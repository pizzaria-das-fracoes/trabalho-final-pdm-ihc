# Pizza de fração (PizzaFracao)

Origem no sistema base: Não existe componente equivalente no Google Material Design 3. Situação: **Novo**. Motivo: representar e manipular frações com partes iguais de uma pizza. Material 3 continua sendo a base de tipografia, controles, interação e acessibilidade; a geometria pedagógica é própria do FatiaMática.

Use os tokens de [02-tokens.md](../02-tokens.md) e as regras de [03-fundamentos.md](../03-fundamentos.md).

## Quando usar

- Use para relacionar numerador, denominador e partes iguais de um mesmo inteiro.
- Use a representação gráfica para denominadores de **2 a 8 partes iguais** nesta versão.
- Em atividades de montagem da fração, a `PizzaFracao` pode ser interativa; nesse caso, ative a seleção por controles textuais equivalentes acessíveis com alvo mínimo de 48 dp.
- Em “Compare as pizzas”, use duas representações visuais estáticas com o mesmo `pizza.size`; selecione a resposta exclusivamente por Radio Buttons Material 3, não pelas fatias.

## Quando não usar

- Não use para denominador menor que 2 ou maior que 8 na versão 1.0.0.
- Não use partes desiguais para representar um mesmo inteiro.
- Não transforme cunhas pequenas em único meio de interação.
- Não use a imagem como única fonte da informação.

## Anatomia

1. Inteiro circular: diâmetro `pizza.size`.
2. Partes iguais: divisões radiais de ângulos iguais, delimitadas por `pizza.separator` com `pizza.separator-width`.
3. Parte selecionada: `pizza.selected`; parte não selecionada: `pizza.unselected`.
4. Resumo numérico/textual: `pizza.summary-font`, `color.on-surface` e `pizza.gap`; derive o numerador da quantidade selecionada.
5. Interação alternativa: caixas de seleção Material 3, uma por parte, com alvo mínimo de 48 dp e rótulo “Fatia N de D”.
6. Estado selecionado nunca depende somente da cor: mantenha o resumo e o estado checked dos controles equivalentes sincronizados.

Em atividades de montagem da fração, os controles equivalentes permitem selecionar e deselecionar partes. Em “Compare as pizzas”, as duas pizzas são representações visuais estáticas, e a resposta é selecionada exclusivamente por Radio Buttons Material 3; as fatias não são opções de resposta.

## Variantes

| Variante | Uso | Tokens |
| --- | --- | --- |
| Representação visual | Exibir uma fração sem permitir mudanças | `pizza.size`, `pizza.selected`, `pizza.unselected`, `pizza.separator`, `pizza.separator-width`, `pizza.summary-font`, `pizza.gap` |
| Interativa com controles equivalentes | Selecionar/deselecionar partes sem exigir precisão motora nas cunhas | Tokens da variante visual + controles Material 3 herdados |

## Estados

| Estado | Aparência | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Padrão | Partes não selecionadas em `pizza.unselected`; separadores em `pizza.separator` | Exiba denominador e seleção recebidos. | Anuncie inteiro, denominador e numerador. |
| Hover | Não altera a pizza estática | Em controles textuais, herde hover M3 quando houver ponteiro. | Não revele informação apenas no hover. |
| Pressionado | Não altera a pizza estática | Na variante interativa, a ativação ocorre no controle textual equivalente. | Mantenha alvo mínimo de 48 dp. |
| Foco | A pizza estática não recebe foco acionável | Foco fica nos controles equivalentes e herda o tratamento M3. | Use uma parada por parte em ordem previsível. |
| Desabilitado | Mantenha a representação legível | Impeça mudanças nos controles equivalentes. | Anuncie indisponibilidade nos controles. |
| Selecionado | Parte usa `pizza.selected` e resumo é atualizado | Sincronize desenho, fração e controle checked. | Anuncie a mudança sem reler toda a tela. |
| Correto | Preserve a representação confirmada | Associe `FeedbackAprendizagem`. | Explique por texto; não dependa de cor. |
| Incorreto | Preserve a tentativa | Permita correção conforme a atividade. | Oriente sem retirar foco inesperadamente. |

## Acessibilidade

- Na variante visual, anuncie resumo como “Pizza dividida em quatro partes iguais, três selecionadas, fração três quartos” e oculte detalhes gráficos redundantes do leitor de tela.
- Na variante interativa, ofereça controles como “Fatia 1 de 4”, com papel de caixa de seleção e estado checked.
- Garanta pelo menos 48 dp por controle textual. As cunhas da pizza não são o único alvo acionável.
- Para escolher entre duas frações, use radio buttons Material 3 com seleção única; não use as fatias como opções.
- Preserve texto ampliado e mantenha resumo, representação e controles sincronizados.
- `pizza.selected` e `pizza.separator` devem ser validados como contraste não textual na implementação; a seleção continua compreensível pelo resumo e pelos controles mesmo sem cor.

## Faça e evite

- **Faça:** Mantenha partes geometricamente iguais e represente a mesma fração também em texto.
- **Evite:** Não use pizzas de tamanhos diferentes numa comparação nem exija toque preciso em cunhas pequenas.

**Decisões fechadas na v1.0.0:** diâmetro padrão de 176 dp, separador de 2 dp, denominadores de 2 a 8, partes selecionadas/não selecionadas resolvidas pelos tokens `pizza.*` e interação por controles equivalentes de pelo menos 48 dp. Variações futuras devem ser registradas em nova versão do Design System.

## Código

Trecho ilustrativo de contrato TSX, sem implementação, imports ou biblioteca escolhida. `t` representa os tokens existentes já resolvidos para o tema.

```tsx
<PizzaFracao
  totalSlices={4}
  selectedSlices={[1, 2, 3]}
  interactive
  onToggleSlice={alternarParte}
  accessibleSummary="Pizza dividida em quatro partes iguais, três selecionadas, fração três quartos."
  interactionMode="textual-controls"
  appearance={{
    size: t["pizza.size"],
    selected: t["pizza.selected"],
    unselected: t["pizza.unselected"],
    separator: t["pizza.separator"],
    separatorWidth: t["pizza.separator-width"],
    summaryTypography: t["pizza.summary-font"],
    gap: t["pizza.gap"],
  }}
/>
```
