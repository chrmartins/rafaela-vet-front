import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-corpo font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verde-600 focus-visible:ring-offset-2 focus-visible:ring-offset-creme disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-verde-600 text-creme hover:bg-verde-700 shadow-cartao",
        secondary:
          "bg-transparent text-verde-700 border border-verde-300 hover:bg-verde-100",
        ghost: "bg-transparent text-verde-700 hover:bg-verde-100",
        // Para uso sobre o bloco verde (fundo escuro da marca)
        inverse: "bg-creme text-verde-700 hover:bg-creme-200 shadow-cartao",
      },
      size: {
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Renderiza o filho no lugar do <button> (composição via Radix Slot). */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
