import {
  IconeCasa,
  IconeCoracao,
  IconeRelogio,
} from "@/components/ilustracoes/icones";

const diferenciais = [
  {
    Icone: IconeCasa,
    titulo: "No conforto de casa",
    descricao:
      "Seu pet é atendido no próprio território, sem o estresse do transporte e da sala de espera lotada.",
  },
  {
    Icone: IconeCoracao,
    titulo: "Atenção sem pressa",
    descricao:
      "Cada visita tem tempo para examinar com calma e ouvir você — o cuidado que um pet merece.",
  },
  {
    Icone: IconeRelogio,
    titulo: "Horário que cabe na rotina",
    descricao:
      "Você agenda a visita no melhor momento do seu dia, direto pelo WhatsApp.",
  },
];

export function SecaoSobre() {
  return (
    <section id="sobre" className="bg-creme py-20 sm:py-28">
      <div className="mx-auto max-w-conteudo px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="font-corpo text-sm font-medium uppercase tracking-[0.18em] text-verde-500">
              Sobre
            </p>
            <h2 className="mt-4 font-titulo text-titulo-md text-verde-900">
              Prazer, sou a Dra. Rafaela Soares
            </h2>
            <p className="mt-6 font-corpo text-lg leading-relaxed text-verde-700">
              Médica veterinária inscrita no{" "}
              <strong className="font-semibold text-verde-800">CRMV-RJ</strong>,
              dedicada à clínica geral de cães e gatos com atendimento
              domiciliar em todo o Rio de Janeiro.
            </p>
            <p className="mt-4 font-corpo text-base leading-relaxed text-verde-700">
              Escolhi atender em casa porque acredito que um animal tranquilo é
              mais fácil de examinar — e um tutor tranquilo colabora melhor com o
              cuidado. Levo até você a estrutura de uma consulta atenta, num
              ambiente que seu pet já conhece.
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {diferenciais.map(({ Icone, titulo, descricao }) => (
              <li
                key={titulo}
                className="rounded-2xl border border-linha bg-creme-200/50 p-6 shadow-cartao"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-verde-100 text-verde-600">
                  <Icone />
                </span>
                <h3 className="mt-4 font-titulo text-lg text-verde-900">
                  {titulo}
                </h3>
                <p className="mt-2 font-corpo text-sm leading-relaxed text-verde-700">
                  {descricao}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
