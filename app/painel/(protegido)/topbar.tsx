import { MenuIcon } from "@/components/illustrations/icons";
import { painelNavItems, isNavItemActive } from "./nav-items";

interface TopbarProps {
  pathname: string;
  onOpenMenu: () => void;
}

/**
 * Barra superior do painel. No mobile carrega o botão que abre a sidebar;
 * no desktop serve só para situar em que seção a pessoa está.
 */
export function Topbar({ pathname, onOpenMenu }: TopbarProps) {
  const itemAtual = painelNavItems.find((item) =>
    isNavItemActive(pathname, item),
  );

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-linha bg-creme/80 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Abrir menu"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full text-verde-700 transition-colors hover:bg-verde-100 lg:hidden"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      <h1 className="font-titulo text-lg text-verde-900">
        {itemAtual?.label ?? "Painel"}
      </h1>
    </header>
  );
}
