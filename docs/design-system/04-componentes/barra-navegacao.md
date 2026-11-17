# Barra de navegação (BarraNavegacao)

Origem no sistema base: Google Material Design 3, [Navigation bar](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-navigation-bar.scss), para destinos principais em Android. Situação: **Adaptado**. Motivo da adaptação: superfície local e uso de `font.label`; preservar estrutura, indicador e estados da Navigation bar M3.

Os valores e os modos claro/escuro são resolvidos por [02-tokens.md](../02-tokens.md); aplique [03-fundamentos.md](../03-fundamentos.md). Nenhum token novo é definido aqui. Para características não adaptadas, siga a especificação Material 3 do componente de origem vinculada acima: estrutura, dimensões, ícones, estados e foco acessível. Essas propriedades são herdadas por referência, não novos tokens locais. Use o tema M3 nos papéis que não possuem mapeamento local; não os substitua silenciosamente por tokens de botão ou cores arbitrárias. Os exemplos omitem essas propriedades herdadas. A integração futura deve preservar os contrastes e permitir texto ampliado; valide pares adicionais na plataforma, sem confundir essa validação com uma lacuna de design.

## Quando usar

- Use para alternar entre os destinos principais móveis demonstrados no protótipo: **Início**, **Sobre** e **Progresso**.
- Mantenha os mesmos destinos e a mesma ordem em todas as telas que exibem a barra.

## Quando não usar

- Não use para confirmar resposta, avançar um exercício ou alternar fatias.
- Não acrescente destinos artificiais para completar a barra.

## Anatomia

1. Container: `color.surface-mid`, adaptado ao HTML; respeite área segura e navegação do sistema Android.
2. Rótulos: `font.label`, `color.on-surface`; adaptação em relação ao label-medium do M3 de referência.
3. Ícones: Material Symbols com rótulos; herde dimensões e posicionamento da Navigation bar M3. A escolha dos símbolos depende dos destinos aprovados.
4. Indicador selecionado: `navigation.indicator` usa `color.accent-soft` com `color.on-accent-soft`; dimensões web são `navigation.indicator-width` e `navigation.indicator-height`. Preserve a cápsula e o rótulo selecionado visível.
5. Seleção semântica: exatamente um destino atual.

## Variantes

| Variante | Uso | Tokens |
| --- | --- | --- |
| Barra inferior de destinos principais | Início, Sobre e Progresso | `color.surface-mid`, `color.on-surface`, `font.label`, `navigation.indicator` |

## Estados

| Estado | Aparência (tokens) | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Padrão | Rótulos `color.on-surface` sobre `color.surface-mid` | Mantenha os três destinos disponíveis. | Anuncie rótulo de cada destino. |
| Hover | Camada de hover herdada da Navigation bar M3 | Não se aplica ao toque sem ponteiro. | Não dependa do hover para revelar rótulos. |
| Pressionado | Camada pressionada herdada da Navigation bar M3 | Navegue após ativação; não confunda pressionado com selecionado. | Preserve foco após mudança de destino. |
| Foco | Foco visível herdado da Navigation bar M3 e da implementação acessível Android | Percorra itens em ordem visual. | Permita ativação por teclado e TalkBack. |
| Desabilitado | Não se aplica nesta variante: destinos são apresentados disponíveis | Não represente bloqueio de conteúdo desabilitando destino global. | Explique indisponibilidade na tela correspondente. |
| Selecionado | Cápsula `color.accent-soft`, ícone/rótulo `color.on-accent-soft` | Marque exatamente o destino atual e evite reinício desnecessário. | Anuncie papel de aba e estado selected, não só uma mudança de cor. |

## Acessibilidade

- Garanta alvo mínimo de 48 dp para cada destino, sem sobreposição das áreas.
- Mostre rótulos, inclusive no destino atual; permita ampliação sem truncamento que impeça reconhecer o destino.
- Anuncie o grupo de navegação, cada destino e sua seleção; preserve ordem coerente.
- Contraste dos rótulos sobre a superfície: 16,21:1 claro e 14,26:1 escuro, conforme `02-tokens.md`.
- Os pares do tema M3 usados no indicador, ícones e camadas devem ser medidos na integração; registre-os futuramente em `06-acessibilidade.md`.

## Faça e evite

- **Faça:** Mantenha os mesmos destinos e a mesma ordem nas telas que usam a barra.
- **Evite:** Não trate a barra como lista de todas as ações da atividade.

**Estado da versão:** destinos e indicador definidos pela referência `docs/oi.html`. A validação de alvos, foco e leitura no Android continua pendente; isso não altera os nomes definidos nesta especificação.

## Código

Trecho ilustrativo de contrato TSX, sem implementação, imports ou biblioteca escolhida. `t` representa os tokens existentes já resolvidos para o tema; props de aparência são um contrato conceitual, não uma API instalada. Callbacks e dados vêm da tela futura. O trecho demonstra somente parte do contrato e não é código executável autossuficiente.

```tsx
<BarraNavegacao
  destinations={destinosAprovados}
  selectedDestination={destinoAtual}
  onSelect={navegar}
  appearance={{
    surface: t["color.surface"], content: t["color.on-surface"],
    labelTypography: t["font.label"],
  }}
/>
```
