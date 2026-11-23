---
name: nova-funcionalidade
description: Implementa uma funcionalidade completa de dentro para fora (domínio, infra, Use Case, container, testes, tela). Use ao adicionar regra de negócio ou persistência/serviço.
---

# Receita: nova funcionalidade (de dentro para fora)

0. **Planejar:** defina se a capacidade precisa de um **DataSource** (guardar/recuperar dados) ou de um **Service** (executar operação externa/hardware), além de eventual vínculo BNCC em `docs/engenharia/matriz-bncc.md`.
1. **Domínio (`src/model/`):**
   - Crie ou atualize a entidade como `type` em `src/model/entities/<nome>.ts` (nunca `class`/`new`).
   - Adicione ou reuse erros específicos em `src/model/errors.ts` estendendo `DomainError`.
   - Crie o contrato `export interface I...` em `src/model/datasources/i...DataSource.ts` ou `src/model/services/i...Service.ts` sem imports externos.
2. **Infra em memória (`src/infra/`):**
   - Implemente `Memory<Nome>DataSource` ou `Memory<Nome>Service` com `implements`, convertendo erros em `DomainError`.
3. **Use Case (`src/usecase/`):**
   - Crie o contrato em `src/usecase/i<Nome>UseCases.ts` e a classe `implements I<Nome>UseCases` em `src/usecase/<nome>UseCases.ts`.
   - Receba DataSources e Services pelo construtor; nunca use `new` de infra nem importe `@/infra`.
   - Valide regras de negócio lançando `ValidationError`.
4. **Container (`src/di/container.ts`):**
   - Conecte a nova implementação em uma linha/função factory e exporte a instância tipada pela interface do Use Case.
5. **Teste do Use Case / Domínio:**
   - Crie/atualize testes unitários usando implementações `Memory*` em memória.
6. **ViewModel, tela e rota:**
   - Se a funcionalidade tiver UI nova, siga a receita `.claude/skills/nova-tela/SKILL.md`.
7. **Implementação real (se pedida):**
   - Implemente o adaptador real em `src/infra/` (`AsyncStorage`, REST, etc.) convertendo erros em `DomainError` e conecte no `container.ts`.
8. **Verifique:** rode `npm run check` com zero erros e registre o `CHG-NNN` + checklist em `docs/harness/`.
