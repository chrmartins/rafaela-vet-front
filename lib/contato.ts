/**
 * Dados de contato reais da Dra. Rafaela Soares.
 * Fonte única para cabeçalho, formulário de contato e rodapé.
 */
export const contato = {
  telefoneExibicao: "(21) 99745-7801",
  // Formato internacional para links wa.me / tel: (Brasil +55, DDD 21)
  whatsappNumero: "5521997457801",
  instagramUsuario: "@rafaelasoares.vet",
  instagramUrl: "https://instagram.com/rafaelasoares.vet",
  localizacao: "Rio de Janeiro - RJ",
} as const;

/** Monta o link do WhatsApp com uma mensagem pré-preenchida (texto já codificado). */
export function montarLinkWhatsapp(mensagem: string) {
  return `https://wa.me/${contato.whatsappNumero}?text=${encodeURIComponent(mensagem)}`;
}
