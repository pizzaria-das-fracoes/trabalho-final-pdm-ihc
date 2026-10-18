# Botão (Botao)

Origem no sistema base: Google Material Design 3, [Filled button](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-filled-button.scss). Situação: **Adaptado**. Motivo da adaptação: aplicar a paleta do FatiaMática; preservar corner-full, tipografia e regras de estado M3.

Os valores e os modos claro/escuro são resolvidos por [02-tokens.md](../02-tokens.md); aplique [03-fundamentos.md](../03-fundamentos.md). Nenhum token novo é definido aqui. Para características não adaptadas, siga a especificação Material 3 do componente de origem vinculada acima: estrutura, dimensões, ícones, estados e foco acessível. Essas propriedades são herdadas por referência, não novos tokens locais. Use o tema M3 nos papéis que não possuem mapeamento local; não os substitua silenciosamente por tokens de botão ou cores arbitrárias. Os exemplos omitem essas propriedades herdadas. A integração futura deve preservar os contrastes e permitir texto ampliado; valide pares adicionais na plataforma, sem confundir essa validação com uma lacuna de design.

## Quando usar

- Use para confirmar a resposta ou executar a ação principal da tela.
- Use um verbo que descreva o resultado da ação.

## Quando não usar

- Não use para navegação entre destinos principais.
- Não apresente várias ações preenchidas concorrentes na atividade.

## Anatomia

1. Container: `button.bg`, `button.radius`; forma de cápsula herdada.
2. Rótulo: `button.label`, `button.font`.
3. Estados: `button.bg-hover`, `button.bg-pressed`, `button.bg-focused`, `button.bg-disabled` e `button.label-disabled`.
4. Área acionável, padding, ícone opcional e foco visível: siga o Filled button M3 e sua implementação acessível Android; preserve alvo mínimo de 48 dp mesmo quando o container visual for menor. Não defina contorno externo próprio.

## Variantes

| Variante | Uso | Tokens |
| --- | --- | --- |
| Principal preenchido | Ação principal disponível | `button.bg`, `button.label`, `button.radius`, `button.font` |

## Estados

| Estado | Aparência (tokens) | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Padrão | `button.bg`, `button.label` | Execute a ação ao ativar; evite envios duplicados. | Anuncie rótulo e papel de botão. |
| Hover | `button.bg-hover`; mantenha `button.label` | Aplique com ponteiro. Não se aplica ao toque sem ponteiro. | Não dependa de hover para descobrir a ação. |
| Pressionado | `button.bg-pressed` | Mostre retorno enquanto acionado; não confirme antes da ativação. | Mantenha rótulo perceptível. |
| Foco | `button.bg-focused`; referência cromática `color.focus` | Herde o tratamento de foco visível do Filled button M3; não dependa somente da camada de fundo. | Permita ativação por teclado e tecnologia assistiva. |
| Desabilitado | `button.bg-disabled`, `button.label-disabled` | Bloqueie ativação e explique a indisponibilidade em texto adjacente quando necessário. | Anuncie disabled; não reduza novamente a opacidade do label resolvido. |

## Acessibilidade

- Garanta alvo mínimo de 48 dp, sem interpretar o primitivo de espaçamento em px como dimensão em dp.
- Preserve escala de fonte e quebra de linha; amplie o container em vez de cortar o rótulo.
- Use rótulo como “Conferir resposta”, não “OK”.
- Contraste de label/fundo: 7,78:1 claro e 7,91:1 escuro; hover: 6,48:1 e 6,94:1; pressed/focus: 5,88:1 e 6,48:1.
- Disabled: 2,25:1 e 2,84:1; exceção de controle inativo, não aprovação no limite de 4,5:1. Medições em `02-tokens.md`; consolidação em `06-acessibilidade.md` realizada.

## Faça e evite

- **Faça:** Use uma ação principal com resultado previsível.
- **Evite:** Não use apenas cor para indicar indisponibilidade.

**Lacunas a resolver:** Nenhuma decisão visual própria pendente para a variante preenchida básica. Dimensões, padding, ícone e foco seguem o Filled button M3; a escolha da biblioteca e os testes Android pertencem à implementação futura, não impedem o uso desta especificação.

## Código

Trecho ilustrativo de contrato TSX, sem implementação, imports ou biblioteca escolhida. `t` representa os tokens existentes já resolvidos para o tema; props de aparência são um contrato conceitual, não uma API instalada. Callbacks e dados vêm da tela futura. O trecho demonstra somente parte do contrato e não é código executável autossuficiente.

```tsx
<Botao
  label="Conferir resposta"
  onPress={conferirResposta}
  appearance={{
    background: t["button.bg"], label: t["button.label"],
    shape: t["button.radius"], typography: t["button.font"],
    hovered: t["button.bg-hover"], pressed: t["button.bg-pressed"],
    focused: t["button.bg-focused"], disabled: t["button.bg-disabled"],
    disabledLabel: t["button.label-disabled"],
  }}
/>
```
