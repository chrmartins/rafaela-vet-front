"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginData } from "@/schema/login-schema";

/**
 * Formulário de entrada no painel.
 *
 * Envia para `/api/sessoes` (o BFF do próprio Next), **não** direto para a
 * API Spring: é o servidor do Next que guarda o token num cookie httpOnly.
 * Este componente nunca vê o token.
 */
export function LoginForm({ destino }: { destino: string }) {
  const router = useRouter();
  const [erroGeral, setErroGeral] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  async function onSubmit(dados: LoginData) {
    setErroGeral(null);

    try {
      const resposta = await fetch("/api/sessoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (!resposta.ok) {
        const corpo = await resposta.json().catch(() => ({}));
        setErroGeral(corpo.mensagem ?? "Não foi possível entrar.");
        return;
      }

      // `refresh` antes de navegar: o guard e o shell leem o cookie no
      // servidor, e sem isso a navegação usaria a árvore antiga, ainda sem
      // sessão.
      router.refresh();
      router.replace(destino);
    } catch {
      setErroGeral("Sem conexão com o servidor. Tente novamente.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="username"
          autoFocus
          placeholder="voce@rafaelasoares.vet"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "erro-email" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="erro-email" className="text-sm text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="senha">Senha</Label>
        <Input
          id="senha"
          type="password"
          autoComplete="current-password"
          placeholder="Sua senha"
          aria-invalid={!!errors.senha}
          aria-describedby={errors.senha ? "erro-senha" : undefined}
          {...register("senha")}
        />
        {errors.senha && (
          <p id="erro-senha" className="text-sm text-red-600">
            {errors.senha.message}
          </p>
        )}
      </div>

      {erroGeral && (
        // role="alert" faz o leitor de tela anunciar sem precisar focar.
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {erroGeral}
        </p>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-1 w-full">
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
