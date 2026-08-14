import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_SESSAO, ROTA_ENTRAR, ROTA_PAINEL } from "@/lib/sessao";

/**
 * Guard de rota do painel.
 *
 * ⚠️ Esta checagem é DELIBERADAMENTE BARATA: ela só olha se o cookie de
 * sessão existe, não se ele é válido. Não trate isto como camada de
 * segurança — quem autoriza de verdade é a API Spring, a cada request.
 * O papel daqui é só evitar que a pessoa veja uma tela vazia do painel
 * antes de ser mandada para o login.
 *
 * (No Next 16 o antigo `middleware.ts` virou `proxy.ts`; o runtime é
 * `nodejs` e não é configurável.)
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const temSessao = request.cookies.has(COOKIE_SESSAO);

  // Tela de entrar: quem já tem sessão não precisa vê-la
  if (pathname === ROTA_ENTRAR) {
    return temSessao
      ? NextResponse.redirect(new URL(ROTA_PAINEL, request.url))
      : NextResponse.next();
  }

  // Demais rotas do painel exigem sessão
  if (!temSessao) {
    const url = new URL(ROTA_ENTRAR, request.url);
    // Guarda para onde a pessoa queria ir, para voltar lá depois de entrar.
    // A leitura deste parâmetro passa por `destinoSeguro()` (lib/sessao.ts).
    url.searchParams.set("destino", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/painel/:path*"],
};
