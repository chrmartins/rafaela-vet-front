# CLAUDE.md — rafaelasoares-site

Frontend completo do sistema da **Dra. Rafaela Soares**, médica-veterinária
com atendimento **domiciliar** (clínica geral, cães e gatos) no Rio de
Janeiro. É o próprio repo que sobe na Vercel (app na raiz, sem monorepo).

**Escopo deste repo — não é só o site público.** Hoje ele só tem a landing
page pública (rotas `/`, `/sobre`, `/servicos`, `/contato` — Área de
Atendimento não é mais rota própria, virou uma seção dentro de `/servicos`),
**e é só isso**. O painel de gestão que morava aqui em `/painel` saiu deste
repositório: virou o **VetPlanet** (`vetplanet-app`), produto para
veterinários autônomos. Este repo voltou a ser o que o nome diz — o site
institucional da Dra. Rafaela, sem backend e sem área restrita.

## Stack

- **Next.js 16** (App Router, Turbopack) + TypeScript + **React 19**
- Tailwind CSS
- shadcn/ui — componentes próprios em `components/ui/`, padrão `cva` +
  Radix `Slot` (prop `asChild` para composição).
  **`select.tsx` usa `@radix-ui/react-select`, não o `<select>` nativo.**
  Tentamos o nativo primeiro e não serve: a lista aberta do `<select>` é
  desenhada pelo sistema operacional, não pelo CSS — no macOS vem cinza-escura
  com destaque azul, ignorando a paleta. Não há como estilizar. Com o Radix a
  lista é DOM comum (creme, verde, `rounded-lg`) e o teclado, o foco e o ARIA
  continuam funcionando. **Com React Hook Form use `Controller`** — não é um
  input com `ref`, então `register()` não dá conta.
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

## Integração contínua

`.github/workflows/ci.yml` roda `npm run lint` e `npm run build` a cada push
na `main` e em todo pull request. São **os mesmos dois comandos** da seção
acima, de propósito: não deve existir a situação de "passa aqui e quebra lá".

A instalação usa `npm ci`, não `npm install` — ele instala exatamente o que
está no `package-lock.json` e falha se o lock estiver fora de sincronia com o
`package.json`, em vez de resolver a diferença sozinho.

Não é preciso passar variável de ambiente nenhuma ao workflow: este site não
consome API.

`next build` já faz a checagem de tipos do TypeScript — não existe passo
`tsc` separado. **Ainda não há suíte de testes**; quando houver, entra no
workflow como mais um passo, depois do lint.

## Identidade visual (não introduzir cores/fontes fora disso)

- Verde primário `#4F6142` · verde médio `#6E8659` · verde claro `#A8BB95`
- Creme (fundo) `#FBF9F1` / `#F6F2E4` · texto `#2E3A26`
- Tokens em `tailwind.config.ts`: `verde-*`, `creme-*`, `linha`
- **Raio único: `--radius: 1rem` (16px).** Toda superfície retangular — card,
  bloco, input, botão, item de menu, alerta — usa **`rounded-lg`**. Não existe
  segundo raio: nada de `rounded-[2rem]`, `rounded-2xl` ou valor arbitrário
  (havia três valores diferentes até 2026-08-15; foram unificados).
  `rounded-md`, `rounded-xl`, `rounded-2xl` e `rounded-3xl` estão mapeados
  para o **mesmo** `var(--radius)` em `tailwind.config.ts` — isso é de
  propósito: **componente novo colado do shadcn já nasce no padrão**, sem
  depender de alguém lembrar de trocar a classe. Para mudar o raio do site
  inteiro, mexa só em `--radius` (`app/globals.css`).
  **`rounded-full` é a única exceção**, e só para o que é círculo ou pílula
  *por forma*: logo, avatar, container de ícone, badge, botão só-ícone. Canto
  arredondado de retângulo nunca é `rounded-full`.
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
| URLs / rotas | 🇧🇷 | `/sobre`, `/servicos`, `/contato` |
| Pastas | 🇬🇧 | `components`, `lib`, `store`, `schema` |
| Primitivos de UI | 🇬🇧 | `Button`, `Input`, `Label`, `Textarea` |
| Layout / estrutura | 🇬🇧 | `Header`, `Footer`, `Logo`, `MobileMenu` |
| Tipos de props | 🇬🇧 | `ButtonProps`, `InputProps` |
| Hooks | 🇬🇧 | `useMobileMenu` |
| Estado puro de UI | 🇬🇧 | `isOpen`, `open`, `close`, `toggle`, `hasScrolled` |
| Handlers de evento | 🇬🇧 | `onSubmit`, `onClick`, `handleSubmit` |
| Ícones | 🇬🇧 | `HouseIcon`, `MapPinIcon`, `WhatsappIcon` |

**Padrão híbrido**: substantivo de
domínio em português + termo técnico em inglês, **nessa ordem** —
`TutorForm`, `ConsultaCard`, `ProntuarioTimeline`, `contatoSchema`,
`ContatoData`.

**Páginas**: `<Rota>Page`, mantendo a rota rastreável — `/sobre` →
`SobrePage`, `/servicos` → `ServicosPage`.

**Arquivos**: `kebab-case` do nome do componente — `button.tsx`,
`mobile-menu.tsx`, `contato-form.tsx`.

Na dúvida, pergunte: *isso é conceito da clínica veterinária ou vocabulário
que qualquer dev React reconhece?* Tutor, consulta e prontuário são do
negócio. Button, form, card e schema são da profissão.

## Feedback ao usuário (toast)

**É o Sonner, não o Toast do Radix.** O shadcn descontinuou o componente
`toast` próprio e hoje recomenda o [Sonner](https://sonner.emilkowal.ski/) —
foi o que instalamos. `components/ui/sonner.tsx` é o wrapper com a identidade
da marca (creme, verde, Work Sans, `rounded-lg`).

```tsx
import { toast } from "sonner";

toast.success("Tutor cadastrado");
toast.error("Não foi possível salvar", { description: erro.message });
toast.warning("...");
```

- **O `<Toaster />` fica em `app/layout.tsx`**, uma vez só, valendo para o site
  inteiro. É de propósito estar na raiz: o toast **sobrevive à
  navegação client-side**, o que permite avisar "Sessão encerrada" e só então
  redirecionar para o login.
- **O outro lado disso:** um toast disparado antes de navegar continua na tela
  depois. Em fluxo que termina em sucesso, chame `toast.dismiss()` antes do
  `router.replace()` — senão o erro da tentativa anterior reaparece na tela
  seguinte (foi exatamente o que aconteceu no login).
- **Quando usar o quê** — a divisão não é estética:

  | Situação | Onde |
  |---|---|
  | Erro de campo (Zod / React Hook Form) | **inline**, embaixo do input |
  | Resultado de operação (salvar, entrar, sair, excluir) | **toast** |
  | Erro que exige uma decisão ou tem instrução longa | bloco na página, não toast |

  Erro de campo nunca vira toast: quem está corrigindo um formulário precisa
  da mensagem parada ao lado do campo, não de um aviso que some em 5s.
- **Título curto, detalhe no `description`.** O título diz o que aconteceu
  ("Não foi possível entrar"); o `description` diz o que fazer.
- Não repita no toast a mensagem crua da API sem ler: a de login é genérica de
  propósito (não revela se o e-mail existe).

## Regras críticas do projeto

1. **Este projeto não tem backend.** A API `vetplanet-api` existe, mas é do
   VetPlanet — o produto de gestão, que é outro projeto. Este site **não
   consome API nenhuma e não deve passar a consumir**. O formulário de contato
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

- **Vercel**, conectada ao GitHub (`chrmartins/rafaelasoares-site`).
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
