/**
 * Aviso temporário para as rotas do painel que ainda não têm tela.
 * Some conforme cada uma for implementada — não é componente definitivo.
 */
export function EmConstrucao({
  titulo,
  descricao,
}: {
  titulo: string;
  descricao: string;
}) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="rounded-2xl border border-dashed border-linha bg-creme p-8 sm:p-12">
        <h2 className="font-titulo text-xl text-verde-900">{titulo}</h2>
        <p className="mt-2 max-w-prose font-corpo text-sm leading-relaxed text-verde-700">
          {descricao}
        </p>
      </div>
    </div>
  );
}
