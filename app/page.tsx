import Link from "next/link";
import { Botao } from "@/components/ui/botao";

export default function PaginaInicial() {
  return (
    // min-h com 100dvh (não 100vh): em mobile a viewport unit "dvh" já
    // desconta a barra de endereço, evitando que o rodapé fique "espiando"
    // no fim da tela quando o navegador esconde/mostra a UI ao rolar.
    // 5rem = altura do header fixo (h-20).
    <section className="flex min-h-[calc(100dvh-5rem)] items-center bg-creme">
      <div className="mx-auto grid w-full max-w-conteudo items-center gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-2 lg:gap-10">
        <div className="max-w-xl">
          <p className="animate-surgir-suave font-corpo text-sm font-medium uppercase tracking-[0.18em] text-verde-500">
            Atendimento veterinário domiciliar · Rio de Janeiro
          </p>

          <h1
            className="mt-5 font-titulo text-titulo-lg text-verde-900 animate-surgir-suave"
            style={{ animationDelay: "0.08s" }}
          >
            O cuidado com seu pet,{" "}
            <span className="italic text-verde-600">no conforto da sua casa</span>.
          </h1>

          <p
            className="mt-6 font-corpo text-lg leading-relaxed text-verde-700 animate-surgir-suave"
            style={{ animationDelay: "0.16s" }}
          >
            Consulta clínica, vacinação e check-up de rotina para cães e gatos —
            sem a tensão do transporte e da sala de espera. A Dra. Rafaela vai
            até você.
          </p>

          <div
            className="mt-9 flex flex-col gap-3 sm:flex-row animate-surgir-suave"
            style={{ animationDelay: "0.24s" }}
          >
            <Botao comoFilho tamanho="grande">
              <Link href="/contato">Agendar visita</Link>
            </Botao>
            <Botao comoFilho variante="secundario" tamanho="grande">
              <Link href="/servicos">Ver serviços</Link>
            </Botao>
          </div>
        </div>

        {/* Ilustração-assinatura — cão + gato em traço único.
            public/cao-e-gato.png (recolorida para o verde da marca) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cao-e-gato.png"
          alt="Ilustração em traço único de um gato e um cão sentados lado a lado"
          width={1621}
          height={642}
          loading="eager"
          className="animate-surgir-suave mx-auto w-full max-w-xl lg:max-w-none"
          style={{ animationDelay: "0.2s" }}
        />
      </div>
    </section>
  );
}
