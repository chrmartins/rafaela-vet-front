import {
  CalendarIcon,
  StethoscopeIcon,
  UserIcon,
  PawIcon,
  ClockIcon,
} from "@/components/illustrations/icons";

/**
 * Itens da sidebar do painel, compartilhados entre desktop e drawer mobile.
 *
 * `exact: true` na Agenda porque ela mora em `/painel` — sem isso ela ficaria
 * marcada como ativa em toda rota filha (`/painel/consultas`, etc.).
 */
export const painelNavItems = [
  { label: "Agenda", href: "/painel", Icon: CalendarIcon, exact: true },
  { label: "Consultas", href: "/painel/consultas", Icon: StethoscopeIcon },
  { label: "Tutores", href: "/painel/tutores", Icon: UserIcon },
  { label: "Animais", href: "/painel/animais", Icon: PawIcon },
  {
    label: "Disponibilidade",
    href: "/painel/disponibilidade",
    Icon: ClockIcon,
  },
] as const;

/** Um item está ativo se a rota bate exatamente ou é uma subrota dele. */
export function isNavItemActive(
  pathname: string,
  item: { href: string; exact?: boolean },
) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
