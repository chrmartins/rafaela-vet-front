import { cn } from "@/lib/cn";

interface PropriedadesIlustracaoCaoGato {
  className?: string;
  /** Ativa a animação de "traço se desenhando" na entrada. */
  animar?: boolean;
}

/**
 * Motivo cão + gato do logo da marca, recriado como ilustração de traço único.
 * Ao montar com `animar`, a linha se desenha (stroke-draw) — respeitando
 * prefers-reduced-motion via classes em globals.css.
 */
export function IlustracaoCaoGato({
  className,
  animar = false,
}: PropriedadesIlustracaoCaoGato) {
  const classeTraco = animar ? "traco-desenha" : undefined;
  const classeDetalhe = animar ? "detalhe-traco" : undefined;

  return (
    <svg
      viewBox="0 0 480 300"
      fill="none"
      role="img"
      aria-label="Ilustração em traço único de um cão e um gato lado a lado"
      className={cn("h-auto w-full", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        stroke="currentColor"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* --- CÃO (esquerda), orelhas caídas --- */}
        <path
          className={classeTraco}
          pathLength={1}
          d="M140 78 C118 78 112 92 112 104 C96 96 74 104 70 132 C66 160 78 182 100 186 C98 210 116 232 140 236 C164 232 182 210 180 186 C202 182 214 160 210 132 C206 104 184 96 168 104 C168 92 162 78 140 78 Z"
        />
        <path
          className={classeTraco}
          pathLength={1}
          style={{ ["--atraso-traco" as string]: "0.5s" }}
          d="M122 198 C122 216 140 226 140 226 C140 226 158 216 158 198"
        />

        {/* --- GATO (direita), orelhas pontudas --- */}
        <path
          className={classeTraco}
          pathLength={1}
          style={{ ["--atraso-traco" as string]: "1s" }}
          d="M312 116 L324 74 L346 106 C348 105 350 105 352 106 L372 74 L384 116 C396 132 396 162 380 178 C372 196 356 204 348 204 C340 204 324 196 316 178 C300 162 300 132 312 116 Z"
        />
      </g>

      {/* --- Detalhes: olhos, focinhos, bigodes --- */}
      <g className={classeDetalhe} fill="currentColor" stroke="none">
        {/* olhos do cão */}
        <circle cx={122} cy={168} r={4.5} />
        <circle cx={158} cy={168} r={4.5} />
        {/* focinho do cão */}
        <ellipse cx={140} cy={200} rx={7} ry={5} />
        {/* olhos do gato */}
        <circle cx={334} cy={150} r={4.5} />
        <circle cx={362} cy={150} r={4.5} />
        {/* focinho do gato */}
        <path d="M341 166 L355 166 L348 174 Z" />
      </g>

      {/* bigodes do gato */}
      <g
        className={classeDetalhe}
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
      >
        <line x1={330} y1={168} x2={300} y2={162} />
        <line x1={330} y1={176} x2={299} y2={178} />
        <line x1={366} y1={168} x2={396} y2={162} />
        <line x1={366} y1={176} x2={397} y2={178} />
      </g>
    </svg>
  );
}
