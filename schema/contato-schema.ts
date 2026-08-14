import { z } from "zod";

/**
 * Validação do formulário de contato da Home.
 * Espelha os campos que serão enviados à futura API de Agendamento.
 */
export const esquemaContato = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Informe seu nome completo.")
    .max(80, "Nome muito longo."),
  telefone: z
    .string()
    .trim()
    .min(10, "Informe um telefone com DDD.")
    .max(20, "Telefone muito longo.")
    .regex(
      /^[0-9()+\-\s]+$/,
      "Use apenas números, espaços e os sinais ( ) + -.",
    ),
  bairro: z
    .string()
    .trim()
    .min(2, "Informe o bairro do atendimento.")
    .max(60, "Bairro muito longo."),
  mensagem: z
    .string()
    .trim()
    .max(500, "Mensagem muito longa (máx. 500 caracteres).")
    .optional(),
});

/** Dados validados do formulário de contato. */
export type DadosContato = z.infer<typeof esquemaContato>;
