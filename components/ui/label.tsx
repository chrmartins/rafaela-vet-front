import * as React from "react";
import { cn } from "@/lib/cn";

export type PropriedadesRotulo =
  React.LabelHTMLAttributes<HTMLLabelElement>;

const Rotulo = React.forwardRef<HTMLLabelElement, PropriedadesRotulo>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium text-verde-700",
          className,
        )}
        {...props}
      />
    );
  },
);
Rotulo.displayName = "Rotulo";

export { Rotulo };
