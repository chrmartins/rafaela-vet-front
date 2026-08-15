import Link from "next/link";
import { Logo } from "@/components/logo/logo";
import { CloseIcon } from "@/components/illustrations/icons";
import { cn } from "@/lib/cn";
import { painelNavItems, isNavItemActive } from "./nav-items";
import { BotaoSair } from "./botao-sair";

interface SidebarProps {
  pathname: string;
  /** Usuário da sessão, resolvido no servidor pelo layout. */
  usuario: { nomeCompleto: string; perfil: string };
  /** Só afeta o drawer mobile; no desktop a sidebar é sempre visível. */
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ pathname, usuario, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Fundo escurecido do drawer (só mobile) */}
      {isOpen && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-verde-900/40 lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-verde-600 transition-transform duration-300",
          "lg:translate-x-0", // no desktop fica sempre visível
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Navegação do painel"
      >
        <div className="flex h-20 shrink-0 items-center justify-between px-5">
          <Link
            href="/painel"
            onClick={onClose}
            className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-creme"
          >
            <Logo inverse />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-creme/80 transition-colors hover:bg-creme/10 lg:hidden"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {painelNavItems.map((item) => {
              const isActive = isNavItemActive(pathname, item);
              const { Icon } = item;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 font-corpo text-sm transition-colors",
                      isActive
                        ? "bg-creme text-verde-700 font-semibold"
                        : "text-creme/85 hover:bg-creme/10 hover:text-creme",
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-creme/15 p-3">
          <div className="px-3 py-2">
            <p className="font-corpo text-sm font-medium text-creme">
              {usuario.nomeCompleto}
            </p>
            <p className="font-corpo text-xs text-creme/60">{usuario.perfil}</p>
          </div>
          <BotaoSair />
        </div>
      </aside>
    </>
  );
}
