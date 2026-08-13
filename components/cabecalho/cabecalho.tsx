"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Botao } from "@/components/ui/botao";
import { Marca } from "@/components/marca/marca";
import { useMenuMobile } from "@/store/use-menu-mobile";
import { cn } from "@/lib/cn";
import { itensNavegacao } from "./itens-navegacao";

// Framer Motion só é baixado quando o usuário realmente abre o menu mobile
// (ver `interagiu` abaixo) — evita que o Cabecalho, presente em toda página
// via app/layout.tsx, carregue essa dependência no bundle compartilhado.
const MenuMobile = dynamic(
  () => import("./menu-mobile").then((m) => m.MenuMobile),
  { ssr: false },
);

export function Cabecalho() {
  const { aberto, alternar, fechar } = useMenuMobile();
  const [rolou, setRolou] = useState(false);
  const [interagiu, setInteragiu] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function aoRolar() {
      setRolou(window.scrollY > 8);
    }
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  // Trava o scroll do corpo enquanto o menu mobile estiver aberto
  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  // Fecha o menu mobile sempre que a rota muda
  useEffect(() => {
    fechar();
  }, [pathname, fechar]);

  return (
    <header
      className={cn(
        // Fundo sempre fosco (translúcido + blur) para o conteúdo não
        // se misturar com o header ao rolar; intensifica na rolagem.
        "fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md transition-all duration-300",
        aberto
          ? "border-linha bg-creme"
          : rolou
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
          <Marca />
        </Link>

        {/* Navegação desktop */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Principal">
          {itensNavegacao.map((item) => {
            const ativo = pathname === item.rota;
            return (
              <Link
                key={item.rota}
                href={item.rota}
                aria-current={ativo ? "page" : undefined}
                className={cn(
                  "rounded font-corpo text-sm transition-colors hover:text-verde-600",
                  ativo ? "font-semibold text-verde-900" : "text-verde-700",
                )}
              >
                {item.rotulo}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Botao comoFilho>
            <Link href="/contato">Agendar visita</Link>
          </Botao>
        </div>

        {/* Botão do menu mobile */}
        <button
          type="button"
          onClick={() => {
            setInteragiu(true);
            alternar();
          }}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-verde-700 transition-colors hover:bg-verde-100 lg:hidden"
          aria-expanded={aberto}
          aria-controls="menu-mobile"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
        >
          <IconeMenu aberto={aberto} />
        </button>
      </div>

      {/* Painel de navegação mobile — só monta após o primeiro clique */}
      {interagiu && <MenuMobile aberto={aberto} pathname={pathname} />}
    </header>
  );
}

function IconeMenu({ aberto }: { aberto: boolean }) {
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
      {aberto ? (
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
