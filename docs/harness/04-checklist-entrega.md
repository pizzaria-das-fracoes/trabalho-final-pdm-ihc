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
