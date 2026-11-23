# Skill: nova-atividade-bncc

**Quando usar:** após aprovação do gate G1, quando o usuário solicitar uma nova atividade pedagógica BNCC.

1. Identificar a habilidade BNCC e ler `docs/engenharia/matriz-bncc.md`.
2. Vincular RF, UC, CA e teste; se ausentes, propor alterações documentais antes de codificar.
3. Especificar objetivo de aprendizagem, enunciado, resposta, feedback e erros comuns.
4. Seguir `docs/design-system/` (e `docs/design-proposta/` apenas se aprovada).
5. Implementar na ordem **Model → Infra (MemoryX / persistência) → Use Case → DI (`container.ts`) → ViewModel → View → rota fina em `app/`**.
6. Cobrir casos de borda matemáticos, ações dos botões, persistência, acessibilidade, 320dp e fontes ampliadas.
7. Rodar `npm run check` e preencher `docs/harness/04-checklist-entrega.md` e `docs/harness/07-registro-de-mudancas.md` com evidências reais.
8. Nunca declarar habilidade implementada ou teste aprovado sem comprovação.
