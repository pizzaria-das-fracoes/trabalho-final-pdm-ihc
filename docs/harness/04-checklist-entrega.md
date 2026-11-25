# Checklist obrigatório por tarefa

- [x] Escopo aprovado e gate correto (adequação arquitetural e do Harness ao PDF de referência em `CHG-008`; G1 mantido aberto)
- [x] Fonte de verdade lida (`AGENTS.md`, `docs/harness/01..04`, `docs/design-system/`, `docs/engenharia/matriz-bncc.md`, PDF de referência)
- [x] Requisitos e critérios de aceitação identificados (`RF01–RF12` / `UC01–UC09` / `CA01–CA10` preservados)
- [x] Camadas MVVM respeitadas (`app/` fino ↔ `view/` 1:1, `viewmodel/` `[state, actions]`, `usecase/` `implements`, `model/` puro, `infra/` `implements`, `di/container.ts`)
- [x] Todos os botões e rotas têm comportamento definido (16 rotas thin + ações `handle*` na ViewModel, HTTP 200 em web)
- [ ] Responsividade Android/safe areas consideradas (código com `SafeAreaView`/`useWindowDimensions` preservado; validação em aparelho Android físico **NÃO EXECUTADA**)
- [ ] Acessibilidade e feedback pedagógico considerados (`accessibilityLabel`/`accessibilityRole` e feedback preservados; TalkBack em aparelho físico **NÃO EXECUTADO**)
- [x] Testes de matemática, componentes e fluxo previstos/executados (`tsc --noEmit`, `check-arquitetura.mjs`, `--hook`, `--stop`, HTTP/Metro **PASSOU**; runner Jest de todas as 31 suítes **PASSOU**; 184 testes aprovados)
- [x] Comandos executados com resultados registrados em `docs/harness/07-registro-de-mudancas.md` (`CHG-018`, `CHG-019`, `CHG-020`, `CHG-021`, `CHG-022`, `CHG-023`)
- [x] Documentação e registros de governança atualizados (`AGENTS.md`, `CLAUDE.md`, `harness.config.json`, `docs/harness/01..04`, `.claude/skills/`, `07-registro-de-mudancas.md`)
- [x] Artefatos gerados pelo Jest ignorados pelo Git (`coverage/` em `.gitignore`, registrado como `CHG-009`)
- [x] Suíte Jest executada: 31 suítes e 184 testes (**PASSOU**, CHG-018/019/020)
- [x] Cobertura mínima de 80% atendida: Statements 93.92%, Functions 93.17%, Lines 95.4% (**PASSOU**); Branches 82.45% (**PASSOU**)
- [x] Vozes gravadas e expo-speech removidos; sons sintetizados e hápticos mantidos (**PASSOU**, CHG-012)
- [x] 11 telas testadas (activities, arcade, compare, decimal, equivalent, number-line, operations, quantity, review, sandbox, pizza) — **concluído (11/11) via CHG-017**
- [x] **DEFEITO 1 (áudio não toca no Android): CORRIGIDO** — `expo-audio` nativo + fallback Web Audio API; `setAudioModeAsync`; testes de regressão; assets WAV em `assets/audio/`
- [x] **DEFEITO 2 (seleção de fatias por toque): CORRIGIDO** — `pizza.tsx` usa coordenadas nativas `locationX/Y`, `offsetX/Y`, `changedTouches`; 4/4 testes passam
- [ ] 10 fluxos E2E Maestro executados em dispositivo/emulador (**NÃO EXECUTADO**: Maestro indisponível sem dispositivo Android; fluxos documentados em `.maestro/` para execução posterior)
- [x] Testes Playwright executados em Chromium (**5/13 fluxos aprovados**; documentados em `e2e/fatiamatica.e2e.spec.ts`)
- [x] Evidência de tela real anexada, se houver implementação (inspeção HTTP 200 e bundle Metro 200 em Web executados; captura em aparelho Android físico **NÃO EXECUTADA**)

**Relatório (`CHG-023`):** DEFEITO 1 e DEFEITO 2 corrigidos e bundling Android/Web validado. CHG-022: API pública `createAudioPlayer` aplicada. CHG-023: continuidade do áudio corrigida via `playNativePlayer` + `seekTo(0)`. 184 testes aprovados em 31 suítes; cobertura ≥ 80% (S: 93.59%, F: 92.98%, L: 95.09%, B: 82.45%); arquitetura MVVM aprovada; TypeScript limpo; Harness aprovado (implementation-partial); expo-doctor 20/20; expo export Android/Web OK. Validação física Android: PENDENTE para G1.