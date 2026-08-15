import { z } from "zod";

/**
 * Validação do formulário de entrada no painel.
 *
 * De propósito mais frouxa que o cadastro: aqui só evitamos ida ao servidor
 * com campo vazio. Regra de senha (tamanho mínimo, por exemplo) não entra —
 * quem tem senha antiga fora do padrão precisa conseguir entrar para trocá-la.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail.")
    .email("E-mail inválido."),
  senha: z.string().min(1, "Informe sua senha."),
});

export type LoginData = z.infer<typeof loginSchema>;
