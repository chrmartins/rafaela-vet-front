import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const variantesBotao = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-corpo font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verde-600 focus-visible:ring-offset-2 focus-visible:ring-offset-creme disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variante: {
        primario:
          "bg-verde-600 text-creme hover:bg-verde-700 shadow-cartao",
        secundario:
          "bg-transparent text-verde-700 border border-verde-300 hover:bg-verde-100",
        fantasma: "bg-transparent text-verde-700 hover:bg-verde-100",
        sobreVerde:
          "bg-creme text-verde-700 hover:bg-creme-200 shadow-cartao",
      },
      tamanho: {
        medio: "h-11 px-6 text-sm",
        grande: "h-12 px-8 text-base",
        icone: "h-11 w-11",
      },
    },
    defaultVariants: {
      variante: "primario",
      tamanho: "medio",
    },
  },
);

export interface PropriedadesBotao
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof variantesBotao> {
  /** Renderiza o filho no lugar do <button> (composição via Radix Slot). */
  comoFilho?: boolean;
}

const Botao = React.forwardRef<HTMLButtonElement, PropriedadesBotao>(
  ({ className, variante, tamanho, comoFilho = false, ...props }, ref) => {
    const Componente = comoFilho ? Slot : "button";
    return (
      <Componente
        className={cn(variantesBotao({ variante, tamanho, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Botao.displayName = "Botao";

export { Botao, variantesBotao };
