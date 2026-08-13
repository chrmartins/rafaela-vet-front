import { create } from "zustand";

interface EstadoMenuMobile {
  aberto: boolean;
  abrir: () => void;
  fechar: () => void;
  alternar: () => void;
}

/**
 * Estado global do menu de navegação mobile (aberto/fechado).
 * Prefixo `use` por ser convenção de hook do React/libs.
 */
export const useMenuMobile = create<EstadoMenuMobile>((set) => ({
  aberto: false,
  abrir: () => set({ aberto: true }),
  fechar: () => set({ aberto: false }),
  alternar: () => set((estado) => ({ aberto: !estado.aberto })),
}));
