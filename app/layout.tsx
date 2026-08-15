import type { Metadata, Viewport } from "next";

// Fontes self-hosted via @fontsource (sem next/font/google — melhor p/ LGPD e performance).
// Subset latino apenas, pesos usados no design.
import "@fontsource/fraunces/latin-400.css";
import "@fontsource/fraunces/latin-500.css";
import "@fontsource/fraunces/latin-600.css";
import "@fontsource/fraunces/latin-600-italic.css";
import "@fontsource/fraunces/latin-700.css";
import "@fontsource/work-sans/latin-400.css";
import "@fontsource/work-sans/latin-500.css";
import "@fontsource/work-sans/latin-600.css";

import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

const tituloSite = "Dra. Rafaela Soares — Veterinária domiciliar no Rio de Janeiro";
const descricaoSite =
  "Atendimento veterinário domiciliar para cães e gatos no Rio de Janeiro. Clínica geral, vacinação e check-up de rotina, com o seu pet no conforto de casa.";

export const metadata: Metadata = {
  metadataBase: new URL("https://rafaelasoares.vet"),
  title: {
    default: tituloSite,
    template: "%s · Dra. Rafaela Soares",
  },
  description: descricaoSite,
  keywords: [
    "veterinária domiciliar",
    "veterinário em casa",
    "atendimento veterinário Rio de Janeiro",
    "clínica geral cães e gatos",
    "vacinação domiciliar pet",
  ],
  authors: [{ name: "Dra. Rafaela Soares" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://rafaelasoares.vet",
    siteName: "Dra. Rafaela Soares",
    title: tituloSite,
    description: descricaoSite,
  },
  twitter: {
    card: "summary_large_image",
    title: tituloSite,
    description: descricaoSite,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FBF9F1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // data-scroll-behavior="smooth": a partir do Next.js 16 o framework não
    // sobrescreve mais scroll-behavior:smooth (globals.css) durante a troca
    // de rota — sem esse atributo, navegar entre páginas rolaria suavemente
    // até o topo em vez de saltar direto. Ver app/guides/upgrading/version-16.
    <html lang="pt-BR" data-scroll-behavior="smooth">
      {/* Header/Footer não vivem aqui: cada área tem o seu layout —
          app/(site) para o site público, app/painel para a área restrita. */}
      <body className="font-corpo antialiased">
        {children}
        {/* Um único Toaster para as duas áreas. Fica na raiz de propósito: é o
            que faz o toast sobreviver à navegação client-side (ex.: avisar
            "Sessão encerrada" e só então redirecionar para o login). */}
        <Toaster />
      </body>
    </html>
  );
}
