# Campo de texto (CampoDeTexto)

Origem no sistema base: Google Material Design 3, [Outlined text field](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-outlined-text-field.scss). Situação: **Adaptado**. Motivo da adaptação: paleta local e tipografia do conteúdo e da instrução; preservar estrutura, forma e label flutuante do Outlined text field M3.

Os valores e os modos claro/escuro são resolvidos por [02-tokens.md](../02-tokens.md); aplique [03-fundamentos.md](../03-fundamentos.md). Nenhum token novo é definido aqui. Para características não adaptadas, siga a especificação Material 3 do componente de origem vinculada acima: estrutura, dimensões, ícones, estados e foco acessível. Essas propriedades são herdadas por referência, não novos tokens locais. Use o tema M3 nos papéis que não possuem mapeamento local; não os substitua silenciosamente por tokens de botão ou cores arbitrárias. Os exemplos omitem essas propriedades herdadas. A integração futura deve preservar os contrastes e permitir texto ampliado; valide pares adicionais na plataforma, sem confundir essa validação com uma lacuna de design.

## Quando usar

- Use somente quando uma atividade exigir resposta digitada.
- Forneça rótulo persistente e instrução curta.

## Quando não usar

- Não crie login ou coleta de nome para justificar este componente.
- Não substitua a interação visual com pizzas por digitação sem necessidade pedagógica.

## Anatomia

1. Área de entrada: `color.surface`, `color.on-surface` e `font.body`.
2. Rótulo flutuante persistente: herde tipografia e transição do Outlined text field M3 nos estados vazio, preenchido e focado; não force `font.label` sobre as métricas específicas do label flutuante.
3. Instrução e erro: `font.body`, `color.on-surface` ou `color.error`; erro sempre em texto.
4. Separação entre campo e conteúdo externo: `space.sm`; herde contorno, espessuras por estado, cursor, placeholder, forma e dimensões do Outlined text field M3. Não use `radius.md` como substituição automática.

## Variantes

| Variante | Uso | Tokens |
| --- | --- | --- |
| Contornado, entrada simples | Resposta digitada quando exigida pela atividade | `color.surface`, `color.on-surface`, `font.body`, `space.sm` |

## Estados

| Estado | Aparência (tokens) | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Padrão | Superfície e texto pelos tokens da anatomia; contorno padrão herdado do Outlined text field M3 | Mantenha rótulo visível com valor vazio ou preenchido. | Associe rótulo ao campo; placeholder não substitui label. |
| Hover | Contorno de hover herdado do Outlined text field M3 | Não se aplica ao toque sem ponteiro; com ponteiro, não o trate como foco. | Não revele instrução exclusivamente no hover. |
| Pressionado | Transição para foco herdada do Outlined text field M3; não reutilize `button.bg-pressed` | Solicite foco e teclado ao tocar na entrada. | Mantenha semântica de campo editável. |
| Foco | Contorno e cursor de foco herdados do Outlined text field M3; `color.focus` não impõe geometria própria | Permita edição com contorno e cursor de foco do componente M3. | Preserve foco visível e ordem de leitura. |
| Desabilitado | Herde label, entrada e outline disabled do Outlined text field M3; as opacidades existentes podem representar suas regras, sem aliases locais | Impeça edição. Não aplique o fundo disabled de botão como se fosse de campo. | Anuncie indisponibilidade e a razão quando relevante. |
| Erro | Texto em `color.error` com `font.body`; contorno de erro herdado do Outlined text field M3 | Explique como corrigir; preserve a resposta digitada. | Associe mensagem ao campo e anuncie após validação. |

## Acessibilidade

- Garanta área de interação mínima de 48 dp e suporte a teclado/TalkBack.
- Permita ampliação e quebra de linha no rótulo e nas instruções.
- Contraste disponível: `color.on-surface`/`color.surface` 16,21:1 claro e 14,26:1 escuro; `color.error`/`color.surface` 6,22:1 e 10,80:1.
- Esses pares foram medidos em `02-tokens.md`; os pares herdados do contorno, placeholder e estados exigem verificação na integração e registro em `06-acessibilidade.md`.

## Faça e evite

- **Faça:** Explique o formato da resposta e o erro em linguagem simples.
- **Evite:** Não use placeholder como único rótulo nem apague automaticamente o valor incorreto.

**Lacunas a resolver:** Nenhuma lacuna estrutural para a variante contornada básica. Siga o Outlined text field M3 nas propriedades não adaptadas, sem criar aliases locais. O conteúdo, tipo de teclado e validação da resposta dependem da atividade futura; não invente requisitos de entrada para esta versão.

## Código

Trecho ilustrativo de contrato TSX, sem implementação, imports ou biblioteca escolhida. `t` representa os tokens existentes já resolvidos para o tema; props de aparência são um contrato conceitual, não uma API instalada. Callbacks e dados vêm da tela futura. O trecho demonstra somente parte do contrato e não é código executável autossuficiente.

```tsx
<CampoDeTexto
  label="Numerador da resposta"
  value={resposta}
  onChangeText={alterarResposta}
  appearance={{
    surface: t["color.surface"], content: t["color.on-surface"],
    inputTypography: t["font.body"],
    error: t["color.error"], gap: t["space.sm"],
  }}
/>
```
