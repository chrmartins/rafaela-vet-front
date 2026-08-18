"use server";

import { revalidatePath } from "next/cache";
import { ApiError } from "@/lib/api";
import { criarUsuario, inativarUsuario } from "@/lib/acesso";
import { exigirAdministrador, SemPermissaoError } from "@/lib/autorizacao";
import { novoUsuarioSchema } from "@/schema/usuario-schema";

/**
 * Mutações de usuário do painel.
 *
 * **Toda ação aqui começa por `exigirAdministrador()`.** Não é redundância com
 * o `page.tsx`: uma Server Action é um endpoint POST público — quem tiver o id
 * da action chama direto, sem nunca abrir a página. Esconder o item da sidebar
 * e checar o perfil na rota deixam a tela coerente; quem *protege* é esta
 * linha (e a API, que também exige `ADMINISTRADOR`).
 */

const ROTA = "/painel/usuarios";

/** Resultado de uma ação, no formato que o formulário sabe exibir. */
export type ResultadoAcao =
  | {
      ok: true;
      mensagem: string;
      /** A operação encerrou o acesso de quem a executou — precisa sair. */
      deslogar?: boolean;
    }
  | {
      ok: false;
      mensagem: string;
      /** Erros por campo, quando a API os devolve (400 de validação). */
      campos?: { campo: string; mensagem: string }[];
      /** Presente em erro inesperado — é o que o suporte usa para achar o log. */
      requestId?: string | null;
    };

export async function criarUsuarioAction(
  dados: unknown,
): Promise<ResultadoAcao> {
  try {
    await exigirAdministrador();

    // Revalida no servidor mesmo já tendo validado no formulário: o cliente
    // pode ser contornado, este ponto não.
    const analise = novoUsuarioSchema.safeParse(dados);
    if (!analise.success) {
      return {
        ok: false,
        mensagem: "Há campos inválidos.",
        campos: analise.error.issues.map((problema) => ({
          campo: String(problema.path[0] ?? ""),
          mensagem: problema.message,
        })),
      };
    }

    const usuario = await criarUsuario(analise.data);
    revalidatePath(ROTA);
    return { ok: true, mensagem: `${usuario.nomeCompleto} agora tem acesso.` };
  } catch (erro) {
    return traduzirErro(erro, "Não foi possível cadastrar o usuário");
  }
}

export async function inativarUsuarioAction(
  idUsuario: string,
): Promise<ResultadoAcao> {
  try {
    const administrador = await exigirAdministrador();

    // Inativar a si mesmo é permitido de propósito — é o caminho pelo qual a
    // trava do último administrador aparece. Se sobrar outro administrador, a
    // API aceita e a pessoa perde o acesso na hora (as sessões dela são
    // revogadas); se ela for a última, volta 422 com a instrução de promover
    // alguém antes. Bloquear isto na tela tornaria essa proteção inalcançável.
    const ehEuMesmo = idUsuario === administrador.idUsuario;

    const usuario = await inativarUsuario(idUsuario);
    revalidatePath(ROTA);

    if (ehEuMesmo) {
      return {
        ok: true,
        mensagem: "Você inativou a própria conta e saiu do painel.",
        deslogar: true,
      };
    }

    return {
      ok: true,
      mensagem: `${usuario.nomeCompleto} não tem mais acesso ao painel.`,
    };
  } catch (erro) {
    return traduzirErro(erro, "Não foi possível inativar o usuário");
  }
}

/**
 * Converte a exceção no que a tela precisa mostrar.
 *
 * O caso que merece atenção é o **422**: é a regra de negócio do backend
 * falando (hoje, "este é o último administrador ativo"). A mensagem da API já
 * é escrita para o usuário final e diz o que fazer — repassar ela é melhor do
 * que inventar um texto genérico aqui e perder a instrução.
 */
function traduzirErro(erro: unknown, prefixo: string): ResultadoAcao {
  if (erro instanceof SemPermissaoError) {
    return { ok: false, mensagem: erro.message };
  }

  if (erro instanceof ApiError) {
    switch (erro.status) {
      case 422: // regra de negócio — último administrador
      case 409: // e-mail já cadastrado
      case 404:
        return { ok: false, mensagem: erro.message };
      case 400:
        return {
          ok: false,
          mensagem: "Há campos inválidos.",
          campos: erro.campos,
        };
      case 401:
        return {
          ok: false,
          mensagem: "Sua sessão expirou. Entre novamente.",
        };
      case 403:
        return {
          ok: false,
          mensagem: "Você não tem permissão para gerenciar usuários.",
        };
      default:
        return {
          ok: false,
          mensagem: `${prefixo}.`,
          requestId: erro.requestId,
        };
    }
  }

  return { ok: false, mensagem: `${prefixo}. Verifique sua conexão.` };
}
