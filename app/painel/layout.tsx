import type { Metadata } from "next";

/**
 * Layout de passagem do painel. Não desenha nada — existe para aplicar
 * `noindex` a **tudo** sob `/painel`, inclusive a tela de entrar.
 *
 * A casca visual (sidebar + topbar) fica em `(protegido)/layout.tsx`, para
 * que `/painel/entrar` não herde a navegação.
 */
export const metadata: Metadata = {
  title: {
    default: "Painel",
    template: "%s · Painel",
  },
  robots: { index: false, follow: false, nocache: true },
};

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
