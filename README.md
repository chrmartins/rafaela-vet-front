# Site institucional — Dra. Rafaela Soares

Site institucional (multipágina) da Dra. Rafaela Soares, médica-veterinária
com atendimento **domiciliar** (clínica geral, cães e gatos) no Rio de
Janeiro.

Stack: **Next.js 16 (App Router, Turbopack)** · **React 19** · TypeScript ·
Tailwind CSS · shadcn/ui (padrão `cva` + Radix `Slot`) · Zod + React Hook Form
· Zustand · Framer Motion. Fontes self-hosted via `@fontsource` (Fraunces +
Work Sans) — sem `next/font/google`.

## Comandos

```bash
npm install
npm run dev     # desenvolvimento (http://localhost:3000)
npm run build   # build de produção
npm run lint    # ESLint (eslint.config.mjs, flat config)
```

## Rotas

| URL                 | Página                                          |
|----------------------|--------------------------------------------------|
| `/`                  | Home (Hero + CTAs)                              |
| `/sobre`             | Sobre a Dra. Rafaela                            |
| `/servicos`          | Serviços + Área de atendimento (RJ)             |
| `/contato`           | Contato (formulário)                            |

Menu do header/footer lista as 4: Home, Sobre, Serviços, Contato.

Cada rota tem `metadata` própria (title/description) para SEO por página.
Cabeçalho e rodapé são renderizados uma vez em `app/layout.tsx` e persistem
entre as rotas.

## Estrutura

```
app/
  layout.tsx                 layout raiz (fontes, metadata base, Cabecalho+Rodape)
  page.tsx                    /
  sobre/page.tsx               /sobre
  servicos/page.tsx            /servicos (inclui a seção Área de Atendimento)
  contato/
    page.tsx                   /contato (Server — metadata + conteúdo estático)
    formulario-contato.tsx      Client — formulário interativo desta rota
  globals.css
components/
  ui/                    primitivos (botao, campo-texto, area-texto, rotulo)
  cabecalho/cabecalho.tsx, rodape/rodape.tsx, marca/marca.tsx
                         pasta-por-componente; usados em toda página, via app/layout.tsx
  ilustracoes/           SVGs próprios (ilustracao-cao-gato, icones)
store/                   estado global Zustand (use-menu-mobile)
schema/                  schemas Zod (esquema-contato → DadosContato)
lib/                     utilitários (cn, contato)
```

Não há camada `components/secoes/`: o conteúdo de cada página fica direto no
`page.tsx` da rota. Quando uma página precisa de interatividade (hooks,
`"use client"`) mas também exporta `metadata` (só permitido em Server
Component), só a parte interativa é extraída — colocada dentro da própria
pasta da rota, não em `components/`. Ver `CLAUDE.md` deste repo para o
racional completo e as convenções de nomenclatura.

## Formulário de contato

O formulário (`app/contato/formulario-contato.tsx`) valida com Zod e, ao
enviar, monta a mensagem e abre o **WhatsApp** (`wa.me`). Ainda **não há
backend**. O ponto exato de integração com a futura API de Agendamento está
marcado por comentário dentro de `aoEnviarFormulario`.

## Acessibilidade e qualidade

- Responsivo de 320px a desktop, sem overflow horizontal.
- Header fixo: `<main>` do layout raiz tem `pt-20` (altura do header) para o
  conteúdo de cada página começar visível abaixo dele.
- Inputs com fonte 16px (evita zoom automático no iOS Safari).
- Foco visível por teclado; `prefers-reduced-motion` respeitado (inclusive na
  animação de traço da Hero).
- SEO: metadata completa (title, description, Open Graph), `lang="pt-BR"`.

## Pendências / próximos passos

- Imagem de Open Graph (`og:image`) e `favicon` definitivos da marca.
- Integração real do formulário com a API de Agendamento quando o backend
  existir (domínio `agendamento`).
