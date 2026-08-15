import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api";
import { criarSessao, encerrarSessao } from "@/lib/acesso";
import { COOKIE_SESSAO } from "@/lib/sessao";

/**
 * BFF de sessão — a ponte entre o navegador e a API.
 *
 * É aqui que o padrão BFF se concretiza: o token que a API devolve **nunca
 * volta para o navegador**. Ele entra num cookie `httpOnly`, que o JavaScript
 * da página não consegue ler, e a partir daí é o servidor do Next que o
 * anexa nas chamadas à API. Um XSS no painel não teria como roubá-lo.
 */

export async function POST(requisicao: Request) {
  let credenciais: { email?: string; senha?: string };

  try {
    credenciais = await requisicao.json();
  } catch {
    return NextResponse.json({ mensagem: "Requisição inválida." }, { status: 400 });
  }

  if (!credenciais.email || !credenciais.senha) {
    return NextResponse.json(
      { mensagem: "Informe e-mail e senha." },
      { status: 400 },
    );
  }

  try {
    const sessao = await criarSessao(credenciais.email, credenciais.senha);

    (await cookies()).set(COOKIE_SESSAO, sessao.token, {
      httpOnly: true, // invisível para o JavaScript da página
      secure: process.env.NODE_ENV === "production", // em dev não há HTTPS
      sameSite: "lax", // some com o CSRF sem quebrar navegação normal
      path: "/",
      // Cookie morre junto com o token no backend — evita o usuário
      // "logado" na tela e recebendo 401 a cada ação.
      expires: new Date(sessao.expiraEm),
    });

    // Devolve só o usuário. O token fica no cookie e não trafega para o JS.
    return NextResponse.json({ usuario: sessao.usuario });
  } catch (erro) {
    if (erro instanceof ApiError) {
      // `message` (e não `mensagem`) porque ApiError estende Error — a
      // propriedade é da linguagem. O texto em si vem em português da API.
      return NextResponse.json(
        { mensagem: erro.message, requestId: erro.requestId },
        { status: erro.status },
      );
    }
    // Backend fora do ar, DNS, timeout...
    console.error("Falha ao autenticar contra a API", erro);
    return NextResponse.json(
      { mensagem: "Não foi possível entrar agora. Tente novamente." },
      { status: 503 },
    );
  }
}

/**
 * Sair.
 *
 * Revoga no backend **e** apaga o cookie. Se a chamada ao backend falhar,
 * ainda assim removemos o cookie: é melhor a pessoa sair da tela e o token
 * expirar sozinho do que continuar aparentemente logada.
 */
export async function DELETE() {
  try {
    await encerrarSessao();
  } catch (erro) {
    console.error("Falha ao revogar a sessão na API", erro);
  }

  (await cookies()).delete(COOKIE_SESSAO);
  return new NextResponse(null, { status: 204 });
}
