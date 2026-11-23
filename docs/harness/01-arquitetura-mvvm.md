# 01 — Arquitetura MVVM Sofisticado

Este guia define a forma exata de implementar cada camada em `src/`, seguindo o padrão **MVVM Sofisticado** (de dentro para fora).

---

## 1. Rota fina (`src/app/`)

Cada arquivo em `src/app/<rota>.tsx` (exceto `_layout.tsx`) importa apenas a tela espelhada em `@/view/<rota>` e faz `export default`.

```ts
// src/app/home.tsx
import HomeScreen from "@/view/home";

export default HomeScreen;
```

- `src/app/_layout.tsx` configura fontes, `SafeAreaProvider`, `StatusBar` e o `<Stack />` do `expo-router`, usando `theme.ts` e ViewModel se precisar. Nunca importa `model`, `usecase`, `infra` ou `di`.

---

## 2. Domínio puro (`src/model/`)

### Entidades (`src/model/entities/*.ts`)

Entidades são `type` em objeto literal. Nunca use `class` nem `new` para entidades. Funções matemáticas puras podem viver junto da entidade em `model/entities/`, sem nenhuma biblioteca externa.

```ts
// src/model/entities/fraction.ts
export type Fraction = {
  n: number;
  d: number;
};
```

### Hierarquia de erros (`src/model/errors.ts`)

```ts
// src/model/errors.ts
export class DomainError extends Error {}
export class ValidationError extends DomainError {}
export class AuthError extends DomainError {}
export class DataSourceError extends DomainError {}
```

### Contratos de DataSource e Service (`src/model/datasources/i*.ts`, `src/model/services/i*.ts`)

- Arquivos começam com prefixo `i` em camelCase (`iProgressDataSource.ts`, `iSoundService.ts`).
- Zero imports de bibliotecas externas.
- Quando houver assinatura em tempo real, o método `subscribe` devolve a função `() => void` para cancelar a escuta.

```ts
// src/model/datasources/iProgressDataSource.ts
import type { PlayerProgress } from "@/model/entities/progress";

export interface IProgressDataSource {
  load(): Promise<PlayerProgress>;
  save(progress: PlayerProgress): Promise<void>;
  subscribe(cb: (progress: PlayerProgress) => void): () => void;
}
```

---

## 3. Infraestrutura (`src/infra/`)

- Implementa as interfaces do domínio com `implements`.
- Sempre possui uma implementação em memória (`MemoryXDataSource`, `MemoryXService`) para testes e desenvolvimento isolado.
- Converte dados externos e erros de biblioteca em `DomainError` (`DataSourceError`, `ValidationError`, etc.).

```ts
// src/infra/datasources/memoryProgressDataSource.ts
import type { IProgressDataSource } from "@/model/datasources/iProgressDataSource";
import type { PlayerProgress } from "@/model/entities/progress";

export class MemoryProgressDataSource implements IProgressDataSource {
  // estado em memória + listeners
}
```

---

## 4. Use Cases (`src/usecase/`)

- Cada domínio tem uma interface (`iXUseCases.ts`) e uma classe (`xUseCases.ts`) com `implements IXUseCases`.
- Recebe Services e DataSources pelo construtor (nunca usa `new Memory...` nem importa `@/infra`).
- Centraliza validações e regras de negócio (lança `ValidationError` quando inválido).

```ts
// src/usecase/shopUseCases.ts
import { ValidationError } from "@/model/errors";
import type { IProgressDataSource } from "@/model/datasources/iProgressDataSource";
import type { IShopUseCases } from "@/usecase/iShopUseCases";

export class ShopUseCases implements IShopUseCases {
  constructor(private progressDataSource: IProgressDataSource) {}

  async buyTopping(id: string): Promise<BuyItemOutcome> {
    if (!item) {
      throw new ValidationError("Item não encontrado na oficina.");
    }
    // ...
  }
}
```

---

## 5. Container de DI (`src/di/container.ts`)

- Único lugar de `src/` que importa `@/infra/*`.
- Instancia os DataSources/Services e entrega os Use Cases tipados pelas interfaces (`IProgressUseCases`, `IShopUseCases`, `IActivityUseCases`).
- Trocar persistência real por memória equivale a mudar uma constante booleana (`USE_MEMORY`).

---

## 6. ViewModel (`src/viewmodel/useXViewModel.ts`)

- Arquivo `.ts` puro (sem JSX).
- Exporta `export type XState = { ... }`, `export type XActions = { ... }` e `export const useXViewModel = (uc: IXUseCases = xUseCases): [XState, XActions] => { ... }`.
- Recebe os Use Cases como parâmetros opcionais com padrão do `container.ts` (facilita testes).
- Toda navegação (`useRouter()`, `useLocalSearchParams()`) fica aqui.
- Captura `DomainError` em blocos `try { ... } catch (err: unknown)` e transforma em mensagem legível para a View; outros erros viram mensagem genérica.

```ts
try {
  setLoading(true);
  await shop.buyTopping(id);
} catch (err: unknown) {
  setError(err instanceof DomainError ? err.message : "Erro inesperado");
} finally {
  setLoading(false);
}
```

---

## 7. View (`src/view/`)

- Espelha `src/app/` 1:1.
- Obtém dados e ações exclusivamente via `const [state, actions] = useXViewModel();`.
- Não importa `expo-router`, não usa `try/catch`, não chama `fetch` e não contém regras de negócio.
- Usa apenas tokens de `@/view/theme` e componentes puros de `@/view/components/*`.
- Declaração obrigatória de tela: `const NomeScreen = () => { ... };` seguido de `export default NomeScreen;` no fim do arquivo.
