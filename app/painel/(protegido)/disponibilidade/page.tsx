import type { Metadata } from "next";
import { EmConstrucao } from "../em-construcao";

export const metadata: Metadata = { title: "Disponibilidade" };

export default function DisponibilidadePage() {
  return (
    <EmConstrucao
      titulo="Disponibilidade"
      descricao="Blocos de horário em que a Dra. Rafaela atende, incluindo o intervalo entre consultas — definido manualmente por enquanto (o cálculo por distância está no roadmap)."
    />
  );
}
