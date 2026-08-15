import { chamarApi } from "./api";

/**
 * Domínio `acesso` da API: sessão e usuários do painel.
 *
 * Espelha o contrato de `rafaela-vet-api`. Tudo aqui roda **no servidor** —
 * é o servidor do Next que fala com a API, nunca o navegador.
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

/** Autentica. Único endpoint da API que não exige token. */
export function criarSessao(email: string, senha: string) {
  return chamarApi<Sessao>("/api/sessoes", {
    method: "POST",
    corpo: { email, senha },
    autenticado: false,
  });
}

/** Quem está logado. Usado pelo shell do painel. */
export function buscarUsuarioAtual() {
  return chamarApi<Usuario>("/api/sessoes/atual");
}

/** Revoga a sessão no backend — o token para de valer na hora. */
export function encerrarSessao() {
  return chamarApi<void>("/api/sessoes/atual", { method: "DELETE" });
}

export function listarUsuarios() {
  return chamarApi<Usuario[]>("/api/usuarios");
}

export function criarUsuario(dados: {
  nomeCompleto: string;
  email: string;
  senha: string;
  perfilAcesso: PerfilAcesso;
}) {
  return chamarApi<Usuario>("/api/usuarios", { method: "POST", corpo: dados });
}

export function inativarUsuario(idUsuario: string) {
  return chamarApi<Usuario>(`/api/usuarios/${idUsuario}/inativar`, {
    method: "PATCH",
  });
}
