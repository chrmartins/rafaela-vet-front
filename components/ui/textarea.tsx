import * as React from "react";
import { cn } from "@/lib/cn";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

/** Campo de texto de múltiplas linhas. Fonte 16px evita zoom no iOS Safari. */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[7rem] w-full rounded-xl border border-linha bg-creme px-4 py-3 text-base text-verde-900 shadow-sm transition-colors",
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
Textarea.displayName = "Textarea";

export { Textarea };
