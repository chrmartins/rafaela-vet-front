import { create } from "zustand";

interface MobileMenuState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * Estado global do menu de navegação mobile.
 * Estado puramente de UI (sem significado de negócio), por isso em inglês.
 */
export const useMobileMenu = create<MobileMenuState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
