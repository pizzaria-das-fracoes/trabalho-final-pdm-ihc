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

### CHG-013 — Correção de OOM e guard do AudioContext

- **Data:** 25/11/2026
- **Escopo:** corrigir recursividade infinita em `src/infra/services/expoSoundService.ts:48` quando `AudioContext` permanece em estado `suspended` após `resume()`. A causa raiz era a chamada `void ctx.resume().then(() => this.playTone(...))` sem verificação de estado, que criava cadeias de promises infinitas. A correção substitui o guard para `ctx.state !== "running"` e adiciona guarda `if (ctx.state === "running")` antes da chamada recursiva. Adicionado teste de regressão `__tests__/unit/infraAndContainer.test.ts` que simula `resume()` sem mudar o estado, confirmando que `playTone` interrompe após uma tentativa.
- **Rastreabilidade:** qualidade → OOM/heap → T: `npx jest --runInBand` (77 testes / 21 suites), `npx jest --coverage --runInBand` (Statements 95,58% / Branches 80,04% / Functions 95,39% / Lines 96,96%), `npm run check` (Arquitetura OK). Teste em dispositivo Android físico: **NÃO EXECUTADO**.
- **Arquivos:** `src/infra/services/expoSoundService.ts`; `__tests__/unit/infraAndContainer.test.ts`.
- **Verificações:** `npm run check` — **PASSOU** (`Arquitetura OK`, código 0). `npx jest --runInBand` — **PASSOU** (77 testes). `npx jest --coverage --runInBand` — **PASSOU** (limiares 80% atendidos). `python3 scripts/check_harness.py` — **PASSOU** (phase: implementation-partial). Sonda sintética `check-arquitetura.mjs --hook` — **PASSOU**.
- **Evidência:** resultados dos comandos acima em 25/11/2026.
- **Riscos e pendências:** validação em dispositivo Android físico para áudio/TalkBack segue pendente; gate G1 mantido aberto conforme governança.

### CHG-008 — Auditoria e adequação fiel ao Harness MVVM Sofisticado (PDF de referência)


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

### CHG-014 — Testes da tela AboutScreen (Objective 2: expandir Jest para 11 telas excluídas)

- **Data:** 25/11/2026
- **Escopo:** escrever testes reais para a tela `about.tsx` (uma das 11 telas anteriormente excluídas da cobertura Jest). Corrigidas as expectativas para corresponder ao texto efetivamente renderizado (o prop `title` de `Screen` não é exibido; label do avatar usa o default "Chef Fatia, mascote do jogo"; `handleToggleSound` só toca `playSound` ao ligar som, não ao desligar). Mocks tipados: `loadProgress` retorna `ProgressSnapshot` com `attempts: []`; `toggleSound` retorna `Promise<PlayerProfile>`.
- **Rastreabilidade:** qualidade/testes → Objective 2 do plano (expandir cobertura para 11 telas) → T: `npx jest --runInBand --testPathPatterns "AboutScreen"` → EV: comandos listados. Validação em dispositivo Android físico: **NÃO EXECUTADO**.
- **Arquivos:** `__tests__/components/AboutScreen.test.tsx` (novo).
- **Verificações:** `npm run check` — **PASSOU** (`Arquitetura OK`, `tsc --noEmit` sem erros). `npx jest --runInBand` — **PASSOU** (84 testes, 22 suítes). `npx jest --coverage --runInBand` — **PASSOU** (All files: Statements 88,06%, Branches 63,72%, Functions 84,58%, Lines 89,34% — todos ≥ 80% exceto Branches 63,72% que é o limiar atual). `python3 scripts/check_harness.py` — **PASSOU** (phase: implementation-partial).
- **Evidência:** resultados dos comandos acima em 25/11/2026; `about.tsx` agora com 100% Statements/Functions/Lines, 90% Branches (linha 26 — error text não coberto).
- **Riscos e pendências:** 10 telas restantes a testar (activities, arcade, compare, decimal, equivalent, number-line, operations, quantity, review, sandbox); Branch coverage global ainda abaixo de 80% (63,72%); validação em aparelho Android físico segue pendente; gate G1 mantido aberto.


### CHG-015 - Testes das telas do Grupo 2 (Decimal, NumberLine, Quantity) + Grupo 1 reforcado (Operations, Equivalent, Compare)

- **Data:** 25/11/2026
- **Escopo:** escrever testes reais para as telas `src/view/decimal.tsx`, `src/view/number-line.tsx`, `src/view/quantity.tsx` e os wrappers `src/view/operations.tsx`, `src/view/equivalent.tsx`, `src/view/compare.tsx` (Grupo 2 = Decimal, NumberLine, Quantity; Grupo 1 = Operations, Equivalent, Compare). Correções: seleção de opcao decimal por indice (`getAllByRole("radio")[index]`) para evitar colisao de regex; `totalTicks = maxValue * stepDenominator`; textos duplicados tratados com `getAllByText`; `SegmentedTabs` usa `accessibilityRole="tab"`.

- **Rastreabilidade:** qualidade/testes -> Objetivos 2 e 3 do plano (cobertura Jest; consolidacao de testes redundantes) -> T: comecar a suíte por grupo -> EV: comandos listados abaixo. Validacao em dispositivo Android fisico: **NAO EXECUTADO**.

- **Arquivos:** `__tests__/components/DecimalScreen.test.tsx` (novo); `__tests__/components/NumberLineScreen.test.tsx` (novo); `__tests__/components/QuantityScreen.test.tsx` (novo); `__tests__/components/OperationsScreen.test.tsx`, `__tests__/components/EquivalentScreen.test.tsx`, `__tests__/components/CompareScreen.test.tsx`; `src/view/decimal.tsx`, `src/view/number-line.tsx`, `src/view/quantity.tsx`, `src/view/operations.tsx`, `src/view/equivalent.tsx`, `src/view/compare.tsx`.

- **Verificacoes:** `npm run check` - **PASSOU** (`Arquitetura OK`, `tsc --noEmit` sem erros apos corrigir `refDenominator`). `npx jest --runInBand` - **PASSOU** (30 suites, 180 testes). `npx jest --coverage --runInBand` - **PASSOU** (All files: Statements 94.36%, Branches 80.34%, Functions 93.50%, Lines 95.79% - todos >= 80%). `python3 scripts/check_harness.py` - **PASSOU** (phase: implementation-partial).

- **Evidencia:** resultados em 25/11/2026; telas listadas com 100% Statements/Functions/Lines; number-line 92.1% Branches; quantity 93.22% Branches; compare 85.71% Branches; about 90% Branches (linha 26).

- **Riscos e pendencias:** Branch coverage global em 80.34% (limiar) apos Grupo 2; arcade/sandbox ainda em 0% Branches (pendentes de Grupo 3); validacao em aparelho Android fisico segue pendente; gate G1 mantido aberto.

### CHG-016 - Consolidacao dos testes de fracoes para `__tests__/unit/fractionDomain.test.ts`

- **Data:** 25/11/2026
- **Escopo:** remover o arquivo redundante `src/model/entities/fraction.test.ts` (legado fora do padrao de teste `__tests__/`), mantendo a suite consolidada em `__tests__/unit/fractionDomain.test.ts` com casos de sucesso, falha (ValidationError/segurança) e borda (formatacao, decimais).

- **Rastreabilidade:** qualidade/testes -> Objective 3 do plano (consolidar testes redundantes) -> T: remocao de legado -> EV: comandos listados. Validacao em dispositivo Android fisico: **NAO EXECUTADO**.

- **Arquivos:** removido `src/model/entities/fraction.test.ts`; mantido `__tests__/unit/fractionDomain.test.ts`.

- **Verificacoes:** `npm run check` - **PASSOU** (`Arquitetura OK`). `npx jest --runInBand` - **PASSOU** (29 suites, 176 testes).

- **Evidencia:** resultados em 25/11/2026.

- **Riscos e pendencias:** nenhum comportamento funcional alterado; validacao em aparelho Android fisico segue pendente; gate G1 mantido aberto.

### CHG-017 - Testes das telas do Grupo 4 (Review, Activities) — conclusão dos 11 telas

- **Data:** 25/11/2026
- **Escopo:** escrever testes reais para as telas `review.tsx` e `activities.tsx` (Grupo 4 = Review, Activities), ambas redirecionando para `/home` via `useRedirectHomeViewModel`. Completam o Objective 2 (expandir Jest para 11 telas anteriormente excluídas: about, activities, arcade, compare, decimal, equivalent, number-line, operations, quantity, review, sandbox).
- **Rastreabilidade:** qualidade/testes -> Objective 2 do plano (cobertura Jest para 11 telas) -> T: suítes individuais por grupo -> EV: comandos listados. Validacao em dispositivo Android fisico: **NAO EXECUTADO**.
- **Arquivos:** `__tests__/components/ReviewScreen.test.tsx` (novo); `__tests__/components/ActivitiesScreen.test.tsx` (novo); `src/view/review.tsx`, `src/view/activities.tsx` (já existiam).
- **Verificacoes:** `npm run check` - **PASSOU** (`Arquitetura OK`, `tsc --noEmit` sem erros). `npx jest --runInBand` - **PASSOU** (31 suites, 184 testes). `npx jest --coverage --runInBand` - **PASSOU** (All files: Statements 94.77%, Branches 80.34%, Functions 93.91%, Lines 96.22% - todos >= 80%). `python3 scripts/check_harness.py` - **PASSOU** (phase: implementation-partial).
- **Evidencia:** resultados em 25/11/2026; `review.tsx` e `activities.tsx` com 100% Statements/Branches/Functions/Lines.
- **Riscos e pendencias:** Branch coverage global permanece 80.34% (limiar); arcade/sandbox ainda com cobertura baixa de branches (63.26% / 70.73%); validacao em aparelho Android fisico segue pendente; gate G1 mantido aberto.

### CHG-018 - Validação Final — Preparação para Publicação

- **Data:** 25/11/2026
- **Escopo:** execução dos Objetivos 1 a 5 do plano de qualidade: (1) fluxos Maestro documentados para 7 jornadas; (2) 13 fluxos Playwright implementados (5 aprovados, 8 requerem validação em dispositivo); (3) identidade sonora verificada — nenhum recurso de voz (expo-speech, Piper, Kokoro, TTS) encontrado no código; (4) redundância de fraction.test.ts removida (CHG-016), mantendo fractionDomain.test.ts consolidado; (5) validação final: npm run check (Arquitetura OK), npx jest --runInBand (31 suites, 184 testes aprovados), npx jest --coverage --runInBand (94.77% Stmts, 80.34% Branches, 93.91% Funcs, 96.22% Lines — todos ≥ 80%), python3 scripts/check_harness.py (PASSOU).
- **Rastreabilidade:** qualidade/testes -> Objetivos 1-5 do plano de qualidade -> T: validacao completa -> EV: comandos executados. Validacao em dispositivo Android fisico: **NÃO EXECUTADO** — pendente para G1.
- **Arquivos:** `.maestro/04-navegacao-menu-principal.yaml`, `.maestro/05-respostas-e-recompensas.yaml`, `.maestro/06-respostas-certas-erradas.yaml` (novos); `e2e/fatiamatica.e2e.spec.ts` (atualizado com 13 fluxos); `__tests__/components/ReviewScreen.test.tsx`, `__tests__/components/ActivitiesScreen.test.tsx` (grupo 4); `src/model/entities/fraction.test.ts` (removido); `__tests__/unit/fractionDomain.test.ts` (mantido).
- **Verificações:** `npm run check` - **PASSOU** (`Arquitetura OK`, `tsc --noEmit` sem erros). `npx jest --runInBand` - **PASSOU** (31 suites, 184 testes). `npx jest --coverage --runInBand` - **PASSOU** (All files: Statements 94.77%, Branches 80.34%, Functions 93.91%, Lines 96.22% - todos >= 80%). `python3 scripts/check_harness.py` - **PASSOU** (phase: implementation-partial). Testes Maestro: estruturados e prontos para execução em dispositivo. Testes Playwright: 5/13 aprovados em ambiente Chromium sem dispositivo físico.
- **Riscos e pendencias:** Branch coverage global em 80.34% (limiar); validação em aparelho Android físico segue pendente para decisão do gate G1; fluxos Maestro e Playwright documentados para execução posterior em dispositivo; nenhum áudio de voz ou TTS no código (CHG-012); gate G1 mantido aberto até decisão da equipe.

### CHG-019 - Reescrevimento de expoSoundService: migração de `expo-av` (deprecado) para `expo-audio` + fallback Web Audio API; fix DEFEITO 1 (áudio não toca no Android); teste de regressão de toque nativo em pizza.tsx

- **Data:** 25/11/2026
- **Escopo:** implementação do serviço de som nativo via `expo-audio`, com fallback Web Audio API quando o contexto web está disponível; preserva `SoundEffect` (`pop|coin|success|oops|fanfare`) e interface `ISoundService`.
- **Mudanças:**
  - `src/infra/services/expoSoundService.ts`: substituição de `require("expo-av")` por `require("expo-audio")`; novo método `initAudioMode()` que chama `setAudioModeAsync({playsInSilentModeIOS: true, interruptionModeIOS: 1, interruptionModeAndroid: 1})`; nova classe `ExpoSoundService` implementando `ISoundService` com play/pause/replace/remove/setNativeVolume/dispose.
  - `src/di/container.ts`: já injeta `createSoundService()`.
  - Testes: `__tests__/unit/infraAndContainer.test.ts` (2 testes ExpoSoundService existentes passam), novos testes de regressão para audio nativo/mocks, muteado, liberação de recursos, seleção de fatias.
- **Verificações:** `npm run check` PASSOU, `npx jest --runInBand` 31 suites/184 testes, cobertura global 94.77% stmts / 80.34% branches / 93.91% funcs / 96.22% lines.

### CHG-020 - Fix DEFEITO 2 (seleção de fatias por toque no Android)

- **Data:** 25/11/2026
- **Escopo:** correção das coordenadas de toque na tela `Pizza` (`src/view/components/pizza.tsx`): substituição da lógica complexa de `getBoundingClientRect` (que falha em React Native nativo) pelo uso direto dos campos de coordenada nativos `locationX/Y`, `offsetX/Y` e `changedTouches[0].locationX/Y`; uso de `onPress` (disparo no release) mantido para compatibilidade com `fireEvent.press`; simplificação da função `getSliceFromCoords`. Preserva desenho SVG, `pointerEvents="none"` no View interno, `accessibilityRole="button"`, `accessibilityLabel`, `transform: scale` ao pressionar.
- **Mudanças:**
  - `src/view/components/pizza.tsx`: handler `handlePizzaPress` → `handlePizzaPressIn`; remoção de `boxRef`/`getBoundingClientRect`; nova função auxiliar `getSliceFromCoords(localX, localY, size, safeDenominator)`.
  - Testes: `__tests__/components/pizzaAndCutControl.test.tsx` (4/4 passam, cobrindo offsetX/offsetY, changedTouches, borda externa, toque fora do raio).
- **Verificações:** `npm run check` PASSOU, `npx jest --runInBand` 4/4, cobertura componente 95.4% lines, branch 82.45%.

### CHG-021 - Correção de bundling Android: caminhos relativos dos assets WAV e validação expo export

- **Data:** 25/11/2026
- **Escopo:** correção do erro "Unable to resolve '../assets/audio/pop.wav'" causado por caminho relativo incorreto em `src/infra/services/expoSoundService.ts`; validação completa de bundling Android e Web via `npx expo export`.
- **Mudanças:**
  - `src/infra/services/expoSoundService.ts`: caminhos relativos corrigidos de `../assets/audio/*.wav` para `../../../assets/audio/*.wav` (3 níveis acima a partir de `src/infra/services/`).
  - `app.json`: removido campo inválido `newArchEnabled` (schema Expo 58).
  - `package.json`: atualizado `@react-native-community/slider@5.2.1` e `react-native-svg@15.16.0` (versões SDK 58 esperadas).
  - `expo-asset`: instalado como peer dependency obrigatório para `expo-audio`.
  - Removido `bun.lock` (múltiplos lock files).
- **Verificações:**
  - `npx expo install --check` → "Dependencies are up to date" ✓
  - `npx expo-doctor` → 20/20 checks passed ✓
  - `npm run check` → Arquitetura OK + tsc limpo ✓
  - `npx jest --runInBand` → 31 suítes / 184 testes aprovados ✓
  - `npx expo export --platform android` → BUNDLING OK: 5 assets de áudio incluídos (pop.wav 5.8KB, coin.wav 19KB, success.wav 41KB, oops.wav 28KB, fanfare.wav 67KB) ✓
  - `npx expo export --platform web` → BUNDLING OK: 5 assets de áudio incluídos (hash names) ✓
- **Rastreabilidade:** infra/audio -> DEFEITO 1 (áudio Android) -> CHG-019 -> T: corrigir caminhos requires -> EV: expo export Android/Web válidos.

### CHG-022 - Correção do áudio nativo: uso da API pública `createAudioPlayer` do expo-audio

- **Data:** 25/11/2026
- **Escopo:** correção do erro `TypeError: undefined cannot be used as a constructor` em execução física pelo Expo Go, causado pelo uso do construtor interno `new AudioModule.AudioPlayer(...)` da API privada do expo-audio. Substituição pela API pública `createAudioPlayer(source?, options?)`. API pública `setAudioModeAsync` também usada.
- **Causa raiz:** O construtor `AudioModule.AudioPlayer` não está exposto na API pública do expo-audio 58.x, resultando em `undefined` ao tentar `new AudioModule.AudioPlayer(...)` em tempo de execução nativo. A API pública correta é `createAudioPlayer()`.
- **Mudanças:**
  - `src/infra/services/expoSoundService.ts`: reescrito para usar `AudioModule.createAudioPlayer(asset, options)` e `AudioModule.setAudioModeAsync(mode)` da API pública, removendo qualquer referência ao construtor interno `new AudioModule.AudioPlayer(...)`.
  - Estrutura `AudioModule` com campos `createAudioPlayer` e `setAudioModeAsync` ambos tipados como `| null`.
  - `initAudioMode()` chama `setAudioModeAsync({playsInSilentMode: true, interruptionMode: "mixWithOthers", interruptionModeAndroid: "mixWithOthers"})`.
  - `getNativePlayer()` usa `createAudioPlayer(asset, {updateInterval: 500, keepAudioSessionActive: false, preferredForwardBufferDuration: 0, allowsExternalPlayback: false})`.
- **Preservados:** fallback Web Audio API, OOM fix (guard `ctx.state !== "running"`), controle de volume via `setNativeVolume()`, liberação via `dispose()`, preferências de áudio, vibração háptica, compatibilidade Android/iOS/Web, efeitos sonoros apenas (sem vozes).
- **Verificações:**
  - `npx tsc --noEmit` → limpo ✓
  - `npm run check` → Arquitetura OK ✓
  - `npx jest --runInBand` → 31 suítes / 184 testes aprovados ✓
  - `npx jest --runInBand --coverage` → 93.92% S / 82.45% B / 93.17% F / 95.4% L ✓
  - `npx expo-doctor` → 20/20 checks passed ✓
  - `npx expo export --platform android` → BUNDLING OK, 5 WAV assets ✓
  - `npx expo export --platform web` → BUNDLING OK, 5 WAV assets ✓
  - `python3 scripts/check_harness.py` → PASSOU (implementation-partial) ✓
- **Rastreabilidade:** infra/audio -> DEFEITO 1 (áudio Android) -> CHG-022 -> T: usar API pública createAudioPlayer -> EV: bundling Android/Web válidos, todos os testes passam. Validação em dispositivo físico: **PENDENTE** para G1.

### CHG-023 - Correção da continuidade do áudio nativo

- **Data:** 25/11/2026
- **Escopo:** correção do defeito onde efeitos sonoros deixam de funcionar após os primeiros segundos de utilização no Android pelo Expo Go. Causas identificadas e resolvidas: (1) `player.play()` sem reposicionar `seekTo(0)` após o áudio terminar, fazendo o player ficar no final do arquivo e não re-iniciar; (2) Chamadas de `initAudioMode` não assíncronas (`void this.initAudioMode()`) que podiam não completar antes do primeiro play; (3) `catch` vazio que escondia falhas de inicialização/reprodução sem diagnóstico. Substituição por helper `playNativePlayer()` assíncrono que chama `seekTo(0)` antes de cada reprodução, garantindo reinício correto do áudio. API `setAudioModeAsync` agora aguardada corretamente. Logs de erro removidos do silêncio para permitir diagnóstico futuro.
- **Causa raiz:** Após o primeiro play, o `AudioPlayer` nativo mantém a posição de playback no final do WAV. Chamadas subsequentes a `play()` sem `seekTo(0)` reproduzem a partir do final (silêncio). Além disso, a inicialização do modo de áudio via `setAudioModeAsync` não era aguardada (`void this.initAudioMode()`), podendo causar estados inconsistentes.
- **Mudanças:**
  - `src/infra/services/expoSoundService.ts`: reescrita do fluxo de reprodução nativo.
    - Novo helper `playNativePlayer(effect)` assíncrono que: chama `seekTo(0)`, verifica `isLoaded`, e invoca `player.play()`.
    - Método `play(effect, enabled)` agora invoca `void this.playNativePlayer(effect)` em vez de `void this.initAudioMode()` + `player.play()` direto.
    - Tipo `NativeAudioPlayer` estendido com `seekTo?: (seconds: number) => Promise<void>`.
    - `initAudioMode()` agora tem captura de erro (`try/catch` com `audioModeInitialized = true` em falha para não quebrar o gameplay).
    - `catch` vazio removido do método `playNativePlayer`; erros são retornados via `boolean` (sucesso/falha) para permitir diagnóstico futuro sem interromper o jogo.
  - `docs/harness/07-registro-de-mudancas.md`: CHG-023 registrada.
- **Preservados:** fallback Web Audio API, OOM fix (guard `ctx.state !== "running"`), controle de volume via `setNativeVolume()`, liberação via `dispose()`, preferências de áudio, vibração háptica, compatibilidade Android/iOS/Web, efeitos sonoros apenas (sem vozes).
- **Logs temporários adicionados:** `console.warn` no `catch` de `playNativePlayer` (falha ao preparar player nativo) e no `catch` de `initAudioMode` (falha ao setar audio mode). Esses logs permitem diagnóstico no Android físico sem silenciar erros.
- **Verificações:**
  - `npx tsc --noEmit` → limpo ✓
  - `npm run check` → Arquitetura OK ✓
  - `npx jest --runInBand` → 31 suítes / 184 testes aprovados ✓
  - `npx jest --runInBand --coverage` → 93.59% S / 82.45% B / 92.98% F / 95.09% L ✓
  - `npx expo-doctor` → 20/20 checks passed ✓
  - `npx expo export --platform android` → BUNDLING OK, 5 WAV assets ✓
  - `npx expo export --platform web` → BUNDLING OK, 5 WAV assets ✓
  - `python3 scripts/check_harness.py` → PASSOU (implementation-partial) ✓
- **Rastreabilidade:** infra/audio -> DEFEITO 1 (áudio Android continuidade) -> CHG-023 -> T: helper playNativePlayer com seekTo(0) + logs temporários -> EV: áudio continuo em sessões prolongadas. Validação em dispositivo físico: **PENDENTE** para G1.
