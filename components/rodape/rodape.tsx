import Link from "next/link";
import { Marca } from "@/components/marca/marca";
import {
  IconeWhatsapp,
  IconeInstagram,
  IconeMapa,
} from "@/components/ilustracoes/icones";
import { contato, montarLinkWhatsapp } from "@/lib/contato";

const linksNavegacao = [
  { rotulo: "Sobre", rota: "/sobre" },
  { rotulo: "Serviços", rota: "/servicos" },
  { rotulo: "Área de atendimento", rota: "/area-atendimento" },
  { rotulo: "Contato", rota: "/contato" },
] as const;

export function Rodape() {
  const anoAtual = new Date().getFullYear();
  const linkWhatsapp = montarLinkWhatsapp(
    "Olá, Dra. Rafaela! Gostaria de agendar uma visita.",
  );

  return (
    <footer className="border-t border-linha bg-creme">
      <div className="mx-auto max-w-conteudo px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Marca comSubtitulo />
            <p className="mt-5 font-corpo text-sm leading-relaxed text-verde-700">
              Atendimento veterinário domiciliar para cães e gatos, com calma e
              atenção, no conforto da sua casa.
            </p>
          </div>

          <div>
            <h2 className="font-corpo text-sm font-semibold uppercase tracking-[0.14em] text-verde-500">
              Navegação
            </h2>
            <ul className="mt-4 flex flex-col gap-3 font-corpo text-sm text-verde-800">
              {linksNavegacao.map((item) => (
                <li key={item.rota}>
                  <Link
                    href={item.rota}
                    className="transition-colors hover:text-verde-600"
                  >
                    {item.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-corpo text-sm font-semibold uppercase tracking-[0.14em] text-verde-500">
              Contato
            </h2>
            <ul className="mt-4 flex flex-col gap-3 font-corpo text-sm text-verde-800">
              <li>
                <a
                  href={linkWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded transition-colors hover:text-verde-600"
                >
                  <IconeWhatsapp className="h-5 w-5 text-verde-600" />
                  {contato.telefoneExibicao}
                </a>
              </li>
              <li>
                <a
                  href={contato.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded transition-colors hover:text-verde-600"
                >
                  <IconeInstagram className="h-5 w-5 text-verde-600" />
                  {contato.instagramUsuario}
                </a>
              </li>
              <li className="inline-flex items-center gap-3">
                <IconeMapa className="h-5 w-5 text-verde-600" />
                {contato.localizacao}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-linha pt-6">
          <p className="font-corpo text-xs text-verde-500">
            © {anoAtual} Dra. Rafaela Soares · Médica-veterinária (CRMV-RJ) ·
            Atendimento domiciliar no Rio de Janeiro.
          </p>
        </div>
      </div>
    </footer>
  );
}
