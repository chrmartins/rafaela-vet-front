import type { Metadata } from "next";
import { IconeWhatsapp } from "@/components/ilustracoes/icones";
import { contato } from "@/lib/contato";
import { FormularioContato } from "./formulario-contato";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Agende uma visita veterinária domiciliar com a Dra. Rafaela Soares no Rio de Janeiro. Preencha o formulário e continue pelo WhatsApp.",
};

export default function PaginaContato() {
  return (
    <section className="bg-creme-200 py-16 sm:py-24">
      <div className="mx-auto grid max-w-conteudo gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <p className="font-corpo text-sm font-medium uppercase tracking-[0.18em] text-verde-500">
            Contato
          </p>
          <h1 className="mt-4 font-titulo text-titulo-md text-verde-900">
            Vamos agendar a visita?
          </h1>
          <p className="mt-4 font-corpo text-lg leading-relaxed text-verde-700">
            Preencha os dados abaixo. Ao enviar, abrimos uma conversa no WhatsApp
            com tudo já preenchido — é só confirmar o melhor horário.
          </p>

          <a
            href={`tel:+${contato.whatsappNumero}`}
            className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-linha bg-creme px-5 py-4 font-corpo text-verde-800 shadow-cartao transition-colors hover:bg-verde-100"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-verde-100 text-verde-600">
              <IconeWhatsapp className="h-5 w-5" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-xs text-verde-500">
                Prefere ligar ou chamar direto?
              </span>
              <span className="font-semibold">{contato.telefoneExibicao}</span>
            </span>
          </a>
        </div>

        <FormularioContato />
      </div>
    </section>
  );
}
