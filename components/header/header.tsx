"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo/logo";
import { useMobileMenu } from "@/store/use-mobile-menu";
import { cn } from "@/lib/cn";
import { navItems } from "./nav-items";

// Framer Motion só é baixado quando o usuário realmente abre o menu mobile
// (ver `hasInteracted` abaixo) — evita que o Header, presente em toda página
// via app/layout.tsx, carregue essa dependência no bundle compartilhado.
const MobileMenu = dynamic(
  () => import("./mobile-menu").then((m) => m.MobileMenu),
  { ssr: false },
);

export function Header() {
  const { isOpen, toggle, close } = useMobileMenu();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      setHasScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Trava o scroll do corpo enquanto o menu mobile estiver aberto.
  // Efeito legítimo: sincroniza o React com o DOM (sistema externo).
  // Fechar o menu ao navegar NÃO fica aqui — é reação a um clique, então
  // acontece no onClick dos links (ver `onNavigate` no MobileMenu).
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header
      className={cn(
        // Fundo sempre fosco (translúcido + blur) para o conteúdo não
        // se misturar com o header ao rolar; intensifica na rolagem.
        "fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md transition-all duration-300",
        isOpen
          ? "border-linha bg-creme"
          : hasScrolled
            ? "border-linha bg-creme/90 shadow-sm"
            : "border-linha/50 bg-creme/70",
      )}
    >
      <div className="mx-auto flex h-20 max-w-conteudo items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verde-600"
          aria-label="Dra. Rafaela Soares — início"
        >
          <Logo />
        </Link>

        {/* Navegação desktop */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded font-corpo text-sm transition-colors hover:text-verde-600",
                  isActive ? "font-semibold text-verde-900" : "text-verde-700",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Button asChild>
            <Link href="/contato">Agendar visita</Link>
          </Button>
        </div>

        {/* Botão do menu mobile */}
        <button
          type="button"
          onClick={() => {
            setHasInteracted(true);
            toggle();
          }}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-verde-700 transition-colors hover:bg-verde-100 lg:hidden"
          aria-expanded={isOpen}
          aria-controls="menu-mobile"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          <MenuIcon isOpen={isOpen} />
        </button>
      </div>

      {/* Painel de navegação mobile — só monta após o primeiro clique */}
      {hasInteracted && (
        <MobileMenu isOpen={isOpen} pathname={pathname} onNavigate={close} />
      )}
    </header>
  );
}

function MenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden
    >
      {isOpen ? (
        <>
          <line x1={5} y1={5} x2={19} y2={19} />
          <line x1={19} y1={5} x2={5} y2={19} />
        </>
      ) : (
        <>
          <line x1={4} y1={8} x2={20} y2={8} />
          <line x1={4} y1={16} x2={20} y2={16} />
        </>
      )}
    </svg>
  );
}
