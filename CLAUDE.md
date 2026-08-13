# CLAUDE.md — rafaela-vet-front

Frontend completo do sistema da **Dra. Rafaela Soares**, médica-veterinária
com atendimento **domiciliar** (clínica geral, cães e gatos) no Rio de
Janeiro. É o próprio repo que sobe na Vercel (app na raiz, sem monorepo).

**Escopo deste repo — não é só o site público.** Hoje ele só tem a landing
page pública (rotas `/`, `/sobre`, `/servicos`, `/area-atendimento`,
`/contato`), mas vai crescer para incluir, **dentro do mesmo repo**, uma
**área administrativa** com cadastro de tutores/animais, administração de
consultas e prontuários. Não existe (e não está planejada) uma área de
tutor separada — tudo fica na área administrativa deste `rafaela-vet-front`.
Ao estruturar rotas/pastas novas, não assuma que este repo continua sendo só
"o site institucional". Pontos ainda em aberto (perguntar antes de assumir):
onde a área administrativa mora no App Router, modelo de autenticação, e se
`painel.rafaelasoares.vet` (domínio citado abaixo) ainda é o plano de deploy
para ela.

> Repo irmão do mesmo projeto maior (fora deste repo):
> `rafaela-vet-api` (backend Spring Boot/Java, ainda não criado). Não assuma
> que exista código ou contrato de API além do que está documentado aqui.

## Stack

- **Next.js 16** (App Router, Turbopack) + TypeScript + **React 19**
- Tailwind CSS
- shadcn/ui — componentes próprios em `components/ui/`, padrão `cva` +
  Radix `Slot` (prop `comoFilho` para composição, não `asChild`)
- Zod + React Hook Form (validação de formulário)
- Zustand (estado global simples — hoje só o menu mobile)
- Framer Motion (animações)
- Fontes **self-hosted via `@fontsource`** (Fraunces + Work Sans) —
  **nunca** usar `next/font/google`: evita dependência de
  `fonts.googleapis.com` em runtime (LGPD + performance)

## Comandos

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de produção — rodar antes de considerar algo pronto
npm run lint    # ESLint (eslint.config.mjs, flat config — não é mais `next lint`,
                # removido no Next 16)
```

`next dev` e `next build` usam saídas separadas (`.next/dev` vs `.next/`)
desde o Next 16 — rodar os dois ao mesmo tempo não corrompe mais o build
(bug que existia no Next 14 e está documentado no histórico deste arquivo).

## Identidade visual (não introduzir cores/fontes fora disso)

- Verde primário `#4F6142` · verde médio `#6E8659` · verde claro `#A8BB95`
- Creme (fundo) `#FBF9F1` / `#F6F2E4` · texto `#2E3A26`
- Tokens em `tailwind.config.ts`: `verde-*`, `creme-*`, `linha`
- Tipografia: `Fraunces` (display, títulos) + `Work Sans` (corpo), expostas
  como `--fonte-titulo` / `--fonte-corpo` em `app/globals.css`,
  `font-titulo` / `font-corpo` no Tailwind
- Elemento-assinatura da marca: traço único cão + gato (o motivo do logo).
  Versão em uso na Hero: `public/cao-e-gato.png` (PNG recolorido para o verde
  da marca, fundo transparente). Existe também uma versão em SVG animável
  (`stroke-draw`) em `components/ilustracoes/ilustracao-cao-gato.tsx` — hoje
  **não está em uso** em nenhuma página; é um ativo de marca para retomar se
  quisermos a animação de "traço se desenhando" de novo.

## Estrutura de pastas

Pastas de topo em **inglês** (padrão de mercado — o que ferramentas, IDEs e
qualquer dev React já reconhecem). Dentro delas, arquivo/componente/
função/variável em **português**, autoexplicativo, sem termos genéricos
(`Service`, `Manager`, `Helper`, `data`, `info`, `item`).

Site **multipágina** de verdade (App Router), não uma single-page com âncoras.
Cada rota é uma pasta em `app/` com seu próprio `page.tsx` + `metadata`
(title/description próprios — SEO por página, não um título genérico
repetido). Cabeçalho e rodapé vivem no `app/layout.tsx` raiz (persistentes
entre rotas, não duplicados em cada `page.tsx`).

**Não existe camada `components/secoes/`.** O conteúdo de cada página fica
direto no `page.tsx` da rota — nada de um componente `Secao*` intermediário
só repassando JSX. Cada `page.tsx` é dona do seu próprio `<h1>` (é a única
seção da página).

Quando uma página precisa de interatividade (hooks, estado, handlers — exige
`"use client"`) mas também precisa exportar `metadata` (só é permitido em
Server Component), extraia **só a parte interativa** para um arquivo
colocado dentro da própria pasta da rota (não em `components/`), e importe
esse componente no `page.tsx`. Exemplo em uso: `app/contato/page.tsx`
(Server, tem `metadata`) importa `app/contato/formulario-contato.tsx`
(Client, `"use client"`, usa `useForm`) — o resto do conteúdo estático da
página (texto, links) fica direto no `page.tsx`.

```
app/
  layout.tsx                layout raiz: fontes, metadata base
                             (title.template), Cabecalho + <main pt-20> + Rodape
  page.tsx                   /                  (Hero + CTAs)
  sobre/page.tsx              /sobre
  servicos/page.tsx           /servicos
  area-atendimento/page.tsx   /area-atendimento
  contato/
    page.tsx                  /contato (Server — metadata + conteúdo estático)
    formulario-contato.tsx     Client — só o <form> interativo, colocado aqui
                                por ser específico desta rota
  globals.css
components/
  ui/                primitivos shadcn/ui (botao, campo-texto, area-texto, rotulo)
  cabecalho/         cabecalho.tsx, itens-navegacao.ts, menu-mobile.tsx (ver nota abaixo)
  rodape/rodape.tsx  \
  marca/marca.tsx     } usados em toda página, via app/layout.tsx
  ilustracoes/       SVGs/gráficos próprios (icones, ilustracao-cao-gato)
store/               estado global Zustand
schema/              schemas Zod
lib/                 utilitários (cn, contato)
public/              estáticos (imagens da marca, etc.)
```

**Não crie `components/layout/`.** `layout` é palavra reservada do App
Router (`app/layout.tsx`, `app/<rota>/layout.tsx`) — mesmo sem conflito
técnico real (o Next só escaneia `app/` em busca dessa convenção, nunca
`components/`), o nome confunde à primeira leitura.

**`components/cabecalho/` tem 3 arquivos, não 1**: o painel do menu mobile
(`menu-mobile.tsx`, usa Framer Motion) é importado via `next/dynamic({ ssr:
false })` dentro de `cabecalho.tsx`, e só é montado depois do primeiro clique
no botão hambúrguer (estado `interagiu`) — `Cabecalho` roda em toda página via
`app/layout.tsx`, então sem isso o Framer Motion entraria no bundle inicial
de todo mundo mesmo quem nunca abre o menu (mobile). `itens-navegacao.ts`
guarda o array de rotas do menu, compartilhado entre desktop e mobile. Ao
mexer no menu mobile, mantenha esse split — não volte a importar Framer
Motion direto em `cabecalho.tsx`.

**Cabeçalho, rodapé e marca ficam em pasta própria** (`components/cabecalho/
cabecalho.tsx`, não `components/cabecalho.tsx`) — pasta-por-componente, nome
do arquivo repete o nome da pasta. Esse padrão vale hoje só para esses três;
`components/ui/` e `components/ilustracoes/` continuam com arquivos soltos
dentro da pasta (não há pasta-por-componente ali).

## Convenções de nomenclatura (seguir à risca para todo nome novo)

- **Componentes**: `PascalCase`; arquivo em `kebab-case`. Não usamos mais o
  prefixo `Secao` (era da época em que a Home era single-page) — conteúdo de
  página fica direto no `page.tsx`; um componente extraído (como
  `FormularioContato`) leva nome descritivo do que faz, sem prefixo de
  "seção".
- **Hooks/stores Zustand**: prefixo `use` (padrão de lib do React — o lint
  `react-hooks` depende desse prefixo, por isso não usamos `usar`):
  `useMenuMobile`. O resto do nome fica em português.
- **Handlers de evento**: prefixo `ao`: `aoEnviarFormulario`,
  `aoConfirmarConsulta` — não `handleSubmit` genérico solto no nosso código
  (a lib pode expor `handleSubmit`; a função que passamos a ela é nossa).
- **Schemas Zod**: prefixo `esquema`, tipo inferido com prefixo `Dados`:
  `esquemaContato` → `DadosContato`.
- **Props de componente**: `Propriedades<NomeComponente>`:
  `PropriedadesBotao`, `PropriedadesCampoTexto`.
- Checklist rápido antes de nomear algo: alguém que nunca viu o código
  entende só pelo nome? Tem verbo claro se for ação? Está em português
  correto (sem tradução literal estranha do inglês)?

## Regras críticas do projeto

1. **Sem backend ainda.** O formulário de contato
   (`app/contato/formulario-contato.tsx`) valida com Zod + React Hook Form e,
   ao enviar, monta a mensagem e abre o **WhatsApp** (`wa.me`) — não faz
   nenhuma chamada de API. O ponto exato de integração futura está marcado
   por comentário dentro de `aoEnviarFormulario` (procurar por `INTEGRAÇÃO
   FUTURA`).
2. **Sem telemedicina/consulta online.** Todo atendimento é presencial. Não
   implementar nem prever integração de videochamada/sala virtual.
3. **Sem `next/image`.** Imagens usam `<img>` nativo (ver decisão de
   segurança abaixo). Se algum dia migrar para `next/image`, revisar antes o
   estado dos CVEs do Image Optimizer.
4. **Responsividade sem exceção**: 320px até desktop, sem overflow
   horizontal em nenhuma faixa intermediária.
5. **Header fixo**: `components/cabecalho/cabecalho.tsx` é `fixed`, então
   `app/layout.tsx` aplica `pt-20` no `<main>` (altura exata do header, `h-20`)
   para o conteúdo de toda página começar visível abaixo dele — não adicionar
   esse espaçamento de novo dentro de cada `page.tsx`. O header também tem fundo
   **fosco permanente** (`bg-creme/70` + `backdrop-blur`, nunca 100%
   transparente) — isso é proposital: depender só da detecção de scroll para
   aplicar o fundo já causou o conteúdo "vazando" atrás do menu.
   Navegação usa `next/link` com rotas reais (`/sobre`, `/servicos`, etc.),
   não âncoras `#` — o item ativo é destacado via `usePathname()`.
6. **Acessibilidade não negociável**: foco visível via teclado, `alt` em
   ilustrações/ícones relevantes, `prefers-reduced-motion` respeitado em toda
   animação (incluindo qualquer futura animação de traço).
7. **Inputs sempre a 16px** (`text-base`) — evita zoom automático no iOS
   Safari. Não reduzir a fonte dos campos de formulário.

## Versões e dependências

Migrado de Next 14 → **16.3.1** em 2026-08-13 (projeto ainda no início — mais
barato migrar agora do que depois que a área administrativa existir). Sem
breaking changes reais nos aplicou: zero rotas dinâmicas, zero `fetch`, zero
Route Handlers, zero `next/font`, zero middleware — a exposição às mudanças
grandes do 15/16 (`params`/`searchParams` async, cache de `fetch`, etc.) foi
zero. O que exigiu ajuste, de fato:

- **ESLint**: `eslint.config.mjs` (flat config), não mais `.eslintrc.json`.
  `eslint-config-next@16` exige **ESLint 9.x** — não use `eslint@latest` sem
  checar antes; a versão 10 já saiu mas o `eslint-plugin-react` empacotado
  pelo `eslint-config-next` ainda não suporta a nova API de `context` do
  ESLint 10 (erro `getFilename is not a function`).
- **`zod` fica travado na série 3.x** (`^3.25.0`, não `^4`) — o
  `@hookform/resolvers` aceita as duas, mas o Zod 4 muda API o suficiente
  para merecer avaliação própria, separada desta migração. Não faça
  `npm install zod@latest` sem querer isso de propósito.
- **`app/layout.tsx` tem `data-scroll-behavior="smooth"` no `<html>`** — a
  partir do Next 16 o framework não sobrescreve mais `scroll-behavior:smooth`
  (definido em `globals.css`) durante troca de rota; sem esse atributo, cada
  navegação rolaria suavemente até o topo em vez de saltar direto.
- **React 19**: todas as libs do projeto (Framer Motion, React Hook Form,
  Radix Slot, Zustand) já declaram suporte — não houve conflito de peer deps
  além dos dois pontos acima.

`node_modules/next/dist/docs/` tem a documentação da versão exata instalada
— é a fonte de verdade se este arquivo ficar desatualizado (ver bloco
`nextjs-agent-rules` no fim deste arquivo, mantido automaticamente pelo
`next dev`). Rodar `npm audit` antes de qualquer migração futura de major.

## Deploy

- **Vercel**, conectada ao GitHub (`chrmartins/rafaela-vet-front`).
- Push em **`main`** → deploy de **produção** automático.
- Qualquer outra branch / Pull Request → **Preview** com URL própria.
- Root Directory na Vercel é `./` (app na raiz do repo, sem monorepo).
- Nenhuma env var necessária hoje (sem backend, sem chaves de API).
- Domínio alvo (a configurar em Settings → Domains quando decidido):
  `rafaelasoares.vet`.

## Antes de codificar

1. Este arquivo é a fonte da verdade para convenções deste repo. Se algo não
   estiver coberto aqui e parecer uma decisão de negócio (ex.: novos campos
   do formulário, nova seção, regra de agendamento), perguntar antes de
   assumir.
2. Seguir as convenções de nomenclatura acima para todo componente, hook,
   schema ou handler novo.
3. Rodar `npm run lint` e `npm run build` antes de considerar uma mudança
   pronta.

O bloco abaixo é gerado e mantido automaticamente pelo próprio `next dev`
(não editar à mão — reaparece sozinho). Mantemos commitado, como a própria
ferramenta recomenda.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
