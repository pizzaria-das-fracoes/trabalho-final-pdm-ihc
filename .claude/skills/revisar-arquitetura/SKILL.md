---
name: revisar-arquitetura
description: Executa o verificador arquitetural, agrupa violações por regra e corrige de dentro para fora sem enfraquecer o verificador.
---

# Receita: revisar arquitetura

1. **Rode o verificador:** execute `npm run check` (`node scripts/check-arquitetura.mjs && tsc --noEmit`).
2. **Agrupe os erros por regra e explique:** identifique cada código `[ERRO] REGRA`, arquivo e linha afetados.
3. **Corrija de dentro para fora:** siga estritamente a ordem `model` → `infra` → `usecase` → `di` → `viewmodel` → `view/components` → `view` → `app`.
4. **Nunca altere o verificador:** é proibido editar `scripts/check-arquitetura.mjs`, `AGENTS.md` ou `docs/design-system/` para esconder uma violação.
5. **Revise manualmente o que a análise estática não vê:**
   - Há regra de negócio ou validação matemática vazando para `ViewModel` ou `View`?
   - Todos os botões e ações passam feedback e tratam `DomainError`?
   - Há rastreabilidade documental (`docs/harness/04-checklist-entrega.md` e `07-registro-de-mudancas.md`)?
