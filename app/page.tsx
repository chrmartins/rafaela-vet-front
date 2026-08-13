import { Cabecalho } from "@/components/layout/cabecalho";
import { Rodape } from "@/components/layout/rodape";
import { SecaoHero } from "@/components/secoes/secao-hero";
import { SecaoSobre } from "@/components/secoes/secao-sobre";
import { SecaoServicos } from "@/components/secoes/secao-servicos";
import { SecaoAreaAtendimento } from "@/components/secoes/secao-area-atendimento";
import { SecaoContato } from "@/components/secoes/secao-contato";

export default function PaginaInicial() {
  return (
    <>
      <Cabecalho />
      <main>
        <SecaoHero />
        <SecaoSobre />
        <SecaoServicos />
        <SecaoAreaAtendimento />
        <SecaoContato />
      </main>
      <Rodape />
    </>
  );
}
