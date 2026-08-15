import { cookies } from "next/headers";
import { COOKIE_SESSAO } from "./sessao";

/**
 * Cliente da API (rafaela-vet-api).
 *
 * **Só roda no servidor.** É o coração do padrão BFF: o token de sessão vive
 * num cookie httpOnly que só o servidor do Next enxerga, e é daqui que ele
 * sai como `Authorization: Bearer`. O navegador nunca vê o token, então um
 * XSS no painel não consegue roubá-lo.
 */
const URL_API = process.env.API_URL ?? "http://localhost:8080";

/** Erro devolvido pela API, já no formato dela. */
export interface ErroApi {
  requestId: string | null;
  status: number;
  mensagem: string;
  campos: { campo: string; mensagem: string }[];
}

export class ApiError extends Error {
  readonly status: number;
  readonly requestId: string | null;
  readonly campos: { campo: string; mensagem: string }[];

  constructor(erro: ErroApi) {
    super(erro.mensagem);
    this.name = "ApiError";
    this.status = erro.status;
    this.requestId = erro.requestId;
    this.campos = erro.campos ?? [];
  }
}

interface OpcoesRequisicao extends Omit<RequestInit, "body"> {
  corpo?: unknown;
  /** Anexa o token da sessão atual. Padrão: true. */
  autenticado?: boolean;
}

/**
 * Chama a API e devolve o corpo já convertido.
 *
 * Lança {@link ApiError} para respostas de erro, preservando o `requestId` —
 * é ele que liga o problema visto na tela ao log do backend.
 */
export async function chamarApi<T>(
  caminho: string,
  { corpo, autenticado = true, headers, ...resto }: OpcoesRequisicao = {},
): Promise<T> {
  const cabecalhos = new Headers(headers);

  if (corpo !== undefined) {
    cabecalhos.set("Content-Type", "application/json");
  }

  if (autenticado) {
    const token = (await cookies()).get(COOKIE_SESSAO)?.value;
    if (token) {
      cabecalhos.set("Authorization", `Bearer ${token}`);
    }
  }

  const resposta = await fetch(`${URL_API}${caminho}`, {
    ...resto,
    headers: cabecalhos,
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
    // Dado de painel é sempre por requisição — nunca servir cache de um
    // usuário para outro.
    cache: "no-store",
  });

  if (!resposta.ok) {
    throw new ApiError(await lerErro(resposta));
  }

  // 204 e afins não têm corpo.
  if (resposta.status === 204 || resposta.headers.get("content-length") === "0") {
    return undefined as T;
  }

  return (await resposta.json()) as T;
}

/**
 * A API responde erro em JSON, mas um 502 do proxy ou uma queda do backend
 * viriam em HTML — daí a leitura defensiva.
 */
async function lerErro(resposta: Response): Promise<ErroApi> {
  try {
    const json = await resposta.json();
    return {
      requestId: json.requestId ?? resposta.headers.get("X-Request-Id"),
      status: json.status ?? resposta.status,
      mensagem: json.mensagem ?? "Não foi possível completar a operação.",
      campos: json.campos ?? [],
    };
  } catch {
    return {
      requestId: resposta.headers.get("X-Request-Id"),
      status: resposta.status,
      mensagem: "Não foi possível completar a operação.",
      campos: [],
    };
  }
}
