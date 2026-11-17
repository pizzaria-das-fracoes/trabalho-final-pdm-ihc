# Checklist obrigatório por tarefa

- [ ] Escopo aprovado e gate correto
- [ ] Fonte de verdade lida (AGENTS, requisitos, BNCC, design)
- [ ] Requisitos e critérios de aceitação identificados
- [ ] Camadas MVVM respeitadas
- [ ] Contratos de rotas, parâmetros e volta Android respeitados
- [ ] Persistência offline e estados de erro tratados conforme contrato
- [ ] Todos os botões e rotas têm comportamento definido
- [ ] Responsividade Android/safe areas consideradas
- [ ] Acessibilidade e feedback pedagógico considerados
- [ ] Testes de matemática, componentes e fluxo previstos/executados
- [ ] Comandos executados com resultados registrados (ou NÃO EXECUTADO)
- [ ] Documentação e matriz de rastreabilidade atualizadas
- [ ] Evidência de tela real anexada, se houver implementação

**Relatório:** arquivos alterados; requisitos cobertos; testes PASSOU/FALHOU/NÃO EXECUTADO; riscos; próximo gate. Nunca marcar itens sem evidência.

## Pré-requisitos para o G2

- [ ] G1 aprovado por revisão humana, incluindo wireframes e contratos técnicos
- [ ] Versões Expo, React Native e TypeScript escolhidas e registradas
- [ ] Persistência local escolhida e contrato de migração definido
- [ ] Projeto Expo criado somente após a aprovação do G1
- [ ] Expo Router, safe areas e navegação Android verificadas
- [ ] Lint, type-check, testes e auditoria de imports configurados
- [ ] Evidências de 320 dp, fonte ampliada, teclado e gesto/botão voltar anexadas

Enquanto qualquer pré-requisito estiver sem evidência, o G2 permanece pendente.

## Relatório — segunda rodada do Gate G1 (2026-11-11)

| Item | Estado e evidência |
|---|---|
| Escopo e gate | Documentação pedagógica autorizada pelo pedido; nenhuma decisão pedagógica proposta foi tratada como aprovada. Gate G1 continua pendente. |
| Fontes lidas | `AGENTS.md`, gate G1, README e documentos de engenharia, matriz, modelo de domínio, especificação pedagógica, README do projeto, arquitetura, Design System e feedback de aprendizagem. |
| Requisitos e critérios considerados | RF01–RF14, UC01–UC09, CA01–CA10 e T01–T15 lidos; recomendações de integração foram registradas sem editar requisitos, casos de uso ou critérios. |
| Arquitetura e interface | Não se aplica: nenhuma implementação, rota, botão ou alteração visual nesta tarefa. |
| Matemática e pedagogia | Exemplos foram conferidos aritmeticamente; regras e limites foram documentados como propostas, não como comportamento implementado. Nenhuma avaliação com estudantes foi realizada. |
| Testes do app / Android / acessibilidade | NÃO EXECUTADOS — aplicativo não implementado e fora do escopo desta rodada. |
| `git diff --check` | PASSOU — nenhuma inconsistência de whitespace no diff. |
| `python scripts/check_harness.py` | PASSOU — Harness documental; app/Android/build não executados por estarem fora do escopo. |
| Verificação exata dos exemplos | PASSOU — partilha, número misto, equivalência, comparação, frações de quantidades, adição, subtração, zero, decimal periódico e rejeição de denominador zero. Executada com `fractions.Fraction` em Python. |
| Referências cruzadas locais | PASSOU — referências relativas nos três documentos pedagógicos apontam para arquivos existentes. |
| Arquivos documentais | Matriz BNCC e modelo de domínio consolidados; especificação pedagógica inclui exemplos, pendências e propostas de integração. |
| Evidência de tela | NÃO APLICÁVEL — nenhuma interface foi implementada. |

**Próximo gate:** revisão humana das propostas pedagógicas e conferência dos focos com a redação oficial da BNCC; manter G1 pendente até haver evidência de aprovação. Nenhum teste com estudantes, app ou Android foi executado.

## Relatório — revisão de alinhamento do modelo de domínio (2026-11-13)

| Item | Estado e evidência |
|---|---|
| Escopo e gate | Revisão documental autorizada; nenhuma regra matemática, limite ou política pedagógica foi alterada. Gate G1 permanece pendente de revisão humana. |
| Fontes lidas | `AGENTS.md`, estado e gates, README de engenharia, matriz BNCC, README do Design System, arquitetura, requisitos, modelo de domínio e contrato técnico disponível em `origin/main`. O contrato `05-contratos-tecnicos.md` não existe na branch desta contribuição. |
| Contrato de persistência | O Harness exige operações equivalentes a `loadProgress`, `saveAttempt` e `listAttempts`, mas não exige o nome `DataSource`. Mantido `ProgressRepository`; métodos e diagrama alinhados às operações do Harness após orientação da equipe. |
| Organização do modelo | Resumo inicial consolidado. Não havia títulos principais duplicados no arquivo. Regras, exemplos, limites numéricos e decisões pendentes preservados. |
| `git diff --check` | PASSOU — nenhuma inconsistência de whitespace. |
| `python scripts/check_harness.py` | PASSOU — executado com o Python do ambiente do projeto (`.venv\Scripts\python.exe`); o Harness informou app/Android/build como NÃO EXECUTADO, fora do escopo da fase 0. |
| Testes do app / Android / avaliação pedagógica | NÃO EXECUTADOS — aplicativo não implementado; não houve validação com estudantes. |
| Arquivos documentais | `docs/engenharia/modelo-dominio.md` e este checklist. |
| Evidência de tela | NÃO APLICÁVEL — nenhuma interface foi implementada. |

**Próximo gate:** revisão humana das quatro contribuições; não declarar G1 aprovado.

## Relatório — resolução de conflitos do PR #16 (2026-11-16)

| Item | Estado e evidência |
|---|---|
| Escopo e gate | Integração documental da `origin/main` à branch `docs/g1-pedagogia`; sem implementação do app e sem aprovação de propostas de UX/pedagogia. G1 permanece pendente. |
| Conflitos | `docs/harness/04-checklist-entrega.md` continha alterações independentes nas duas branches. Foram preservados os pré-requisitos do G2 da `main` e os relatórios G1 da branch. `CHANGELOG.md` foi combinado automaticamente pelo Git, preservando as entradas de ambas as branches. |
| Outras alterações | As demais alterações da `main` foram incorporadas sem resolução manual de conflito; propostas de design permanecem propostas. |
| `git diff --cached --check` e `git diff --check` | PASSARAM — sem erros de whitespace. |
| `python scripts/check_harness.py` | PASSOU — Harness documental; app/Android/build não executados, fora do escopo. |
| Testes do app / Android / validação pedagógica | NÃO EXECUTADOS — nenhuma implementação nem avaliação com estudantes. |
| Evidência de tela | NÃO APLICÁVEL — nenhuma interface foi implementada nesta resolução. |

**Próximo gate:** revisão humana pendente; não declarar G1 aprovado.
