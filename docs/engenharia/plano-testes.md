# Plano de testes e evidências

| Teste | Tipo | Entrada/ação | Resultado esperado |
|---|---|---|---|
| T01 | unitário | Fraction(3,4) | representação válida |
| T02 | unitário | comparar 1/2 e 2/4 | iguais |
| T03 | unitário | comparar 3/4 e 2/3 | maior |
| T04 | unitário | equivalência 2/3 e 4/6 | verdadeiro |
| T05 | UI | posicionar 3/2 na reta | 1,5 e feedback |
| T06 | unitário | converter 1/4 | 0,25 |
| T07 | unitário | 3/4 de 20 | 15 |
| T08 | unitário | 1/2 + 1/3 | 5/6 |
| T09 | integração | salvar e reiniciar app | progresso preservado |
| T10 | UI | revisar resposta errada | questão reaberta |
| T11 | futuro | diagnóstico e adaptação | regra transparente |
| T12 | Android | 320dp, fonte 150%, gesto, teclado | sem clipping/overflow |
| T13 | integração | tocar cada botão e navegar | ação/feedback sem erro |
| T14 | arquitetura | imports de camadas | sem violações |
| T15 | build | versão Expo + bundle Android | sem módulo nativo ausente |
| T16 | UI visual | pizza 3/4, setores de denominadores 2–8 | setores iguais, separadores visíveis e resumo corresponde às partes selecionadas |
| T17 | acessibilidade | checkbox das fatias e rádio de comparação com TalkBack | rótulo, papel e estado marcado/selecionado anunciados; ordem de foco previsível |
| T18 | responsividade | comparação e tela inicial em 320/393 dp e fonte ampliada | sem overflow; pizzas empilham em largura estreita; textos e ações permanecem visíveis |
| T19 | revisão visual | telas inicial, catálogo, atividade e progresso ao lado de `docs/.html` | cabeçalho, navegação, cartões, pizza, feedback e hierarquia seguem a referência mobile |

**Status:** T01–T04, T06–T09 e T14–T15 constam como executados em registro anterior. T05, T10, T12–T13 e T16–T19 permanecem pendentes de validação UI/Android; T11 continua futuro. Capturas e logs de dispositivo real ainda não existem. CHG-002 e CHG-003 não declaram esses testes como executados.
