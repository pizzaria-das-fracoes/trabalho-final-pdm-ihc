# Checklist obrigatório por tarefa

- [x] Escopo aprovado e gate correto (adequação arquitetural e do Harness ao PDF de referência em `CHG-008`; G1 mantido aberto)
- [x] Fonte de verdade lida (`AGENTS.md`, `docs/harness/01..04`, `docs/design-system/`, `docs/engenharia/matriz-bncc.md`, PDF de referência)
- [x] Requisitos e critérios de aceitação identificados (`RF01–RF12` / `UC01–UC09` / `CA01–CA10` preservados)
- [x] Camadas MVVM respeitadas (`app/` fino ↔ `view/` 1:1, `viewmodel/` `[state, actions]`, `usecase/` `implements`, `model/` puro, `infra/` `implements`, `di/container.ts`)
- [x] Todos os botões e rotas têm comportamento definido (16 rotas thin + ações `handle*` na ViewModel, HTTP 200 em web)
- [ ] Responsividade Android/safe areas consideradas (código com `SafeAreaView`/`useWindowDimensions` preservado; validação em aparelho Android físico **NÃO EXECUTADA**)
- [ ] Acessibilidade e feedback pedagógico considerados (`accessibilityLabel`/`accessibilityRole` e feedback preservados; TalkBack em aparelho físico **NÃO EXECUTADO**)
- [ ] Testes de matemática, componentes e fluxo previstos/executados (`tsc --noEmit`, `check-arquitetura.mjs`, `--hook`, `--stop`, HTTP/Metro **PASSOU**; runner Jest de `fraction.test.ts` / `progressDataSource.test.ts` **NÃO EXECUTADO**)
- [x] Comandos executados com resultados registrados em `docs/harness/07-registro-de-mudancas.md` (`CHG-008`)
- [x] Documentação e registros de governança atualizados (`AGENTS.md`, `CLAUDE.md`, `harness.config.json`, `docs/harness/01..04`, `.claude/skills/`, `07-registro-de-mudancas.md`)
- [x] Artefatos gerados pelo Jest ignorados pelo Git (`coverage/` em `.gitignore`, registrado como `CHG-009`)
- [x] Suíte Jest executada: 21 suítes e 76 testes (**PASSOU**, CHG-010)
- [x] Cobertura mínima de 80% atendida: Statements 95,79%, Branches 80,14%, Functions 95,62%, Lines 97,18% (**PASSOU**, CHG-010)
- [ ] Três fluxos E2E Maestro executados em dispositivo/emulador (**NÃO EXECUTADO**: Maestro e adb indisponíveis)
- [ ] Correção visual do som e da seleção da Pizza no navegador real (**NÃO EXECUTADO** até inspeção humana no Expo Web)
- [ ] Evidência de tela real anexada, se houver implementação (inspeção HTTP 200 e bundle Metro 200 em Web executados; captura em aparelho Android físico **NÃO EXECUTADA**)

**Relatório (`CHG-008`):** arquivos listados por camada em `docs/harness/07-registro-de-mudancas.md`; checks estáticos (`npm run check`, `--stop`, sonda `--hook`, `compile_applet`, `lint_applet`) e servidor Web (16 rotas HTTP 200 + bundle Metro 200) **PASSOU**; runner Jest e validação física Android **NÃO EXECUTADOS**; próximo gate: decisão da equipe sobre **G1**.
