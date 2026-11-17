# Radio Button para resposta única (RadioButtonM3)

Origem: Herdado do Radio Button Material 3. Usado em comparação e em atividades de resposta única.

## Anatomia e comportamento

- Opção é uma linha inteira acionável, mínimo 48 dp; o protótipo usa 56 px de altura mínima.
- Círculo vazio usa `color.outline`; selecionado usa borda e ponto interno `color.action`.
- Texto da opção permanece visível e pode receber destaque `color.action` no estado selecionado.
- Agrupe opções com papel de radiogroup e rótulo ligado ao enunciado.
- Exatamente uma opção selecionada por grupo; as opções não executam a conferência.
- A seleção habilita uma única ação principal “Conferir resposta”.

## Estados

Padrão, hover, pressed, foco, selecionado e disabled herdam o Radio Button M3. Preserve a escolha após erro. Se a tarefa compara pizzas, as alternativas devem ser A, B e “As duas têm o mesmo tanto”; a resposta matemática e a justificativa vêm dos dados da atividade.

## Acessibilidade

Anuncie pergunta, rótulo, papel radio, posição/total quando disponível e estado selected. O foco percorre opções na ordem visual; a aparência selecionada não depende apenas de cor.
