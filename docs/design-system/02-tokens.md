# Tokens


Base exclusiva: **Google Material Design 3**. Referência técnica: tokens M3 v0.192 do repositório oficial Material Web. Este recorte usa duração/easing do M3, anterior ao movimento por física do M3 Expressive; não mistura as duas versões. Não pressupõe implementação do aplicativo.

Referências oficiais: [tipografia][type], [formas][shape], [elevação][elevation], [movimento][motion], [estados][state], [cores][colors] e [botão preenchido][button]. As etiquetas classificam a decisão, não a simples existência de um nome local. A paleta é uma adaptação para o FatiaMática, escolhida e medida nesta etapa; não é uma paleta oficial nem um resultado atribuído ao Material Theme Builder.

## 1. Primitivos (o valor bruto)

### Cor

Laranja queimado nas ações remete à pizza; neutros quentes mantêm o foco no conteúdo. Acerto, erro e seleção também exigem texto e sinais além da cor. Os nomes identificam amostras locais, sem alegar uma escala tonal HCT completa.

| Token | Valor | Origem |
| --- | --- | --- |
| `orange-action-light` | `#8C3900` | Adaptado |
| `orange-action-dark` | `#FFB68A` | Adaptado |
| `orange-ink-dark` | `#512000` | Adaptado |
| `neutral-0` | `#FFFFFF` | Herdado |
| `neutral-surface-light` | `#FFF8F4` | Adaptado |
| `neutral-surface-dark` | `#1B120D` | Adaptado |
| `neutral-ink-light` | `#241A14` | Adaptado |
| `neutral-ink-dark` | `#F1DFD4` | Adaptado |
| `red-error-light` | `#B3261E` | Herdado |
| `red-error-dark` | `#F2B8B5` | Herdado |
| `red-ink-dark` | `#601410` | Herdado |

As três amostras de erro correspondem a error claro/escuro e on-error escuro do esquema de referência M3. O primitivo branco é Herdado, pois seu valor não foi alterado; a combinação com as cores da marca é Adaptada. O azul do template e `neutral-900` foram substituídos; não são cores obrigatórias.

### Espaço (grade de 8 pontos: múltiplos de 8, ou de 4 para ajustes finos)

| Token | Valor | Origem |
| --- | --- | --- |
| `space-4` | 4 px | Adaptado |
| `space-8` | 8 px | Adaptado |
| `space-16` | 16 px | Adaptado |
| `space-24` | 24 px | Adaptado |
| `space-32` | 32 px | Adaptado |

Valores preservados do template acadêmico e incorporados ao Fatia Design System como sua escala local de espaçamento (Adaptado), sem alegar herança direta de tokens específicos do Material 3. A classificação abrange os primitivos e seus aliases semânticos. A unidade definitiva depende da expectativa do professor; mantenha px, sem conversão para dp. Não foram acrescentados tokens de espaçamento.

Os demais valores brutos necessários às tabelas seguintes também pertencem ao nível primitivo:

| Token | Valor | Origem |
| --- | --- | --- |
| `type.family` | Roboto | Herdado |
| `type.size.title` | 22 px | Herdado |
| `type.size.body` | 16 px | Herdado |
| `type.size.label` | 14 px | Herdado |
| `type.line.title` | 28 px | Herdado |
| `type.line.body` | 24 px | Herdado |
| `type.line.label` | 20 px | Herdado |
| `type.weight.regular` | 400 (adimensional) | Herdado |
| `type.weight.medium` | 500 (adimensional) | Herdado |
| `type.tracking.title` | 0 px | Herdado |
| `type.tracking.body` | 0,5 px | Herdado |
| `type.tracking.label` | 0,1 px | Herdado |
| `shape.medium` | 12 px | Herdado |
| `shape.full` | 9999 px (representação Material Web de corner-full) | Herdado |
| `depth.level1` | 1 dp | Herdado |
| `duration.short2` | 100 ms | Herdado |
| `duration.medium2` | 300 ms | Herdado |
| `easing.standard` | cubic-bezier(0.2, 0, 0, 1), coordenadas adimensionais | Herdado |
| `opacity.hover` | 8% | Herdado |
| `opacity.pressed` | 12% | Herdado |
| `opacity.focus` | 12% | Herdado |
| `opacity.disabled-container` | 12% | Herdado |
| `opacity.disabled-label` | 38% | Herdado |

Tipografia e forma seguem Material Web em px (tipografia convertida de rem com base documental de 16 px), sem converter espaçamento. No aplicativo futuro, texto deve respeitar ampliação do sistema; px aqui não significa bloquear essa ampliação. Elevação é profundidade conceitual em dp, não um valor CSS de sombra. `shape.full` representa uma cápsula: na plataforma futura, resolver corner-full com base na geometria do controle, sem tratar 9999 px como espaçamento ou dimensão física obrigatória.

## 2. Semânticos (o significado)

### Cor

| Token | Claro | Escuro | Uso | Origem |
| --- | --- | --- | --- | --- |
| `color.action` | `orange-action-light` | `orange-action-dark` | Ação principal; papel M3 primary com nome do template | Adaptado |
| `color.on-action` | `neutral-0` | `orange-ink-dark` | Texto e ícone sobre `color.action`; papel on-primary | Adaptado |
| `color.surface` | `neutral-surface-light` | `neutral-surface-dark` | Fundo das telas e superfície de referência | Adaptado |
| `color.on-surface` | `neutral-ink-light` | `neutral-ink-dark` | Texto sobre `color.surface` | Adaptado |
| `color.error` | `red-error-light` | `red-error-dark` | Texto/ícone de erro na superfície ou fundo de erro | Herdado |
| `color.on-error` | `neutral-0` | `red-ink-dark` | Texto sobre `color.error` | Herdado |
| `color.focus` | `orange-action-light` | `orange-action-dark` | Cor local de referência para foco; geometria herdada do componente Material 3 correspondente | Adaptado |
| `color.action-hover` | composição de `color.on-action`, `state.hover-opacity` sobre `color.action` | mesma fórmula com valores escuros | Fundo com hover | Herdado |
| `color.action-pressed` | composição de `color.on-action`, `state.pressed-opacity` sobre `color.action` | mesma fórmula com valores escuros | Fundo pressionado | Herdado |
| `color.action-focused` | composição de `color.on-action`, `state.focus-opacity` sobre `color.action` | mesma fórmula com valores escuros | Fundo com foco | Herdado |
| `color.disabled-bg` | composição de `color.on-surface`, `state.disabled-container-opacity` sobre `color.surface` | mesma fórmula com valores escuros | Fundo inativo, somente sobre a superfície documentada | Herdado |
| `color.on-disabled` | composição de `color.on-surface`, `state.disabled-label-opacity` sobre `color.disabled-bg` | mesma fórmula com valores escuros | Cor resolvida do rótulo inativo a 38% | Herdado |

Composição sRGB por canal: resultado = alfa × primeiro plano + (1 − alfa) × fundo; arredondar cada canal ao inteiro mais próximo. Hover, pressed, focus e disabled têm comportamento Herdado do M3; as cores da marca aplicadas a essas regras continuam Adaptadas. Disabled usa `on-surface` a 12% no container e a 38% no label, este sobre o container resolvido. `color.on-disabled` já representa essa composição: não reaplicar a opacidade de 38%. Desabilitado também exige estado semântico e ausência de interação.

Contrastes calculados pela [fórmula WCAG][contrast]: canais sRGB normalizados são linearizados por c/12,92 se c ≤ 0,04045, ou ((c + 0,055)/1,055)^2,4. L = 0,2126R + 0,7152G + 0,0722B; razão = (L maior + 0,05)/(L menor + 0,05). Arredondamento somente para exibição; aprovação usa resultado integral. São medições de cores, não testes em aparelho.

| Par (texto ou contorno / fundo) | Modo | Cores resolvidas | Razão | Resultado |
| --- | --- | --- | --- | --- |
| `on-action / action` | Claro | `#FFFFFF` / `#8C3900` | 7.78:1 | Aprovado (≥ 4,5:1) |
| `on-surface / surface` | Claro | `#241A14` / `#FFF8F4` | 16.21:1 | Aprovado (≥ 4,5:1) |
| `error / surface` | Claro | `#B3261E` / `#FFF8F4` | 6.22:1 | Aprovado (≥ 4,5:1) |
| `on-error / error` | Claro | `#FFFFFF` / `#B3261E` | 6.54:1 | Aprovado (≥ 4,5:1) |
| `focus / surface` | Claro | `#8C3900` / `#FFF8F4` | 7.40:1 | Aprovado (≥ 4,5:1) |
| `button.label / action-hover` | Claro | `#FFFFFF` / `#954914` | 6.48:1 | Aprovado (≥ 4,5:1) |
| `button.label / action-pressed` | Claro | `#FFFFFF` / `#9A511F` | 5.88:1 | Aprovado (≥ 4,5:1) |
| `button.label / action-focused` | Claro | `#FFFFFF` / `#9A511F` | 5.88:1 | Aprovado (≥ 4,5:1) |
| `on-disabled / disabled-bg` | Claro | `#9C938E` / `#E5DDD9` | 2.25:1 | Inferior a 4,5:1; exceção WCAG para controle inativo |
| `on-action / action` | Escuro | `#512000` / `#FFB68A` | 7.91:1 | Aprovado (≥ 4,5:1) |
| `on-surface / surface` | Escuro | `#F1DFD4` / `#1B120D` | 14.26:1 | Aprovado (≥ 4,5:1) |
| `error / surface` | Escuro | `#F2B8B5` / `#1B120D` | 10.80:1 | Aprovado (≥ 4,5:1) |
| `on-error / error` | Escuro | `#601410` / `#F2B8B5` | 7.66:1 | Aprovado (≥ 4,5:1) |
| `focus / surface` | Escuro | `#FFB68A` / `#1B120D` | 10.81:1 | Aprovado (≥ 4,5:1) |
| `button.label / action-hover` | Escuro | `#512000` / `#F1AA7F` | 6.94:1 | Aprovado (≥ 4,5:1) |
| `button.label / action-pressed` | Escuro | `#512000` / `#EAA479` | 6.48:1 | Aprovado (≥ 4,5:1) |
| `button.label / action-focused` | Escuro | `#512000` / `#EAA479` | 6.48:1 | Aprovado (≥ 4,5:1) |
| `on-disabled / disabled-bg` | Escuro | `#7C6F68` / `#352B25` | 2.84:1 | Inferior a 4,5:1; exceção WCAG para controle inativo |

Foco visível continua obrigatório. A medição de `color.focus` contra `color.surface` verifica somente esse par de cores; não aprova um contorno externo personalizado. A geometria e a solução específica de foco serão definidas em `04-componentes/` e `06-acessibilidade.md`. Outros fundos exigem nova medição.

Os pares disabled abaixo de 4,5:1 são registrados sem alegar aprovação nesse limite. Controles inativos são exceção ao requisito de contraste textual WCAG 1.4.3; o estado deve continuar identificável e não pode ocultar informação necessária para compreender a atividade.

### Tipografia

| Token | Família | Tamanho | Peso | Altura de linha | Uso | Origem |
| --- | --- | --- | --- | --- | --- | --- |
| `font.title` | `type.family` | `type.size.title` (22 px) | `type.weight.regular` (400) | `type.line.title` (28 px) | Títulos de tela; M3 title-large | Herdado |
| `font.body` | `type.family` | `type.size.body` (16 px) | `type.weight.regular` (400) | `type.line.body` (24 px) | Texto corrido; M3 body-large | Herdado |
| `font.label` | `type.family` | `type.size.label` (14 px) | `type.weight.medium` (500) | `type.line.label` (20 px) | Rótulos de botão e campo; M3 label-large | Herdado |

Recorte da escala M3, não a escala completa. Tracking: título → `type.tracking.title`, corpo → `type.tracking.body`, rótulo → `type.tracking.label`. Permitir quebra de linha e ampliação, sem diminuir texto para acomodar conteúdo.

### Espaço, forma e elevação

| Token | Valor | Uso | Origem |
| --- | --- | --- | --- |
| `space.sm` | `space-8` | Espaço entre elementos relacionados | Adaptado |
| `space.md` | `space-16` | Margem interna padrão | Adaptado |
| `space.lg` | `space-24` | Separação entre grupos | Adaptado |
| `radius.md` | `shape.medium` (12 px) | Forma corner-medium para cards; não impõe forma a campos | Herdado |
| `radius.lg` | `shape.medium` (12 px) | Alias preservado do template para cards; o nome lg não indica outro valor nesta versão | Herdado |
| `radius.full` | `shape.full` | Forma corner-full do botão principal preenchido | Herdado |
| `elevation.card` | `depth.level1` (1 dp) | Card elevado em repouso; M3 level1 | Herdado |

Botão preenchido herda corner-full e cards herdam corner-medium (12 px) do M3 ([card elevado][card]). Os aliases `radius.md` e `radius.lg` são preservados, mas nenhum deles determina a forma dos campos: isso será decidido no arquivo de componentes conforme a variante Material 3 escolhida. Elevação não define sozinha uma sombra: usar representação de level1 da plataforma, sem inventar offsets; a legibilidade não pode depender da sombra.

### Movimento

| Token | Valor | Uso | Origem |
| --- | --- | --- | --- |
| `motion.duration.short` | `duration.short2` (100 ms) | Feedback de toque | Herdado |
| `motion.duration.medium` | `duration.medium2` (300 ms) | Transições de contexto | Herdado |
| `motion.easing.standard` | `easing.standard` | Curva padrão de estados e mudanças simples | Herdado |

Valores do modelo M3 de easing/duração citado, sem alegar serem a recomendação mais recente de física do Expressive. Redução de movimento elimina deslocamentos e transições decorativas, mantendo feedback textual e estado final imediatamente disponíveis. Não animar fatias continuamente durante a resolução.

| Token | Valor | Uso | Origem |
| --- | --- | --- | --- |
| `state.hover-opacity` | `opacity.hover` | Camada sob o rótulo no hover | Herdado |
| `state.pressed-opacity` | `opacity.pressed` | Camada sob o rótulo ao pressionar | Herdado |
| `state.focus-opacity` | `opacity.focus` | Camada sob o rótulo com foco | Herdado |
| `state.disabled-container-opacity` | `opacity.disabled-container` | Composição do fundo inativo | Herdado |
| `state.disabled-label-opacity` | `opacity.disabled-label` | Composição do rótulo inativo | Herdado |

## 3. Tokens de componente (onde é usado)

Contrato inicial de tokens para o botão principal preenchido, sem declarar concluída a especificação do componente. Valores visuais apontam somente para o nível semântico.

| Token | Aponta para | Origem |
| --- | --- | --- |
| `button.bg` | `color.action` | Adaptado |
| `button.label` | `color.on-action` | Adaptado |
| `button.radius` | `radius.full` | Herdado |
| `button.bg-hover` | `color.action-hover` | Herdado |
| `button.bg-pressed` | `color.action-pressed` | Herdado |
| `button.bg-disabled` | `color.disabled-bg` | Herdado |
| `button.bg-focused` | `color.action-focused` | Herdado |
| `button.label-disabled` | `color.on-disabled` | Herdado |
| `button.font` | `font.label` | Herdado |

Nas linhas de estado, Herdado classifica a regra de interação/composição; não muda a classificação Adaptada da paleta. Hover só se aplica com ponteiro. Pressionado e foco mantêm `button.label` opaco; desabilitado usa `button.label-disabled`, que já resolve o label a 38%. A geometria de foco é herdada do componente Material 3 correspondente; `color.focus` é a referência cromática local quando houver mapeamento aprovado. Alvo mínimo aprovado: 48 dp, independentemente do espaçamento em px.

### PizzaFracao

Tokens **Novos** do componente pedagógico `PizzaFracao`. Eles fecham a representação gráfica usada na versão 1.0.0 sem transformar as fatias em alvos de toque: a interação é feita por controles textuais equivalentes de pelo menos 48 dp.

| Token | Valor / aponta para | Uso | Origem |
| --- | --- | --- | --- |
| `pizza.size` | `176 dp` | Diâmetro padrão da representação | Novo |
| `pizza.separator-width` | `2 dp` | Separação visível entre partes iguais | Novo |
| `pizza.selected` | `color.action` | Preenchimento de parte selecionada | Novo |
| `pizza.unselected` | `color.surface` | Preenchimento de parte não selecionada | Novo |
| `pizza.separator` | `color.on-surface` | Linha que delimita partes | Novo |
| `pizza.summary-font` | `font.body` | Resumo textual da fração | Novo |
| `pizza.gap` | `space.sm` | Distância entre representação e resumo | Novo |

O uso de `color.action` como valor de `pizza.selected` compartilha a cor de marca, mas mantém papéis semânticos diferentes: código de componente deve referenciar `pizza.selected`, não `color.action`. A seleção nunca é comunicada somente pela cor: o resumo textual e os controles equivalentes permanecem obrigatórios. O diâmetro é da representação, não do alvo de toque.

## 4. Modo escuro

Todos os tokens semânticos de cor mudam de valor ou são recalculados com os valores escuros. A ação passa a laranja claro com texto marrom escuro; a superfície passa a marrom quase preto com texto claro. Erro e foco usam os pares escuros. Não inverter cores automaticamente nem aplicar filtro na tela.

Tipografia, espaçamento, raios, profundidade e movimento permanecem iguais. A representação da elevação deve respeitar o tema da plataforma. Tokens de componente conservam seus aliases: apenas a resolução semântica muda. Novos fundos, transparências ou cores pedagógicas exigem medição antes do uso. Os contrastes acima não substituem validação futura de TalkBack, foco, texto ampliado ou uso em aparelho.

## 5. (Bônus) Versão legível por máquina


Não incluída nesta versão: seção opcional. As tabelas são a fonte documental; não há estrutura paralela ou código do aplicativo.

[type]: https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-typescale.scss
[shape]: https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-shape.scss
[elevation]: https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-elevation.scss
[motion]: https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-motion.scss
[state]: https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-state.scss
[button]: https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-filled-button.scss
[colors]: https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-color.scss
[contrast]: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
[card]: https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-elevated-card.scss
