"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { rotuloPerfil, type Usuario } from "@/lib/acesso-modelo";
import { ROTA_ENTRAR } from "@/lib/sessao";
import { inativarUsuarioAction } from "./acoes";

interface ListaUsuariosProps {
  usuarios: Usuario[];
  /** Quem está logado — para marcar a própria linha e avisar do auto-corte. */
  idUsuarioLogado: string;
}

/**
 * Lista de usuários do painel, com inativação.
 *
 * **Não há exclusão** — nem aqui, nem na API. O histórico precisa continuar
 * apontando para quem registrou cada consulta e cada prontuário, então o mais
 * próximo de "excluir" é inativar (ver `CLAUDE.md`, seção de LGPD).
 *
 * Inativar pede confirmação em dois passos. Não é cerimônia: a ação derruba a
 * sessão da pessoa na hora, e um clique errado numa linha vizinha tira alguém
 * do sistema no meio do expediente.
 */
export function ListaUsuarios({
  usuarios,
  idUsuarioLogado,
}: ListaUsuariosProps) {
  const router = useRouter();
  const [confirmando, setConfirmando] = useState<string | null>(null);
  const [emAndamento, setEmAndamento] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function inativar(usuario: Usuario) {
    setConfirmando(null);
    setEmAndamento(usuario.idUsuario);

    startTransition(async () => {
      const resultado = await inativarUsuarioAction(usuario.idUsuario);
      setEmAndamento(null);

      if (!resultado.ok) {
        // É aqui que cai o 422 do último administrador. A mensagem da API já
        // explica o caminho ("promova outro usuário antes"), então vai inteira
        // para a descrição em vez de virar um "erro ao inativar" genérico.
        toast.error("Não foi possível inativar", {
          description: resultado.mensagem,
        });
        return;
      }

      toast.success("Usuário inativado", { description: resultado.mensagem });

      if (resultado.deslogar) {
        // A API já revogou as sessões; o DELETE aqui é só para apagar o cookie
        // deste navegador antes de mandar para o login.
        await fetch("/api/sessoes", { method: "DELETE" }).catch(() => {});
        router.refresh();
        router.replace(ROTA_ENTRAR);
      }
    });
  }

  if (usuarios.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-linha bg-creme p-8 text-center font-corpo text-sm text-verde-700">
        Nenhum usuário cadastrado ainda.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-linha bg-creme shadow-cartao">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-linha">
              <Th>Nome</Th>
              <Th>E-mail</Th>
              <Th>Perfil</Th>
              <Th>Situação</Th>
              <Th className="text-right">Ações</Th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => {
              const souEu = usuario.idUsuario === idUsuarioLogado;
              const processando = emAndamento === usuario.idUsuario;
              const aguardandoConfirmacao = confirmando === usuario.idUsuario;

              return (
                <tr
                  key={usuario.idUsuario}
                  className={cn(
                    "border-b border-linha/60 last:border-b-0",
                    !usuario.ativo && "opacity-60",
                  )}
                >
                  <td className="px-4 py-4 font-corpo text-sm font-medium text-verde-900">
                    {usuario.nomeCompleto}
                    {souEu && (
                      <span className="ml-2 font-normal text-verde-500">
                        (você)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 font-corpo text-sm text-verde-700">
                    {usuario.email}
                  </td>
                  <td className="px-4 py-4 font-corpo text-sm text-verde-700">
                    {rotuloPerfil[usuario.perfilAcesso]}
                  </td>
                  <td className="px-4 py-4">
                    <Situacao ativo={usuario.ativo} />
                  </td>
                  <td className="px-4 py-4 text-right">
                    {!usuario.ativo && (
                      <span className="font-corpo text-xs text-verde-500">
                        Sem acesso
                      </span>
                    )}

                    {usuario.ativo && !aguardandoConfirmacao && (
                      <button
                        type="button"
                        onClick={() => setConfirmando(usuario.idUsuario)}
                        disabled={processando}
                        className="rounded-lg px-3 py-2 font-corpo text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:opacity-50"
                      >
                        {processando ? "Inativando..." : "Inativar"}
                      </button>
                    )}

                    {usuario.ativo && aguardandoConfirmacao && (
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setConfirmando(null)}
                            className="rounded-lg px-3 py-2 font-corpo text-sm text-verde-700 transition-colors hover:bg-verde-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verde-300"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            autoFocus
                            onClick={() => inativar(usuario)}
                            className="rounded-lg bg-red-600 px-3 py-2 font-corpo text-sm font-medium text-creme transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                          >
                            Confirmar
                          </button>
                        </div>
                        <p className="font-corpo text-xs text-red-700">
                          {souEu
                            ? "Você perde o acesso agora e sai do painel."
                            : "A sessão desta pessoa cai na hora."}
                        </p>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={cn(
        "px-4 py-3 font-corpo text-xs font-semibold uppercase tracking-wider text-verde-500",
        className,
      )}
    >
      {children}
    </th>
  );
}

function Situacao({ ativo }: { ativo: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-corpo text-xs font-medium",
        ativo ? "bg-verde-100 text-verde-700" : "bg-creme-300 text-verde-500",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          ativo ? "bg-verde-500" : "bg-verde-300",
        )}
      />
      {ativo ? "Ativo" : "Inativo"}
    </span>
  );
}
