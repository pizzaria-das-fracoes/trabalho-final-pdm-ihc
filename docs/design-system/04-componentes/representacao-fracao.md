# Representação numérica da fração (RepresentacaoFracao)

Origem: Adaptado de convenções tipográficas M3 para apresentar numerador, barra e denominador ao lado da PizzaFracao.

## Anatomia

1. Numerador acima da barra; denominador abaixo.
2. Barra horizontal com largura suficiente para os dois números e contraste `color.on-surface`.
3. Tamanho `font.fraction`; quebras e escala de fonte devem expandir o componente.
4. Em variante acessível, rotule numerador e denominador, além do anúncio completo da fração.

## Variantes

| Variante | Uso | Regras |
|---|---|---|
| Alvo | Enunciado “Pinte para mostrar” | Fração em `color.accent-soft` com `color.on-accent-soft` |
| Resumo | Resultado da seleção | Fração sincronizada com a pizza e controles; pode incluir rótulos numerador/denominador |
| Comparação | Fração A/B | Mesmo tamanho e alinhamento para as duas quantidades |
| Decimal | Fração relacionada ao decimal | Símbolo de igualdade, texto legível e pizza de referência |

Não simplifique ou altere valores no componente visual. A transformação matemática vem do conteúdo/Use Case. Não anuncie apenas caracteres posicionais; tecnologias assistivas recebem uma frase inteira.
