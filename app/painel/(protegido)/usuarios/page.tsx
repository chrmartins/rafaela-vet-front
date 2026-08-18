import type { Metadata } from "next";
import { listarUsuarios } from "@/lib/acesso";
import { buscarUsuarioDaSessao } from "@/lib/autorizacao";
import { ListaUsuarios } from "./lista-usuarios";
import { NovoUsuarioForm } from "./novo-usuario-form";

export const metadata: Metadata = { title: "Usuários" };

/**
 * Gestão de usuários do painel — exclusiva de `ADMINISTRADOR`.
 *
 * **A checagem de perfil está aqui, não só na sidebar.** Esconder o item do
 * menu resolve a aparência; quem digitar `/painel/usuarios` na barra de
 * endereço chega neste componente do mesmo jeito. As mutações têm a própria
 * checagem em `acoes.ts` — cada porta é trancada por dentro.
 */
export default async function UsuariosPage() {
  const usuarioLogado = await buscarUsuarioDaSessao();

  if (usuarioLogado.perfilAcesso !== "ADMINISTRADOR") {
    return <AcessoRestrito />;
  }

  const usuarios = await listarUsuarios();

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <div>
        <p className="max-w-prose font-corpo text-sm leading-relaxed text-verde-700">
          Quem pode entrar no painel. Não existe cadastro público: todo acesso
          nasce aqui.
        </p>
      </div>

      <NovoUsuarioForm />

      <section className="flex flex-col gap-3">
        <h2 className="font-titulo text-lg text-verde-900">
          Usuários cadastrados
        </h2>
        <ListaUsuarios
          usuarios={usuarios}
          idUsuarioLogado={usuarioLogado.idUsuario}
        />
      </section>
    </div>
  );
}

function AcessoRestrito() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-lg border border-linha bg-creme p-8 shadow-cartao sm:p-12">
        <h2 className="font-titulo text-xl text-verde-900">Acesso restrito</h2>
        <p className="mt-2 max-w-prose font-corpo text-sm leading-relaxed text-verde-700">
          A gestão de usuários é exclusiva do perfil Administrador. Se você
          precisa cadastrar alguém, peça a quem administra o sistema.
        </p>
      </div>
    </div>
  );
}
