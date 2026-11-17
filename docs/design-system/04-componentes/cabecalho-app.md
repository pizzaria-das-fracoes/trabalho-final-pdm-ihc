# Cabeçalho do app (CabecalhoApp)

Origem: Adaptado da estrutura mobile de `docs/oi.html` e da Top app bar Material 3. Esta é a faixa fixa no topo do app, não o título interno do conteúdo.

## Anatomia

1. Área segura superior e superfície `color.surface`.
2. Marca Pizza compacta, sem resumir fração quando usada como logo.
3. Título da tela com `font.title`, truncado somente após preservar o sentido; permita quebra quando o espaço pedir.
4. Ações opcionais à direita somente se existirem e tiverem rótulo acessível, estado anunciado e comportamento real. O HTML mostra som, tema e acessibilidade; no app, cada ação permanece ausente até ser implementada.
5. Divisor `color.outline-variant`; cabeçalho permanece fixo enquanto a tela rola.

## Estados e acessibilidade

- Título identifica a tela atual; no conteúdo, não repita o mesmo título se isso não apoiar a tarefa.
- Marca é anunciada como “FatiaMática” quando informativa e ocultada quando decorativa.
- Botões de ícone usam alvo mínimo de 48 dp, rótulo e `accessibilityState` quando alternáveis.
- Modo escuro resolve o mesmo contrato com a paleta escura. Tema e estado não podem depender só da cor.
- Preserve área segura, escala de texto e foco após ação.

## Implementação

Em app sem ação de voltar definida, mantenha cabeçalho simples com marca e título; não adicione botão inerte. Menu de tema/som/acessibilidade permanece proposto conforme `08-estado-e-evolucao.md`.
