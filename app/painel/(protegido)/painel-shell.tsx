"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

/**
 * Casca do painel: sidebar + topbar em volta do conteúdo da rota.
 *
 * Separado de `layout.tsx` porque precisa de estado (drawer mobile) e o
 * layout precisa continuar Server Component para exportar `metadata`.
 */
interface PainelShellProps {
  children: React.ReactNode;
  /** Vem do layout, que resolve a sessão no servidor. */
  usuario: { nomeCompleto: string; perfil: string };
}

export function PainelShell({ children, usuario }: PainelShellProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();

  function closeDrawer() {
    setIsDrawerOpen(false);
  }

  // Trava o scroll do corpo enquanto o drawer estiver aberto.
  // Efeito legítimo: sincroniza o React com o DOM (sistema externo).
  // Fechar o drawer ao navegar NÃO fica aqui — é reação a um clique, então
  // acontece no onClick dos links da Sidebar.
  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  return (
    <div className="min-h-dvh bg-creme-200">
      <Sidebar
        pathname={pathname}
        usuario={usuario}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      />

      {/* lg:pl-72 abre espaço para a sidebar fixa (w-72) no desktop */}
      <div className="flex min-h-dvh flex-col lg:pl-72">
        <Topbar pathname={pathname} onOpenMenu={() => setIsDrawerOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
