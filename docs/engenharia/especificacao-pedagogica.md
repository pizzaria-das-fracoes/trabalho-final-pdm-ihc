# Especificação pedagógica proposta — Gate G1

## Status e fontes

Este documento detalha propostas para revisão da equipe; não aprova nem implementa novo escopo.

**Já registrado nos documentos da branch principal atualizada:** público do 6º ano, objetivo de aprender frações com recursos visuais e feedback, requisitos RF01–RF14, casos UC01–UC09 e os critérios CA01–CA10, todos planejados. Ver [visao-e-escopo.md](visao-e-escopo.md), [requisitos.md](requisitos.md), [casos-de-uso.md](casos-de-uso.md) e [criterios-de-aceite.md](criterios-de-aceite.md).

**Fornecido como referência nesta rodada, mas ainda não registrado nos documentos existentes da branch:** os nomes dos quatro mundos — **Descubra as Frações**, **Frações no Dia a Dia**, **Pizzaria Matemática** e **Mestres das Frações**. São preservados aqui sem substituição.

**Propostas pendentes:** objetivos e sequência dos mundos, limites de conteúdo, práticas de elaboração de problemas, exemplos e explicações de erro. A [matriz BNCC](matriz-bncc.md) e o [modelo de domínio](modelo-dominio.md) separam essas propostas das associações e regras já documentadas.

`docs/projeto/` nesta branch contém somente um README informativo; as recomendações de integração abaixo referem-se aos arquivos vigentes em `docs/engenharia/`. Nenhum requisito, caso de uso ou critério de aceitação foi alterado nesta rodada.

## Progressão e objetivos propostos para os mundos

A progressão parte de significados e representações, passa a contextos e procedimentos, e termina com integração, justificativa e elaboração. Reapresentar uma habilidade em mais de um mundo é intencional; a ordem não significa domínio garantido. As habilidades e focos são sínteses, não transcrições oficiais. Conferir a redação e o escopo exatos com a [BNCC oficial](https://basenacionalcomum.mec.gov.br/images/BNCC_EI_EF_110518_versaofinal_site.pdf) antes de publicação.

| Mundo (nome preservado) | Objetivos de aprendizagem propostos | Progressão/atividades exemplificativas | Habilidades relacionadas |
|---|---|---|---|
| **Descubra as Frações** | Reconhecer inteiro e partes iguais; relacionar numerador e denominador; interpretar frações como parte-todo e como quociente; reconhecer zero, frações próprias/impróprias e equivalências simples; comparar e ordenar usando representações. | Começar com coleções e figuras particionadas; explicitar o inteiro de referência; depois repartir unidades entre grupos e comparar frações por unidades equivalentes ou por reta. Introduzir números mistos como outra escrita de algumas frações impróprias somente após a equipe aprovar esse recorte. | EF06MA07 |
| **Frações no Dia a Dia** | Usar frações em quantidades contáveis; relacionar representações fracionária e decimal e localizá-las na reta; explicar quando o resultado de uma fração de quantidade é natural; formular problemas com contexto claro. | Partilhar objetos em grupos iguais; calcular frações de quantidades divisíveis; conectar uma medida fracionária à posição e ao decimal exato ou periódico correspondente. Começar com valores pequenos e contextos familiares, sem estereótipos ou dependência de compra/consumo. | EF06MA08, EF06MA09 |
| **Pizzaria Matemática** | Consolidar partes iguais, equivalência e comparação; somar/subtrair frações positivas com unidades compatíveis; explicar o resultado em fração e representação visual; criar problemas válidos. | Usar pizzas do mesmo tamanho como área representada, não como decoração; converter pedaços a subdivisões equivalentes; resolver medidas de receitas sem somar denominadores. Restringir subtrações a resultado não negativo no escopo proposto. | EF06MA07, EF06MA10 |
| **Mestres das Frações** | Integrar as quatro habilidades em situações novas; escolher e justificar representações; verificar resultados; elaborar problemas de fração de quantidade e de adição/subtração. | Oferecer prática cumulativa com exemplos curtos, não cronometrada e sem ranking. Pedir que o estudante confira a própria questão por outra representação e identifique se há dados suficientes e uma resposta válida. Não usar o nome do mundo como declaração de domínio ou certificação. | EF06MA07, EF06MA08, EF06MA09, EF06MA10 |

### Critérios pedagógicos transversais propostos

- Antes de introduzir uma regra, explicitar o significado da unidade/todo e apresentar ao menos uma representação visual ou contextual que preserve esse significado.
- Ligar desenho, linguagem cotidiana e notação `n/d`; não apresentar o desenho como única definição de fração.
- Em respostas incorretas, preservar a tentativa e apontar o raciocínio que pode ser revisto; não rotular o estudante.
- Quando a habilidade incluir elaboração de problemas, pedir enunciado, dados, operação/representação e solução verificável. Avaliar correção matemática e clareza do enunciado, não criatividade ou ortografia como evidência de matemática.
- Não usar quantidade fracionária de objetos discretos sem explicar a unidade ou mudar o contexto para uma medida contínua.

## Atividades originais e feedback explicativo proposto

Os enunciados abaixo foram redigidos para esta especificação. São exemplos para revisão, não conteúdo aprovado nem cópia de material de terceiros.

### Descubra as Frações — parte-todo e divisão

**Atividade:** “Três barras iguais serão repartidas igualmente entre quatro equipes. Que fração de uma barra recebe cada equipe? Mostre também como `3/4` pode ser visto como partes de um inteiro.”

**Verificação:** `3 ÷ 4 = 3/4` de barra por equipe. Separadamente, uma barra em quatro partes iguais, com três partes selecionadas, também representa `3/4`. A atividade compara duas interpretações do mesmo número, não confunde três barras com três partes de uma barra.

**Erro comum — inverter numerador e denominador.** Pista: “Primeiro conte em quantas partes iguais cada unidade foi dividida; esse total fica no denominador. Depois conte quantas dessas partes estão sendo consideradas.” Explicação: “São quatro partes iguais por inteiro e três partes consideradas: `3/4`.”

### Frações no Dia a Dia — quantidade, decimal e reta

**Atividade:** “Uma turma tem 20 cartões para organizar. `3/4` deles serão colocados numa caixa. Quantos cartões vão para a caixa? Localize `3/4` entre 0 e 1 e compare com `0,75`.”

**Verificação:** `20 ÷ 4 = 5`; `5 × 3 = 15`. Na reta, `3/4 = 0,75`.

**Extensão decimal:** “Uma fita mede `1/3` de metro. Qual escrita decimal exata representa essa medida?” A resposta é periódica (`0,333…`), não `0,33` exato. A notação adotada para indicar período precisa de aprovação.

**Erro comum — usar o denominador como resposta decimal ou arredondar sem aviso.** Pista: “A quantidade de casas decimais não vem diretamente do denominador; pense em divisões equivalentes por 10, 100, etc.” Explicação: “`3/4 = 75/100 = 0,75`. Já `1/3` não termina: `0,33` é uma aproximação, não o mesmo número.”

### Pizzaria Matemática — comparação e operações

**Atividade:** “Duas pizzas idênticas foram divididas em `3/4` e `2/3`. Qual fração representa mais pizza? Depois, uma receita usa `1/2` de uma medida e `1/3` de outra medida da mesma unidade. Quanto usa ao todo?”

**Verificação:** `3/4 = 9/12` e `2/3 = 8/12`, logo `3/4 > 2/3`. Para a soma, `1/2 + 1/3 = 3/6 + 2/6 = 5/6`.

**Erro comum — somar denominadores.** Pista: “Meios e terços são tamanhos de pedaço diferentes. Reescreva os dois em sextos antes de contar.” Explicação: “`1/2` são `3/6` e `1/3` são `2/6`; juntos são `5/6`, não `2/5`.”

**Atividade de subtração:** “De uma medida de `5/6`, foram usados `1/3`. Quanto resta?”

**Verificação:** `5/6 - 1/3 = 5/6 - 2/6 = 3/6 = 1/2`.

**Erro comum — subtrair denominadores ou trocar a ordem.** Pista: “Expresse as duas quantidades em partes de mesmo tamanho e confira qual quantidade é maior.” Explicação: “`1/3 = 2/6`; restam `3/6`, que simplifica para `1/2`.”

### Mestres das Frações — elaborar e verificar

**Atividade:** “Crie um problema de partilha ou medida em que seja preciso calcular `2/3` de 24 unidades. Escreva a pergunta, resolva e confira o resultado por uma representação diferente.”

**Verificação possível:** `24 ÷ 3 = 8`; `8 × 2 = 16`. Um enunciado com 24 objetos distribuídos em três grupos iguais e pedido de dois grupos dá resultado natural `16`.

**Atividade de revisão:** “Uma jarra tinha `7/8` de litro e foram usados `1/4` de litro. Escreva uma pergunta que possa ser respondida e calcule o que restou.”

**Verificação:** `7/8 - 1/4 = 7/8 - 2/8 = 5/8` de litro.

**Erro comum — criar dados incompatíveis ou resposta que não atende ao objetivo.** Pista: “Confira se a unidade está clara, se a divisão indicada cabe igualmente e se a pergunta corresponde à operação que você resolveu.” Explicação: “Para `2/3` de 24, dividir 24 em 3 grupos iguais dá 8 por grupo; considerar 2 grupos dá 16. O resultado é natural e pode ser conferido somando 8 + 8.”

### Feedback adicional para erros frequentes

| Erro observado | Pista antes de revelar solução | Explicação posterior |
|---|---|---|
| Dizer que `1/4 > 1/3` porque 4 é maior que 3. | “Represente as duas frações do mesmo inteiro ou escreva-as em doze avos.” | “`1/4 = 3/12` e `1/3 = 4/12`; portanto `1/3` é maior. Com o mesmo numerador 1, dividir o inteiro em mais partes iguais deixa cada parte menor.” |
| Dizer que `2/3` não é equivalente a `4/6`. | “Que número foi usado para transformar 2 em 4? O mesmo fator transforma 3 em 6?” | “Multiplicando numerador e denominador por 2, `2/3 = 4/6`; a quantidade não mudou. Somar 1 ao numerador e ao denominador não é uma regra de equivalência.” |
| Escrever `1/3 = 0,33`. | “A divisão de 1 por 3 termina ou continua?” | “`0,33` corresponde a `33/100` e é menor que `1/3`; é apenas aproximação. A escrita continua como `0,333…`.” |
| Tentar representar `2/0`. | “O denominador informa em quantas partes iguais o inteiro foi separado. É possível separar em zero partes?” | “Não existe fração com denominador zero. Escolha um denominador positivo; não há resposta a calcular para `2/0`.” |
| Subtrair `1/2 - 3/4` no módulo de racionais positivos. | “Qual quantidade é maior? Esta atividade permite resultados negativos?” | “`1/2` é menor que `3/4`. Pela política proposta, a atividade inicial não inclui resultados negativos: troque a ordem ou escolha outra questão. Não transforme a diferença em zero.” |

O padrão de feedback é uma proposta para complementar o componente já documentado em `docs/design-system/04-componentes/feedback-aprendizagem.md`: dica conceitual, relação com a representação e oportunidade de tentar de novo antes de mostrar uma solução completa. A equipe deve aprovar a sequência de revelação e revisar linguagem para a turma.

## Recomendações para integrar documentos de requisitos

**Nenhum arquivo listado abaixo foi alterado nesta rodada.** Para integração posterior, sem renumerar identificadores:

| Documento | Proposta de integração |
|---|---|
| `requisitos.md` | Esclarecer RF02 para incluir parte-todo e quociente/partilha; ampliar RF08 e RF09 para “resolver e elaborar problemas”; indicar explicitamente o escopo positivo e não negativo da operação nesta etapa, se aprovado. Manter RF01 como apoio transversal. |
| `casos-de-uso.md` | Estender UC01 com partilha de mais de uma unidade; UC04/UC05 com equivalência entre reta e decimal periódico; UC06/UC07 com um fluxo de criação/verificação de problema, se aprovado. |
| `criterios-de-aceite.md` | Acrescentar exemplos para `3 ÷ 4 = 3/4`, `0/d = 0`, rejeição de denominador zero, equivalência/simplificação, decimal periódico sem igualdade arredondada, quantidade divisível, soma e subtração com resultado zero e negativa fora do escopo. |
| `plano-testes.md` | Separar cobertura de adição e subtração; incluir casos de borda, fração de quantidade que não dá natural, elaboração de problema, overflow/limites e verificação de explicações. Não marcar como executado antes da implementação. |
| `matriz-bncc.md` | Usar as ampliações da seção de propostas na matriz; manter separadas as relações atuais e as pendentes de aprovação. |

## Aprovações ainda necessárias

1. Aprovar objetivos, ordem flexível e associação das habilidades aos quatro mundos.
2. Aprovar limites de conteúdo e de representação indicados em [modelo-dominio.md](modelo-dominio.md).
3. Decidir se números mistos serão objetivo explícito ou apenas forma alternativa.
4. Aprovar exclusão de resultados negativos no conteúdo inicial e regras para elaboração de problemas.
5. Aprovar notação de decimais periódicos, casas exibidas e política de aproximação.
6. Conferir a redação oficial e o alinhamento de cada objetivo com a BNCC antes de publicação.

**Não é evidência de validação pedagógica:** este documento não relata avaliação com estudantes, professor, especialista ou teste de aprendizagem. Tais validações continuam pendentes.
