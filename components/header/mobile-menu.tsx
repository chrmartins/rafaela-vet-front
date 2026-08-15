"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { UserIcon } from "@/components/illustrations/icons";
import { cn } from "@/lib/cn";
import { navItems } from "./nav-items";

interface MobileMenuProps {
  isOpen: boolean;
  pathname: string;
  /** Fecha o menu ao clicar num link — reação a clique, não a efeito. */
  onNavigate: () => void;
}

/**
 * Painel de navegação mobile. Vive num arquivo próprio e é importado via
 * `next/dynamic` em header.tsx para o Framer Motion não entrar no bundle
 * compartilhado de toda página — só é baixado quando o usuário de fato abre
 * o menu (ver bundle-dynamic-imports no skill vercel-react-best-practices).
 */
export function MobileMenu({ isOpen, pathname, onNavigate }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="menu-mobile"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="overflow-hidden border-t border-linha bg-creme lg:hidden"
        >
          <nav
            className="mx-auto flex max-w-conteudo flex-col gap-1 px-5 py-4 sm:px-8"
            aria-label="Principal (mobile)"
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-3 font-corpo text-base transition-colors hover:bg-verde-100",
                    isActive ? "font-semibold text-verde-900" : "text-verde-800",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Button asChild className="mt-3 w-full">
              <Link href="/contato" onClick={onNavigate}>
                Agendar visita
              </Link>
            </Button>

            {/* Acesso da equipe, separado por uma linha para não se misturar
                à navegação do site. Aponta para /painel — o guard decide
                entre painel e login. */}
            <Link
              href="/painel"
              onClick={onNavigate}
              className="mt-4 inline-flex items-center justify-center gap-2 border-t border-linha pt-4 font-corpo text-sm text-verde-500 transition-colors hover:text-verde-700"
            >
              <UserIcon className="h-4 w-4" />
              Painel da equipe
            </Link>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
