"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { Botao } from "@/components/ui/botao";
import { cn } from "@/lib/cn";
import { itensNavegacao } from "./itens-navegacao";

interface PropriedadesMenuMobile {
  aberto: boolean;
  pathname: string;
}

/**
 * Painel de navegação mobile. Vive num arquivo próprio e é importado via
 * `next/dynamic` em cabecalho.tsx para o Framer Motion não entrar no bundle
 * compartilhado de toda página — só é baixado quando o usuário de fato abre
 * o menu (ver bundle-dynamic-imports no skill vercel-react-best-practices).
 * Fechar ao trocar de rota é responsabilidade do próprio cabecalho.tsx
 * (efeito que reage a `pathname`), não deste componente.
 */
export function MenuMobile({ aberto, pathname }: PropriedadesMenuMobile) {
  return (
    <AnimatePresence>
      {aberto && (
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
            {itensNavegacao.map((item) => {
              const ativo = pathname === item.rota;
              return (
                <Link
                  key={item.rota}
                  href={item.rota}
                  aria-current={ativo ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-3 font-corpo text-base transition-colors hover:bg-verde-100",
                    ativo ? "font-semibold text-verde-900" : "text-verde-800",
                  )}
                >
                  {item.rotulo}
                </Link>
              );
            })}
            <Botao comoFilho className="mt-3 w-full">
              <Link href="/contato">Agendar visita</Link>
            </Botao>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
