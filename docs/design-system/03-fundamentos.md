# Fundamentos


Base: Google Material Design 3, adaptada pela linguagem visual móvel de [`docs/oi.html`](../oi.html). As regras abaixo aplicam os tokens de [02-tokens.md](02-tokens.md). Herdado indica uma diretriz M3 mantida; Adaptado indica sua aplicação à marca e ao contexto educativo. Valores do palco desktop do HTML não definem dimensões fixas para a tela Android.

## Cor

- Use `color.action` somente para destacar a ação principal da tela. (Adaptado)
- Use `color.surface` como superfície principal e `color.on-surface` para o conteúdo sobre ela. (Herdado)
- Use `color.error` somente para estados de erro. (Herdado)
- Associe texto, ícone ou outra indicação perceptível à cor ao comunicar acerto, erro, seleção ou outro estado; nunca dependa somente da cor. (Herdado)
- Use somente as cores definidas em `02-tokens.md`; não introduza valores hexadecimais diretamente na interface. (Adaptado)
- Aplique a paleta do FatiaMática como adaptação de marca e preserve os papéis semânticos Material 3 documentados em `02-tokens.md`. (Adaptado)
- Use `color.surface-low` para agrupar catálogo e conteúdo secundário; reserve `color.surface` para a superfície principal do app.
- Use `color.accent-soft` para alvo da fração, chips de seleção e indicador da aba atual; mantenha `color.on-accent-soft` sobre esse fundo.
- Use `color.success` somente para acerto confirmado; erro usa superfície clara, borda/texto de erro e orientação. Não pinte progresso neutro como sucesso.
- Em dialogs e painel modal, aplique `color.scrim` e restaure o foco ao controle que abriu o painel.

## Tipografia

- Use `font.title` nos títulos de tela, conforme o estilo Material 3 title-large. (Herdado)
- Use `font.body` nos textos corridos, instruções e explicações, conforme o estilo Material 3 body-large. (Herdado)
- Use `font.label` nos rótulos de controles, conforme o estilo Material 3 label-large. (Herdado)
- Respeite a escala de fonte configurada pelo usuário no Android. (Herdado)
- Permita quebra de linha quando o texto aumentar; não reduza arbitrariamente a fonte para fazê-lo caber. (Herdado)
- Use `font.question`, `font.option`, `font.small`, `font.chip` e `font.helper` apenas nos usos definidos em `02-tokens.md`; todos devem respeitar escala de fonte.

## Espaçamento

- Preserve a grade do professor em múltiplos de 8 px; use 4 px apenas para ajustes finos, conforme os tokens existentes. (Adaptado)
- Use `space.md` como margem interna e lateral padrão das telas. (Adaptado)
- Use `space.sm` entre elementos diretamente relacionados. (Adaptado)
- Use `space.lg` para separar grupos distintos de conteúdo. (Adaptado)
- Use somente os tokens de espaçamento existentes; não crie valores intermediários. (Adaptado)

## Ícones

- Adote Material Symbols como conjunto de ícones, coerente com Material Design 3. (Herdado)
- Use ícones para apoiar compreensão e reconhecimento; evite decoração excessiva durante as atividades. (Adaptado)
- Forneça rótulo textual quando o significado do ícone não for evidente. (Herdado)
- Forneça rótulo acessível para ações representadas por ícones que precisem ser anunciadas por tecnologia assistiva. (Herdado)
- Acompanhe instruções importantes de texto; não use somente um ícone ambíguo. (Adaptado)
- Deixe a definição de tamanhos para a especificação dos componentes; não crie tokens de tamanho de ícones nesta etapa. (Adaptado)

## Elevação

- Use `elevation.card` somente quando o card precisar ser percebido como uma superfície elevada. (Herdado)
- Prefira organização por superfície, espaçamento ou borda quando a elevação não acrescentar hierarquia significativa. (Herdado)
- Use a representação Material 3 de `elevation.card` na plataforma; não invente sombras, offsets ou níveis de elevação fora dos tokens existentes. (Herdado)

## Movimento

- Use `motion.duration.short` para feedback breve de interação. (Herdado)
- Use `motion.duration.medium` para transições de contexto. (Herdado)
- Use `motion.easing.standard` nas mudanças simples previstas pelo sistema. (Herdado)
- Evite animações contínuas ou meramente decorativas durante a resolução das atividades. (Adaptado)
- Respeite a opção de redução de movimento do sistema; remova deslocamentos e transições decorativas sem remover informações ou feedback necessários. (Herdado)
- Mascote pode flutuar/piscar somente na entrada e início; pare o movimento durante a resolução e quando a redução de movimento estiver ativa.
- Celebração breve ocorre somente após resposta correta; erro pode ter retorno visual curto, sem tremer conteúdo essencial nem deslocar o foco.

## Composição mobile de referência

- Estruture as telas com área segura, cabeçalho persistente, conteúdo rolável e navegação inferior.
- Use toda a largura útil do dispositivo. A moldura de telefone e o painel lateral de marca do HTML pertencem à avaliação desktop do protótipo, não à tela Android.
- Cabeçalho identifica a tela e mantém apenas ações com nome e comportamento definidos. Não exiba som, tema ou painel de IHC enquanto seus controles não tiverem comportamento no app.
- Cards de atividade combinam mini pizza, título, descrição curta, chip de habilidade, estado e progresso disponível. O card inteiro é uma única ação.
- Em atividades, apresente enunciado, representação matemática e opções em hierarquia vertical; mantenha a ação principal após os controles.
- Use tokens locais de componentes descritos em `02-tokens.md`; não espalhe medidas CSS isoladas em telas.
