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

### CHG-005 — Voz offline do Professor Fatia (Piper TTS CC0) e efeitos sonoros Kenney CC0

- **Data:** 19/11/2026
- **Escopo:** integrar vozes pré-geradas em português brasileiro (`pt_BR-cadu-medium`, CC0) para o personagem Professor Fatia e efeitos sonoros/fanfarra CC0 (`Kenney Interface Sounds` e `Kenney Music Jingles`) usando `expo-audio`, com botão ligar/desligar sons (`Som`/`Mudo`), botão `Repetir` instruções faladas em todas as atividades e falas específicas de acerto e erro, mantendo funcionamento 100% offline sem dependência de API paga ou binários GPL no app.
- **Rastreabilidade:** EF06MA07–10 → RF01–RF10 → UC01–UC07 → CA01–CA08 → T: `tsc --noEmit`, `check_architecture.py`, verificação HTTP do bundle Metro e assets MP3 → EV: comandos listados abaixo. Validação em aparelho Android físico: **NÃO EXECUTADO**.
- **Arquivos:** `package.json`; `app.json`; `assets/audio/LICENSES.md` (novo); `assets/audio/sfx/*.mp3` (6 novos); `assets/audio/voice/*.mp3` (91 novos); `src/view/audioCatalog.ts` (novo); `src/view/sound.ts`; `src/view/speech.ts`; `src/view/layouts/Screen.tsx`; `src/view/components/ActivityShell.tsx`; `src/app/pizza.tsx`; `src/app/compare.tsx`; `src/app/number-line.tsx`; `src/app/quantity.tsx`; `src/app/arcade.tsx`; `docs/harness/07-registro-de-mudancas.md`.
- **Verificações:** `python3 scripts/check_architecture.py` — **PASSOU**; `npm run check` (`tsc --noEmit`) — **PASSOU**; verificação HTTP em `http://localhost:3000` (11 rotas, bundle Metro com 97 referências `.mp3` e download de assets `tap.mp3` e `op_2_5_plus_1_5.mp3` em HTTP 200) — **PASSOU**. Teste auditivo manual em dispositivo Android físico: **NÃO EXECUTADO**.
- **Evidência:** saída real dos checks acima e inventário de licenças documentado em `assets/audio/LICENSES.md`.
- **Riscos e pendências:** bloqueio de autoplay inicial em navegadores web antes do primeiro toque é tratado sem erro com `try/catch`, e o botão `Repetir` permite acionar a fala sob demanda; reprodução em dispositivo Android físico segue pendente para validação final de build nativo.

### CHG-006 — Substituição da voz do Professor Fatia para `pt_BR-faber-medium` e atribuição CC BY 4.0

- **Data:** 19/11/2026
- **Escopo:** substituir integralmente as 91 falas pré-geradas em `assets/audio/voice/*.mp3` do modelo anterior (`pt_BR-cadu-medium`, rejeitado auditivamente) pelo modelo masculino brasileiro `pt_BR-faber-medium` (Piper TTS), usando parâmetros recomendados no model card (`noise_scale=0.45`, `noise_w_scale=0.333`, `length_scale=0.97`) e masterização limpa (`highpass 80 Hz`, equalização leve, `44.1 kHz` mono VBR `-q:a 3`), além de incluir a atribuição comercial **CC BY 4.0** exigida pelo modelo base (`en_US/hifi_tts_92`) em `assets/audio/LICENSES.md` e na tela `Sobre o FatiaMática` (`src/app/about.tsx`).
- **Rastreabilidade:** EF06MA07–10 → RF01–RF10 → UC01–UC07 → CA01–CA08 → T: auditoria auditiva comparativa (`cadu`, `faber`, `jeff`), verificação de 91 MP3s gerados (`5471.3 KB`), `check_architecture.py`, `tsc --noEmit`, build e inspeção HTTP no servidor Expo/Metro → EV: comandos listados abaixo. Validação auditiva em aparelho Android físico: **NÃO EXECUTADO**.
- **Arquivos:** `assets/audio/voice/*.mp3` (91 arquivos regravados com `pt_BR-faber-medium`); `assets/audio/LICENSES.md`; `src/app/about.tsx`; `docs/harness/07-registro-de-mudancas.md`.
- **Verificações:** `python3 scripts/check_architecture.py` — **PASSOU**; `npm run check` / `lint_applet` (`tsc --noEmit`) — **PASSOU**; `compile_applet` — **PASSOU**; verificação HTTP em `http://localhost:3000/` e `/about` (HTTP 200), bundle Metro com 97 módulos `.mp3` e atribuição `CC BY 4.0 / Cori Samuel`, e paridade exata de bytes para `prof_voice_test.mp3` (`53502` B), `feedback_correct.mp3` (`21415` B) e `tap.mp3` (`2239` B) — **PASSOU**. `python3 scripts/check_harness.py` — **FALHOU** conforme esperado na fase pós-implementação (aponta existência de `src/`, `node_modules/`, `package.json`, `app.json` fora da fase 0). Teste em dispositivo Android físico: **NÃO EXECUTADO**.
- **Evidência:** saída real dos comandos executados em 19/11/2026 e auditoria auditiva direta dos clipes `prof_voice_test.mp3`, `feedback_correct.mp3`, `feedback_wrong.mp3` e `pizza_3_4_fixed.mp3`.
- **Riscos e pendências:** atribuição CC BY 4.0 visível dentro do app (`about.tsx`) e em `assets/audio/LICENSES.md` para conformidade de publicação comercial na Google Play Store; reprodução em aparelho Android físico permanece pendente para validação final do APK/AAB.

### CHG-007 — Remoção completa de vozes e efeitos MP3 adicionados (manter apenas sons leves de toque)

- **Data:** 20/11/2026
- **Escopo:** atender ao pedido do usuário para remover visualmente e do código todas as vozes (Piper/Kokoro), efeitos sonoros MP3 (`Kenney`), `expo-audio`, `speech.ts`, `audioCatalog.ts`, rota temporária `voice-samples.tsx` e controles visuais relacionados (`Prof. Fatia`, `Repetir`, botão de amostras e créditos de áudio em `about.tsx`), deixando apenas os sons leves de toque/feedback sintetizados por WebAudio + `expo-haptics` (`soundFx`: `pop`, `coin`, `success`, `oops`, `fanfare`) e o botão `Som`/`Mudo`, adiando áudio completo para versão futura.
- **Rastreabilidade:** EF06MA07–10 → RF01–RF10 → UC01–UC07 → CA01–CA08 → T: `tsc --noEmit`, `check_architecture.py`, `compile_applet`, `lint_applet`, verificação de ausência de referências residuais e inspeção HTTP do bundle Metro → EV: comandos listados abaixo. Validação em dispositivo Android físico: **NÃO EXECUTADO**.
- **Arquivos:** removidos `assets/audio/**` (91 MP3s de voz, 6 MP3s SFX, 4 amostras e `LICENSES.md`), `src/app/voice-samples.tsx`, `src/view/audioCatalog.ts` e `src/view/speech.ts`; restaurado/atualizado `src/view/sound.ts`, `src/view/components/Pizza.tsx`, `src/view/layouts/Screen.tsx`, `src/view/components/ActivityShell.tsx`, `src/app/index.tsx`, `src/app/about.tsx`, `src/app/pizza.tsx`, `src/app/compare.tsx`, `src/app/number-line.tsx`, `src/app/quantity.tsx`, `src/app/arcade.tsx`, `app.json`, `package.json` e `docs/harness/07-registro-de-mudancas.md`.
- **Verificações:** `python3 scripts/check_architecture.py` — **PASSOU** (`Arquitetura: PASSOU`); `compile_applet` — **PASSOU**; `lint_applet` (`tsc --noEmit`) — **PASSOU**; varredura `grep` em `src/`, `app.json` e `package.json` — **PASSOU** (zero referências a `audioCatalog`, `speakPrompt`, `speakFeedback`, `stopSpeech`, `Prof. Fatia`, `voice-samples`, `expo-audio`, `SFX_ASSETS` ou `soundFx.slice`); verificação HTTP no servidor em `http://localhost:3000` (`/`, `/home`, `/pizza`, `/compare`, `/number-line`, `/quantity`, `/arcade`, `/about` em HTTP 200 e `0` referências a `.mp3`/`assets/audio`/`Prof. Fatia`/`voice-samples` no bundle Web de `4752851` bytes) — **PASSOU**. Teste em dispositivo Android físico: **NÃO EXECUTADO**.
- **Evidência:** saída real dos comandos acima executados em 20/11/2026 após todas as remoções e reinicialização do servidor de desenvolvimento.
- **Riscos e pendências:** áudio completo e narração permanecem adiados para versão futura; `voiceStyle` foi mantido apenas no tipo/estado de perfil armazenado localmente para evitar quebra de perfis salvos no dispositivo. Validação visual/auditiva em aparelho Android físico segue pendente.

### CHG-008 — Auditoria e adequação fiel ao Harness MVVM Sofisticado (PDF de referência)

- **Data:** 22/11/2026
- **Escopo:** adequar integralmente o código em `src/` e os artefatos de Harness (`AGENTS.md`, `CLAUDE.md`, `harness.config.json`, `docs/harness/01..04`, `.claude/skills/`, `.claude/settings.json`, `scripts/check-arquitetura.mjs`, `package.json`) às especificações do documento *Harness: a IA programando do nosso jeito* (`public/assets/aistudio/Montando_um_Harness_MVVM_Sofisticado__5__448bafb2.pdf`), preservando 100% das telas, fluxos, matemática BNCC, copy em português e identidade visual do FatiaMática.
- **Rastreabilidade:** EF06MA07–10 → RF01–RF12 → UC01–UC09 → CA01–CA10 → T: `npm run check` (`node scripts/check-arquitetura.mjs && tsc --noEmit`), hooks `--hook` (incluindo sonda sintética de violação retornando código 2) e `--stop`, `compile_applet`, `lint_applet` e inspeção HTTP das 16 rotas e bundle Metro em `http://localhost:3000` → EV: saídas reais dos comandos listados abaixo. Testes Jest (`fraction.test.ts` e `progressDataSource.test.ts`) e validação em aparelho Android físico: **NÃO EXECUTADOS**.
- **Arquivos:**
  - **Harness / Governança:** `AGENTS.md`; `CLAUDE.md` (novo); `harness.config.json`; `.claude/settings.json`; `.claude/skills/nova-tela/SKILL.md` (novo); `.claude/skills/nova-funcionalidade/SKILL.md` (novo); `.claude/skills/sincronizar-tema/SKILL.md` (novo); `.claude/skills/revisar-arquitetura/SKILL.md`; `.claude/skills/nova-atividade-bncc/SKILL.md`; removida `.claude/skills/sincronizar-design/`; `docs/harness/01-arquitetura-mvvm.md` (novo); `docs/harness/02-convencoes-de-codigo.md` (novo); `docs/harness/03-expo-e-react-native.md` (novo); `docs/harness/04-views-e-design-system.md` (novo); `docs/harness/04-checklist-entrega.md`; `docs/harness/07-registro-de-mudancas.md`; `scripts/check-arquitetura.mjs` (novo); `package.json`.
  - **`src/model/`:** `errors.ts`; `datasources/iProgressDataSource.ts`; `services/iSoundService.ts`; `entities/{progress,fraction,game,generator,fraction.test}.ts`.
  - **`src/infra/`:** `datasources/{memoryProgressDataSource,asyncStorageProgressDataSource,progressDataSource.test}.ts`; `services/{expoSoundService,memorySoundService}.ts`.
  - **`src/usecase/`:** `iProgressUseCases.ts`; `progressUseCases.ts`; `iShopUseCases.ts`; `shopUseCases.ts`; `iActivityUseCases.ts`; `activityUseCases.ts`.
  - **`src/di/`:** `container.ts`.
  - **`src/viewmodel/`:** `useAboutViewModel.ts`; `useArcadeViewModel.ts`; `useCompareViewModel.ts`; `useHomeViewModel.ts`; `useNumberLineViewModel.ts`; `usePizzaViewModel.ts`; `useProgressViewModel.ts`; `useQuantityViewModel.ts`; `useQuizActivityViewModel.ts`; `useRedirectHomeViewModel.ts`; `useSandboxViewModel.ts`; `useShopViewModel.ts`; `useWelcomeViewModel.ts`.
  - **`src/view/`:** `theme.ts`; `components/{actionButton,activityShell,activityVisual,chipButton,choiceList,feedback,fractionDisplay,pizza,pizzaAvatar,screen,segmentedTabs,sliceCheckbox,sliceCutControl,stageProgress}.tsx`; telas espelhadas `{index,home,pizza,compare,equivalent,decimal,operations,number-line,quantity,arcade,sandbox,shop,progress,about,activities,review}.tsx`.
  - **`src/app/`:** `_layout.tsx`; 16 rotas finas `{index,home,pizza,compare,equivalent,decimal,operations,number-line,quantity,arcade,sandbox,shop,progress,about,activities,review}.tsx`.
- **Verificações:**
  - `npm run check` (`node scripts/check-arquitetura.mjs && tsc --noEmit`) — **PASSOU** (`Arquitetura OK`, código 0).
  - `node scripts/check-arquitetura.mjs --stop` (stdin `{}` e `{"stop_hook_active":true}`) — **PASSOU** (código 0).
  - Sonda sintética `node scripts/check-arquitetura.mjs --hook` sobre arquivo temporário com violações propositais (removido imediatamente após o teste) — **PASSOU** (bloqueou com `[ERRO]` para 9 violações e retornou `HOOK_EXIT=2` em `stderr`).
  - `compile_applet` e `lint_applet` (`tsc --noEmit`) — **PASSOU**.
  - Servidor web em `http://localhost:3000`: todas as 16 rotas retornaram `HTTP 200` e o bundle Metro (`platform=web`, `4832428` bytes) respondeu `HTTP 200` — **PASSOU**.
  - Execução de `fraction.test.ts` / `progressDataSource.test.ts` via runner Jest e validação em dispositivo Android físico — **NÃO EXECUTADO**.
- **Evidência:** saída dos comandos executados em 22/11/2026 registrados acima.
- **Riscos e pendências:** G1 permanece aberto conforme governança do projeto; execução do suite Jest e validação visual/TalkBack em aparelho Android físico permanecem pendentes.


### CHG-009 — Ignorar relatórios de cobertura gerados pelo Jest

- **Data:** 22/11/2026
- **Escopo:** adicionar `coverage/` ao `.gitignore` para impedir que relatórios HTML e arquivos de cobertura gerados pelos testes sejam enviados ao Git remoto. Nenhum arquivo de aplicação, teste ou governança funcional foi alterado.
- **Rastreabilidade:** RF/RNF/UC/CA/T/EV: N/A — alteração de configuração do controle de versão, sem comportamento funcional ou impacto pedagógico.
- **Arquivos:** `.gitignore`.
- **Verificações:** `git check-ignore -v coverage coverage/lcov-report/index.html` — **PASSOU** (ambas as entradas correspondem à regra `coverage/` em `.gitignore:4`). `git diff --check -- .gitignore docs/harness/04-checklist-entrega.md docs/harness/07-registro-de-mudancas.md` — **PASSOU** após remover a linha vazia final. `npm run check` (`node scripts/check-arquitetura.mjs && tsc --noEmit`) — **FALHOU** no checker arquitetural por violações existentes em arquivos antigos fora desta alteração (por exemplo `src/model/fraction.ts`, `src/view/tokens.ts`, `src/viewmodel/use-*-view-model.ts`); o `tsc --noEmit` não chegou a executar porque o checker retornou erro primeiro. `npx tsc --noEmit` — **FALHOU** por erros de dependências/ tipos já presentes, incluindo o módulo ausente `@testing-library/react-native`.
- **Evidência:** saída real do comando acima e regra `.gitignore:4`.
- **Riscos e pendências:** a pasta `coverage/` já existente permanece no diretório local até ser excluída manualmente ou por limpeza do projeto; ela não será incluída em novos commits.

### CHG-010 — Suíte Jest, cobertura mínima e preparação E2E

- **Data:** 22/11/2026
- **Escopo:** restaurar o ambiente Jest/RNTL, corrigir a mescla arquitetural sem alterar o verificador, remover cópias legadas fora do padrão MVVM, completar ações de retorno das ViewModels Arcade/Sandbox e documentar comandos reproduzíveis de testes e cobertura.
- **Rastreabilidade:** professores requerem testes unitários, componentes, mocks, hooks, integração, cobertura, E2E e histórico Git. Este registro cobre somente a infraestrutura/testes executados; não declara validação BNCC ou visual em aparelho.
- **Arquivos:** `package.json`; `package-lock.json`; `jest.config.js`; `jest.setup.ts`; `src/di/container.ts`; `src/viewmodel/useArcadeViewModel.ts`; `src/viewmodel/useSandboxViewModel.ts`; `src/view/components/` e `src/viewmodel/` após remoção das cópias legadas; `__tests__/`; `README.md`; `docs/harness/04-checklist-entrega.md`; `docs/harness/07-registro-de-mudancas.md`.
- **Verificações:** `npm run check` — **PASSOU** (`Arquitetura OK` e `tsc --noEmit` sem erros). `npm test` — **PASSOU** (21 suítes, 76 testes). `npm run test:coverage` — **PASSOU** (Statements 95,79%; Branches 80,14%; Functions 95,62%; Lines 97,18%). Maestro instalado/emulador Android: **NÃO EXECUTADO** (CLI Maestro e `adb devices` não disponíveis neste ambiente).
- **Evidência:** saída dos comandos acima em 22/11/2026; relatório em `coverage/lcov-report/index.html`.
- **Riscos e pendências:** os três fluxos em `.maestro/` existem, mas exigem dispositivo/emulador e instalação do app para execução reproduzível; nenhum G1/G2/G4 é considerado aprovado por esta etapa.

### CHG-011 — Som sintético e seleção de fatias no Expo Web

- **Data:** 23/11/2026
- **Escopo:** corrigir a retomada do Web Audio depois da interação do usuário e corrigir a seleção da fatia da Pizza no Expo Web. O clique sem coordenadas válidas passou a ser ignorado, evitando seleção aleatória.
- **Rastreabilidade:** qualidade/usabilidade do app → testes de componentes e infraestrutura → evidência dos checks abaixo. Não representa validação humana em navegador/dispositivo.
- **Arquivos:** `src/infra/services/expoSoundService.ts`; `src/view/components/pizza.tsx`; `__tests__/components/pizzaAndCutControl.test.tsx`.
- **Verificações:** `npm run check` — **PASSOU** (`Arquitetura OK`). Teste focal da Pizza — **PASSOU** (4 testes). Rotas `/`, `/pizza` e `/home` no Expo Web — **PASSOU** (HTTP 200).
- **Evidência:** servidor Expo Web em `http://localhost:3000`; resultados dos comandos executados em 23/11/2026.
- **Riscos e pendências:** validação visual do áudio e da pintura da fatia em navegador real permanece pendente; o som depende de interação do usuário e pode ser bloqueado pela política do navegador.

### CHG-012 — Remoção das vozes gravadas

- **Data:** 23/11/2026
- **Escopo:** remover integralmente os arquivos MP3 de voz, os efeitos MP3 e a dependência `expo-speech`, mantendo apenas o som sintético leve de toque/acerto/erro/fanfare e hápticos do serviço existente.
- **Rastreabilidade:** RF/RNF/UC/CA/T/EV: N/A — ajuste solicitado no modo de áudio, sem alteração das regras matemáticas ou da matriz BNCC.
- **Arquivos:** `assets/audio/**` (removidos); `package.json`; `package-lock.json`; `src/model/entities/progress.ts`; `docs/harness/04-checklist-entrega.md`; `docs/harness/07-registro-de-mudancas.md`.
- **Verificações:** `npm run check` — **PASSOU** (`Arquitetura OK`, `tsc --noEmit` sem erros). Varredura por `expo-speech`, `assets/audio`, `.mp3`, `audioCatalog`, `speech`, `speakPrompt`, `speakFeedback`, `voice-samples`, `VoiceStyle` e `voiceStyle` em código/manifests — **PASSOU** (nenhuma ocorrência).
- **Evidência:** pasta `assets/audio/` removida, `expo-speech` removido dos manifests e saída real dos comandos executados em 23/11/2026.
- **Riscos e pendências:** nenhum áudio gravado ou serviço de fala permanece; reprodução sintética no Expo Web e em dispositivo físico continua sujeita à inspeção humana.
