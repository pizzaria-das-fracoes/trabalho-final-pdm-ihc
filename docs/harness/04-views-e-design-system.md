# 04 — Views e Design System

O Design System oficial do **FatiaMática** está em `docs/design-system/`. O arquivo `src/view/theme.ts` traduz esses tokens para o código TypeScript.

## Ordem de leitura no kit de Design

| Arquivo em `docs/design-system/` | Quando ler |
| --- | --- |
| `README.md` | sempre, primeiro |
| `01-principios.md`, `02-tokens.md`, `03-fundamentos.md` | antes de criar ou alterar qualquer tela |
| `04-componentes/<x>.md` | ao criar ou atualizar aquele componente |
| `05-padroes.md` | ao montar um fluxo entre telas |
| `06-acessibilidade.md` | ao revisar e finalizar a tela |

> Atenção: `docs/design-proposta/` contém propostas não aprovadas; nunca trate rascunhos de lá como tokens oficiais sem aprovação explícita.

## Regras de `src/view/theme.ts`

- `src/view/theme.ts` é o **único arquivo em `src/view/`** autorizado a conter valores literais de cor (`#hex`, `rgb(...)`, `rgba(...)`) e primitivos numéricos de espaçamento.
- A paleta primitiva (`palette`) permanece privada dentro de `theme.ts` (não exportada).
- Telas e componentes consomem exclusivamente tokens semânticos exportados (`theme.color.*`, `theme.space.*`, `theme.radius.*`, `theme.type.*`, `accentColors`, `rarityColors`, etc.).
- Se faltar algum token para atender a um pedido, **pare e pergunte** antes de inventar um valor na tela.

## Regras para componentes (`src/view/components/*.tsx`)

- Recebe todos os dados e callbacks por `props` (usando `type NomeProps = { ... }`).
- **Nunca** importa nenhuma ViewModel e **nunca** importa `expo-router`.
- Sempre usa export nomeado (`export const Nome = (...) => { ... };`).
- Expõe variantes e estados via props tipadas.

## Regras para telas (`src/view/*.tsx`)

- Consome `const [state, actions] = useXViewModel();`.
- Considera os estados de tela (`loading`, `error`, conteúdo / feedback) e toque mínimo acessível (`>= 48dp` ou `44dp` conforme componente, `accessibilityLabel`, `accessibilityRole`).
- Respeita área segura (`SafeAreaView` / `Screen`) e responsividade mobile (320dp+ e fontes ampliadas).
- Ao concluir uma alteração visual, liste quais tokens e componentes foram utilizados.
