import {
  IconeEstetoscopio,
  IconeSeringa,
  IconePata,
  IconeAgenda,
} from "@/components/ilustracoes/icones";

const servicos = [
  {
    Icone: IconeEstetoscopio,
    titulo: "Consulta clínica geral",
    descricao:
      "Avaliação completa para sintomas, mudanças de comportamento ou aquela dúvida que não pode esperar.",
  },
  {
    Icone: IconeSeringa,
    titulo: "Vacinação",
    descricao:
      "Aplicação e orientação do calendário vacinal de cães e gatos, sem sair de casa.",
  },
  {
    Icone: IconeAgenda,
    titulo: "Check-up de rotina",
    descricao:
      "Exame preventivo periódico para acompanhar a saúde do seu pet e detectar cedo o que importa.",
  },
  {
    Icone: IconePata,
    titulo: "Pequenos procedimentos",
    descricao:
      "Curativos, coleta de exames e cuidados simples realizados com segurança no ambiente doméstico.",
  },
];

export function SecaoServicos() {
  return (
    <section id="servicos" className="bg-creme-200 py-20 sm:py-28">
      <div className="mx-auto max-w-conteudo px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="font-corpo text-sm font-medium uppercase tracking-[0.18em] text-verde-500">
            Serviços
          </p>
          <h2 className="mt-4 font-titulo text-titulo-md text-verde-900">
            O que a Dra. Rafaela leva até você
          </h2>
          <p className="mt-4 font-corpo text-lg leading-relaxed text-verde-700">
            Cuidado clínico de cães e gatos, feito no ritmo do seu pet. Casos que
            exijam estrutura hospitalar são encaminhados com orientação.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          {servicos.map(({ Icone, titulo, descricao }) => (
            <li
              key={titulo}
              className="group rounded-2xl border border-linha bg-creme p-7 shadow-cartao transition-transform duration-200 hover:-translate-y-1"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-verde-100 text-verde-600 transition-colors group-hover:bg-verde-300 group-hover:text-verde-900">
                <Icone />
              </span>
              <h3 className="mt-5 font-titulo text-xl text-verde-900">
                {titulo}
              </h3>
              <p className="mt-2 font-corpo text-sm leading-relaxed text-verde-700">
                {descricao}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
