# Prompt — Criar site institucional (Home) da Dra. Rafaela Soares

> Uso: cole este prompt no Claude Code, dentro da raiz do repositório do projeto (onde estarão `CLAUDE.md`, `docs/padrao-nomenclatura.md` e `docs/regras-de-negocio.md`).

---

Antes de codificar, leia `CLAUDE.md`, `docs/padrao-nomenclatura.md` e `docs/regras-de-negocio.md` na raiz do projeto. Siga rigorosamente as convenções de nomenclatura e as regras de negócio já definidas ali. Se algo estiver marcado `[A DEFINIR]` e for necessário pra essa tarefa, me pergunte antes de assumir um comportamento.

## O que construir

Crie a **Home** (página inicial) do site institucional da Dra. Rafaela Soares, médica veterinária recém-formada, com atendimento **domiciliar** (clínica geral, cães e gatos) no Rio de Janeiro. Apenas a Home por enquanto — sem outras rotas.

## Stack obrigatória

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- shadcn/ui (componentes base próprios, seguindo o padrão `cva` + `Slot` do Radix, não instalar via CLI)
- Zod + React Hook Form (validação de formulário)
- Zustand (estado do menu mobile)
- Framer Motion (animações)
- Fontes **self-hosted via `@fontsource`** — não usar `next/font/google` (evita dependência de `fonts.googleapis.com` em runtime; melhor para LGPD e performance)

## Identidade visual

Baseie cores e tipografia na identidade visual já existente da marca (logo com monograma "RS" em serifa elegante, traço de cão+gato dentro do "O", paleta verde-sálvia sobre creme). Não usar paletas genéricas de IA (nada de cream + terracota #D97757, nada de dark mode acid-green).

Tokens de referência:
- Verde primário: `#4F6142` · Verde médio: `#6E8659` · Verde claro/accent: `#A8BB95`
- Creme (fundo): `#FBF9F1` / `#F6F2E4` · Texto: `#2E3A26`
- Tipografia: display serifado com personalidade (ex: Fraunces) para títulos + sans humanista (ex: Work Sans) para corpo

**Elemento-assinatura**: recrie em SVG, como ilustração de traço único, o motivo cão+gato que já existe dentro do logo da marca — e anime esse traço "se desenhando" (stroke-draw) na entrada da Hero. Respeitar `prefers-reduced-motion`.

## Estrutura de pastas (padrão de mercado + nomenclatura em português por dentro)

```
app/
components/
  ui/          → primitivos shadcn/ui
  layout/      → cabeçalho, rodapé
  secoes/      → uma seção de página por arquivo
  ilustracoes/ → SVGs/gráficos próprios
store/         → stores Zustand
schema/        → schemas Zod
lib/           → utilitários (cn, etc.)
```

Pastas de topo em inglês (padrão de mercado). Dentro delas, nomes de arquivo, componente, função e variável em português, autoexplicativos, sem termos genéricos — siga `docs/padrao-nomenclatura.md` seção 10 à risca (prefixo `Secao` para blocos de página, `usar` para hooks/stores, `ao` para handlers, `esquema`/`Dados` para Zod).

## Seções da Home

1. **Cabeçalho** — fixo, logo/wordmark, navegação (Sobre, Serviços, Área de atendimento, Contato), CTA "Agendar visita", menu mobile funcional (Zustand)
2. **Hero** — eyebrow + headline + subtexto + dois CTAs (agendar / ver serviços) + ilustração-assinatura animada
3. **Sobre** — apresentação da Dra. Rafaela (CRMV-RJ, clínica geral, atendimento domiciliar) + 2-3 diferenciais em cards
4. **Serviços** — grid de cards: consulta clínica geral, vacinação, check-up de rotina, pequenos procedimentos
5. **Área de atendimento** — bloco de destaque informando cobertura no Rio de Janeiro
6. **Contato** — formulário (nome, telefone, bairro, mensagem opcional) validado com Zod + React Hook Form. **Sem backend ainda**: ao enviar, montar mensagem e abrir WhatsApp (`https://wa.me/<numero>?text=...`). Deixar comentário explícito no código indicando onde plugar a futura API de Agendamento
7. **Rodapé** — contato (telefone/WhatsApp, Instagram, localização), copyright

Dados de contato reais a usar: telefone/WhatsApp `(21) 99745-7801`, Instagram `@rafaelasoares.vet`, localização "Rio de Janeiro - RJ".

## Fora de escopo (não implementar)

- Nenhuma consulta online/telemedicina — todo atendimento é presencial
- Nenhuma integração real de agendamento/backend ainda — formulário só encaminha pro WhatsApp
- Nenhuma tela de prontuário do tutor (ainda não decidido — ver `docs/regras-de-negocio.md`)

## Requisitos de qualidade (não negociáveis)

- **Responsividade completa**: mobile (320-375px), tablet (768px) e desktop, sem overflow horizontal, sem elementos espremidos em nenhuma faixa intermediária de breakpoint
- Cuidado especial com: header fixo cobrindo âncoras (`scroll-margin-top` nas seções), inputs com fonte ≥16px (evitar zoom automático no iOS Safari), textos pequenos com contraste mínimo WCAG AA
- Acessibilidade: foco visível via teclado, texto alternativo em ilustrações/ícones relevantes, `prefers-reduced-motion` respeitado
- SEO: metadata completa (title, description, Open Graph), `lang="pt-BR"`
- Rodar `npm run build` ao final e garantir que compila sem erros de tipo antes de considerar concluído

## Entregável

Projeto Next.js completo e funcional, buildando sem erros, pronto para `npm run dev`. Ao final, liste o que ficou pendente de decisão de negócio (se houver) e o que é próximo passo natural (ex: integração com backend de agendamento quando existir).
