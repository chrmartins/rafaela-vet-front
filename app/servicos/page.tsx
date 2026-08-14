import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  StethoscopeIcon,
  SyringeIcon,
  PawIcon,
  CalendarIcon,
  MapPinIcon,
} from "@/components/illustrations/icons";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Consulta clínica geral, vacinação, check-up de rotina e pequenos procedimentos para cães e gatos, com atendimento veterinário domiciliar no Rio de Janeiro.",
};

const servicos = [
  {
    Icon: StethoscopeIcon,
    titulo: "Consulta clínica geral",
    descricao:
      "Avaliação completa para sintomas, mudanças de comportamento ou aquela dúvida que não pode esperar.",
  },
  {
    Icon: SyringeIcon,
    titulo: "Vacinação",
    descricao:
      "Aplicação e orientação do calendário vacinal de cães e gatos, sem sair de casa.",
  },
  {
    Icon: CalendarIcon,
    titulo: "Check-up de rotina",
    descricao:
      "Exame preventivo periódico para acompanhar a saúde do seu pet e detectar cedo o que importa.",
  },
  {
    Icon: PawIcon,
    titulo: "Pequenos procedimentos",
    descricao:
      "Curativos, coleta de exames e cuidados simples realizados com segurança no ambiente doméstico.",
  },
];

export default function ServicosPage() {
  return (
    // min-h com 100dvh no wrapper das duas seções juntas (não em cada uma
    // separadamente) — garante que o rodapé só apareça depois de rolar, sem
    // forçar duas telas cheias de scroll. Mesmo padrão da Home/Sobre/Contato.
    <div className="min-h-[calc(100dvh-5rem)]">
      <section className="bg-creme-200 py-16 sm:py-24">
        <div className="mx-auto max-w-conteudo px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="font-corpo text-sm font-medium uppercase tracking-[0.18em] text-verde-500">
              Serviços
            </p>
            <h1 className="mt-4 font-titulo text-titulo-md text-verde-900">
              O que a Dra. Rafaela leva até você
            </h1>
            <p className="mt-4 font-corpo text-lg leading-relaxed text-verde-700">
              Cuidado clínico de cães e gatos, feito no ritmo do seu pet. Casos
              que exijam estrutura hospitalar são encaminhados com orientação.
            </p>
          </div>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {servicos.map(({ Icon, titulo, descricao }) => (
              <li
                key={titulo}
                className="group rounded-2xl border border-linha bg-creme p-7 shadow-cartao transition-transform duration-200 hover:-translate-y-1"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-verde-100 text-verde-600 transition-colors group-hover:bg-verde-300 group-hover:text-verde-900">
                  <Icon />
                </span>
                <h2 className="mt-5 font-titulo text-xl text-verde-900">
                  {titulo}
                </h2>
                <p className="mt-2 font-corpo text-sm leading-relaxed text-verde-700">
                  {descricao}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Área de atendimento — antes era rota própria (/area-atendimento),
          agora vive dentro de Serviços */}
      <section className="bg-creme py-16 sm:py-24">
        <div className="mx-auto max-w-conteudo px-5 sm:px-8">
          <div className="rounded-[2rem] bg-verde-600 px-7 py-12 text-creme shadow-flutuante sm:px-14 sm:py-16">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-creme/15 px-3 py-1 text-sm font-medium text-creme">
                  <MapPinIcon className="h-4 w-4" />
                  Área de atendimento
                </span>
                <h2 className="mt-5 font-titulo text-titulo-md text-creme">
                  Atendimento domiciliar no Rio de Janeiro
                </h2>
                <p className="mt-4 font-corpo text-lg leading-relaxed text-creme/85">
                  A Dra. Rafaela atende a domicílio na cidade do Rio de
                  Janeiro. Não sabe se cobre o seu bairro? Fala com a gente
                  pelo WhatsApp — confirmamos a disponibilidade na hora.
                </p>
              </div>

              <div className="lg:pl-6">
                <Button asChild variant="inverse" size="lg">
                  <Link href="/contato">Confirmar meu bairro</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
