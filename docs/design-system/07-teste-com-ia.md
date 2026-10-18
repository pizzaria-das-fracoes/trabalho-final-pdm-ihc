# Teste com IA


## Rodada 1

- **Ferramenta e modelo:** OpenAI Codex — modelo não identificado na interface.
- **Material entregue à IA:** somente `docs/design-system/`, como fonte exclusiva de decisões de design.
- **Prompt usado:**

> Crie uma proposta de especificação para a tela **Compare as pizzas** do aplicativo FatiaMática usando exclusivamente o sistema de design fornecido. Descreva a estrutura da tela e apresente um trecho TSX ilustrativo. Use somente tokens, componentes, padrões e regras documentados. Não invente valores, cores, espaçamentos, raios, componentes ou comportamentos que não estejam definidos. Quando alguma decisão necessária não estiver especificada no sistema de design, declare explicitamente a lacuna em vez de preenchê-la por conta própria.

- **Resultado:** Foi produzida uma proposta textual de especificação e um trecho TSX ilustrativo, apresentados na conversa. A especificação ficou parcial porque o mecanismo de resposta de “Compare as pizzas” não estava definido: não era possível determinar como o estudante escolheria uma fração e encaminharia essa escolha para conferência sem inventar comportamento. O TSX mostrou duas `PizzaFracao` visuais e `FeedbackAprendizagem`; não incluiu controles de resposta nem botão de conferência operacional. Foram declaradas as lacunas de composição, desenho interno, indicador de progresso e validação de acessibilidade. Não foi produzida imagem, implementação executável ou teste em aparelho.

| Verificação | Passou? | Observação |
| --- | --- | --- |
| Cores, espaços e raios vieram de tokens | Sim | A proposta usou somente tokens existentes; não definiu raios ou dimensões gráficas adicionais. |
| Todos os estados dos componentes foram respeitados | Sim | A proposta respeitou a variante visual da pizza e os estados não interativos do feedback. O resultado era parcial; essa avaliação documental não comprova estados em execução. |
| Alvos de toque e contraste respeitados | Não | Os requisitos foram preservados, mas faltavam definição dos controles de resposta, contraste gráfico das pizzas e validação dos alvos na implementação. Os pares textuais documentados não comprovam a acessibilidade integral da tela. |
| A IA não inventou valores | Sim | Não foram criados tokens, componentes, dimensões, cores ou regras de resposta; as decisões ausentes foram declaradas. |

## Desvios e correções na documentação

| Desvio | Causa (o que faltava ou estava ambíguo) | Arquivo corrigido |
| --- | --- | --- |
| Mecanismo de resposta indefinido | Não estava definido qual relação comparar nem como registrar a escolha. Foi acrescentada a variação para identificar a maior quantidade, selecionar uma opção e conferir a resposta. | `05-padroes.md` |
| Botões de resposta ambíguos | O inventário citava “botões de resposta”, sem distinguir a seleção da alternativa da ação principal de conferência. O inventário passou a indicar Radio Buttons Material 3 para seleção única; `Botao` “Conferir resposta” permanece como única ação principal e as fatias permanecem como representação visual. | `README.md`, `04-componentes/pizza-fracao.md` e `05-padroes.md` |
| Papel da `PizzaFracao` ambíguo entre atividades | A documentação não deixava explícita a diferença entre montagem da fração e comparação. Foi registrado que a montagem pode usar `PizzaFracao` interativa com controles equivalentes acessíveis de no mínimo 48 dp, enquanto “Compare as pizzas” usa pizzas estáticas e Radio Buttons Material 3, nunca as fatias, para selecionar a resposta. | `04-componentes/pizza-fracao.md` e `05-padroes.md` |
| Dimensões equivalentes dos inteiros insuficientemente explícitas | Foi adicionada a regra de representar os dois inteiros com dimensões equivalentes, sem usar diferença de tamanho para sugerir a maior fração. Não foi definido diâmetro literal. | `04-componentes/pizza-fracao.md` |
| Composição responsiva e texto ampliado sem regra específica | Foi documentado empilhamento quando a largura for insuficiente ou o texto estiver ampliado, preservando dimensões equivalentes e sem breakpoint numérico ou redução arbitrária. | `05-padroes.md` |
| Indicador de progresso previsto sem especificação | Foi declarado não obrigatório em “Compare as pizzas” e fora do recorte dessa tela no Design System v1.0.0; permanece no inventário, mas a IA não deve inventar sua especificação. | `05-padroes.md` |

As correções acima foram realizadas entre as rodadas. Após o teste, a geometria documental da `PizzaFracao` também foi fechada para a v1.0.0 com tokens próprios; a validação do contraste não textual em execução continua pertencendo à implementação Android. A herança Material 3 continuou sendo usada por referência, sem reproduzir ou inventar detalhes externos.

## Rodada 2

- **Tela testada:** a mesma tela **Compare as pizzas** da Rodada 1.
- **Instrução utilizada:** novamente, **“use exclusivamente o sistema de design fornecido”**, mantendo a exigência de usar somente tokens, componentes, padrões e regras documentados e de declarar lacunas sem preenchê-las arbitrariamente.
- **Resultado:** após as correções documentais, a IA identificou corretamente duas `PizzaFracao` estáticas com o mesmo `pizza.size`; identificou que as fatias não são opções de resposta; utilizou Radio Buttons Material 3 para seleção única; utilizou um único `Botao` com o rótulo “Conferir resposta”; preservou a seleção em tentativa incorreta; respeitou o alvo mínimo de `48 dp`; não reintroduziu a ambiguidade “botões de resposta”; não confundiu a variante interativa da `PizzaFracao`, usada em atividades de montagem, com a variante estática usada em “Compare as pizzas”; e não inventou valores para as lacunas que permaneceram sem definição.

### Trecho representativo

```tsx
<PizzaFracao
	totalSlices={option.denominator}
	selectedSlices={option.selectedSlices}
	accessibleSummary={option.accessibleSummary}
	appearance={{
		size: t["pizza.size"],
		selected: t["pizza.selected"],
		unselected: t["pizza.unselected"],
		separator: t["pizza.separator"],
		separatorWidth: t["pizza.separator-width"],
		summaryTypography: t["pizza.summary-font"],
		gap: t["pizza.gap"],
	}}
	// Representação estática; as fatias não são opções de resposta.
/>

<RadioButtonM3
	label={option.fractionLabel}
	selected={selectedOptionId === option.id}
	onPress={() => selecionarOpcao(option.id)}
	minTouchTarget="48dp"
/>

<Botao
	label="Conferir resposta"
	onPress={conferirResposta}
	appearance={{
		background: t["button.bg"],
		label: t["button.label"],
		shape: t["button.radius"],
		typography: t["button.font"],
	}}
/>
```

O trecho é representativo e não constitui implementação executável autossuficiente. A seleção incorreta permanece disponível para correção e nova conferência. O feedback continua textual, explicativo e anunciado como atualização não interruptiva.

### Limitações restantes de implementação

As limitações abaixo permanecem como decisões de implementação ainda não definidas e não representam falhas da Rodada 2:

- Biblioteca e API concreta dos Radio Buttons Material 3.
- Implementação gráfica da pizza.
- Integração real com TalkBack.
- Breakpoint numérico para a composição responsiva.
- Conversão técnica dos espaçamentos em `px`.
- Validação Android, incluindo integração real dos alvos, foco e contraste não textual.
