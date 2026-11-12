# Rastreabilidade BNCC → requisitos → casos de uso → testes

## Situação e fonte

Esta matriz organiza associações já presentes em `requisitos.md`, `casos-de-uso.md`, `criterios-de-aceite.md` e `plano-testes.md`. Não cria nem renumera RF, UC, CA ou T. A cobertura descrita é planejada, não implementada nem validada com estudantes.

Os focos abaixo são sínteses operacionais, não transcrições oficiais. A redação e o contexto curricular de cada habilidade devem ser conferidos no documento oficial da BNCC antes de publicação. Referência indicada no projeto: [BNCC — versão final](https://basenacionalcomum.mec.gov.br/images/BNCC_EI_EF_110518_versaofinal_site.pdf).

## Matriz de rastreabilidade existente

Os identificadores e vínculos abaixo são os dos documentos vigentes. A associação à habilidade é curricularmente planejada; a coluna de lacunas distingue vínculo explícito de cobertura apenas relacionada. Não se criam nem se renumeram identificadores nesta rodada.

| Habilidade | Foco operacional (síntese) | RF atuais | UC atuais | CA atuais | Testes planejados | Situação, lacunas e evidência |
|---|---|---|---|---|---|---|
| EF06MA07 | Compreender, comparar e ordenar frações como partes de inteiros e como resultado de divisão; identificar equivalências. | RF02, RF03, RF04, RF05, RF10 | UC01, UC02, UC03 | CA01 (RF03), CA02 (RF04), CA03 (RF05), CA08 (RF10) | T01–T04 | T01 verifica validade de `3/4`; T02–T03 comparam e T04 verifica equivalência. Falta critério/teste explícito para significado parte-todo em RF02, quociente/partilha e ordenação de um conjunto de frações. |
| EF06MA08 | Relacionar números racionais positivos nas formas fracionária e decimal e a pontos da reta numérica. | RF06, RF07, RF10 | UC04, UC05 | CA04 (RF06), CA05 (RF07), CA08 (RF10) | T05–T06 | CA04 inclui `3/2` na reta 0–2; CA05 inclui `1/4 = 0,25` e alerta que `1/3` não é decimal finito. T05–T06 não cobrem decimal periódico, comparação das duas representações nem pontos fora do intervalo; não foram executados. |
| EF06MA09 | Resolver e elaborar problemas de fração de uma quantidade cujo resultado seja natural. | RF08, RF10 | UC06 | CA06 (RF08), CA08 (RF10) | T07 | CA06/T07 cobrem `3/4` de 20 = 15. Não há elaboração pelo estudante, teste de outros casos de divisibilidade ou evidência executada. |
| EF06MA10 | Resolver e elaborar problemas de adição ou subtração de racionais positivos na forma fracionária. | RF09, RF10 | UC07 | CA07 (RF09), CA08 (RF10) | T08 | UC07/CA07 incluem adição e subtração; T08 cobre somente a adição. Elaboração, resultado zero, subtração negativa e teste específico da subtração ainda não têm cobertura explícita. |
| Apoio, sem habilidade BNCC própria | Consultar progresso e revisar tentativas. | RF11, RF12 | UC08 | CA09 (RF11); nenhum CA próprio de RF12 | T09 (RF11), T10 (RF12) | T09–T10 são evidências planejadas para funções de apoio, não evidência autônoma de domínio curricular; não foram executados. |
| Futuro, sem habilidade BNCC própria | Diagnóstico e seleção adaptativa planejados para etapa futura. | RF13, RF14 | UC09 | Nenhum | T11 (futuro) | T11 é futuro e não executado; não integra cobertura curricular validada. UC09 alerta que o diagnóstico não é cientificamente validado. |
| Transversal, não é uma habilidade BNCC | Apresentar trilha com objetivos por habilidade. | RF01 | Nenhum | Nenhum | Nenhum | RF01 não tem caso de uso, critério, teste ou evidência associados na documentação atual. |

Rastreabilidade exigida: habilidade → RF → UC → CA → teste → evidência. A evidência atual limita-se ao que está especificado nos critérios e testes planejados; não há execução do app, capturas de tela ou validação com estudantes. CA08 é genérico para RF10 e não verifica separadamente a qualidade das explicações por habilidade. Assim, a matriz registra vínculos e lacunas, mas não declara cobertura pedagógica validada.

## Mapeamento de referência para os quatro mundos

Os nomes abaixo foram confirmados no escopo desta rodada. A distribuição e os objetivos são propostas pedagógicas, não decisões já aprovadas:

| Mundo (nome preservado) | Habilidades que podem ser trabalhadas | Objetivo proposto |
|---|---|---|
| Descubra as Frações | EF06MA07 | Construir significados de fração como parte-todo e divisão, reconhecer frações próprias/impróprias, comparar e identificar equivalências. |
| Frações no Dia a Dia | EF06MA08, EF06MA09 | Relacionar frações, decimais e reta numérica; calcular frações de quantidades naturais e criar problemas contextualizados. |
| Pizzaria Matemática | EF06MA07, EF06MA10 | Usar representações visuais para equivalência e comparação, além de somar/subtrair frações positivas em situações de medida. |
| Mestres das Frações | EF06MA07–EF06MA10 | Praticar e explicar estratégias integradas, elaborar problemas válidos e conferir resultados em mais de uma representação. O nome não implica certificação de domínio. |

Os mundos podem retomar habilidades anteriores; esta tabela não estabelece pré-requisitos rígidos nem ordem obrigatória.

## Propostas de atualização para integração posterior

Não são requisitos aprovados e não alteram os documentos de origem nesta rodada:

1. Estender RF02, UC01, CA01 e T01 para incluir partilha como divisão (por exemplo, 3 unidades repartidas igualmente entre 4 pessoas), além da representação parte-todo.
2. Estender RF08, UC06, CA06 e T07 para que o estudante também elabore um problema de fração de quantidade com resultado natural e justifique a divisibilidade.
3. Estender RF09, UC07, CA07 e T08 para elaboração de problemas; incluir testes separados para soma e subtração, resultados zero e rejeição de resultados negativos no escopo inicial.
4. Estender RF06–RF07, UC04–UC05, CA04–CA05 e T05–T06 com comparação entre representações, um decimal periódico e regras para pontos fora da reta configurada.
5. Criar critérios e testes pedagógicos específicos para as dicas/explicações de RF10 em cada habilidade.
6. Vincular RF01 a um caso de uso, critério e teste para verificar que cada objetivo exibido corresponde à matriz curricular aprovada.

**Estado:** associações existentes preservadas; lacunas registradas sem renumerar identificadores; ampliações acima aguardam aprovação. Nenhum teste foi executado e nenhuma habilidade foi validada por avaliação de aprendizagem. As sínteses de habilidade requerem conferência com a redação oficial da BNCC antes de publicação.
