import type { Metadata } from "next";
import { EmConstrucao } from "../em-construcao";

export const metadata: Metadata = { title: "Animais" };

export default function AnimaisPage() {
  return (
    <EmConstrucao
      titulo="Animais"
      descricao="Busca de animais e ficha individual, com histórico clínico, vacinas aplicadas e evolução de peso."
    />
  );
}
