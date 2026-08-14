import { Header } from "@/components/header/header";
import { Footer } from "@/components/footer/footer";

/**
 * Layout do site público. O painel (`app/painel`) tem o seu próprio, com
 * sidebar e sessão — por isso Header/Footer moram aqui e não no layout raiz.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {/* pt-20 = altura do header fixo (h-20), garante que o conteúdo de
          toda página comece visível abaixo dele */}
      <main className="pt-20">{children}</main>
      <Footer />
    </>
  );
}
