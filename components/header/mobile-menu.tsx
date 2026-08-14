"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
