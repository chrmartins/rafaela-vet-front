/**
 * Tipos e rótulos do domínio `acesso`.
 *
 * **Sem nenhuma dependência de servidor** — e é esse o motivo do arquivo
 * existir separado de `lib/acesso.ts`. Aquele importa `lib/api.ts`, que lê o
 * cookie com `next/headers` e só roda no servidor; um Client Component que
 * importasse `rotuloPerfil` de lá quebraria o build inteiro (já quebrou).
 *
 * Regra prática: **valor usado no navegador mora aqui.** `lib/acesso.ts` fica
 * só com as chamadas à API.
 */

export type PerfilAcesso = "ADMINISTRADOR" | "VETERINARIO" | "ATENDENTE";

/** Rótulos para exibição — o enum cru é maiúsculo e feio na tela. */
export const rotuloPerfil: Record<PerfilAcesso, string> = {
  ADMINISTRADOR: "Administrador",
  VETERINARIO: "Veterinário",
  ATENDENTE: "Atendente",
};

export interface Usuario {
  idUsuario: string;
  nomeCompleto: string;
  email: string;
  perfilAcesso: PerfilAcesso;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Sessao {
  /** Só o servidor do Next vê este valor; vai direto para o cookie httpOnly. */
  token: string;
  expiraEm: string;
  usuario: Usuario;
}
