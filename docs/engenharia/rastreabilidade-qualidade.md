# Rastreabilidade de qualidade — G1

Este documento complementa, sem substituir ou alterar, a [matriz BNCC](matriz-bncc.md). Preserva os identificadores existentes e fecha a ligação para critérios de aceitação e testes planejados. RF01–RF12 são MVP; RF13–RF14 e T11 são futuros e excluídos da cobertura/aceitação do MVP.

Legenda de status: **PLANEJADO / NÃO EXECUTADO**. A presença de uma relação na tabela não constitui evidência de conformidade.

## BNCC → RF → UC → CA → teste

| Habilidade/escopo | RF | Caso de uso | Critério de aceitação | Teste(s) planejado(s) |
|---|---|---|---|---|
| EF06MA07 — significados e representação | RF02 | UC01 | CA12 | T17, T18, T28, T29, T31 |
| EF06MA07 — montagem e representação | RF03 | UC01 | CA01 | T01, T17, T18, T20, T29, T31 |
| EF06MA07 — comparação/ordenação | RF04 | UC02 | CA02 | T02, T03, T18, T20, T21, T31 |
| EF06MA07 — equivalência | RF05 | UC03 | CA03 | T04, T18, T20, T21, T31 |
| EF06MA07–10 — dicas e explicações | RF10 | UC01–UC08 | CA08, CA13 | T17, T21, T22, T25, T31 |
| EF06MA08 — reta numérica | RF06 | UC04 | CA04 | T05, T18, T20, T21, T31 |
| EF06MA08 — fração e decimal | RF07 | UC05 | CA05 | T06, T18, T20, T21, T31 |
| EF06MA09 — fração de quantidade | RF08 | UC06 | CA06 | T07, T18, T20, T21, T31 |
| EF06MA10 — adição/subtração | RF09 | UC07 | CA07 | T08, T18, T19, T20, T21, T31 |
| Apoio — trilha por habilidade | RF01 | UC10 | CA11 | T13, T16, T26, T29 |
| Apoio — progresso local | RF11 | UC08 | CA09 | T09, T22–T25 |
| Apoio — revisão de erros | RF12 | UC08 | CA14 | T10, T22–T25 |
| Futuro — diagnóstico | RF13 | UC09 | Fora do MVP; sem CA de MVP | T11 (futuro; não executar nesta fase) |
| Futuro — adaptação | RF14 | UC09 | Fora do MVP; sem CA de MVP | T11 (futuro; não executar nesta fase) |

## RNF → CA → teste planejado

| Requisito | Critério de aceitação | Teste(s) planejado(s) |
|---|---|---|
| RNF01 | CA15 | T15, T30 |
| RNF02 | CA10, CA16 | T12, T29 |
| RNF03 | CA17 | T28, T29 |
| RNF04 | CA18 | T09, T23–T25 |
| RNF05 | CA19 | T13, T26 |
| RNF06 | CA20 | T01–T08, T18–T20, T31 |
| RNF07 | CA21 | T14 |
| RNF08 | CA22 | T27 |

## Checagem de completude documental

- **MVP:** todos RF01–RF12 aparecem com ao menos um UC, CA e teste planejado; RNF01–RNF08 também possuem CA e teste.
- **Identificadores preservados:** RF01–RF14, RNF01–RNF08, UC01–UC09, CA01–CA10 e T01–T15 mantêm sua identidade. UC10, CA11–CA22 e T16–T31 são acréscimos; nenhum ID é reutilizado.
- **Futuro:** RF13/RF14, UC09 e T11 não são contabilizados como requisito coberto ou aceito do MVP.
- **Dependências:** T20, parte da validação de T21/T29 e os critérios G1 associados não podem ser aprovados até as decisões listadas no plano de testes e a aprovação visual/pedagógica.
- **Execução:** todos os testes estão planejados e não executados; não há evidência de app Android nesta documentação.
