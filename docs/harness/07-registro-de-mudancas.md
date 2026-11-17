# Registro de mudanças e rastreabilidade de execução

Este registro conecta cada alteração ao motivo e às evidências disponíveis. O status descreve somente o que foi efetivamente feito. Uma especificação ou comando planejado não é evidência de execução.

## Formato obrigatório para novas mudanças

Cada registro recebe um ID sequencial `CHG-NNN` e inclui:

- **Escopo:** objetivo e limites da alteração.
- **Rastreabilidade:** BNCC (se aplicável) → RF/RNF → UC → CA → T → EV. Use `N/A` com justificativa quando um elo não se aplicar.
- **Arquivos:** caminhos alterados por camada/documentação.
- **Verificações:** comando literal, resultado (`PASSOU`, `FALHOU`, `NÃO EXECUTADO`, `NÃO APLICÁVEL`) e observação sobre limites.
- **Evidência:** caminho de relatório, log ou captura; se não houver, declarar `NÃO EXECUTADA`.
- **Riscos e pendências:** itens abertos e gate afetado.

Não declarar conformidade visual, acessibilidade, pedagógica ou BNCC com base apenas em inspeção de código ou em um verificador textual.

## Registros

### CHG-001 — Alinhamento do Harness e rastreabilidade

- **Data:** 17/11/2026
- **Escopo:** corrigir a divergência documental/configuracional sobre o estado do pacote; deixar G1 como próximo gate aberto; instituir registro obrigatório de mudanças e ampliar o checker para validar coerência mínima. Nenhuma tela, regra de negócio ou arquivo de implementação do app foi alterado.
- **Rastreabilidade:** RF/RNF/UC/CA/T: N/A — alteração de governança do Harness, sem comportamento funcional. Evidência ligada à auditoria existente `docs/harness/06-auditoria-ui-design-system.md` (achado P0).
- **Arquivos:** `AGENTS.md`; `harness.config.json`; `docs/harness/00-estado-e-gates.md`; `docs/harness/04-checklist-entrega.md`; `docs/harness/07-registro-de-mudancas.md`; `scripts/check_harness.py`.
- **Verificações:** `python3 scripts/check_harness.py` — **PASSOU** (`implementation-partial`, G1 ativo; RF/UC identificados). Limite impresso pelo checker: não valida UI, IHC, matemática, BNCC ou execução Android. `git diff --check -- AGENTS.md harness.config.json docs/harness/00-estado-e-gates.md docs/harness/04-checklist-entrega.md docs/harness/07-registro-de-mudancas.md scripts/check_harness.py` — **PASSOU** (sem saída; código 0).
- **Evidência:** auditoria anterior em `docs/harness/06-auditoria-ui-design-system.md`; resultado reproduzível do checker acima, executado em 17/11/2026.
- **Riscos e pendências:** G1 permanece pendente, design-proposta permanece não aprovado e bloqueia novas implementações funcionais. Este ajuste não aprova o app existente nem valida UI em dispositivo.

### CHG-002 — Correção visual dos achados prioritários

- **Data:** 17/11/2026
- **Escopo:** corrigir achados de IHC/UI no início, pizza e comparação usando o Design System oficial, sem alterar regras de aprendizagem nem criar novos fluxos.
- **Rastreabilidade:** EF06MA07 → RF03/RF04 → UC01/UC02 → CA01/CA02 → T16/T17/T18 → EV: diff de código + checks listados abaixo. Para a hierarquia do início: RF01 → T18. T16–T18 são planos de validação, não executados.
- **Arquivos:** `src/view/tokens.ts`; `src/view/components/Pizza.tsx`; `src/view/components/SliceCheckbox.tsx` (novo); `src/view/components/ChoiceList.tsx`; `src/view/components/ActionButton.tsx`; `src/app/home.tsx`; `src/app/pizza.tsx`; `src/app/compare.tsx`; `package.json`; `package-lock.json`; `docs/engenharia/plano-testes.md`; `docs/harness/04-checklist-entrega.md`; `docs/harness/06-auditoria-ui-design-system.md`; `docs/harness/07-registro-de-mudancas.md`; `AGENTS.md`; `CHANGELOG.md`.
- **Verificações:** `npm run check` — **PASSOU** (`tsc --noEmit`); `python3 scripts/check_architecture.py` — **PASSOU**; `python3 scripts/check_harness.py` — **PASSOU**, checker textual sem validação visual.
- **Evidência:** resultados dos comandos acima em 17/11/2026; mudanças inspecionáveis nos arquivos listados. Screenshots, TalkBack, Android real e T16–T18: **NÃO EXECUTADOS**.
- **Riscos e pendências:** G1 permanece aberto para novas funcionalidades. A validação visual em tela física segue pendente. A geometria da pizza foi implementada por vetores, mas ainda não foi inspecionada por screenshot.

### CHG-003 — Port visual do protótipo `docs/oi.html`

- **Data:** 17/11/2026
- **Escopo:** aproximar as telas nativas do protótipo mobile: onboarding visual simples, cabeçalho, navegação inferior, mascote, catálogo de atividades, pizza com crosta/cobertura, cartões de fração, feedback por estado e representações pedagógicas por atividade. Preservar fluxos/regras já existentes. O Design System não foi alterado; serve somente como conhecimento auxiliar.
- **Rastreabilidade:** EF06MA07–10 → RF01–RF10 → UC01–UC07 → CA01–CA08 → T16/T17/T18/T19 → EV: diff dos componentes e checks. Os testes T16–T19 são pendentes, não executados.
- **Referência visual:** `docs/oi.html` (protótipo fornecido no projeto; composição mobile). Referência de conhecimento, sem alteração: `docs/design-system/`.
- **Arquivos:** `src/view/tokens.ts`; `src/view/layouts/Screen.tsx`; `src/view/components/NavigationBar.tsx`; `src/view/components/Pizza.tsx`; `src/view/components/PizzaAvatar.tsx` (novo); `src/view/components/ActivityCard.tsx` (novo); `src/view/components/FractionDisplay.tsx` (novo); `src/view/components/ActivityVisual.tsx` (novo); `src/view/components/ChoiceList.tsx`; `src/view/components/ActivityShell.tsx`; `src/view/components/Feedback.tsx`; `src/app/index.tsx`; `src/app/home.tsx`; `src/app/activities.tsx`; `src/app/about.tsx` (novo); `src/app/progress.tsx`; `src/app/pizza.tsx`; `src/app/compare.tsx`; `src/app/equivalent.tsx`; `src/app/number-line.tsx`; `src/app/decimal.tsx`; `src/app/quantity.tsx`; `src/app/operations.tsx`; `src/app/review.tsx`; `docs/engenharia/plano-testes.md`; `docs/harness/04-checklist-entrega.md`; `docs/harness/06-auditoria-ui-design-system.md`; `docs/harness/07-registro-de-mudancas.md`; `AGENTS.md`; `CHANGELOG.md`.
- **Verificações:** `npm run check` — **PASSOU** (`tsc --noEmit`); `python3 scripts/check_architecture.py` — **PASSOU**; `python3 scripts/check_harness.py` — **PASSOU**, com limite textual indicado no resultado; `git diff --check` — **PASSOU**.
- **Evidência:** implementação inspecionável nos arquivos listados e resultados dos comandos em 17/11/2026. Ainda sem screenshot comparativo, aparelho Android, teste de TalkBack ou teste em texto ampliado.
- **Riscos e pendências:** protótipo de entrada contém escolha de perfil e avatar persistentes; app mantém a entrada existente sem perfil porque persistência de perfil seria escopo funcional novo. Painel de acessibilidade, tema escuro e sons do HTML também não foram adicionados. G1 permanece aberto; equivalência visual T19 não está aprovada.

### CHG-004 — Atualização do Fatia Design System para `docs/oi.html`

- **Data:** 17/11/2026
- **Escopo:** atualizar o Design System independente do Harness para documentar a referência visual mobile `docs/oi.html`, os componentes que ela demonstra e os estados proposto/parcial/implementado das funções. Esta alteração revisa conhecimento e especificação; não acrescenta funcionalidades ao app.
- **Rastreabilidade:** RF/UC/CA/T: N/A — revisão documental de sistema de design, sem mudança no comportamento implementado. O vínculo visual é com a fonte `docs/oi.html`; a validação de implementação continua pendente.
- **Arquivos:** `docs/design-system/README.md`; `01-principios.md`; `02-tokens.md`; `03-fundamentos.md`; `04-componentes/*.md`; `05-padroes.md`; `06-acessibilidade.md`; `07-teste-com-ia.md`; `08-estado-e-evolucao.md` (novo); `CHANGELOG.md`; `docs/harness/04-checklist-entrega.md`; `docs/harness/07-registro-de-mudancas.md`.
- **Verificações:** `python3 scripts/check_harness.py` — **PASSOU** (`implementation-partial`; limite textual impresso pelo checker); `git diff --check` — **PASSOU**. Inspeção documental não verifica renderização nem conformidade visual/acessível.
- **Evidência:** especificações e changelog atualizados nos arquivos listados. Screenshot comparativo, aparelho Android, TalkBack e revisão com estudantes: **NÃO EXECUTADOS**.
- **Riscos e pendências:** os controles adicionais de tema, áudio, acessibilidade e perfil permanecem propostos se ausentes do app; não os declarar implementados. G1/G2 continuam sujeitos aos gates documentados.
