# Site institucional — Dra. Rafaela Soares

Home do site institucional da Dra. Rafaela Soares, médica-veterinária com
atendimento **domiciliar** (clínica geral, cães e gatos) no Rio de Janeiro.

Stack: **Next.js 14 (App Router)** · TypeScript · Tailwind CSS · shadcn/ui
(padrão `cva` + Radix `Slot`) · Zod + React Hook Form · Zustand · Framer Motion.
Fontes self-hosted via `@fontsource` (Fraunces + Work Sans) — sem
`next/font/google`.

## Comandos

```bash
npm install
npm run dev     # desenvolvimento (http://localhost:3000)
npm run build   # build de produção
npm run lint    # ESLint
```

## Estrutura

```
app/                     rotas (App Router), layout, metadata/SEO, globals.css
components/
  ui/                    primitivos (botao, campo-texto, area-texto, rotulo)
  layout/                cabecalho, rodape, marca
  secoes/                uma seção da Home por arquivo (prefixo Secao*)
  ilustracoes/           SVGs próprios (ilustracao-cao-gato, icones)
store/                   estado global Zustand (use-menu-mobile)
schema/                  schemas Zod (esquema-contato → DadosContato)
lib/                     utilitários (cn, contato)
```

Convenções de nomenclatura seguem `../padrao-nomenclatura.md` (seção 10):
pastas de topo em inglês; arquivos/componentes/funções em português; seções com
prefixo `Secao`, hooks/stores com prefixo `use`, handlers com prefixo `ao`,
schemas Zod `esquema*`/`Dados*`, props `Propriedades*`.

## Formulário de contato

O formulário (`components/secoes/secao-contato.tsx`) valida com Zod e, ao enviar,
monta a mensagem e abre o **WhatsApp** (`wa.me`). Ainda **não há backend**. O
ponto exato de integração com a futura API de Agendamento está marcado por
comentário dentro de `aoEnviarFormulario`.

## Acessibilidade e qualidade

- Responsivo de 320px a desktop, sem overflow horizontal.
- Header fixo com `scroll-margin-top` nas seções (âncoras não ficam cobertas).
- Inputs com fonte 16px (evita zoom automático no iOS Safari).
- Foco visível por teclado; `prefers-reduced-motion` respeitado (inclusive na
  animação de traço da Hero).
- SEO: metadata completa (title, description, Open Graph), `lang="pt-BR"`.

## Pendências / próximos passos

- **Segurança de dependências**: fixado em `next@14.2.35` (patch seguro mais
  recente do 14.2 — resolve o CVE crítico e os exploráveis). Restam advisories
  em `next`/`postcss` cuja correção só existe no **Next 16** (breaking). O site
  não usa `next/image`, então o Image Optimizer não fica exposto. Decidir junto
  com o roadmap se/quando migrar para Next 15/16.
- Imagem de Open Graph (`og:image`) e `favicon` definitivos da marca.
- Integração real do formulário com a API de Agendamento quando o backend
  existir (domínio `agendamento`).
