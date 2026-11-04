# Contrato obrigatório de qualquer agente — FatiaMática

1. **Não implemente o aplicativo nesta fase.** A fase atual é Harness + especificações. Não crie `src/`, `package.json`, `app.json`, nem dependências sem aprovação do usuário.
2. Leia, nesta ordem: `docs/harness/00-estado-e-gates.md`, `docs/engenharia/README.md`, `docs/engenharia/matriz-bncc.md`, `docs/design-system/README.md` e `docs/harness/01-arquitetura.md`.
3. Respeite o Design System M3 preservado em `docs/design-system/`. `docs/design-proposta/` contém sugestões pendentes, não tokens oficiais.
4. Exija rastreabilidade habilidade BNCC → requisito → caso de uso → critérios de aceite → teste → evidência.
5. Na futura implementação: `src/app` rotas finas; `src/view` UI sem lógica de domínio; `src/viewmodel` estado/ações; `src/usecase` regras de aplicação; `src/model` entidades e funções puras; `src/infra` adaptadores; `src/di` composição. Dependências dirigidas para dentro. Proibido importar infra em view/viewmodel/model/usecase.
6. Nenhum botão sem ação, rota sem export default válido, import quebrado, estado visual não testado, áudio dependente de módulo nativo indisponível, ou UI que ultrapasse a área segura.
7. Nunca invente testes, métricas, avaliações com crianças, validação Android ou conformidade BNCC. Documentação de alinhamento não equivale a validação pedagógica.
8. Para cada tarefa, preencher `docs/harness/04-checklist-entrega.md`, incluindo comandos realmente executados e resultado.
9. Sem login, telemetria, coleta de dados de menores ou serviços remotos sem justificativa, consentimento aplicável e revisão de privacidade.
10. A cada mudança de escopo, atualizar requisitos, casos de uso, matriz de rastreabilidade, design system e changelog conforme aplicável.
