import type { Metadata } from "next";
import Link from "next/link";
import { Botao } from "@/components/ui/botao";
import { IconeMapa } from "@/components/ilustracoes/icones";

export const metadata: Metadata = {
  title: "Área de atendimento",
  description:
    "Atendimento veterinário domiciliar da Dra. Rafaela Soares na cidade do Rio de Janeiro. Confirme a cobertura do seu bairro pelo WhatsApp.",
};

export default function PaginaAreaAtendimento() {
  return (
    <section className="bg-creme py-16 sm:py-24">
      <div className="mx-auto max-w-conteudo px-5 sm:px-8">
        <div className="rounded-[2rem] bg-verde-600 px-7 py-12 text-creme shadow-flutuante sm:px-14 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-creme/15 px-3 py-1 text-sm font-medium text-creme">
                <IconeMapa className="h-4 w-4" />
                Área de atendimento
              </span>
              <h1 className="mt-5 font-titulo text-titulo-md text-creme">
                Atendimento domiciliar no Rio de Janeiro
              </h1>
              <p className="mt-4 font-corpo text-lg leading-relaxed text-creme/85">
                A Dra. Rafaela atende a domicílio na cidade do Rio de Janeiro.
                Não sabe se cobre o seu bairro? Fala com a gente pelo WhatsApp —
                confirmamos a disponibilidade na hora.
              </p>
            </div>

            <div className="lg:pl-6">
              <Botao comoFilho variante="sobreVerde" tamanho="grande">
                <Link href="/contato">Confirmar meu bairro</Link>
              </Botao>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
