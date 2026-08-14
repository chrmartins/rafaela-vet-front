import type { Metadata } from "next";
import { EmConstrucao } from "../em-construcao";

export const metadata: Metadata = { title: "Consultas" };

export default function ConsultasPage() {
  return (
    <EmConstrucao
      titulo="Consultas"
      descricao="Lista e busca de consultas, com agendamento, confirmação e cancelamento (sempre por status — consulta não é excluída fisicamente)."
    />
  );
}
