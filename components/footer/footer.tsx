import Link from "next/link";
import { Logo } from "@/components/logo/logo";
import {
  WhatsappIcon,
  InstagramIcon,
  MapPinIcon,
} from "@/components/illustrations/icons";
import { navItems } from "@/components/header/nav-items";
import { contato, montarLinkWhatsapp } from "@/lib/contato";

export function Footer() {
  const anoAtual = new Date().getFullYear();
  const linkWhatsapp = montarLinkWhatsapp(
    "Olá, Dra. Rafaela! Gostaria de agendar uma visita.",
  );

  return (
    <footer className="border-t border-linha bg-creme">
      <div className="mx-auto max-w-conteudo px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <Logo withTagline />
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
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-verde-600"
                  >
                    {item.label}
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
                  <WhatsappIcon className="h-5 w-5 text-verde-600" />
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
                  <InstagramIcon className="h-5 w-5 text-verde-600" />
                  {contato.instagramUsuario}
                </a>
              </li>
              <li className="inline-flex items-center gap-3">
                <MapPinIcon className="h-5 w-5 text-verde-600" />
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
