/**
 * Ponto único de verdade sobre a sessão do painel.
 *
 * Tudo que precisa saber o nome do cookie (o guard em `proxy.ts`, o Route
 * Handler `/api/sessoes`, e os Server Components que chamam a API Spring)
 * importa daqui — nunca repete a string.
 */

/** Cookie de sessão: httpOnly, nunca legível por JavaScript do navegador. */
export const COOKIE_SESSAO = "rafaela_sessao";

/** Tela de entrada do painel (fora do guard). */
export const ROTA_ENTRAR = "/painel/entrar";

/** Primeira tela após entrar. */
export const ROTA_PAINEL = "/painel";

/**
 * Valida o destino pós-login vindo da query string.
 *
 * Sem isso, `/painel/entrar?destino=https://site-malicioso` viraria um
 * open redirect após o login. Só aceitamos caminhos internos do painel.
 */
export function destinoSeguro(destino: string | null | undefined) {
  if (!destino) return ROTA_PAINEL;
  const ehCaminhoInternoDoPainel =
    destino.startsWith("/painel") && !destino.startsWith("//");
  return ehCaminhoInternoDoPainel ? destino : ROTA_PAINEL;
}
