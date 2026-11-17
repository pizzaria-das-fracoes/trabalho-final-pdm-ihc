# Visualização da atividade (VisualizacaoAtividade)

Origem: Novo, componente pedagógico para associar cada objetivo a uma representação apropriada, demonstrado no protótipo móvel.

## Variantes

| Tipo | Representação esperada | Estado no app |
|---|---|---|
| Equivalência | Pizza de referência e opções com pizzas mini; notação ao lado | Implementado parcialmente |
| Comparação | Duas pizzas iguais, identificadas A/B, com notação e seleção por rádio A/B/= | Implementado parcialmente; opção “iguais” deve ser suportada antes de declarar cobertura completa |
| Reta numérica | Linha de 0 a 2, marcas numéricas e posição da fração | Representação inicial existente; validar proporção e escala |
| Decimal | Pizza/parte visual junto à notação decimal equivalente | Implementado parcialmente |
| Fração de quantidade | Inteiro dividido em grupos; agrupamentos destacados conforme o numerador | Representação inicial existente; validar correspondência de cada questão |
| Operações | Barras equivalentes com partes iguais, parcelas e resultado | Representação inicial existente; validar soma e subtração separadamente |

## Regras

- Use uma representação que mostre o conceito da questão; um `ActivityShell` textual genérico não substitui a visualização.
- Conteúdo e respostas vêm da atividade atual; não fixe resultados no componente visual.
- A visualização não é controle de seleção, a menos que a variante interativa esteja declarada e tenha controles acessíveis sincronizados.
- Texto associado deve explicar o que a figura representa. Não dependa só de formas, posição ou cor.
- Se o espaço ficar insuficiente, empilhe grupos e mantenha partes iguais; não comprima pizzas ou rótulos.
- Teste proporção/igualdade matemática dos segmentos em todos os casos permitidos antes de aprovar a atividade.
