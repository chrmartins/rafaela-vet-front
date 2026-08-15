# CLAUDE.md — rafaela-vet-front

Frontend completo do sistema da **Dra. Rafaela Soares**, médica-veterinária
com atendimento **domiciliar** (clínica geral, cães e gatos) no Rio de
Janeiro. É o próprio repo que sobe na Vercel (app na raiz, sem monorepo).

**Escopo deste repo — não é só o site público.** Hoje ele só tem a landing
page pública (rotas `/`, `/sobre`, `/servicos`, `/contato` — Área de
Atendimento não é mais rota própria, virou uma seção dentro de `/servicos`),
mas vai crescer para incluir, **dentro do mesmo repo**, uma **área
administrativa em `/painel`** com cadastro de tutores/animais, administração
de consultas e prontuários. Não existe (e não está planejada) uma área de
tutor separada — tudo fica na área administrativa deste `rafaela-vet-front`.
Ao estruturar rotas/pastas novas, não assuma que este repo continua sendo só
"o site institucional".

## Autenticação (decidido, ainda não implementado)

- **Auth próprio no backend Spring Boot** (Spring Security + JWT, domínio
  `acesso`) — **não** usar Clerk/Auth0/Keycloak. Decidido porque são 1–3
  usuários, **sem cadastro público** (usuários criados pelo admin), e a
  identidade fica no mesmo Postgres do prontuário (LGPD).
- **Nenhuma biblioteca de auth no frontend** — nada de Auth.js/NextAuth. O
  Spring é o provedor de identidade; o Next só guarda a sessão e protege
  rota.
- **Padrão BFF: token em cookie `httpOnly` + `Secure` + `SameSite`, nunca em
  `localStorage`.** O navegador não deve ver o token em JavaScript; quem
  chama a API Spring é o servidor do Next (Server Components / Route
  Handlers). Isso é proposital: o sistema guarda prontuário e CPF, e JWT em
  `localStorage` é lido por qualquer XSS.
- Guard de rota em **`proxy.ts`** (no Next 16 o `middleware.ts` virou
  `proxy.ts`; runtime é `nodejs`, `edge` não é suportado). O guard faz só
  uma checagem barata de sessão — **a autorização real é sempre do Spring, a
  cada request**. Nunca tratar o guard do frontend como camada de
  segurança.
- `/painel` fica **no mesmo domínio** (`rafaelasoares.vet/painel`), não em
  subdomínio: mesmo deploy, cookie de sessão same-origin, sem DNS nem CORS
  extra.

### Como falar com a API

```
lib/api.ts        cliente HTTP (SÓ servidor) — anexa o token do cookie
lib/acesso.ts     funções tipadas do domínio acesso (criarSessao, etc.)
app/api/sessoes/  Route Handler = o BFF: grava e apaga o cookie httpOnly
```

- **`lib/api.ts` nunca roda no navegador.** Ele lê o cookie httpOnly com
  `cookies()` do Next e manda `Authorization: Bearer`. Se for importado num
  componente `"use client"`, quebra — e é essa quebra que garante o padrão.
- O login envia para **`/api/sessoes` do próprio Next**, não para a API
  Spring. É o servidor do Next que recebe o token e o guarda no cookie; a
  resposta ao navegador traz só o usuário. Verificado na prática:
  `document.cookie`, `localStorage` e `sessionStorage` ficam **vazios** com o
  usuário logado.
- Erros da API viram `ApiError`, que preserva o `requestId` — o mesmo id que
  marca as linhas de log no backend. Ao mostrar erro inesperado ao usuário,
  exiba esse id: é com ele que se acha o rastro.
- `ApiError` estende `Error`, então a mensagem está em `.message` (não
  `.mensagem`) — propriedade da linguagem.

### Onde a sessão é realmente validada

Em `app/painel/(protegido)/layout.tsx`, que chama `buscarUsuarioAtual()` e
redireciona para o login se der 401/403. O guard em `proxy.ts` **não** valida
nada — só checa se o cookie existe, para evitar piscar tela vazia. Um cookie
forjado passa pelo guard e morre no layout.

Erro que **não** é 401/403 (backend fora do ar, por exemplo) é relançado de
propósito: fingir que a pessoa foi deslogada esconderia o problema real.

### Estrutura do painel (implementada)

```
proxy.ts                     guard: matcher ["/painel/:path*"]
lib/sessao.ts                COOKIE_SESSAO, ROTA_ENTRAR, destinoSeguro()
app/painel/
  layout.tsx                 só metadata (noindex de TUDO sob /painel)
  entrar/page.tsx            /painel/entrar — FORA do grupo, sem sidebar
  (protegido)/
    layout.tsx               casca (PainelShell)
    painel-shell.tsx         Client: estado do drawer mobile
    sidebar.tsx  topbar.tsx  nav-items.ts
    page.tsx                 /painel — Agenda
    consultas/ tutores/ animais/ disponibilidade/
```

Por que dois níveis de layout: `app/painel/layout.tsx` não desenha nada,
existe só para aplicar `noindex` inclusive à tela de entrar. A casca visual
mora em `(protegido)/layout.tsx` — se `entrar` ficasse dentro do grupo,
herdaria a sidebar e mostraria a navegação por trás do login.

- **O nome do cookie nunca é string solta** — vem de `lib/sessao.ts`, que é
  compartilhado por `proxy.ts`, pelo futuro `/api/sessoes` e pelos Server
  Components. Mesma coisa para `ROTA_ENTRAR`/`ROTA_PAINEL`.
- **`destinoSeguro()` é obrigatório** ao ler `?destino=` da query: sem ele,
  `/painel/entrar?destino=https://site-malicioso` vira open redirect depois
  do login.
- **Fechar menu/drawer é reação a clique, não a efeito.** Nada de
  `useEffect(() => setState(...), [pathname])` — o lint `react-hooks` do
  React 19 barra isso (`set-state-in-effect`) e ele tem razão: causa render
  em cascata. O fechamento acontece no `onClick` dos links (`onNavigate` no
  MobileMenu do site, `onClose` na Sidebar do painel). Efeito só para
  sincronizar com o DOM, como travar `body.overflow`.

> Repo irmão do mesmo projeto maior (fora deste repo):
> `rafaela-vet-api` (backend Spring Boot/Java, ainda não criado). Não assuma
> que exista código ou contrato de API além do que está documentado aqui.

## Stack

- **Next.js 16** (App Router, Turbopack) + TypeScript + **React 19**
- Tailwind CSS
- shadcn/ui — componentes próprios em `components/ui/`, padrão `cva` +
  Radix `Slot` (prop `asChild` para composição)
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
  (`stroke-draw`) em `components/illustrations/cao-gato-illustration.tsx` — hoje
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
(Server, tem `metadata`) importa `app/contato/contato-form.tsx`
(Client, `"use client"`, usa `useForm`) — o resto do conteúdo estático da
página (texto, links) fica direto no `page.tsx`.

```
app/
  layout.tsx                layout raiz: fontes, metadata base
                             (title.template), Header + <main pt-20> + Footer
  page.tsx                   /                  (Hero + CTAs)
  sobre/page.tsx              /sobre
  servicos/page.tsx           /servicos (inclui a seção Área de Atendimento)
  contato/
    page.tsx                  /contato (Server — metadata + conteúdo estático)
    contato-form.tsx           Client — só o <form> interativo, colocado aqui
                                por ser específico desta rota
  globals.css
components/
  ui/                primitivos (button, input, textarea, label)
  header/            header.tsx, nav-items.ts, mobile-menu.tsx (ver nota abaixo)
  footer/footer.tsx  \
  logo/logo.tsx       } usados em toda página, via app/layout.tsx
  illustrations/     SVGs/gráficos próprios (icons, cao-gato-illustration)
store/               estado global Zustand
schema/              schemas Zod
lib/                 utilitários (cn, contato)
public/              estáticos (imagens da marca, etc.)
```

**Não crie `components/layout/`.** `layout` é palavra reservada do App
Router (`app/layout.tsx`, `app/<rota>/layout.tsx`) — mesmo sem conflito
técnico real (o Next só escaneia `app/` em busca dessa convenção, nunca
`components/`), o nome confunde à primeira leitura.

**`components/header/` tem 3 arquivos, não 1**: o painel do menu mobile
(`mobile-menu.tsx`, usa Framer Motion) é importado via `next/dynamic({ ssr:
false })` dentro de `header.tsx`, e só é montado depois do primeiro clique
no botão hambúrguer (estado `hasInteracted`) — `Header` roda em toda página
via `app/layout.tsx`, então sem isso o Framer Motion entraria no bundle
inicial de todo mundo, mesmo de quem nunca abre o menu (mobile).
`nav-items.ts` guarda o array de rotas do menu, compartilhado entre desktop,
mobile **e o footer**. Ao mexer no menu mobile, mantenha esse split — não
volte a importar Framer Motion direto em `header.tsx`.

**Header, footer e logo ficam em pasta própria** (`components/header/
header.tsx`, não `components/header.tsx`) — pasta-por-componente, nome do
arquivo repete o nome da pasta. Esse padrão vale hoje só para esses três;
`components/ui/` e `components/illustrations/` continuam com arquivos soltos
dentro da pasta (não há pasta-por-componente ali).

## Convenções de nomenclatura (seguir à risca para todo nome novo)

**Princípio (revisado em 2026-08-13): linguagem de negócio em português,
vocabulário técnico em inglês.** A regra anterior mandava tudo em português
dentro do código e produzia nomes como `PropriedadesBotao`, `esquemaContato`
e `comoFilho` — foi substituída por gerar mais atrito que clareza.

| Categoria | Idioma | Exemplo |
|---|---|---|
| Domínios / módulos | 🇧🇷 | `acesso`, `cadastro`, `agendamento`, `prontuario` |
| Entidades de negócio | 🇧🇷 | `Tutor`, `Animal`, `Consulta` |
| Funções de negócio | 🇧🇷 | `agendarConsulta()`, `montarLinkWhatsapp()` |
| Variáveis de negócio | 🇧🇷 | `tutorSelecionado`, `consultasDoDia`, `anoAtual` |
| URLs / rotas | 🇧🇷 | `/sobre`, `/servicos`, `/painel/tutores` |
| Pastas | 🇬🇧 | `components`, `lib`, `store`, `schema` |
| Primitivos de UI | 🇬🇧 | `Button`, `Input`, `Label`, `Textarea` |
| Layout / estrutura | 🇬🇧 | `Header`, `Footer`, `Logo`, `MobileMenu` |
| Tipos de props | 🇬🇧 | `ButtonProps`, `InputProps` |
| Hooks | 🇬🇧 | `useMobileMenu` |
| Estado puro de UI | 🇬🇧 | `isOpen`, `open`, `close`, `toggle`, `hasScrolled` |
| Handlers de evento | 🇬🇧 | `onSubmit`, `onClick`, `handleSubmit` |
| Ícones | 🇬🇧 | `HouseIcon`, `MapPinIcon`, `WhatsappIcon` |

**Padrão híbrido** (o que mais vai se repetir no painel): substantivo de
domínio em português + termo técnico em inglês, **nessa ordem** —
`TutorForm`, `ConsultaCard`, `ProntuarioTimeline`, `contatoSchema`,
`ContatoData`.

**Páginas**: `<Rota>Page`, mantendo a rota rastreável — `/sobre` →
`SobrePage`, `/painel/tutores` → `TutoresPage`.

**Arquivos**: `kebab-case` do nome do componente — `button.tsx`,
`mobile-menu.tsx`, `contato-form.tsx`.

Na dúvida, pergunte: *isso é conceito da clínica veterinária ou vocabulário
que qualquer dev React reconhece?* Tutor, consulta e prontuário são do
negócio. Button, form, card e schema são da profissão.

## Regras críticas do projeto

1. **Sem backend ainda.** O formulário de contato
   (`app/contato/contato-form.tsx`) valida com Zod + React Hook Form e,
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
5. **Header fixo**: `components/header/header.tsx` é `fixed`, então
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
