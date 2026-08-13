import * as React from "react";
import { cn } from "@/lib/cn";

export type PropriedadesCampoTexto = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Campo de texto de linha única. Fonte 16px (text-base) para evitar o
 * zoom automático do iOS Safari ao focar o input.
 */
const CampoTexto = React.forwardRef<HTMLInputElement, PropriedadesCampoTexto>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-xl border border-linha bg-creme px-4 text-base text-verde-900 shadow-sm transition-colors",
          "placeholder:text-verde-500/60",
          "focus-visible:border-verde-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verde-300",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-200",
          className,
        )}
        {...props}
      />
    );
  },
);
CampoTexto.displayName = "CampoTexto";

export { CampoTexto };
