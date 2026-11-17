# Tokens


Base: **Google Material Design 3**, adaptada pela identidade e pelos valores locais demonstrados em [`docs/oi.html`](../oi.html). Referência técnica: tokens M3 v0.192 do repositório oficial Material Web. Este recorte usa duração/easing do M3, anterior ao movimento por física do M3 Expressive; não mistura as duas versões. Valores extraídos do protótipo descrevem a referência visual; não comprovam sua validação no app Android.

Referências oficiais: [tipografia][type], [formas][shape], [elevação][elevation], [movimento][motion], [estados][state], [cores][colors] e [botão preenchido][button]. As etiquetas classificam a decisão, não a simples existência de um nome local. A paleta é uma adaptação para o FatiaMática, escolhida e medida nesta etapa; não é uma paleta oficial nem um resultado atribuído ao Material Theme Builder.

## 1. Primitivos (o valor bruto)

### Cor

Laranja queimado nas ações remete à pizza; neutros quentes mantêm o foco no conteúdo. Acerto, erro e seleção também exigem texto e sinais além da cor. Os nomes identificam amostras locais, sem alegar uma escala tonal HCT completa.

#### Cores de ação e neutros

| Token | Valor | Origem |
| --- | --- | --- |
| `orange-action-light` | `#8C3900` | Adaptado |
| `orange-action-dark` | `#FFB68A` | Adaptado |
| `orange-ink-dark` | `#512000` | Adaptado |
| `orange-hover-light` | `#954914` | Adaptado |
| `orange-pressed-light` | `#9A511F` | Adaptado |
| `orange-hover-dark` | `#F1AA7F` | Adaptado |
| `orange-pressed-dark` | `#EAA479` | Adaptado |
| `neutral-0` | `#FFFFFF` | Herdado |
| `neutral-surface-light` | `#FFF8F4` | Adaptado |
| `neutral-surface-low-light` | `#F4EDE9` | Adaptado |
| `neutral-surface-mid-light` | `#EDE6E2` | Adaptado |
| `neutral-surface-high-light` | `#E7E0DB` | Adaptado |
| `neutral-surface-dark` | `#1B120D` | Adaptado |
| `neutral-surface-low-dark` | `#261C17` | Adaptado |
| `neutral-surface-mid-dark` | `#2C221D` | Adaptado |
| `neutral-surface-high-dark` | `#322823` | Adaptado |
| `neutral-ink-light` | `#241A14` | Adaptado |
| `neutral-ink-dark` | `#F1DFD4` | Adaptado |
| `neutral-outline-light` | `#867E79` | Adaptado |
| `neutral-outline-dark` | `#90827A` | Adaptado |
| `neutral-outline-variant-light` | `#E5DDD9` | Adaptado |
| `neutral-outline-variant-dark` | `#352B25` | Adaptado |
| `neutral-disabled-bg-light` | `#E5DDD9` | Adaptado |
| `neutral-disabled-bg-dark` | `#352B25` | Adaptado |
| `neutral-disabled-label-light` | `#9C938E` | Adaptado |
| `neutral-disabled-label-dark` | `#7C6F68` | Adaptado |

#### Cores de erro

| Token | Valor | Origem |
| --- | --- | --- |
| `red-error-light` | `#B3261E` | Herdado |
| `red-error-dark` | `#F2B8B5` | Herdado |
| `red-ink-dark` | `#601410` | Herdado |

#### Cores de acerto/sucesso (Novas)

Usadas no feedback de acerto, barra de domínio e chip de habilidade `compare`. Não existem no esquema M3 padrão; criadas para distinguir sucesso pedagógico da ação de marca sem reutilizar o laranja.

| Token | Valor | Origem |
| --- | --- | --- |
| `green-success-light` | `#3F8067` | Novo |
| `green-on-success-light` | `#FFFFFF` | Novo |
| `green-success-ink-light` | `#2E5F4B` | Novo |
| `green-success-soft-light` | `#E4E7E0` | Novo |
| `green-success-dark` | `#7FC79A` | Novo |
| `green-on-success-dark` | `#0E2A1B` | Novo |
| `green-success-ink-dark` | `#9AD8AE` | Novo |
| `green-success-soft-dark` | `#292B21` | Novo |

#### Cores de destaque/queijo (Novas)

Amarelo queijo remete ao topping da pizza. Usado em chips de fatia ganhas, card de alvo, barra de estrelas e indicador de navegação ativo. Mantém o laranja como ação principal; o amarelo é destaque secundário.

| Token | Valor | Origem |
| --- | --- | --- |
| `yellow-accent-light` | `#F5B544` | Novo |
| `yellow-on-accent-light` | `#241A14` | Novo |
| `yellow-accent-soft-light` | `#FDE9CD` | Novo |
| `yellow-on-accent-soft-light` | `#8C3900` | Novo |
| `yellow-accent-dark` | `#F5C56B` | Novo |
| `yellow-on-accent-dark` | `#3A2A00` | Novo |
| `yellow-accent-soft-dark` | `#3E2F1C` | Novo |
| `yellow-on-accent-soft-dark` | `#F5C56B` | Novo |

#### Cores de informação (Novas)

Azul informativo para dicas, chip `equiv` e rótulos de comparação. Separa "informação neutra" de "acerto" (verde) e "ação" (laranja).

| Token | Valor | Origem |
| --- | --- | --- |
| `blue-info-light` | `#47599E` | Novo |
| `blue-on-info-light` | `#FFFFFF` | Novo |
| `blue-info-soft-light` | `#E2E6F4` | Novo |
| `blue-info-dark` | `#A9B8F7` | Novo |
| `blue-on-info-dark` | `#141F45` | Novo |
| `blue-info-soft-dark` | `#26283A` | Novo |

#### Cores da pizza — componente PizzaFracao (Novas)

Paleta interna ao componente pedagógico. `pizza-crust` é a cor da borda/crosta; `pizza-topping` é o fundo dos ingredientes; `avatar-eye` é o branco dos olhos dos avatares-personagem.

| Token | Valor | Uso | Origem |
| --- | --- | --- | --- |
| `pizza-crust-light` | `#C77E1F` | Crosta (borda circular) da pizza | Novo |
| `pizza-crust-dark` | `#C98A2E` | Crosta no modo escuro | Novo |
| `pizza-topping-light` | `#FFF3E6` | Fundo dos ingredientes/toppings SVG | Novo |
| `pizza-topping-dark` | `#512000` | Fundo dos ingredientes no modo escuro | Novo |
| `avatar-eye` | `#FFFFFF` claro / `#F1DFD4` escuro | Olhos dos avatares-personagem | Novo |

As três amostras de erro correspondem a error claro/escuro e on-error escuro do esquema de referência M3. O azul do template e `neutral-900` foram substituídos; não são cores obrigatórias. As novas famílias de cor (success, accent, info, pizza) são extensões criadas para o FatiaMática; nenhuma alega ser uma família tonal HCT completa.

### Espaço (grade de 8 pontos: múltiplos de 8, ou de 4 para ajustes finos)

| Token | Valor | Origem |
| --- | --- | --- |
| `space-4` | 4 px | Adaptado |
| `space-8` | 8 px | Adaptado |
| `space-16` | 16 px | Adaptado |
| `space-24` | 24 px | Adaptado |
| `space-32` | 32 px | Adaptado |

Valores preservados do template acadêmico e incorporados ao Fatia Design System como sua escala local de espaçamento (Adaptado), sem alegar herança direta de tokens específicos do Material 3. A classificação abrange os primitivos e seus aliases semânticos. A unidade definitiva depende da expectativa do professor; mantenha px, sem conversão para dp. Não foram acrescentados tokens de espaçamento.

O primitivo branco é Herdado, pois seu valor não foi alterado; as combinações com as cores da marca são Adaptadas. Os demais valores brutos necessários às tabelas seguintes também pertencem ao nível primitivo:

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
| `shape.large` | 16 px | Adaptado |
| `shape.extra-large` | 28 px | Adaptado |
| `shape.full` | 9999 px (representação Material Web de corner-full) | Herdado |
| `shape.extra-small` | 4 px | Adaptado |
| `depth.level1` | 1 dp | Herdado |
| `depth.level2` | 2 dp | Herdado |
| `depth.level3` | 3 dp | Herdado |
| `duration.short2` | 100 ms | Herdado |
| `duration.medium2` | 300 ms | Herdado |
| `duration.long1` | 600 ms | Adaptado |
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
| `color.surface-low` | `neutral-surface-low-light` | `neutral-surface-low-dark` | Superfície ligeiramente rebaixada (fundo de cards, listas) | Adaptado |
| `color.surface-mid` | `neutral-surface-mid-light` | `neutral-surface-mid-dark` | Superfície hover e nav bar | Adaptado |
| `color.surface-high` | `neutral-surface-high-light` | `neutral-surface-high-dark` | Superfície pressionada, fundos de dialog | Adaptado |
| `color.on-surface` | `neutral-ink-light` | `neutral-ink-dark` | Texto sobre `color.surface` | Adaptado |
| `color.outline` | `neutral-outline-light` | `neutral-outline-dark` | Bordas de campos, chips e separadores | Adaptado |
| `color.outline-variant` | `neutral-outline-variant-light` | `neutral-outline-variant-dark` | Bordas sutis de cards e divisórias | Adaptado |
| `color.error` | `red-error-light` | `red-error-dark` | Texto/ícone de erro na superfície ou fundo de erro | Herdado |
| `color.on-error` | `neutral-0` | `red-ink-dark` | Texto sobre `color.error` | Herdado |
| `color.success` | `green-success-light` | `green-success-dark` | Fundo do feedback de acerto e barra dominada | Novo |
| `color.on-success` | `green-on-success-light` | `green-on-success-dark` | Texto sobre `color.success` | Novo |
| `color.success-ink` | `green-success-ink-light` | `green-success-ink-dark` | Texto de sucesso sobre superfície clara | Novo |
| `color.success-soft` | `green-success-soft-light` | `green-success-soft-dark` | Fundo suave de chips e cards de sucesso | Novo |
| `color.accent` | `yellow-accent-light` | `yellow-accent-dark` | Estrelas, chips de fatia e ativo de navegação | Novo |
| `color.on-accent` | `yellow-on-accent-light` | `yellow-on-accent-dark` | Texto sobre `color.accent` | Novo |
| `color.accent-soft` | `yellow-accent-soft-light` | `yellow-accent-soft-dark` | Fundo de card de alvo, chips de fatias ganhas | Novo |
| `color.on-accent-soft` | `yellow-on-accent-soft-light` | `yellow-on-accent-soft-dark` | Texto sobre `color.accent-soft` | Novo |
| `color.info` | `blue-info-light` | `blue-info-dark` | Cor de dicas e chip de frações equivalentes | Novo |
| `color.on-info` | `blue-on-info-light` | `blue-on-info-dark` | Texto sobre `color.info` | Novo |
| `color.info-soft` | `blue-info-soft-light` | `blue-info-soft-dark` | Fundo de blocos de dica e rótulos de comparação | Novo |
| `color.focus` | `orange-action-light` | `orange-action-dark` | Cor local de foco; no protótipo web o anel usa 3 px e offset de 2 px; no Android respeite foco acessível da plataforma | Adaptado |
| `color.scrim` | `rgba(36,26,20,0.4)` | `rgba(0,0,0,0.6)` | Fundo de diálogo e painel modal | Adaptado |
| `color.action-hover` | `orange-hover-light` sobre `color.action` | `orange-hover-dark` sobre `color.action` | Fundo com hover | Herdado |
| `color.action-pressed` | `orange-pressed-light` sobre `color.action` | `orange-pressed-dark` sobre `color.action` | Fundo pressionado | Herdado |
| `color.action-focused` | composição de `color.on-action`, `state.focus-opacity` sobre `color.action` | mesma fórmula com valores escuros | Fundo com foco | Herdado |
| `color.disabled-bg` | `neutral-disabled-bg-light` | `neutral-disabled-bg-dark` | Fundo inativo | Herdado |
| `color.on-disabled` | `neutral-disabled-label-light` | `neutral-disabled-label-dark` | Rótulo inativo (38%) | Herdado |

Composição sRGB por canal: resultado = alfa × primeiro plano + (1 − alfa) × fundo; arredondar cada canal ao inteiro mais próximo. Hover, pressed, focus e disabled têm comportamento Herdado do M3; as cores da marca aplicadas a essas regras continuam Adaptadas. Disabled usa `on-surface` a 12% no container e a 38% no label, este sobre o container resolvido. `color.on-disabled` já representa essa composição: não reaplicar a opacidade de 38%. Desabilitado também exige estado semântico e ausência de interação.

Contrastes calculados pela [fórmula WCAG][contrast]: canais sRGB normalizados são linearizados por c/12,92 se c ≤ 0,04045, ou ((c + 0,055)/1,055)^2,4. L = 0,2126R + 0,7152G + 0,0722B; razão = (L maior + 0,05)/(L menor + 0,05). Arredondamento somente para exibição; aprovação usa resultado integral. São medições de cores, não testes em aparelho.

#### Pares originais (v1.0.0)

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

#### Pares novos — tokens adicionados na v1.1.0

Valores medidos com a mesma fórmula WCAG sRGB. O painel de IHC do protótipo G1 calcula e exibe esses contrastes em tempo real.

| Par (texto / fundo) | Modo | Cores resolvidas | Razão | Resultado |
| --- | --- | --- | --- | --- |
| `on-success / success` | Claro | `#FFFFFF` / `#3F8067` | 4.65:1 | Aprovado (≥ 4,5:1) |
| `success-ink / surface` | Claro | `#2E5F4B` / `#FFF8F4` | 7.17:1 | Aprovado (≥ 4,5:1) |
| `on-accent / accent` | Claro | `#241A14` / `#F5B544` | 7.78:1 | Aprovado (≥ 4,5:1) |
| `on-accent-soft / accent-soft` | Claro | `#8C3900` / `#FDE9CD` | 5.73:1 | Aprovado (≥ 4,5:1) |
| `on-info / info` | Claro | `#FFFFFF` / `#47599E` | 5.21:1 | Aprovado (≥ 4,5:1) |
| `info / info-soft` | Claro | `#47599E` / `#E2E6F4` | 4.77:1 | Aprovado (≥ 4,5:1) |
| `on-surface / surface-low` | Claro | `#241A14` / `#F4EDE9` | 15.01:1 | Aprovado (≥ 4,5:1) |
| `on-surface / surface-mid` | Claro | `#241A14` / `#EDE6E2` | 13.70:1 | Aprovado (≥ 4,5:1) |
| `on-success / success` | Escuro | `#0E2A1B` / `#7FC79A` | 6.12:1 | Aprovado (≥ 4,5:1) |
| `on-accent / accent` | Escuro | `#3A2A00` / `#F5C56B` | 8.34:1 | Aprovado (≥ 4,5:1) |
| `on-info / info` | Escuro | `#141F45` / `#A9B8F7` | 7.45:1 | Aprovado (≥ 4,5:1) |

> [!NOTE]
> Valores medidos sobre as amostras de cor do protótipo. Pares com `surface-low`/`surface-mid` usam a mesma fonte `on-surface`; os demais fundos de superfície (high, dialog) também aprovam por serem mais claros que `surface`. Medições em aparelho e com TalkBack continuam necessárias.

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
| `radius.xs` | `shape.extra-small` (4 px) | Campo de texto outlined, borda interna da snackbar | Adaptado |
| `radius.md` | `shape.medium` (12 px) | Forma corner-medium para cards e chips | Herdado |
| `radius.lg` | `shape.large` (16 px) | Cards maiores e painel bottom-sheet | Adaptado |
| `radius.xl` | `shape.extra-large` (28 px) | Dialogs e painel de acessibilidade | Adaptado |
| `radius.full` | `shape.full` | Forma corner-full do botão principal preenchido e chips cápsula | Herdado |
| `elevation.card` | `depth.level1` (1 dp) | Card elevado em repouso; M3 level1 | Herdado |
| `elevation.floating` | `depth.level2` (2 dp) | Painel lateral, card em hover | Herdado |
| `elevation.modal` | `depth.level3` (3 dp) | Dialogs e snackbar | Herdado |

Botão preenchido herda corner-full e cards herdam corner-medium (12 px) do M3. `radius.xs` é Adaptado para o campo outlined (M3 usa 4 px em campos preenchidos). `radius.xl` (28 px) alinha o dialog à especificação M3 de dialog. A representação CSS das sombras nos três níveis de elevação é definida no componente; a legibilidade não pode depender da sombra.

### Movimento

| Token | Valor | Uso | Origem |
| --- | --- | --- | --- |
| `motion.duration.short` | `duration.short2` (100 ms) | Feedback de toque, ripple | Herdado |
| `motion.duration.medium` | `duration.medium2` (300 ms) | Transições de contexto, entrada de cards | Herdado |
| `motion.duration.celebration` | `duration.long1` (600 ms) | Confete e animação de resultado perfeito — somente na tela de resultado | Adaptado |
| `motion.easing.standard` | `easing.standard` | Curva padrão de estados e mudanças simples | Herdado |

`motion.duration.celebration` é Adaptado: 600 ms é maior que o máximo M3 do modelo de duração, justificado pelo contexto de celebração pedagógica isolado na tela de resultado. Redução de movimento elimina deslocamentos e transições decorativas, mantendo feedback textual e estado final imediatamente disponíveis. **Não animar fatias continuamente durante a resolução.**

| Token | Valor | Uso | Origem |
| --- | --- | --- | --- |
| `state.hover-opacity` | `opacity.hover` | Camada sob o rótulo no hover | Herdado |
| `state.pressed-opacity` | `opacity.pressed` | Camada sob o rótulo ao pressionar | Herdado |
| `state.focus-opacity` | `opacity.focus` | Camada sob o rótulo com foco | Herdado |
| `state.disabled-container-opacity` | `opacity.disabled-container` | Composição do fundo inativo | Herdado |
| `state.disabled-label-opacity` | `opacity.disabled-label` | Composição do rótulo inativo | Herdado |

## 3. Tokens de componente (onde é usado)

Contrato de tokens para os componentes documentados. Valores visuais apontam somente para o nível semântico.

### Botão — variantes

| Token | Aponta para | Variante | Origem |
| --- | --- | --- | --- |
| `button.bg` | `color.action` | Preenchido | Adaptado |
| `button.label` | `color.on-action` | Preenchido | Adaptado |
| `button.radius` | `radius.full` | Todas | Herdado |
| `button.bg-hover` | `color.action-hover` | Preenchido | Herdado |
| `button.bg-pressed` | `color.action-pressed` | Preenchido | Herdado |
| `button.bg-disabled` | `color.disabled-bg` | Todas | Herdado |
| `button.bg-focused` | `color.action-focused` | Preenchido | Herdado |
| `button.label-disabled` | `color.on-disabled` | Todas | Herdado |
| `button.font` | `font.label` | Todas | Herdado |
| `button.tonal-bg` | `color.accent-soft` | Tonal | Novo |
| `button.tonal-label` | `color.on-accent-soft` | Tonal | Novo |
| `button.outlined-border` | `color.outline` | Outlined | Adaptado |
| `button.outlined-label` | `color.action` | Outlined | Adaptado |
| `button.danger-border` | `color.error` | Perigo | Adaptado |
| `button.danger-label` | `color.error` | Perigo | Adaptado |
| `button.danger-bg-hover` | `color.error` | Perigo | Adaptado |
| `button.danger-label-hover` | `color.on-error` | Perigo | Adaptado |

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
| `pizza.crust` | `pizza-crust-light` / `pizza-crust-dark` | Crosta externa da pizza | Novo |
| `pizza.topping` | `pizza-topping-light` / `pizza-topping-dark` | Ingredientes em fatias selecionadas | Novo |
| `pizza.crust-width` | proporção do componente; anel 98→88 no viewBox 200 | Espessura da crosta | Novo |
| `pizza.topper-pepperoni` | raios 7 px e 5 px no viewBox 200 | Cobertura ilustrativa | Novo |
| `pizza.topper-leaf` | raio 3,4 px no viewBox 200 | Detalhe verde ilustrativo | Novo |
| `avatar.eye` | `avatar-eye` | Olho do mascote | Novo |

### Cartão de atividade e navegação

| Token | Valor / aponta para | Uso | Origem |
|---|---|---|---|
| `card.activity-padding` | 14 px no HTML; `space.md` como aproximação nativa quando exigido pela plataforma | Padding do card do catálogo | Adaptado |
| `card.activity-gap` | 14 px no HTML | Separação da mini pizza e conteúdo | Novo |
| `card.activity-pizza` | `pizza.size / 2` (88 px) | Pizza mini do catálogo | Novo |
| `navigation.indicator` | `color.accent-soft` / `color.on-accent-soft` | Indicador e rótulo do destino selecionado | Adaptado |
| `navigation.indicator-width` | 64 px no HTML | Largura do indicador da aba | Novo |
| `navigation.indicator-height` | 32 px no HTML | Altura do indicador da aba | Novo |
| `color.scrim` | claro `rgba(36,26,20,0.4)`; escuro `rgba(0,0,0,0.6)` | Painel e dialog modais | Adaptado |
| `focus.web-ring-width` | 3 px no HTML | Foco visível da versão web | Adaptado |
| `focus.web-ring-offset` | 2 px no HTML | Afastamento do foco web | Adaptado |

O uso de `color.action` como valor de `pizza.selected` compartilha a cor de marca, mas mantém papéis semânticos diferentes: código de componente deve referenciar `pizza.selected`, não `color.action`. A seleção nunca é comunicada somente pela cor: o resumo textual e os controles equivalentes permanecem obrigatórios. O diâmetro é da representação, não do alvo de toque.

## 4. Modo escuro

Todos os tokens semânticos de cor mudam de valor ou são recalculados com os valores escuros. A ação passa a laranja claro com texto marrom escuro; a superfície passa a marrom quase preto com texto claro. Erro e foco usam os pares escuros. Não inverter cores automaticamente nem aplicar filtro na tela.

Tipografia, espaçamento, raios, profundidade e movimento permanecem iguais. A representação da elevação deve respeitar o tema da plataforma. Tokens de componente conservam seus aliases: apenas a resolução semântica muda. Novos fundos, transparências ou cores pedagógicas exigem medição antes do uso. Os contrastes acima não substituem validação futura de TalkBack, foco, texto ampliado ou uso em aparelho.

## 5. Valores da referência mobile — versão 1.1.0

Os aliases abaixo registram medidas e estados usados em `docs/oi.html`. Use nomes semânticos no código; a tabela não autoriza repetir valores literais em telas.

### Tipografia complementar

| Token | Valor da referência | Uso |
|---|---:|---|
| `font.question` | 18 px / linha 26 px / peso 500 | Enunciado principal da atividade |
| `font.small` | 12 px / linha 17 px | Estado, contador e ajuda |
| `font.chip` | 11 px / linha 16 px | Código BNCC e chips compactos |
| `font.option` | 15 px / linha 20 px | Rótulo das opções de resposta |
| `font.helper` | 12 px / linha 17 px | Ajuda curta sob a ação |
| `font.fraction` | 22 px / linha 26 px | Numerador e denominador apresentados juntos |

Esses tamanhos são valores CSS do protótipo e devem respeitar escala de fonte. Não os use para substituir os estilos M3 documentados em título, corpo e label.

### Geometria local de componentes

| Token | Valor da referência | Uso |
|---|---:|---|
| `pizza.crust-width` | 10 px (anel entre raio 98 e 88 no viewBox 200) | Crosta externa da PizzaFracao |
| `pizza.topper-pepperoni` | raios 7 px e 5 px no viewBox 200 | Coberturas em fatias selecionadas |
| `pizza.topper-leaf` | raio 3,4 px no viewBox 200 | Detalhe verde de cobertura |
| `card.activity-padding` | 14 px | Padding do cartão no HTML; aproximar para `space.md` no app se necessário |
| `card.activity-gap` | 14 px | Separação entre mini pizza e conteúdo |
| `card.activity-pizza` | 88 px (metade de `pizza.size`) | Mini pizza no catálogo |
| `navigation.indicator-width` | 64 px | Indicador selecionado da barra inferior |
| `navigation.indicator-height` | 32 px | Indicador selecionado da barra inferior |
| `focus.web-ring-width` | 3 px | Foco visível no protótipo web; Android herda foco nativo |
| `focus.web-ring-offset` | 2 px | Distância do foco no protótipo web |

### Elevação e movimento demonstrados

| Token | Valor CSS | Uso |
|---|---|---|
| `elevation.level1-shadow` | `0 1px 2px rgba(36,26,20,.14), 0 1px 3px 1px rgba(36,26,20,.08)` | Card em repouso |
| `elevation.level2-shadow` | `0 1px 2px rgba(36,26,20,.14), 0 2px 6px 2px rgba(36,26,20,.10)` | Hover/elemento flutuante |
| `elevation.level3-shadow` | `0 4px 8px 3px rgba(36,26,20,.12), 0 1px 3px rgba(36,26,20,.16)` | Dialog/painel modal |
| `motion.entry` | 300 ms, `easing.standard` | Entrada breve de conteúdo |
| `motion.avatar-float` | 2600 ms, alternado | Mascote em repouso fora da resolução da atividade |
| `motion.avatar-blink` | 4400 ms | Piscar do mascote, se movimento permitido |
| `motion.error-feedback` | 450 ms | Sinal visual breve de tentativa incorreta, sem deslocar foco |

Sombras CSS são apenas a expressão web. No Android, use elevação nativa equivalente e confira desempenho/contraste; não converta a string de sombra em offset arbitrário.

## 6. (Bônus) Versão legível por máquina


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
