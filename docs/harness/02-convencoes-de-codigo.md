# 02 — Convenções de Código

Estas convenções valem para todo arquivo dentro de `src/` e são verificadas automaticamente por `scripts/check-arquitetura.mjs`.

## Sempre

- TypeScript tipado em tudo (`strict: true`).
- `type` para props de componente, entidades de domínio e `State` / `Actions` de ViewModel.
- Componentes e telas como arrow function: `const Nome = () => { ... };`.
- Telas em `src/view/` e rotas em `src/app/`: `export default Nome;` no fim do arquivo.
- Componentes auxiliares em `src/view/components/`: **sempre export nomeado** (`export const MeuComponente = (...) => { ... };`), nunca `export default`.
- Captura de exceção tipada: `catch (err: unknown)`.
- Importações sempre com alias `@/` (ex.: `@/view/theme`, `@/model/errors`).

## Nunca

- `any` (nem em assinatura, nem em `as any`, nem em genérico `<any>`).
- `React.FC` ou `FC<...>`.
- `export default function`.
- `function Nome(...)` para declarar componente React em `.tsx`.
- `interface` para declarar Props em `.tsx` (`interface FooProps` é proibido; use `type FooProps`).
- Imports relativos com `./` ou `../`.
- Arquivos `.js` ou `.jsx` dentro de `src/`.
- Usar os termos `Repository`, `"repositório"` ou `Connector`.

## Tabela de nomes de arquivos e símbolos

| O quê | Arquivo em `src/` | Símbolo principal |
| --- | --- | --- |
| Tela | `view/<mesmo caminho da rota>.tsx` | `const NomeScreen = () => ...` + `export default NomeScreen` |
| Rota fina | `app/<rota>.tsx` | `import NomeScreen from "@/view/<rota>"; export default NomeScreen;` |
| Componente | `view/components/actionButton.tsx` | `export const ActionButton = ...` |
| Tema | `view/theme.ts` | `export const theme = ...` |
| ViewModel | `viewmodel/useHomeViewModel.ts` | `HomeState`, `HomeActions`, `useHomeViewModel` |
| Entidade | `model/entities/progress.ts` | `export type PlayerProgress = ...` |
| Contrato DataSource | `model/datasources/iProgressDataSource.ts` | `export interface IProgressDataSource` |
| Contrato Service | `model/services/iSoundService.ts` | `export interface ISoundService` |
| Implementação | `infra/datasources/memoryProgressDataSource.ts` | `export class MemoryProgressDataSource implements ...` |
| Use Case | `usecase/iShopUseCases.ts` + `usecase/shopUseCases.ts` | `IShopUseCases`, `ShopUseCases` |
| Erros | `model/errors.ts` | `DomainError`, `ValidationError`, `AuthError`, `DataSourceError` |
| Container | `di/container.ts` | `export const shopUseCases: IShopUseCases = ...` |

- Arquivos em `camelCase` (exceto rotas de navegação kebab-case espelhadas entre `app/` e `view/`, como `number-line.tsx`).
- Tipos, interfaces e classes em `PascalCase`.
- Ações na ViewModel começam com `handle` (ex.: `handleNavigate`, `handleBuyTopping`, `handleSubmit`).
