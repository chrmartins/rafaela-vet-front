import { cn } from "@/lib/cn";

/**
 * Wordmark da marca: monograma "RS" em serifa + nome por extenso.
 * Usada no cabeçalho e no rodapé.
 */
export function Marca({
  className,
  comSubtitulo = false,
}: {
  className?: string;
  comSubtitulo?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        aria-hidden
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-verde-300 bg-creme-200 font-titulo text-lg font-semibold tracking-tight text-verde-600"
      >
        RS
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-titulo text-lg font-semibold tracking-tight text-verde-900">
          Dra. Rafaela Soares
        </span>
        {comSubtitulo && (
          <span className="mt-1 font-corpo text-xs text-verde-500">
            Veterinária domiciliar
          </span>
        )}
      </span>
    </span>
  );
}
