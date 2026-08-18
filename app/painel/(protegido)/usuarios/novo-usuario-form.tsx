"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { rotuloPerfil, type PerfilAcesso } from "@/lib/acesso-modelo";
import {
  novoUsuarioSchema,
  type NovoUsuarioData,
} from "@/schema/usuario-schema";
import { criarUsuarioAction } from "./acoes";

const PERFIS: PerfilAcesso[] = ["ATENDENTE", "VETERINARIO", "ADMINISTRADOR"];

/**
 * Cadastro de um novo usuário do painel.
 *
 * Não existe auto-cadastro no sistema: este formulário é o único caminho para
 * alguém passar a ter acesso, e só um administrador chega até aqui.
 */
export function NovoUsuarioForm() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<NovoUsuarioData>({
    resolver: zodResolver(novoUsuarioSchema),
    mode: "onBlur",
    defaultValues: { perfilAcesso: "ATENDENTE" },
  });

  async function onSubmit(dados: NovoUsuarioData) {
    const resultado = await criarUsuarioAction(dados);

    if (resultado.ok) {
      toast.success("Usuário cadastrado", { description: resultado.mensagem });
      reset();
      return;
    }

    // Erro de campo devolvido pela API volta para o campo — não vira toast.
    // (Ex.: e-mail já cadastrado é 409 e vem como mensagem geral; um 400 de
    // validação vem campo a campo.)
    if (resultado.campos?.length) {
      for (const { campo, mensagem } of resultado.campos) {
        if (campo in dados) {
          setError(campo as keyof NovoUsuarioData, { message: mensagem });
        }
      }
      return;
    }

    toast.error(resultado.mensagem, {
      description: resultado.requestId
        ? `Informe ao suporte o código ${resultado.requestId}.`
        : undefined,
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-lg border border-linha bg-creme p-6 shadow-cartao"
    >
      <h2 className="font-titulo text-lg text-verde-900">Novo usuário</h2>
      <p className="mt-1 font-corpo text-sm text-verde-700">
        A pessoa entra com o e-mail e a senha definidos aqui, e pode trocar a
        senha depois.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="nomeCompleto">Nome completo</Label>
          <Input
            id="nomeCompleto"
            autoComplete="off"
            placeholder="Nome que aparece no painel"
            aria-invalid={!!errors.nomeCompleto}
            aria-describedby={errors.nomeCompleto ? "erro-nome" : undefined}
            {...register("nomeCompleto")}
          />
          {errors.nomeCompleto && (
            <p id="erro-nome" className="text-sm text-red-600">
              {errors.nomeCompleto.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="off"
            placeholder="pessoa@rafaelasoares.vet"
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
          <Label htmlFor="perfilAcesso">Perfil de acesso</Label>
          {/* `Controller` e não `register`: o Select do Radix não é um input
              com `ref`, o valor vem por `onValueChange`. */}
          <Controller
            name="perfilAcesso"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="perfilAcesso"
                  onBlur={field.onBlur}
                  aria-invalid={!!errors.perfilAcesso}
                >
                  <SelectValue placeholder="Escolha o perfil" />
                </SelectTrigger>
                <SelectContent>
                  {PERFIS.map((perfil) => (
                    <SelectItem key={perfil} value={perfil}>
                      {rotuloPerfil[perfil]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <p className="text-xs text-verde-500">
            Só administradores gerenciam usuários.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="senha">Senha inicial</Label>
          <Input
            id="senha"
            type="password"
            // `new-password` evita que o gerenciador de senhas ofereça a senha
            // de quem está logado para a conta que está sendo criada.
            autoComplete="new-password"
            placeholder="Pelo menos 8 caracteres"
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
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="mt-6 w-full sm:w-auto"
      >
        {isSubmitting ? "Cadastrando..." : "Cadastrar usuário"}
      </Button>
    </form>
  );
}
