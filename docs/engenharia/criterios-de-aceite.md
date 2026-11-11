# Critérios de aceitação (planejados; não executados)

Os critérios abaixo tornam verificável o comportamento esperado do MVP. Os IDs CA01–CA10 foram preservados; CA11 em diante os complementam. Evidência exigida e cobertura estão no [plano de testes](plano-testes.md) e na [rastreabilidade](rastreabilidade-qualidade.md). Critério documentado não equivale a teste executado.

## Funcionalidades

- **CA01 (RF03):** selecionar 3 de 4 partes iguais exibe 3/4 e a pizza correspondente; selecionar zero exibe 0/4 sem falha. Uma tentativa inválida não altera a fração exibida nem é salva como válida.
- **CA02 (RF04):** comparar 1/2 = 2/4, 3/4 > 2/3 e 1/3 < 1/2 produz os sinais corretos. Após resposta incorreta, a justificativa explica a relação de valor e permite nova tentativa preservando a seleção até a alteração explícita.
- **CA03 (RF05):** 2/3 e 4/6 são identificadas como equivalentes; 2/3 e 3/5 não são. A justificativa mostra que a transformação equivalente mantém o valor.
- **CA04 (RF06):** 1/2 é localizado em 0,5 e 3/2 em 1,5 na reta 0–2; a mesma ação pode ser concluída sem arrastar. A tolerância de posição usada para correção deve estar aprovada e registrada antes da implementação.
- **CA05 (RF07):** 1/4 corresponde a 0,25; 1/3 não é exibido ou aceito como decimal finito exato. A regra de arredondamento/representação para periódicos deve estar aprovada antes de incluí-los em questões.
- **CA06 (RF08):** 3/4 de 20 resulta em 15; a resposta inclui explicação visual que relaciona divisão em partes iguais e quantidade selecionada.
- **CA07 (RF09):** 1/2 + 1/3 resulta em 5/6 e 3/4 − 1/2 resulta em 1/4, ambas reduzidas. Operandos inválidos não geram resultado nem tentativa válida. Cálculo de resultado negativo é coberto por teste unitário de domínio; questão de estudante com resultado negativo fica fora do MVP até aprovação pedagógica.
- **CA08 (RF10):** em resposta incorreta, exibir uma dica conceitual antes de revelar resposta ou solução completa; após a ação explícita de solicitar/continuar ajuda, apresentar explicação relacionada à questão. Em acerto, explicar por que a resposta representa o conceito. Linguagem respeitosa, texto disponível para releitura, sem depender somente de cor e sem apagar tentativa. A sequência e a redação de cada habilidade precisam de aprovação pedagógica.
- **CA09 (RF11):** tentativa e progresso por habilidade permanecem após encerrar e reabrir o app sem internet. Uma gravação interrompida não pode corromper dados previamente confirmados; comportamento de recuperação deve ser verificável.
- **CA10 (RNF02/RNF05):** em 320 dp, com fonte ampliada e barras/gestos Android ativos, todos os controles e destinos visíveis ou alcançáveis por rolagem permanecem acionáveis; não há clipping, sobreposição, rota quebrada ou botão sem ação/feedback.
- **CA11 (RF01):** a trilha apresenta objetivos associados a cada habilidade EF06MA07, EF06MA08, EF06MA09 e EF06MA10; toda atividade indicada como disponível abre seu destino correto. Habilidade/atividade indisponível é identificada e não abre rota inválida. Conteúdo e ordem devem corresponder à matriz BNCC validada e à navegação aprovada.
- **CA12 (RF02):** antes de solicitar interação, a atividade explica que o inteiro é dividido em partes iguais e identifica numerador como partes consideradas e denominador como total de partes; selecionar uma resposta atualiza o desenho e a representação a/b de forma sincronizada. O texto explicativo deve ser validado pedagogicamente.
- **CA13 (RF10):** cada resposta conferida, correta ou incorreta, apresenta resultado e explicação específica da habilidade; erro oferece dica sem revelar prematuramente a solução, preserva a tentativa e permite tentar de novo. A atualização é anunciada sem interromper indevidamente a leitura; conteúdo não pode ser apenas “certo/errado”.
- **CA14 (RF12):** cada resposta incorreta salva pode ser aberta em Revisão com enunciado/identificador e contexto necessários; “tentar novamente” reabre a questão sem preencher a resposta anterior como nova resposta nem apagar o histórico. Após conferir, a nova tentativa e seu resultado ficam registrados; questões sem erro não aparecem como erros revisáveis.

## Requisitos não funcionais

- **CA15 (RNF01):** a matriz de compatibilidade identifica versões suportadas de Android, Expo e React Native; `expo install --check` e `expo-doctor` não reportam incompatibilidade não justificada e o build Android de teste conclui. Versões e logs devem ser registrados; incompatibilidade justificada requer aceite técnico explícito.
- **CA16 (RNF02):** em 320, 393 e 430 dp, com escalas de fonte ampliada definidas em T28, telas e estados do MVP não cortam conteúdo ou controles; todas as ações são alcançáveis, incluindo com teclado e insets ativos.
- **CA17 (RNF03):** cada alvo interativo mede pelo menos 48 × 48 dp sem sobreposição; cada combinação de texto/fundo em uso atende 4,5:1 para texto normal, ressalvados controles inativos conforme WCAG. Contraste não textual, foco e estados gráficos têm medição própria. Relatório inclui medições por tema e estados relevantes.
- **CA18 (RNF04):** fluxos principais, leitura/gravação de progresso e revisão funcionam com conectividade desativada, sem depender de serviço remoto; falha de persistência é comunicada e não apresentada como sucesso.
- **CA19 (RNF05):** inventário de rotas e controles tem destino/efeito esperado. Cada destino abre a tela definida; botão Voltar do Android retorna uma tela por vez sem duplicar gravação ou descartar progresso confirmado. Não há exceção não tratada nos fluxos de navegação testados.
- **CA20 (RNF06):** operações e casos-limite definidos em T18–T20 têm testes unitários; T31 cobre integração dos fluxos críticos; falha em qualquer caso obrigatório bloqueia aprovação. Registrar comando e resultado real, sem inferir cobertura por existência de casos planejados.
- **CA21 (RNF07):** auditoria automatizada não encontra dependência proibida/ciclo entre camadas segundo as regras de `01-arquitetura.md`; rotas têm export default válido. Resultado e regra da auditoria ficam anexados à evidência.
- **CA22 (RNF08):** o app não solicita nome, telefone, e-mail, conta ou identificador pessoal no MVP; revisão do código/configuração não encontra analytics/telemetria ou endpoint remoto que transmita esses dados. Captura de tráfego durante os fluxos cobertos não mostra transmissão de dados pessoais. Permissões e tráfego não essenciais são ausentes ou justificados e aprovados.

## Escopo e aprovação

RF13 e RF14 não possuem critério de aceite do MVP e não entram no denominador de conclusão do MVP; T11 é apenas referência futura. Cada CA exige execução do teste relacionado e evidência registrada para ser declarado aprovado. Status nesta rodada: **PLANEJADO / NÃO EXECUTADO**.
