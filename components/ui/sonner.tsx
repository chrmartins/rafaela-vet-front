"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * Toaster do shadcn/ui — hoje baseado em **Sonner**, não no Toast do Radix
 * (o shadcn descontinuou o componente próprio e passou a recomendar Sonner).
 *
 * Montado uma única vez em `app/layout.tsx`, então vale para o site público e
 * para o painel. Como fica na raiz, o toast **sobrevive à navegação client-side**
 * — é o que permite disparar "Sessão encerrada" e só depois mandar para o login.
 *
 * O visual não é o padrão do Sonner: as classes abaixo trazem o toast para a
 * identidade da marca (creme, verde, Work Sans, `rounded-lg`). Ao mexer aqui,
 * lembre que `group-[.toaster]:` é o que dá especificidade suficiente para
 * ganhar do CSS que o Sonner injeta sozinho.
 */
export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      // Sem dark mode no projeto — fixar evita o Sonner tentar adivinhar pelo
      // sistema operacional e servir um toast escuro sobre o site claro.
      theme="light"
      position="bottom-right"
      // O padrão (32px) encosta demais na borda no celular.
      offset={16}
      duration={5000}
      className="toaster group font-corpo"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:rounded-lg group-[.toaster]:border group-[.toaster]:border-linha group-[.toaster]:bg-creme group-[.toaster]:text-verde-900 group-[.toaster]:shadow-cartao group-[.toaster]:font-corpo group-[.toaster]:gap-3",
          title: "group-[.toast]:font-medium group-[.toast]:text-sm",
          description:
            "group-[.toast]:text-verde-700 group-[.toast]:text-sm group-[.toast]:leading-relaxed",
          actionButton:
            "group-[.toast]:rounded-lg group-[.toast]:bg-verde-600 group-[.toast]:text-creme group-[.toast]:text-sm group-[.toast]:font-medium",
          cancelButton:
            "group-[.toast]:rounded-lg group-[.toast]:bg-verde-100 group-[.toast]:text-verde-700 group-[.toast]:text-sm",
          closeButton:
            "group-[.toast]:rounded-lg group-[.toast]:border-linha group-[.toast]:bg-creme group-[.toast]:text-verde-700",
          // Sucesso fala em verde da marca; erro precisa destoar de propósito,
          // então usa o mesmo vermelho já em uso nos erros de campo dos forms.
          success:
            "group-[.toaster]:border-verde-300 [&_[data-icon]]:text-verde-600",
          error:
            "group-[.toaster]:border-red-200 group-[.toaster]:bg-red-50 group-[.toaster]:text-red-900 [&_[data-icon]]:text-red-600 [&_[data-description]]:text-red-700",
          warning:
            "group-[.toaster]:border-amber-200 group-[.toaster]:bg-amber-50 group-[.toaster]:text-amber-900 [&_[data-icon]]:text-amber-600 [&_[data-description]]:text-amber-800",
          info: "group-[.toaster]:border-verde-200 [&_[data-icon]]:text-verde-500",
        },
      }}
      {...props}
    />
  );
}
