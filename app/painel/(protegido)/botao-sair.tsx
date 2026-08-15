"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoutIcon } from "@/components/illustrations/icons";
import { ROTA_ENTRAR } from "@/lib/sessao";

/**
 * Sair do painel.
 *
 * Chama o BFF, que revoga a sessão na API **e** apaga o cookie. Como o token
 * é opaco e vive no banco, a revogação vale imediatamente — não é só o
 * navegador esquecendo a credencial.
 */
export function BotaoSair() {
  const router = useRouter();
  const [saindo, setSaindo] = useState(false);

  async function sair() {
    setSaindo(true);
    try {
      await fetch("/api/sessoes", { method: "DELETE" });
    } catch {
      // Falha de rede não deve prender ninguém dentro do painel: o cookie
      // pode não ter sido apagado, mas o guard manda para o login mesmo assim.
    }
    router.refresh();
    router.replace(ROTA_ENTRAR);
  }

  return (
    <button
      type="button"
      onClick={sair}
      disabled={saindo}
      className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 font-corpo text-sm text-creme/85 transition-colors hover:bg-creme/10 hover:text-creme disabled:opacity-60"
    >
      <LogoutIcon className="h-5 w-5 shrink-0" />
      {saindo ? "Saindo..." : "Sair"}
    </button>
  );
}
