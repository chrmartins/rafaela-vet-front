import type { Metadata } from "next";
import { EmConstrucao } from "../em-construcao";

export const metadata: Metadata = { title: "Tutores" };

export default function TutoresPage() {
  return (
    <EmConstrucao
      titulo="Tutores"
      descricao="Cadastro e busca de tutores, com endereço de atendimento e os animais vinculados a cada um."
    />
  );
}
