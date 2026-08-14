import { PainelShell } from "./painel-shell";

/**
 * Casca das rotas protegidas do painel (sidebar + topbar).
 * `/painel/entrar` fica fora deste grupo justamente para não herdá-la.
 */
export default function PainelProtegidoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PainelShell>{children}</PainelShell>;
}
