"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  async function onSubmit(dados: LoginData) {
    try {
      const resposta = await fetch("/api/sessoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });

      if (!resposta.ok) {
        const corpo = await resposta.json().catch(() => ({}));
        // A API devolve a mesma mensagem para e-mail inexistente, senha errada
        // e usuário inativo — de propósito, para não revelar quem tem conta.
        // Não tente detalhar aqui.
        toast.error("Não foi possível entrar", {
          description: corpo.mensagem ?? "Verifique o e-mail e a senha.",
        });
        return;
      }

      // O Toaster é global e o toast sobrevive à navegação — sem isto, o erro
      // da tentativa anterior aparece dentro do painel depois de um login que
      // deu certo.
      toast.dismiss();

      // `refresh` antes de navegar: o guard e o shell leem o cookie no
      // servidor, e sem isso a navegação usaria a árvore antiga, ainda sem
      // sessão.
      router.refresh();
      router.replace(destino);
    } catch {
      toast.error("Sem conexão com o servidor", {
        description: "Verifique sua internet e tente novamente.",
      });
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

      {/* Falha de login vira toast (o Sonner já anuncia em leitor de tela).
          Erro de campo continua inline, logo abaixo do input: quem está
          corrigindo um campo precisa da mensagem parada ali, não de um aviso
          que some sozinho. */}
      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-1 w-full">
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
