# Requisitos (planejados; aplicativo não implementado)

## Requisitos funcionais

RF01–RF12 compõem o MVP descrito na visão e no escopo. RF13–RF14 são futuros e não podem ser tratados como entregues, aceitos ou requisito de saída dos gates do MVP.

| ID | Requisito | Prioridade | BNCC | Escopo |
|---|---|---|---|---|
| RF01 | Exibir trilha com objetivos por habilidade | alta | EF06MA07–10 | MVP |
| RF02 | Ensinar partes iguais, numerador e denominador com pizza | alta | EF06MA07 | MVP |
| RF03 | Montar pizza com fração válida e feedback visual | alta | EF06MA07 | MVP |
| RF04 | Comparar e ordenar frações com justificativa | alta | EF06MA07 | MVP |
| RF05 | Identificar e construir frações equivalentes | alta | EF06MA07 | MVP |
| RF06 | Posicionar frações na reta numérica | alta | EF06MA08 | MVP |
| RF07 | Relacionar frações e decimais positivos | média | EF06MA08 | MVP |
| RF08 | Resolver fração de quantidade em problemas cotidianos | alta | EF06MA09 | MVP |
| RF09 | Resolver adição e subtração de frações positivas | alta | EF06MA10 | MVP |
| RF10 | Mostrar dicas graduais e explicar respostas | alta | EF06MA07–10 | MVP |
| RF11 | Guardar progresso por habilidade no dispositivo | alta | apoio | MVP |
| RF12 | Revisar respostas erradas e tentar novamente | média | apoio | MVP |
| RF13 | Oferecer diagnóstico inicial curto | futura | apoio | Futuro; fora do MVP |
| RF14 | Selecionar desafios por regras de dificuldade | futura | apoio | Futuro; fora do MVP |

## Requisitos não funcionais

| ID | Requisito verificável |
|---|---|
| RNF01 | Compatibilidade Android com versão Expo/React Native alinhada por ferramenta oficial |
| RNF02 | Nenhum controle interativo fora da área visível; verificar 320dp e escala de fonte ampliada |
| RNF03 | Alvos de toque de pelo menos 48dp; contraste de texto normal >=4,5:1 |
| RNF04 | Fluxo principal utilizável offline, com dados locais |
| RNF05 | Navegação sem rotas quebradas; botões com ação/feedback testados |
| RNF06 | Testes unitários de operações com frações e de integração dos fluxos críticos |
| RNF07 | Separação de camadas MVVM e auditoria automatizada de imports |
| RNF08 | Sem coleta remota de dados pessoais de crianças no MVP |

## Aplicação e evidência

Os critérios verificáveis e os testes planejados estão em `criterios-de-aceite.md`, `plano-testes.md` e `rastreabilidade-qualidade.md`. O planejamento não comprova implementação ou execução. O plano identifica como pendentes as decisões pedagógicas e visuais que precisam de aprovação; nenhuma regra de conteúdo ou aparência em aberto deve ser inventada durante o desenvolvimento.
