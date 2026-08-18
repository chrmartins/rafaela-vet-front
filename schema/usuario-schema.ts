import { z } from "zod";

/**
 * Cadastro de usuário do painel.
 *
 * Espelha as restrições do `CriarUsuarioRequest` da API — se mudar lá, mude
 * aqui. Validar no cliente é conveniência (erro na hora, sem ida ao servidor);
 * quem decide continua sendo a API, e a Server Action revalida com este mesmo
 * schema antes de chamar o backend.
 */
export const perfilAcessoSchema = z.enum([
  "ADMINISTRADOR",
  "VETERINARIO",
  "ATENDENTE",
]);

export const novoUsuarioSchema = z.object({
  nomeCompleto: z
    .string()
    .trim()
    .min(1, "Informe o nome completo.")
    .max(120, "Nome completo muito longo."),
  email: z
    .string()
    .trim()
    .min(1, "Informe o e-mail.")
    .email("E-mail inválido.")
    .max(180, "E-mail muito longo."),
  // 8 caracteres é a recomendação do NIST; 72 é o teto do BCrypt, que ignora
  // o que passa disso — sem o limite, uma senha longa daria falsa segurança.
  senha: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres.")
    .max(72, "A senha deve ter no máximo 72 caracteres."),
  perfilAcesso: perfilAcessoSchema,
});

export type NovoUsuarioData = z.infer<typeof novoUsuarioSchema>;
