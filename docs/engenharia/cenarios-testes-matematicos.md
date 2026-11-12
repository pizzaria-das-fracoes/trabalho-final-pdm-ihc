# Catálogo proposto de cenários matemáticos testáveis

## Status e convenções

Este catálogo prepara a futura automação unitária e de casos de uso; não contém código, não altera os testes T01–T15 existentes e não afirma execução. Nenhum cenário M01–M23 foi implementado ou executado como teste automatizado; referências a T/CA indicam apenas especificações existentes. Os rótulos distinguem:

- **Matemática consolidada:** propriedade/resultado matemático exato, independente da decisão de produto.
- **Proposta pedagógica:** escolha de conteúdo ou tratamento didático ainda sujeita à aprovação da equipe.
- **Funcionalidade planejada:** requisito ou fluxo já descrito, porém não implementado.
- **Automação pendente:** cenário abaixo ainda não existe como teste executado; referências a T/CA indicam apenas documentação planejada.

Valores fracionários e comparações devem ser conferidos por aritmética inteira/exata, não por igualdade de ponto flutuante. Decimais com vírgula são representações em base 10; `…` indica expansão infinita periódica. `ERRO_DOMINIO` significa que a operação deve falhar explicitamente, sem arredondar, truncar ou produzir um valor de sucesso alternativo; o nome é ilustrativo, não API implementada.

Os IDs `M01`–`M23` identificam linhas deste catálogo, **não** são identificadores de teste T e não renumeram os existentes. Consulte [modelo-dominio.md](modelo-dominio.md), [matriz-bncc.md](matriz-bncc.md) e [especificacao-pedagogica.md](especificacao-pedagogica.md).

## Cenários

| ID | Entrada | Resultado exato/esperado | Regra e decisão de produto | Rastreabilidade atual | Estado do teste |
|---|---|---|---|---|---|
| M01 | `2/3`, `4/6` | Equivalentes: verdadeiro (`2×6 = 3×4 = 12`). | Matemática consolidada; ensinar equivalência é funcionalidade planejada. | EF06MA07; RF05, UC03, CA03, T04. | Automação planejada, ainda não executada. |
| M02 | `2/3`, `3/5` | Não equivalentes (`2×5 = 10`, `3×3 = 9`). | Matemática consolidada; exemplo previsto em CA03. | EF06MA07; RF05, UC03, CA03. | T04 cobre o par equivalente `2/3` e `4/6`, não esta entrada; teste específico pendente. |
| M03 | `3/0` | Fração inválida; rejeitar antes de divisão, simplificação, comparação ou operação. | Matemática consolidada: divisão por zero não define racional. Mensagem/recuperação na atividade é proposta pedagógica. | RF03/UC01 bloqueiam totais inválidos em parte-todo; cobertura de valor `n/0` não está explícita em CA/T. | Novo caso automatizado pendente. |
| M04 | `0/4` | Valor zero; forma canônica `0/1`. A atividade pode exibir `0/4` se o denominador contextual for 4. | Matemática consolidada; conservar a escrita contextual é decisão didática proposta. | RF03, UC01, CA01 menciona selecionar zero e exibir `0/4`. | CA01/T01 não cobrem normalização; caso automatizado pendente. |
| M05 | Simplificar `12/18` | `mdc(12,18)=6`; forma reduzida `2/3`. Simplificar `0/4` resulta em `0/1`. | Matemática consolidada; quando apresentar a forma reduzida é decisão de conteúdo. | RF05, UC03, CA03 cobre equivalência, mas não exemplo de MDC. | Caso unitário automatizado pendente. |
| M06 | Comparar `1/2`, `2/4` | Igualdade (`1×4 = 2×2`). | Matemática consolidada; comparação exata sem float. | EF06MA07; RF04, UC02, CA02, T02. | T02 planejado; não executado. |
| M07 | Ordenar `{2/3, 1/2, 3/4}` em ordem crescente | `{1/2, 2/3, 3/4}`; para frações distintas equivalentes, preservar empate ou regra estável de exibição. | Matemática consolidada; regra de desempate visual é decisão de produto. | RF04 pede ordenar, mas UC02 descreve duas frações; CA02/T02–T03 não verificam uma coleção. | Caso automatizado de ordenação pendente. |
| M08 | Classificar `3/4` e `7/4` | `3/4` própria (`0 < 3/4 < 1`); `7/4` imprópria (`>1`). | Matemática consolidada; exemplos, progressão e representação de impróprias são proposta pedagógica. | EF06MA07 é referência proposta; RF02/UC01 enfatizam pizza/partes iguais, sem critério para impróprias. | Caso automatizado pendente. |
| M09 | Converter `7/4` em número misto | `7/4 = 1 + 3/4 = 1 3/4`, pois `7 = 1×4 + 3`. | Matemática consolidada; ensinar o número misto ou só o apresentar depende de aprovação. | Sem RF/UC/CA/T específico. | Caso automatizado pendente e conteúdo não aprovado. |
| M10 | `3/4` de `20` | `20÷4=5`; `5×3=15` objetos. | Matemática consolidada; EF06MA09 requer resultado natural; a atividade contextual é planejada. | RF08, UC06, CA06, T07. | T07 planejado; não executado. |
| M11 | `2/3` de `10` | Valor exato `20/3`, não natural. Não arredondar; rejeitar/reformular se a questão for de resultado natural. | Resultado matemático consolidado; rejeição/reautoria no conteúdo é proposta pedagógica. | RF08/UC06 mencionam quantidade divisível; sem critério explícito para divisibilidade negativa. | Caso automatizado pendente. |
| M12 | `1/2 + 1/3` | `3/6 + 2/6 = 5/6`. | Matemática consolidada; denominador comum e explicação visual são funcionalidade planejada. | RF09, UC07, CA07, T08. | T08 planejado; não executado. |
| M13 | `3/4 − 1/2` | `3/4 − 2/4 = 1/4`. | Matemática consolidada; apresentar forma reduzida quando pedido. | RF09, UC07, CA07 inclui este resultado. | Caso documentado; teste de subtração automatizado não executado. |
| M14 | `1/2 − 1/2` | `0/1` canônico (ou `0/2` contextual, ambos valor zero). | Matemática consolidada; preservar denominador contextual na explicação é proposta. | Não há CA/T atual para resultado zero de subtração; CA01 é zero na atividade visual. | Caso automatizado pendente. |
| M15 | `1/2 − 3/4` | Resultado matemático exato `−1/4`. Para atividade do domínio didático não negativo proposto, não aceitar a questão/operação como exercício válido; não retornar zero, valor absoluto ou aproximação. | O valor negativo é matemática consolidada; excluí-lo do conteúdo inicial é decisão pedagógica proposta. A validação de pré-condição pertence ao Use Case; o model mantém o domínio acordado e comunica erro de domínio se for chamado fora dele. | RF09 fala em frações positivas; não há política nos RF/UC/CA/T existentes. | Caso de Use Case pendente e política requer aprovação. |
| M16 | Converter `1/4` e `1/8` | `1/4 = 0,25`; `1/8 = 0,125`, decimais exatos. | Matemática consolidada; formato com vírgula segue convenção adotada no documento. | RF07, UC05, CA05, T06 (para `1/4`). | T06 planejado; `1/8` é caso adicional; ambos não executados. |
| M17 | Converter `1/3`; comparar com `0,33` | `1/3 = 0,333…`; `0,33 = 33/100`; não são iguais (`1/3 − 33/100 = 1/300`). | Matemática consolidada; notação do período, casas exibidas e inclusão didática precisam de aprovação. | RF07/UC05 e CA05 dizem não tratar `1/3` como decimal finito, mas não especificam resposta periódica nem feedback. | Caso exato unitário pendente; apresentação ainda não aprovada. |
| M18 | Posicionar `3/2` na reta `0–2` | Valor `3/2 = 1 + 1/2`; posição racional é `1,5`, entre 1 e 2. A camada matemática retorna/valida valor racional; pixels/coordenadas pertencem à apresentação. | Matemática consolidada; interação e escala visual são funcionais planejadas. | RF06, UC04, CA04, T05 (T05 usa `3/2`). | T05 é UI planejada; nenhum teste de domínio/UI foi executado. |
| M19 | Posicionar `5/2` em reta configurada `0–2` | Valor `2,5` está fora da janela; reconfigurar a janela para incluí-lo ou rejeitar a atividade. Nunca mover para o extremo 2 silenciosamente. | Valor consolidado; janela `0–2` é configuração atual e política fora da janela é proposta. | UC04/CA04 usam `0–2`; não há regra para fora do intervalo. | Caso automatizado e de interface pendente. |
| M20 | Numerador `n<0` no domínio não negativo; denominador `d=0`, `d<0` ou não inteiro; numerador/denominador fora do limite aprovado | Rejeitar entrada inválida explicitamente antes de operar. Para os limites técnicos propostos: `0≤n≤1.000.000`, `1≤d≤1.000.000`, ambos inteiros seguros. | Invariantes de racional são matemática consolidada; valores máximos são guardrails técnicos propostos, não limites curriculares aprovados. | Não há requisito/CA/T de domínio para faixa/overflow. | Teste de validação/limite pendente. |
| M21 | `1/1009 + 1/1013` | Soma exata `2022/1.022.117` (denominadores coprimos); os operandos respeitam o limite proposto, mas o denominador canônico ultrapassa `1.000.000`: devolver erro explícito de domínio, sem arredondar. Todos os intermediários são inteiros seguros. | A aritmética exata é consolidada; limitar resultados canônicos a `1.000.000` é proposta técnica, cuja política de erro requer aprovação. | RNF06 pede testes matemáticos, mas não define limites/resultados fora da faixa. | Teste de limite de resultado pendente. |
| M22 | `1.000.000/1 + 1/1` | Soma matemática `1.000.001/1`; excede o limite técnico proposto de numerador canônico, então erro explícito de domínio, sem overflow silencioso. | Resultado aritmético consolidado; limite e tipo de erro são proposta técnica. | Sem CA/T de limite de resultado. | Teste de limite de resultado pendente. |
| M23 | Problema criado pelo estudante: fração `2/3`, quantidade `24`, unidade “cartões” | Dados coerentes: `24÷3=8`, `8×2=16 cartões`; validar que enunciado, pergunta e operação se referem a esses dados. Contraponto: `2/3` de 10 não satisfaz resultado natural. | A solução é matemática consolidada; elaboração, validação do enunciado e rubrica são propostas de funcionalidade e conteúdo. | EF06MA09/10 e objetivos dos mundos incluem elaborar na proposta, mas RF08/09 atuais dizem resolver; sem UC/CA/T para autoria. | Nenhum teste automatizado de autoria implementado; critérios precisam aprovação. |

## Responsabilidade por camada — arquitetura prevista

| Camada | Responsabilidade relativa aos cenários |
|---|---|
| **Model** | Entidade `Fraction`, invariantes e funções puras/exatas de domínio (equivalência, simplificação, comparação/ordenação e cálculo fracionário), com limites explícitos e resultado de erro tipado. Sem UI, estado de tela ou dependências externas. |
| **Use Cases** | Orquestrar as operações e fluxos de resolução/elaboração usando o Model; validar pré-condições do exercício (por exemplo, quantidade com resultado natural e subtração não negativa se essa política for aprovada); escolher a explicação/estratégia curricular; converter erros do Model em resultado de aplicação compreensível. |
| **ViewModel** | Receber ações, manter estado e tentativa, validar formato de entrada e chamar Use Cases; não calcular valores de fração nem decidir equivalência/ordem. |
| **View** | Apresentar fração, visual/decimal/reta, explicação, erro e controles acessíveis; não conter regras aritméticas ou de domínio. Coordenadas gráficas não substituem o valor racional avaliado. |

Esta separação é proposta de especificação compatível com [01-arquitetura.md](../harness/01-arquitetura.md), não código ou validação de imports.

## Lacunas para preparar a suíte automatizada

1. Transformar M01–M23 em casos automatizados unitários/de Use Case após aprovação de limites e política de resultados negativos.
2. Preservar os T01–T15 existentes; mapear cenários adicionais para os testes numa futura revisão de `plano-testes.md`, sem afirmar execução.
3. Decidir tipos de erro para entrada inválida, resultado negativo fora do escopo pedagógico e resultado fora dos limites técnicos.
4. Separar teste de domínio da posição exata e teste visual/acessível da interação na reta.
5. Criar critérios aprovados para respostas explicativas, problema criado pelo estudante e conclusão de cada mundo.

**Status:** catálogo documental proposto. Nenhum cenário desta tabela foi executado como suíte do app; os cálculos de conferência desta revisão são validações independentes de exemplos, não evidência de testes automatizados implementados.
