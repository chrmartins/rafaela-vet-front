import { cache } from "react";
import { buscarUsuarioAtual, type PerfilAcesso, type Usuario } from "./acesso";

/**
 * Quem está logado, resolvido **uma vez por requisição**.
 *
 * O `cache()` do React deduplica a chamada: o layout do painel, a página e a
 * Server Action de uma mesma requisição pedem o usuário e a API é consultada
 * só uma vez. Sem isso, cada verificação de perfil custaria um round-trip.
 *
 * Não vale como cache entre requisições — o escopo morre com a requisição, que
 * é justamente o que queremos: sessão revogada precisa parar de valer na hora.
 */
export const buscarUsuarioDaSessao = cache(
  async (): Promise<Usuario> => buscarUsuarioAtual(),
);

/** O usuário logado tem algum dos perfis exigidos? */
export async function temPerfil(
  ...perfis: readonly PerfilAcesso[]
): Promise<boolean> {
  const usuario = await buscarUsuarioDaSessao();
  return perfis.includes(usuario.perfilAcesso);
}

/**
 * Barra a execução se quem chamou não for administrador.
 *
 * **Existe para as Server Actions**, e é obrigatório nelas. Uma Server Action
 * vira um endpoint POST público: qualquer um que descubra o id da action pode
 * chamá-la direto, sem passar pela página que a renderizou. Esconder o botão
 * na tela não protege nada — a checagem tem que estar dentro da própria ação.
 *
 * A API também recusa (todo `/api/usuarios/**` exige `ADMINISTRADOR`); isto
 * aqui é a camada que evita depender só disso e devolve erro em português
 * antes de gastar uma chamada de rede.
 */
export async function exigirAdministrador(): Promise<Usuario> {
  const usuario = await buscarUsuarioDaSessao();
  if (usuario.perfilAcesso !== "ADMINISTRADOR") {
    throw new SemPermissaoError();
  }
  return usuario;
}

/** Quem está autenticado, mas não pode executar a operação. */
export class SemPermissaoError extends Error {
  constructor(
    mensagem = "Você não tem permissão para gerenciar usuários.",
  ) {
    super(mensagem);
    this.name = "SemPermissaoError";
  }
}
