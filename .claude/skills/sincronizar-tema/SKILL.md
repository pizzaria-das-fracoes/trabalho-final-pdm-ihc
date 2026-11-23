---
name: sincronizar-tema
description: Sincroniza docs/design-system/ com src/view/theme.ts, carregamento de fontes no _layout e componentes em view/components/. Use ao atualizar tokens ou design system.
---

# Receita: sincronizar tema

1. **Leia o Design System oficial:** `docs/design-system/README.md`, `02-tokens.md`, `03-fundamentos.md` e `06-acessibilidade.md`. Pare e pergunte se houver `TODO` ou token ausente. Nunca use `docs/design-proposta/` sem aprovação explícita.
2. **Atualize `src/view/theme.ts`:**
   - Mantenha `palette` privado (não exportado) neste único arquivo com literais de cor.
   - Exporte os tokens semânticos exatos de `02-tokens.md` (`theme`, `accentColors`, `rarityColors`, etc.).
3. **Carregue as fontes no `_layout.tsx`:** garanta que `src/app/_layout.tsx` carregue as fontes definidas nos tokens tipográficos usando tokens de `@/view/theme`.
4. **Sincronize componentes:** para cada componente em `docs/design-system/04-componentes/`, mantenha um arquivo em `src/view/components/` com export nomeado, variantes tipadas via `type` e consumo exclusivo de `theme.ts`.
5. **Conclua com evidência:** rode `npm run check` e apresente a tabela de mapeamento `token -> valor`.
