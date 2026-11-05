# Checklist obrigatório por tarefa

- [ ] Escopo aprovado e gate correto
- [ ] Fonte de verdade lida (AGENTS, requisitos, BNCC, design)
- [ ] Requisitos e critérios de aceitação identificados
- [ ] Camadas MVVM respeitadas
- [ ] Todos os botões e rotas têm comportamento definido
- [ ] Responsividade Android/safe areas consideradas
- [ ] Acessibilidade e feedback pedagógico considerados
- [ ] Testes de matemática, componentes e fluxo previstos/executados
- [ ] Comandos executados com resultados registrados (ou NÃO EXECUTADO)
- [ ] Documentação e matriz de rastreabilidade atualizadas
- [ ] Evidência de tela real anexada, se houver implementação

**Relatório:** arquivos alterados; requisitos cobertos; testes PASSOU/FALHOU/NÃO EXECUTADO; riscos; próximo gate. Nunca marcar itens sem evidência.

## Registro — correção de rastreabilidade RNF03/T12

- **Escopo:** documentação na branch `docs/projeto-pdm-ihc`, com aprovação explícita; sem implementação do aplicativo. Commit local autorizado; push não autorizado.
- **Fontes e rastreabilidade:** lidos os gates, requisitos, matriz BNCC, Design System, arquitetura, plano de testes e especificação do projeto. RNF03 agora aponta para a medição de alvos de pelo menos 48 dp prevista no T12; a associação segue marcada como proposta (†).
- **Camadas, rotas, botões e interface Android:** não aplicável; nenhum código do aplicativo foi alterado.
- **Comandos executados:**
  - `git status --short --branch` — branch correta; diretório limpo antes da edição. Após a edição: quatro arquivos de documentação modificados.
  - `git diff --check` — PASSOU, sem erros de whitespace; Git emitiu aviso de conversão LF/CRLF para `docs/projeto/02-requisitos.md`.
  - `git diff -- CHANGELOG.md docs/engenharia/plano-testes.md docs/projeto/02-requisitos.md` — revisadas as alterações; somente a inclusão planejada da medição de 48 dp e a correção da rastreabilidade.
- **Validação documental:** `python scripts/check_harness.py` — PASSOU.
- **Testes Android e T12:** NÃO EXECUTADOS; continuam planejados para a fase de implementação.
- **Risco/pendência:** a medição de 48 dp ainda precisa ser executada em Android e registrada com evidência.
- **Próximo passo:** revisão humana das alterações; nenhum gate de implementação foi aprovado por esta tarefa.
