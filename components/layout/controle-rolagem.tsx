"use client";

import { useEffect } from "react";

/**
 * Garante que a Home sempre abra pela Hero (topo).
 *
 * Sem isso, o navegador restaura a posição de rolagem/âncora de uma visita
 * anterior (ex.: usuário clicou em "Agendar visita" → URL fica com
 * `#contato` → ao reabrir a aba, o Safari/Chrome mobile volta direto para a
 * seção de Contato em vez da Hero). Roda só na montagem inicial da página —
 * não interfere em cliques de âncora feitos durante a navegação.
 */
export function ControleRolagem() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return null;
}
