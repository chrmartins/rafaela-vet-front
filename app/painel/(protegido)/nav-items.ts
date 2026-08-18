import {
  CalendarIcon,
  StethoscopeIcon,
  UserIcon,
  UsersIcon,
  PawIcon,
  ClockIcon,
} from "@/components/illustrations/icons";
import type { ComponentType } from "react";
import type { PerfilAcesso } from "@/lib/acesso-modelo";

interface PainelNavItem {
  label: string;
  href: string;
  Icon: ComponentType<{ className?: string }>;
  /** Rota exata, sem casar com subrotas. */
  exact?: boolean;
  /**
   * Perfis que enxergam o item. Ausente = todo mundo que está logado.
   *
   * Isto é **cosmético**: esconder o link evita oferecer uma porta trancada,
   * mas não protege nada. Quem digita a URL chega na página do mesmo jeito —
   * a proteção é a checagem dentro da rota e da Server Action.
   */
  perfis?: readonly PerfilAcesso[];
}

/**
 * Itens da sidebar do painel, compartilhados entre desktop e drawer mobile.
 *
 * `exact: true` na Agenda porque ela mora em `/painel` — sem isso ela ficaria
 * marcada como ativa em toda rota filha (`/painel/consultas`, etc.).
 */
export const painelNavItems: readonly PainelNavItem[] = [
  { label: "Agenda", href: "/painel", Icon: CalendarIcon, exact: true },
  { label: "Consultas", href: "/painel/consultas", Icon: StethoscopeIcon },
  { label: "Tutores", href: "/painel/tutores", Icon: UserIcon },
  { label: "Animais", href: "/painel/animais", Icon: PawIcon },
  {
    label: "Disponibilidade",
    href: "/painel/disponibilidade",
    Icon: ClockIcon,
  },
  {
    label: "Usuários",
    href: "/painel/usuarios",
    Icon: UsersIcon,
    perfis: ["ADMINISTRADOR"],
  },
] as const;

/** Os itens que este perfil enxerga na navegação. */
export function navItemsPara(perfil: PerfilAcesso) {
  return painelNavItems.filter((item) => !item.perfis || item.perfis.includes(perfil));
}

/** Um item está ativo se a rota bate exatamente ou é uma subrota dele. */
export function isNavItemActive(
  pathname: string,
  item: { href: string; exact?: boolean },
) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
