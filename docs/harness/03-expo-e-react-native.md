# 03 — Expo, React Native e Bibliotecas por Camada

## Comandos padrão

| Para… | Use |
| --- | --- |
| Instalar pacote compatível com o SDK | `npx expo install <pacote>` |
| Diagnosticar dependências | `npx expo-doctor` |
| Alinhar versões do SDK | `npx expo install --fix` |
| Limpar cache do Metro | `npx expo start --clear` |
| Verificar arquitetura + tipos | `npm run check` |
| Rodar apenas arquitetura | `npm run arquitetura` |

- Nunca edite `ios/` ou `android/` manualmente; configure tudo via `app.json`.
- Variáveis `EXPO_PUBLIC_` em `.env` não são segredo (ficam no bundle do cliente).

## Expo Router

- `src/app/_layout.tsx` define o `<Stack />` (ou `<Tabs />`), carrega fontes (`Fredoka`, `Nunito`) e envolve com `SafeAreaProvider` + `StatusBar`.
- Cada rota em `src/app/` é apenas um reexport fino de `src/view/`.
- `router.push`, `router.replace`, `router.back` e `useLocalSearchParams` só podem aparecer em `src/viewmodel/`.

## Cada biblioteca na sua camada

| Necessidade | Biblioteca | Onde fica |
| --- | --- | --- |
| UI, layout, SVG, slider | `react-native`, `react-native-svg`, `@react-native-community/slider` | `view/` e `view/components/` |
| Navegação | `expo-router` | `viewmodel/` (e `Stack`/`Tabs` em `app/_layout.tsx`) |
| Dados locais persistentes | `@react-native-async-storage/async-storage` | `infra/datasources/` |
| Háptico / Áudio Web leve | `expo-haptics` | `infra/services/` |
| API REST / `fetch` | `fetch` | `infra/datasources/` |

- Componente visual vai para a View; operação de armazenamento, rede ou hardware vira `DataSource` ou `Service` em `infra/`.
- No **FatiaMática**, o aplicativo opera 100% offline, sem login, sem telemetria e sem coleta de dados de menores.
