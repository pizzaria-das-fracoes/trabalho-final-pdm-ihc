# Contrato do Agente — FatiaMática (Harness MVVM Sofisticado)

Este projeto segue o padrão **MVVM Sofisticado** combinado com a governança pedagógica e de rastreabilidade BNCC do **FatiaMática**.

## 1. Antes de escrever

Leia apenas o que a tarefa exigir, na ordem abaixo:

| Tipo de tarefa | Arquivos para ler antes |
| --- | --- |
| Criar ou alterar qualquer código | `docs/harness/01-arquitetura-mvvm.md` |
| Criar um arquivo novo | `docs/harness/02-convencoes-de-codigo.md` |
| Usar Expo, bibliotecas, persistência ou build | `docs/harness/03-expo-e-react-native.md` |
| Criar ou mexer em uma tela / componente | `docs/harness/04-views-e-design-system.md`, `docs/design-system/README.md` |
| Nova atividade ou alteração de escopo BNCC | `docs/harness/00-estado-e-gates.md`, `docs/engenharia/README.md`, `docs/engenharia/matriz-bncc.md` |

> **Estado e Design System:** `docs/design-system/` é o kit oficial. `docs/design-proposta/` contém apenas sugestões pendentes, não tokens oficiais. G1 permanece aberto até decisão documentada da equipe.

---

## 2. Estrutura de pastas

```text
src/
├─ app/                     só rotas finas (+ _layout.tsx)
├─ view/                    espelha app/ 1:1
│  ├─ components/           componentes puros (export nomeado)
│  └─ theme.ts              único arquivo com valores literais de cor/espaço
├─ viewmodel/
│  └─ useXViewModel.ts      estado, ações, navegação e captura de DomainError
├─ usecase/
│  ├─ iXUseCases.ts         contrato do Use Case (interface)
│  └─ xUseCases.ts          regras de negócio e validações
├─ model/
│  ├─ entities/             type X em objeto literal (nunca class/new)
│  ├─ datasources/          contratos iXDataSource.ts (interface)
│  ├─ services/             contratos iXService.ts (interface)
│  └─ errors.ts             DomainError e subclasses
├─ infra/
│  ├─ datasources/          implementações reais + memoryXDataSource.ts
│  └─ services/             implementações reais + memoryXService.ts
└─ di/
   └─ container.ts          único ponto que instancia infra e injeta nos Use Cases
```

**Nenhuma outra pasta é permitida dentro de `src/`.** Contratos sempre com `interface`; entidades, props e estados sempre com `type`.

---

## 3. Regras de ouro (1 a 12)

1. `app/` só tem rotas finas: `import` da tela espelhada + `export default`.
2. `view/` espelha `app/` 1:1, inclusive `[id]`, `(tabs)` e `+not-found`.
3. A View só renderiza: sem `expo-router`, `try/catch`, `fetch` ou dados.
4. Toda a navegação (`router`, `useLocalSearchParams`) fica na ViewModel.
5. ViewModel: `useXViewModel.ts` com `XState`, `XActions` e tupla `[state, actions]`.
6. Regras de negócio e validações ficam nos Use Cases.
7. Domínio puro: entidade é `type`, contrato é `interface`, nenhuma biblioteca externa.
8. Infra implementa as interfaces (`implements`) e converte erros externos em `DomainError`.
9. Só `di/container.ts` importa `@/infra` (e os testes unitários).
10. Estilos só com tokens do `theme.ts`; faltou token, pare e pergunte.
11. Importações sempre com `@/`, nunca `./` ou `../`.
12. Proibido `any`, `React.FC`, `export default function`, `function Nome()` para componente, `interface` em props e arquivos `.js` em `src/`.

---

## 4. Quem pode importar quem

| Camada | Pode importar | Nunca importa |
| --- | --- | --- |
| `app/` | só a tela espelhada (`@/view/<rota>`) | todo o resto |
| `app/_layout.tsx` | `react`, `expo-router`, `@/view/theme`, `@/viewmodel/*`, UI libs Expo (`expo-font`, `@expo-google-fonts/*`, `expo-status-bar`, `react-native-safe-area-context`) | `model`, `usecase`, `infra`, `di` |
| `view/` | `react`, `react-native`, `react-native-svg`, `@react-native-community/slider`, `@/viewmodel/*`, `@/view/components/*`, `@/view/theme`, `import type` de `@/model/entities/*` | `expo-router`, `usecase`, `infra`, `di` |
| `view/components/` | o mesmo da `view/`, **sem** `viewmodel` | `viewmodel`, `expo-router`, `usecase`, `infra`, `di` |
| `viewmodel/` | `react`, `expo-router`, `@/usecase/i*`, `@/di/container`, `@/model/entities/*`, `@/model/errors` | `react-native`, `view`, `infra` |
| `usecase/` | `@/model/*`, `@/usecase/*` | `infra`, `view`, `viewmodel`, `di`, bibliotecas externas |
| `model/` | só `@/model/*` | qualquer outra coisa ou biblioteca externa |
| `infra/` | `@/model/*` e libs de dados/hardware (`@react-native-async-storage/async-storage`, `expo-haptics`, etc.) | `usecase`, `viewmodel`, `view`, `di` |
| `di/` | `@/infra/*`, `@/usecase/*`, `@/model/*` | `view`, `viewmodel` |

> Exceções explícitas: a View pode usar `import type` de `@/model/entities/*`; testes (`*.test.ts`) podem importar `@/infra` para testar adaptadores em memória.

---

## 5. Vocabulário obrigatório

- **Entidade:** `type` em objeto literal; nunca `class` nem `new`.
- **DataSource:** guarda e recupera dados (`AsyncStorage`, `Firestore`, API REST, memória).
- **Service:** executa uma funcionalidade (`expo-haptics`, áudio, login, notificação).
- **Use Case:** o que o app faz; valida e coordena Services e DataSources.
- **Proibido usar:** `Repository`, `"repositório"` ou `Connector`.

---

## 6. Verificação

- Rode `npm run check` (`node scripts/check-arquitetura.mjs && tsc --noEmit`) e corrija **tudo** antes de declarar a tarefa concluída.
- Nunca altere `scripts/check-arquitetura.mjs`, `AGENTS.md` ou `docs/design-system/` para esconder um erro.
- Para cada tarefa no FatiaMática, registre a mudança (`CHG-NNN`) em `docs/harness/07-registro-de-mudancas.md` e atualize `docs/harness/04-checklist-entrega.md` com os comandos realmente executados e seu estado real (`PASSOU`, `FALHOU`, `NÃO EXECUTADO`, `NÃO APLICÁVEL`). Nunca converta plano em evidência.

---

## 7. Expo em uma linha

- Confira o SDK em `package.json`; instale bibliotecas Expo com `npx expo install <pacote>`; nunca edite `ios/` ou `android/` manualmente (use `app.json`); `EXPO_PUBLIC_` não é segredo.
- Sem login, telemetria, coleta de dados de menores ou serviços remotos sem justificativa, consentimento e revisão de privacidade.
- Nenhum botão sem ação, áudio dependente de módulo nativo indisponível ou UI fora da área segura.

---

## 8. Como se comportar

- Execute **uma tarefa por vez**; pergunte quando houver ambiguidade ou falta de token no Design System.
- Ao concluir, **liste os arquivos criados/alterados por camada** e explique de forma clara e didática, sem inventar testes, avaliações com crianças ou validação em dispositivo físico não executados.
