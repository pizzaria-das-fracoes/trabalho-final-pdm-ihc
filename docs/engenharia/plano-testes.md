# Plano de testes e evidências

## Status e convenções

Este é um plano: **todos os testes abaixo estão PLANEJADOS e NÃO EXECUTADOS**. O aplicativo não está implementado. Não há resultados PASSOU/FALHOU, captura Android ou evidência de conformidade nesta rodada. RF13/RF14 e T11 são futuros e excluídos da aprovação do MVP.

Manter os IDs T01–T15 existentes; T16 em diante são novos. Executar casos unitários e de integração em automação quando disponíveis; casos Android/UI exigem emulador ou dispositivo identificado. Em cada execução registrar versão do app/commit, ambiente, pré-condições, passos, resultado esperado/obtido, logs/capturas relevantes e status PASSOU/FALHOU/BLOQUEADO/NÃO EXECUTADO. Falha de ambiente é BLOQUEADO, nunca PASSOU.

## Casos planejados

| Teste | Tipo | Requisito/CA | Entrada/ação | Resultado esperado |
|---|---|---|---|---|
| T01 | Unitário | RF03/CA01 | Criar fração 3/4 e simplificar | Denominador positivo, valor preservado e representação válida; resultado reduzido conforme regra do domínio. |
| T02 | Unitário | RF04/CA02 | Comparar 1/2 e 2/4 | Igualdade exata, sem comparar floats. |
| T03 | Unitário | RF04/CA02 | Comparar 3/4 com 2/3 e 1/3 com 1/2 | Respectivamente maior e menor, usando comparação exata. |
| T04 | Unitário | RF05/CA03 | Equivalência 2/3↔4/6 e 2/3↔3/5 | Verdadeiro no primeiro par; falso no segundo. |
| T05 | UI | RF06/CA04 | Posicionar 3/2 na reta e usar controle acessível sem arrastar | Indicar 1,5, feedback explicado e tentativa registrada; tolerância de acerto previamente aprovada. |
| T06 | Unitário | RF07/CA05 | Converter 1/4 e classificar 1/3 | 1/4 = 0,25; 1/3 não pode ser tratado como decimal finito exato. |
| T07 | Unitário | RF08/CA06 | Calcular 3/4 de 20 | Resultado 15; operação definida sem perda de exatidão. |
| T08 | Unitário | RF09/CA07 | Calcular 1/2 + 1/3 e 3/4 − 1/2 | 5/6 e 1/4, simplificados. |
| T09 | Integração | RF11/CA09, RNF04/CA18 | Salvar tentativa/progresso, encerrar normalmente, reabrir sem rede | Dados confirmados persistem e são associados à habilidade correta, sem duplicação. |
| T10 | UI | RF12/CA14 | Abrir erro salvo na revisão e refazê-lo | Questão/contexto reabertos; tentativa anterior preservada; nova tentativa registrada após conferir. |
| T11 | Futuro | RF13–14 | Diagnóstico/adaptação | Apenas referência futura; não executar, não contar como cobertura nem como bloqueio do MVP. |
| T12 | Android/UI | RNF02/CA10, CA16 | Fluxos em 320, 393 e 430 dp; fonte ampliada, teclado e insets | Sem clipping/sobreposição; controles visíveis ou alcançáveis por rolagem. Matriz detalhada em T29. |
| T13 | Integração/UI | RNF05/CA19 | Ativar cada botão/controle e navegar por cada destino | Ação/feedback conforme inventário, sem rota quebrada ou controle sem comportamento. |
| T14 | Arquitetura | RNF07/CA21 | Executar auditoria de imports e rotas | Nenhuma violação/ciclo proibido; exports default válidos. |
| T15 | Build/compatibilidade | RNF01/CA15 | Checagem Expo e build Android de teste | Versões compatíveis segundo ferramenta oficial; build conclui e logs são registrados. |
| T16 | UI/integração | RF01/CA11 | Abrir trilha e selecionar objetivos EF06MA07–10 | Cada habilidade/objetivo é identificado; atividade disponível abre o destino correto; item indisponível não abre rota inválida. |
| T17 | UI/integração | RF02–03/CA01, CA12 | Aula de partes iguais; selecionar 0/4 e 3/4; tentar total zero/inválido | Texto conceitual precede atividade; pizza, numerador e denominador permanecem sincronizados; 0/4 é aceito; denominador inválido é bloqueado com mensagem, sem salvar tentativa válida. |
| T18 | Unitário/validação | RF02–04, RF07–09/CA01–07 | Numerador zero; denominador zero/negativo; entrada ausente, malformada, não inteira ou fora do intervalo permitido | Zero no numerador é válido; denominador não positivo e entradas inválidas são rejeitados com erro de domínio previsível, sem crash, resultado falso ou gravação inválida. Pizza fora de 2–8 partes é bloqueada conforme Design System v1.0.0. |
| T19 | Unitário | RF09/CA07 | Subtrair frações positivas em que o subtraendo é maior (ex.: 1/3 − 1/2) | Domínio produz resultado matemático assinado correto (-1/6), sem perder sinal. UI/questão com resultado negativo permanece fora do MVP até aprovação pedagógica explícita. |
| T20 | Unitário/robustez | RF03–09/CA01–07, CA20 | Valores mínimos/máximos permitidos, denominadores-limite e operações que excedem limite numérico | Validar limites aprovados; nenhuma operação pode retornar resposta silenciosamente inexata, overflow ou corrompida. Bloqueado até decisão do responsável pelo modelo sobre limites/overflow e representação de entrada inválida. |
| T21 | UI/conteúdo | RF10/CA08, CA13 | Resposta correta, incorreta, pedido de dica e tentativa repetida em cada família de atividade | Acerto tem explicação; erro tem orientação/dica antes da solução; texto respeitoso, específico e releível; feedback não depende de cor e não remove a tentativa. Conteúdo requer aprovação pedagógica. |
| T22 | Integração/UI | RF11–12/CA09, CA14 | Criar erro, consultar progresso, rever, corrigir, conferir e rever histórico | Erro original aparece uma vez; revisão conserva contexto e histórico; nova tentativa não sobrescreve a anterior nem aparece preenchida como nova resposta. |
| T23 | Integração Android | RF11–12/RNF04/CA09, CA18 | Desativar rede antes/durante atividades; salvar progresso e abrir revisão offline | Fluxos principais, persistência e revisão funcionam sem internet; estado não é perdido nem depende de resposta remota. |
| T24 | Integração/robustez | RF11–12/CA09, CA14 | Forçar encerramento inesperado após gravação confirmada e durante gravação | Após reabrir, gravações confirmadas permanecem; gravação interrompida não corrompe estado confirmado nem cria sucesso/duplicata falsa. Resultado depende do contrato de persistência aprovado. |
| T25 | Integração/recuperação | RF10–12/RNF04–05/CA13, CA18–19 | Simular falha de leitura, escrita e carregamento/conferência; repetir operação | Mensagem identifica falha técnica, não erro matemático; contexto e dados confirmados são preservados; repetição recupera somente a operação falha e não duplica tentativa. |
| T26 | Android/UI | RF01/RNF05/CA11, CA19 | Navegar trilha→atividade→progresso/revisão; pressionar Voltar do Android e testar raiz | Voltar retorna uma tela por vez, mantém estado e não salva tentativa duplicada. Na raiz, comportamento aprovado (por exemplo, permanecer/confirmar saída) é consistente e documentado antes de implementar. |
| T27 | Privacidade/integração | RNF08/CA22 | Inspecionar permissões, dependências, configuração e tráfego durante trilha, atividades, progresso, revisão e falhas | Nenhum dado pessoal é solicitado nem transmitido; não há analytics/telemetria ou endpoint pessoal no MVP; tráfego e permissões não essenciais estão ausentes ou justificados e aprovados. |
| T28 | Acessibilidade Android | RNF03/CA17 | TalkBack, foco, ordem de leitura, rótulos, anúncios, alvos e contraste em estados/temas aplicáveis | TalkBack identifica nome/papel/estado dos controles; feedback é anunciado sem repetição indevida; foco acompanha fluxo e não fica encoberto; alvos ≥48×48 dp sem sobreposição; texto normal ≥4,5:1 e contraste não textual medido separadamente. |
| T29 | Matriz Android/UI | RNF02–03/CA10, CA16–17 | Todas as telas/estados essenciais nas larguras 320, 393 e 430 dp, com fonte padrão e ampliada (mínimo proposto 150%), barras/gestos Android; repetir com teclado nas telas que o usam | Sem corte, sobreposição, alvo inacessível ou scroll horizontal involuntário; conteúdo e ações alcançáveis; composição mantém hierarquia. Registrar resolução de janela em dp, escala, Android, insets e evidência por célula. |
| T30 | Compatibilidade Android | RNF01/CA15 | Executar checks oficiais e build nos níveis de Android definidos na matriz de suporte aprovada | Sem incompatibilidade não justificada e build de teste instalável/aberto nos ambientes aprovados. Matriz de versões é pré-requisito. |
| T31 | Integração/UI | RF04–09/CA02–07, CA13, RNF06/CA20 | Percorrer comparação, equivalência, reta, decimais, fração de quantidade e operações; incluir resposta certa/errada e nova tentativa | Resultados e explicações correspondem aos casos aceitos; entradas inválidas não geram tentativa válida; fluxos persistem conforme UC e são rastreáveis a CA. |

## Matriz de validação de larguras e acessibilidade

| Largura da janela | Configuração mínima | Cobertura obrigatória |
|---|---|---|
| 320 dp | Fonte padrão e ampliada (150% proposto); barras/gestos do sistema; teclado quando aplicável | Todas as telas essenciais; rolagem e alcance de controles; pizzas e controles alternativos; feedback e navegação Voltar; TalkBack e foco nos fluxos principais. |
| 393 dp | Mesmas configurações | Mesma cobertura; verificar composição padrão e estados de conteúdo, erro e progresso. |
| 430 dp | Mesmas configurações | Mesma cobertura; verificar que largura adicional não distorce hierarquia, alinhamento ou dimensões equivalentes das representações. |

Em cada largura: pelo menos tema claro/escuro se ambos forem suportados; TalkBack ligado; rótulos, papéis, estados, ordem e anúncios; alvos medidos em dp; contraste textual e não textual medido em contexto. O Design System exige ampliação e TalkBack, mas esses resultados continuam não comprovados até execução. A escala de 150% é proposta para tornar o cenário reproduzível; confirmar/aprovar esse valor no G1. Dispositivos, versões Android, densidade, orientação e tamanhos de janela suportados precisam ser definidos na matriz técnica antes de G2.

## Condições objetivas de aprovação dos Gates

As condições abaixo operacionalizam os gates descritos em `docs/harness/00-estado-e-gates.md`; não alteram seu estado automaticamente. Gate só pode ser marcado aprovado quando os artefatos e evidências estiverem registrados e aceitos pelos responsáveis.

| Gate | Condições de saída sob qualidade | Evidência mínima |
|---|---|---|
| G1 — UX/arquitetura | Rastreabilidade RF→UC→CA→T completa para MVP e RNF→CA→T completa; decisões de fluxo, conteúdo e interface necessárias à implementação aprovadas; wireframes de 320 e 393 dp e cenários de fonte ampliada/estados aprovados; stack, versões, rotas/destinos, persistência e limites matemáticos acordados. RF13/RF14 identificados como futuros. | Aprovação registrada dos responsáveis; matriz de rastreabilidade sem lacunas de MVP; casos/CA/plano revisados. Nenhum teste Android é exigido ou declarado executado nesta etapa documental. |
| G2 — Fundação | App abre no ambiente compatível aprovado; build/check oficial passa; rotas e Voltar Android passam T13, T15, T26 e CA19; safe areas validadas nas larguras obrigatórias; nenhuma rota quebrada ou crash nos smoke tests. | Logs de checks/build e roteiro/capturas nos ambientes da matriz, com resultado PASSOU. |
| G3 — Ensino | RF01–RF10 do MVP implementados; todos os CA funcionais aplicáveis passam; testes matemáticos, incluindo inválidos, zero, sinal e limites acordados, passam; conteúdo e alinhamento BNCC revistos/validados pelos responsáveis pedagógicos. | Resultados T01–T08, T16–T21 e T31; rastreabilidade atualizada e aprovação de conteúdo. Nenhuma avaliação de aprendizagem é alegada sem estudo realizado. |
| G4 — Qualidade | Testes obrigatórios de acessibilidade, responsividade, navegação, offline, persistência, recuperação, privacidade e arquitetura passam; nenhuma falha bloqueadora/alta aberta; todos os controles cobertos; zero transmissão de dados pessoais observada nos fluxos testados. | Evidência T09–T10, T12–T14 e T22–T30; relatório por largura/configuração, logs, medições e revisão de riscos assinada. |
| G5 — Publicação | Gates anteriores aprovados; AAB de release gerado e instalado/testado em faixa interna/fechada; ficha, identidade, permissões, política de privacidade, público-alvo e declarações da loja revisados e consistentes; nenhum crash/bloqueador aberto no teste de release. | AAB/versionamento, logs de build e teste de loja, checklist de publicação e aprovações responsáveis. Não implica publicação efetiva sem submissão e aceite da loja. |

Os critérios de “nenhuma falha bloqueadora/alta aberta” e “todos os testes obrigatórios passam” são condições propostas de saída; a equipe deve aprová-los no G1 e registrar qualquer exceção com responsável e prazo. Tamanhos de amostra para avaliação com usuários, caso necessária, também dependem de aprovação IHC/pedagógica e não são inventados neste plano.

## Pendências que dependem de decisões externas

- **Agente pedagógico:** aprovar sequência e textos de RF02/RF10, conteúdos/objetivos por habilidade, níveis e itens de RF08, tolerância para reta, tratamento didático de decimais periódicos e se questões com resultado negativo entram em escopo futuro.
- **Responsável pelo modelo de domínio:** definir limites numéricos, política de overflow/precisão, normalização/sinal e retorno para entrada inválida. T20 permanece bloqueado até definição; não alterar `modelo-dominio.md` nesta rodada.
- **Responsável visual/UX:** aprovar wireframes e composição, navegação/destinos/ordem, comportamento de Voltar na raiz, escalas de fonte (150% proposto), estados e modo escuro; manter tokens do Design System como fonte normativa.
- **Responsável técnico/arquitetura:** aprovar matriz Android/Expo/React Native, biblioteca de navegação/controles, contrato/migração de persistência e forma de teste de encerramento inesperado; definir comandos automatizados disponíveis.
- **Privacidade/IHC:** aprovar inventário de permissões e método de captura de tráfego; definir protocolo de avaliação com estudantes somente se for realizado e aprovado.

## Relatório de execução

Para cada rodada, preencher resultados reais e anexar evidências, sem substituir resultados por expectativas. Nesta revisão documental: **testes Android, unitários do app, integração do app, acessibilidade em dispositivo, build e publicação — NÃO EXECUTADOS; aplicativo não implementado.**
