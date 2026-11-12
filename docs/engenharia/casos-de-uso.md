# Casos de uso (especificações planejadas)

Os casos UC01–UC08 descrevem o MVP. UC09 permanece futuro, fora do MVP. Fluxos, conteúdos e controles dependentes de decisão visual ou pedagógica só serão considerados aprovados após a decisão registrada pelos responsáveis.

## UC01 — Aprender a representar uma fração
**Ator:** estudante. **Pré:** abrir mundo EF06MA07. **Fluxo:** observar a explicação de inteiro e partes iguais → selecionar total de partes permitido pela atividade → escolher partes pintadas → observar numerador e denominador sincronizados com a pizza → conferir e receber explicação → concluir. **Alternativos:** denominador zero, fora do intervalo permitido pela atividade ou entrada inválida é bloqueado com mensagem compreensível; nenhuma parte selecionada é representada como 0/b; falha técnica não é apresentada como erro matemático. **Pós:** tentativa registrada localmente. **RF:** RF02, RF03, RF10.

## UC02 — Comparar frações
Selecionar duas frações → ver representações com inteiros de dimensão equivalente → escolher >, < ou = → conferir → receber justificativa baseada em valor racional → tentar novamente quando incorreto. Incluir pares equivalentes e não equivalentes, numeradores zero quando pedagogicamente aprovados e denominadores válidos. **RF:** RF04, RF10.

## UC03 — Descobrir equivalências
Apresentar fração → subdividir partes sem alterar a quantidade → identificar ou construir equivalente → explicar a transformação de numerador e denominador → tentar novamente quando incorreto. **RF:** RF05, RF10.

## UC04 — Posicionar na reta
Exibir reta 0–2 → posicionar fração por gesto ou por controle alternativo acessível sem arrastar → conferir tolerância/posição conforme escala visual aprovada → mostrar posição correta e explicação → registrar tentativa. A tolerância de acerto precisa de decisão antes da implementação. **RF:** RF06, RF10.

## UC05 — Converter fração/decimal
Mostrar fração positiva → selecionar decimal correspondente → conferir e justificar a conversão. Priorizar decimais finitos nas questões iniciais; frações periódicas não podem ser apresentadas como decimal finito exato. **RF:** RF07, RF10.

## UC06 — Calcular fração de quantidade
Apresentar problema contextualizado com quantidade divisível no nível inicial → escolher resultado → conferir → explicar partição e multiplicação. Quantidade, vocabulário e dificuldade dependem de aprovação pedagógica. **RF:** RF08, RF10.

## UC07 — Somar/subtrair frações
Exibir operação com operandos positivos → representar partes → resolver com denominador comum quando necessário → conferir → explicar resultado e simplificar. O resultado de subtração pode ser negativo matematicamente; sua apresentação em atividade de estudante exige decisão pedagógica. Até essa decisão, testar o cálculo assinado no domínio, mas não incluir questão com resultado negativo no conteúdo MVP. **RF:** RF09, RF10.

## UC08 — Consultar progresso e revisar
Abrir progresso → visualizar tentativas por habilidade e critério de cálculo já aprovado → escolher resposta errada anterior → reabrir questão com enunciado e resposta esperada preservados → refazer → receber feedback e registrar nova tentativa sem apagar a anterior. Progresso deve estar disponível sem rede e sobreviver a encerramento normal e recuperação após fechamento inesperado. Distinguir estados vazio, carregando e erro; permitir repetir a operação que falhou sem descartar dados existentes. **RF:** RF11, RF12.

## UC09 — Diagnóstico (futuro; fora do MVP)
Responder questões curtas sem penalização → obter recomendação de mundo por regras documentadas. Não declarar diagnóstico validado cientificamente. **RF:** RF13, RF14.

## UC10 — Consultar trilha e abrir habilidade
Abrir início/trilha → visualizar objetivos identificados por habilidade EF06MA07–EF06MA10 → selecionar uma habilidade/atividade disponível → abrir o destino correspondente. O botão Voltar do Android retorna à tela anterior sem apagar estado ou salvar uma tentativa duplicada; na raiz, seu efeito precisa seguir decisão de navegação Android aprovada. Destinos, ordem, estados disponíveis e comportamento na raiz são dependências da decisão de UX/arquitetura. **RF:** RF01; RNF05.
