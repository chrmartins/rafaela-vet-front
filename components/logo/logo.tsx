import { cn } from "@/lib/cn";

interface LogoProps {
  className?: string;
  /** Exibe a linha "Veterinária domiciliar" abaixo do nome. */
  withTagline?: boolean;
  /** Cores claras, para uso sobre fundo verde (sidebar do painel). */
  inverse?: boolean;
}

/**
 * Wordmark da marca: monograma "RS" em serifa + nome por extenso.
 * Usada no Header, no Footer e na sidebar do painel (com `inverse`).
 */
export function Logo({
  className,
  withTagline = false,
  inverse = false,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        aria-hidden
        className={cn(
          "grid h-11 w-11 shrink-0 place-items-center rounded-full border font-titulo text-lg font-semibold tracking-tight",
          inverse
            ? "border-creme/30 bg-creme/10 text-creme"
            : "border-verde-300 bg-creme-200 text-verde-600",
        )}
      >
        RS
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-titulo text-lg font-semibold tracking-tight",
            inverse ? "text-creme" : "text-verde-900",
          )}
        >
          Dra. Rafaela Soares
        </span>
        {withTagline && (
          <span
            className={cn(
              "mt-1 font-corpo text-xs",
              inverse ? "text-creme/70" : "text-verde-500",
            )}
          >
            Veterinária domiciliar
          </span>
        )}
      </span>
    </span>
  );
}
