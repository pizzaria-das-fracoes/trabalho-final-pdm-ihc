# Estado e gates de aprovação

**Fase atual — implementação parcial existente; Harness em revisão.** Há código e documentação de implementação neste pacote. A auditoria estática identificou divergências de UI/arquitetura ainda abertas. O design proposto continua **NÃO APROVADO**; o Design System em `docs/design-system/` permanece a referência oficial. Publicação: **NÃO EXECUTADA**.

| Gate | Condição de saída | Situação |
|---|---|---|
| G0 Harness | documentação, checklist, rastreabilidade e verificadores com limites explícitos | em revisão após CHG-001 |
| G1 UX/arquitetura | wireframes Android aprovados; decisões de interação e arquitetura registradas; revisão humana da equipe | pendente — bloqueia novas implementações funcionais |
| G2 Fundação | app novo abre no Expo Go compatível; navegação e safe areas testadas | pendente |
| G3 Ensino | RFs priorizados implementados, matemática testada e BNCC rastreada | pendente |
| G4 Qualidade | Android pequeno/grande, acessibilidade, offline, testes, IHC | pendente |
| G5 Publicação | ícone, nome, políticas, conta de desenvolvedor, AAB e testes de loja | pendente |

**Regra:** a IA não pode marcar um gate como concluído apenas por escrever código ou documentação. Exigir evidência verificável. `activeGate` indica o próximo gate aberto; não significa que ele foi aprovado. Evidência deve ter caminho/identificador, data, ambiente e escopo. Ausência de evidência é `NÃO EXECUTADO`, nunca aprovação presumida.
