import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agenda",
};

export default function AgendaPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <p className="font-corpo text-sm text-verde-500">
        {/* TODO: substituir por dados reais quando a API existir */}
        Em construção — a Agenda do Dia é a próxima tela.
      </p>
    </div>
  );
}
