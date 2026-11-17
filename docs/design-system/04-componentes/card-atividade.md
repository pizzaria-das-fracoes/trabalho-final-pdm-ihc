# Card de atividade (CardAtividade)

Origem no sistema base: Google Material Design 3, [Elevated card](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-elevated-card.scss). Situação: **Adaptado**. Motivo da adaptação: apresentar uma atividade educativa com paleta e superfície locais; preservar corner-medium e elevação level1. O fundo local `color.surface` não equivale ao papel surface-container-low do card M3 de referência.

Os valores e os modos claro/escuro são resolvidos por [02-tokens.md](../02-tokens.md); aplique [03-fundamentos.md](../03-fundamentos.md). Nenhum token novo é definido aqui. Para características não adaptadas, siga a especificação Material 3 do componente de origem vinculada acima: estrutura, dimensões, ícones, estados e foco acessível. Essas propriedades são herdadas por referência, não novos tokens locais. Use o tema M3 nos papéis que não possuem mapeamento local; não os substitua silenciosamente por tokens de botão ou cores arbitrárias. Os exemplos omitem essas propriedades herdadas. A integração futura deve preservar os contrastes e permitir texto ampliado; valide pares adicionais na plataforma, sem confundir essa validação com uma lacuna de design.

## Quando usar

- Use para apresentar uma atividade e permitir abrir seu conteúdo.
- Use elevação somente quando acrescentar hierarquia perceptível.

## Quando não usar

- Não use vários cards como botões de resposta durante um exercício focado.
- Não aninhe controles acionáveis dentro do card inteiramente clicável.

## Anatomia

1. Container: `color.surface-low`, `radius.md`, `elevation.card`.
2. Mini PizzaFracao: `card.activity-pizza`, com resumo e fatias que identifiquem o tema da atividade.
3. Título, descrição e estado: `font.body`, `font.label`/`font.small`, `color.on-surface`.
4. Chip da habilidade: `font.chip`; escolha `color.accent-soft`, `color.success-soft` ou `color.info-soft` conforme a categoria, sempre com texto.
5. Indicador de progresso: `color.surface-high` como trilha e preenchimento semântico; só represente dados disponíveis e rotule a medida.
6. Padding/gap da referência: `card.activity-padding` e `card.activity-gap`; no Android respeite mínimo 48 dp e texto ampliado.
7. Área acionável única com nome da atividade e destino; não aninhe botões.

## Variantes

| Variante | Uso | Tokens |
| --- | --- | --- |
| Card de catálogo acionável | Abrir atividade e resumir estado | `radius.md`, `elevation.card`, `color.surface-low`, `font.body`, `font.label`, `font.chip`, `card.activity-*`, `pizza.*` |

## Estados

| Estado | Aparência (tokens) | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Padrão | Tokens da anatomia; elevação em repouso | Abra a atividade ao ativar. | Anuncie título e papel de botão. |
| Hover | Camada e elevação de hover herdadas do Elevated card M3 | Não se aplica ao toque sem ponteiro. | Não esconda informação até hover. |
| Pressionado | Camada pressionada herdada do Elevated card M3; não reutilize camadas de botão preenchido | Forneça retorno antes de navegar. | Mantenha nome acessível. |
| Foco | Foco herdado do Elevated card M3 e da implementação acessível Android; sem contorno próprio | Permita ativação sem toque. | Garanta foco visível sem depender da sombra. |
| Desabilitado | Tratamento disabled herdado do Elevated card M3; inclua texto “Indisponível” | Não abra a atividade. | Anuncie disabled e motivo; não use apenas opacidade. |

## Acessibilidade

- Garanta alvo mínimo de 48 dp para o card acionável.
- Preserve título e descrição com texto ampliado; não fixe altura que corte conteúdo.
- Evite leitura duplicada do título por agrupamento inadequado.
- Contraste de `color.on-surface` sobre `color.surface`: 16,21:1 claro e 14,26:1 escuro em `02-tokens.md`.
- Estados com camadas herdadas exigem medições na integração; não declare conclusão de `06-acessibilidade.md`.

## Faça e evite

- **Faça:** Informe o nome e a finalidade da atividade antes de abri-la.
- **Evite:** Não dependa da sombra ou de cor para indicar disponibilidade.

**Lacunas a resolver:** Nenhuma decisão estrutural pendente para o card elevado acionável. Camadas, elevações de interação, disabled, foco e ícones seguem o Elevated card M3. Nomes, descrições e condições de disponibilidade de cada atividade são conteúdo do produto a definir, não ausência de tokens.

### Campos do card na versão 1.1.0

O protótipo móvel apresenta mini pizza, nome, descrição, chip BNCC, estado (`Nova`, em prática ou dominada) e barra. No app, mostre status e medida somente quando a fonte e o cálculo estiverem definidos; não use a aparência de barra para sugerir percentual semântico diferente do dado real.

## Código

Trecho ilustrativo de contrato TSX, sem implementação, imports ou biblioteca escolhida. `t` representa os tokens existentes já resolvidos para o tema; props de aparência são um contrato conceitual, não uma API instalada. Callbacks e dados vêm da tela futura. O trecho demonstra somente parte do contrato e não é código executável autossuficiente.

```tsx
<CardAtividade
  title="Monte sua pizza"
  description="Represente uma fração selecionando fatias."
  onPress={abrirAtividade}
  appearance={{
    surface: t["color.surface"], content: t["color.on-surface"],
    shape: t["radius.lg"], elevation: t["elevation.card"],
    titleTypography: t["font.title"], bodyTypography: t["font.body"],
    padding: t["space.md"], gap: t["space.sm"], groupGap: t["space.lg"],
  }}
/>
```
