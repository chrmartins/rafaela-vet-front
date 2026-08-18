import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api";
import { rotuloPerfil } from "@/lib/acesso-modelo";
import { buscarUsuarioDaSessao } from "@/lib/autorizacao";
import { ROTA_ENTRAR } from "@/lib/sessao";
import { PainelShell } from "./painel-shell";

/**
 * Casca das rotas protegidas do painel (sidebar + topbar).
 * `/painel/entrar` fica fora deste grupo justamente para não herdá-la.
 *
 * **É aqui que a sessão é validada de verdade.** O guard em `proxy.ts` só
 * verifica se o cookie existe; quem diz se o token vale é a API. Um cookie
 * forjado passa pelo guard e morre aqui, com 401.
 */
export default async function PainelProtegidoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let usuario;

  try {
    // Via `buscarUsuarioDaSessao` (com cache por requisição): a página filha
    // também precisa do usuário para checar o perfil, e assim a API é
    // consultada uma vez só.
    usuario = await buscarUsuarioDaSessao();
  } catch (erro) {
    if (erro instanceof ApiError && (erro.status === 401 || erro.status === 403)) {
      // Sessão expirada, revogada ou cookie inválido.
      redirect(ROTA_ENTRAR);
    }
    // Backend fora do ar é outra história: deixa o erro subir para o
    // error boundary em vez de fingir que a pessoa foi deslogada.
    throw erro;
  }

  return (
    <PainelShell
      usuario={{
        nomeCompleto: usuario.nomeCompleto,
        perfil: rotuloPerfil[usuario.perfilAcesso],
        // O enum cru, e não só o rótulo: é ele que a sidebar usa para decidir
        // quais itens de menu mostrar.
        perfilAcesso: usuario.perfilAcesso,
      }}
    >
      {children}
    </PainelShell>
  );
}
