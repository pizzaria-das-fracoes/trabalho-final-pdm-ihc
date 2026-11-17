# Checklist obrigatório por tarefa

> **Leitura atual:** o primeiro registro abaixo documenta a auditoria de 17/11/2026. Registros de implementação anteriores contêm afirmações históricas que não comprovam aprovação de gate. A configuração e o estado em `00-estado-e-gates.md` são a referência atual: G1 pendente; novas implementações funcionais bloqueadas até aprovação documentada.

## CHG-002 — Correção visual dos achados prioritários

- [x] Escopo limitado à UI existente: início, montagem da pizza, comparação, tema e estados de botão.
- [x] Sem adição de requisitos ou recursos funcionais; G1 permanece pendente para novas funcionalidades.
- [x] Pizza radial, controles checkbox acessíveis, opções por rádio e hierarquia inicial revisados contra `docs/design-system/`.
- [x] `npm run check` — **PASSOU** (`tsc --noEmit`).
- [x] `python3 scripts/check_architecture.py` — **PASSOU**.
- [x] `python3 scripts/check_harness.py` — **PASSOU**; limite do checker: não valida UI/IHC.
- [ ] Screenshot em 320 dp/393 dp, escala de fonte ampliada, TalkBack e aparelho Android — **NÃO EXECUTADOS**.
- **Arquivos:** registrados em `docs/harness/07-registro-de-mudancas.md`, CHG-002.

## CHG-003 — Aderência visual ao protótipo `docs/oi.html`

- [x] HTML consultado como fonte visual direta; Design System consultado como conhecimento, sem alterá-lo.
- [x] Aplicados ao app nativo: cabeçalho, navegação inferior, mascote pizza, cartões com pizzas/status, progresso, feedback e representações específicas por atividade.
- [x] Conteúdo existente preservado; sem serviços, perfil persistente ou regras de negócio novos.
- [x] `npm run check` — **PASSOU** (`tsc --noEmit`).
- [x] `python3 scripts/check_architecture.py` — **PASSOU**.
- [x] `python3 scripts/check_harness.py` — **PASSOU**; não valida UI/IHC visual.
- [x] `git diff --check` — **PASSOU**.
- [ ] Comparação visual por screenshot, 320/393 dp, fonte ampliada e TalkBack — **NÃO EXECUTADA**.
- **Arquivos e checks:** registrados em `docs/harness/07-registro-de-mudancas.md`, CHG-003.

## CHG-004 — Atualização do Fatia Design System para o protótipo

- [x] `docs/oi.html` registrado como referência visual mobile do Design System 1.1.0; o diretório continua como fonte de conhecimento separada do Harness.
- [x] Componentes, tokens, fundamentos, padrões e acessibilidade revisados para refletir a referência.
- [x] Recursos demonstrados no HTML separados por estado: implementado, parcial ou proposto para o app.
- [x] Changelog do Design System e registro do Harness atualizados.
- [x] `python3 scripts/check_harness.py` — **PASSOU**; checker textual, não valida UI/IHC.
- [x] `git diff --check` — **PASSOU** (sem erros de whitespace).
- [ ] Validação visual em aparelho e revisão humana do conteúdo — **NÃO EXECUTADAS** nesta alteração documental.
- **Arquivos e checks:** registrados em `docs/harness/07-registro-de-mudancas.md`, CHG-004.

## Registro da auditoria estática — 17/11/2026

- [x] Escopo: auditoria do app existente contra `AGENTS.md`, arquitetura, tokens e padrões do Design System.
- [x] Fontes obrigatórias lidas, incluindo estado/gates, requisitos, matriz BNCC, Design System e arquitetura.
- [x] Código de Views, componentes de pizza/seleção, ViewModels, rotas e tokens revisado estaticamente.
- [x] Resultado registrado em `docs/harness/06-auditoria-ui-design-system.md`, com prioridades e sequência recomendada.
- [x] `python3 scripts/check_architecture.py` — **PASSOU** (escopo limitado a imports diretos de infraestrutura).
- [x] `npm run check` — **PASSOU** (`tsc --noEmit`).
- [x] `python3 scripts/check_harness.py` — **PASSOU** (escopo limitado aos checks descritos no relatório).
- [ ] `npm test` — **NÃO EXECUTADO** nesta auditoria estática.
- [ ] Validação de screenshot/dispositivo, TalkBack, 320 dp, 393 dp e fonte ampliada — **NÃO EXECUTADA**.
- [ ] G1/G2 — **PENDENTE**: há conflito entre AGENTS, estado do gate, configuração e código presente; não marcar como aprovado por esta auditoria.
- **Arquivos do app alterados nesta tarefa:** nenhum.

- [ ] Para mudanças futuras, registrar CHG, requisito/critério/teste/evidência aplicáveis em `docs/harness/07-registro-de-mudancas.md`.
- [ ] Não reutilizar status de execução de tarefas anteriores como evidência da tarefa atual.

- [x] Escopo aprovado e gate correto — implementação autorizada pelo usuário; G2–G5 continuam pendentes.
- [x] Fonte de verdade lida (AGENTS, requisitos, BNCC, design)
- [x] Requisitos e critérios de aceitação identificados
- [x] Camadas MVVM respeitadas — auditoria automatizada passou.
- [x] Todos os botões e rotas têm comportamento definido na fatia implementada.
- [x] Harness atualizado para fase `implementation-partial`; `python3 scripts/check_harness.py` **PASSOU**.
- [ ] Responsividade Android/safe areas consideradas — código preparado; validação em aparelho não executada.
- [x] Acessibilidade e feedback pedagógico considerados no contrato da UI; validação TalkBack não executada.
- [x] Testes de matemática executados; testes de componentes e fluxo ainda não executados.
- [x] Comandos executados com resultados registrados abaixo.
- [x] Documentação e matriz de rastreabilidade atualizadas para o estado parcial.
- [ ] Evidência de tela real anexada — não executada.

**Relatório:** arquivos alterados; requisitos cobertos; testes PASSOU/FALHOU/NÃO EXECUTADO; riscos; próximo gate. Nunca marcar itens sem evidência.

## Registro desta implementação

- **Arquivos:** `src/`, `app.json`, `package.json`, `package-lock.json`, `tsconfig.json`, `jest.config.js` e `scripts/check_architecture.py`.
- **Cobertura parcial:** RF02–RF12; UC01–UC08 em fluxos implementados, incluindo navegação principal e revisão por atividade.
- **Não implementado:** RF13–RF14, diagnóstico/adaptação, testes UI automatizados e validação em aparelho.
- **PASSOU:** `npm install`; `npm run check`; `npm test` (5 testes); `npm run arquitetura`; `npx expo-doctor` (20/20 no SDK 58); `npx expo export --platform android` (bundle Android exportado).
- **NÃO EXECUTADO:** `python3 scripts/check_harness.py` como gate da Fase 0 (incompatível com a presença autorizada do app); teste no Expo Go; dispositivo Android real; TalkBack; 320 dp/fonte 150%; build AAB; testes UI automatizados.
- **Riscos:** o progresso depende de AsyncStorage e ainda não foi verificado após reinicialização em Android real; conteúdo e validação pedagógica não foram avaliados com estudantes.
- **Próximo gate:** G2, após teste de abertura no Expo Go e validação de navegação/safe areas.
