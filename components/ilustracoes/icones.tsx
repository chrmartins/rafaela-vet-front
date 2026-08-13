import type { SVGProps } from "react";

/**
 * Ícones de linha próprios (24x24, stroke = currentColor).
 * Estilo alinhado ao traço do logo. Decorativos por padrão (aria-hidden).
 */
type PropriedadesIcone = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: PropriedadesIcone) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

export function IconeCasa(props: PropriedadesIcone) {
  return (
    <Base {...props}>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v9h12v-9" />
      <path d="M10 19v-5h4v5" />
    </Base>
  );
}

export function IconeCoracao(props: PropriedadesIcone) {
  return (
    <Base {...props}>
      <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z" />
    </Base>
  );
}

export function IconeAgenda(props: PropriedadesIcone) {
  return (
    <Base {...props}>
      <rect x={4} y={5} width={16} height={16} rx={2} />
      <path d="M4 9h16M8 3v4M16 3v4" />
      <path d="M9 14h2M14 14h1" />
    </Base>
  );
}

export function IconeEstetoscopio(props: PropriedadesIcone) {
  return (
    <Base {...props}>
      <path d="M6 3v5a4 4 0 0 0 8 0V3" />
      <path d="M6 3H4M14 3h2" />
      <path d="M10 16v1a4 4 0 0 0 8 0v-2" />
      <circle cx={18} cy={12} r={2} />
    </Base>
  );
}

export function IconeSeringa(props: PropriedadesIcone) {
  return (
    <Base {...props}>
      <path d="M14 4l6 6" />
      <path d="M16 8 8 16l-2 4-2-2 4-2 8-8" />
      <path d="M12 8l4 4M6 14l4 4" />
    </Base>
  );
}

export function IconePata(props: PropriedadesIcone) {
  return (
    <Base {...props}>
      <circle cx={6.5} cy={10} r={1.6} />
      <circle cx={10} cy={6.5} r={1.6} />
      <circle cx={14} cy={6.5} r={1.6} />
      <circle cx={17.5} cy={10} r={1.6} />
      <path d="M8 15.5c1-2 2.5-3 4-3s3 1 4 3c1 2-.4 3.5-2 3.5-1 0-1.4-.5-2-.5s-1 .5-2 .5c-1.6 0-3-1.5-2-3.5Z" />
    </Base>
  );
}

export function IconeMapa(props: PropriedadesIcone) {
  return (
    <Base {...props}>
      <path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10Z" />
      <circle cx={12} cy={11} r={2.2} />
    </Base>
  );
}

export function IconeRelogio(props: PropriedadesIcone) {
  return (
    <Base {...props}>
      <circle cx={12} cy={12} r={8} />
      <path d="M12 8v4l3 2" />
    </Base>
  );
}

export function IconeWhatsapp(props: PropriedadesIcone) {
  return (
    <Base {...props}>
      <path d="M4 20l1.4-4A8 8 0 1 1 9 19.2L4 20Z" />
      <path d="M9 9c0 3 3 6 6 6 .8 0 1.4-.8 1-1.5l-1.3-.8-1 .8c-1-.4-2.1-1.5-2.5-2.5l.8-1-.8-1.3C10.8 7.6 10 8.2 10 9" />
    </Base>
  );
}

export function IconeInstagram(props: PropriedadesIcone) {
  return (
    <Base {...props}>
      <rect x={4} y={4} width={16} height={16} rx={4.5} />
      <circle cx={12} cy={12} r={3.5} />
      <circle cx={17} cy={7} r={0.6} fill="currentColor" />
    </Base>
  );
}

export function IconeSeta(props: PropriedadesIcone) {
  return (
    <Base {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Base>
  );
}
