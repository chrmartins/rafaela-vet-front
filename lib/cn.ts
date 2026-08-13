import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes condicionais (clsx) e resolve conflitos do Tailwind (twMerge).
 * Nome mantido como `cn` por ser convenção consolidada do shadcn/ui.
 */
export function cn(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}
