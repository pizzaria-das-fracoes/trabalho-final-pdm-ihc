---
name: nova-tela
description: Cria uma tela no padrão MVVM Sofisticado (rota fina, tela em view/, ViewModel). Use ao pedir uma nova tela.
---

# Receita: nova tela

1. **Entenda o pedido:** defina rota em `src/app/`, estado (`XState`), ações (`XActions`) e vínculo com requisitos/BNCC se aplicável.
2. **Leia o conhecimento:** `docs/harness/01-arquitetura-mvvm.md`, `docs/harness/04-views-e-design-system.md` e `docs/design-system/README.md` (`02-tokens.md`, `05-padroes.md`).
3. **Crie a ViewModel** em `src/viewmodel/use<Nome>ViewModel.ts`:
   - Exporte `type <Nome>State`, `type <Nome>Actions` e `use<Nome>ViewModel(...): [<Nome>State, <Nome>Actions]`.
   - Receba Use Cases por parâmetro com padrão de `@/di/container`.
   - Toda navegação (`useRouter()`, `useLocalSearchParams()`) e tratamento de `DomainError` ficam aqui.
4. **Componentes que faltam:** se precisar de componente novo, leia `docs/design-system/04-componentes/` e crie em `src/view/components/<nome>.tsx` com `export const` (sem ViewModel e sem `expo-router`).
5. **Crie a tela** em `src/view/<mesmo-caminho-da-rota>.tsx`:
   - `const <Nome>Screen = () => { ... };` + `export default <Nome>Screen;`.
   - Leia apenas `[state, actions]` da ViewModel.
   - Use somente tokens de `@/view/theme`; inclua estados (carregando, erro, vazio e conteúdo), área segura e acessibilidade (`accessibilityLabel`, `accessibilityRole`, alvo mínimo de toque).
6. **Crie a rota fina** em `src/app/<rota>.tsx`:
   - Apenas `import <Nome>Screen from "@/view/<rota>";` e `export default <Nome>Screen;`.
7. **Verifique e conclua:** rode `npm run check` (`node scripts/check-arquitetura.mjs && tsc --noEmit`), corrija qualquer erro e liste os arquivos por camada, tokens e componentes usados.
