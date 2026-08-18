"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/cn";

/**
 * Campo de seleção, sobre `@radix-ui/react-select`.
 *
 * **Por que não o `<select>` nativo:** a lista aberta do nativo é desenhada
 * pelo sistema operacional, não pelo CSS — no macOS ela vem cinza-escura, com
 * destaque azul, ignorando a paleta da marca. Não há como estilizar. O Radix
 * renderiza a lista como DOM comum, então ela fica creme e verde como o resto
 * do painel, sem perder teclado (setas, Home/End, digitar para buscar), foco
 * preso e ARIA — que era o motivo de usar o nativo antes.
 *
 * API igual à do shadcn/ui, para um componente novo de lá colar sem adaptação:
 *
 * ```tsx
 * <Select value={valor} onValueChange={setValor}>
 *   <SelectTrigger><SelectValue placeholder="Escolha" /></SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="ATENDENTE">Atendente</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 *
 * Com React Hook Form use `Controller` — não é um input com `ref`, então
 * `register()` não dá conta.
 */

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      // Mesma medida e mesma borda do Input, para os dois se alinharem lado a lado.
      "group flex h-12 w-full items-center justify-between gap-2 rounded-lg border border-linha bg-creme px-4 text-base text-verde-900 shadow-sm transition-colors",
      "data-[placeholder]:text-verde-500/60",
      "focus-visible:border-verde-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verde-300",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-200",
      className,
    )}
    {...props}
  >
    <span className="truncate text-left">{children}</span>
    <SelectPrimitive.Icon asChild>
      <ChevronIcon className="h-5 w-5 shrink-0 text-verde-600 transition-transform duration-200 group-data-[state=open]:rotate-180" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      sideOffset={6}
      className={cn(
        "relative z-50 max-h-72 min-w-[8rem] overflow-hidden rounded-lg border border-linha bg-creme text-verde-900 shadow-flutuante",
        // Keyframe próprio (tailwind.config.ts) — o projeto não usa o plugin
        // tailwindcss-animate. `motion-safe` respeita prefers-reduced-motion.
        "motion-safe:data-[state=open]:animate-surgir-lista",
        // Acompanha a mesma largura do gatilho — lista mais estreita que o
        // campo fica torta, mais larga estoura no mobile.
        position === "popper" &&
          "w-[var(--radix-select-trigger-width)] data-[side=bottom]:translate-y-0 data-[side=top]:-translate-y-1",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center gap-2 rounded-lg py-2.5 pl-9 pr-3 font-corpo text-sm outline-none transition-colors",
      // `highlighted` cobre mouse e teclado — o Radix marca o item sob o
      // cursor e o navegado por seta com o mesmo atributo.
      "data-[highlighted]:bg-verde-100 data-[highlighted]:text-verde-900",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-3 flex h-4 w-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="h-4 w-4 text-verde-600" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "px-3 py-2 font-corpo text-xs font-semibold uppercase tracking-wider text-verde-500",
      className,
    )}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
};
