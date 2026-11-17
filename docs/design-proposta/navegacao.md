# Proposta de navegação e IHC — Gate G1

> **Pendente de aprovação.** Fluxos e nomes de destinos abaixo são uma proposta de interface, não uma decisão já aprovada nem uma descrição de comportamento implementado. Não altera os requisitos de engenharia.

## 1. Destinos e mapa dos mundos

Propõe-se uma barra inferior persistente com quatro destinos principais, na mesma ordem em todas as telas raiz:

1. **Início** — retomar a atividade e abrir os mundos.
2. **Mundos** — explorar a trilha de quatro mundos.
3. **Progresso** — consultar o progresso individual por habilidade.
4. **Caderno de erros** — revisar questões que podem ser refeitas.

**Configurações** ficam em uma ação com rótulo acessível no cabeçalho do Início; a partir de outras telas, o caminho é Início → Configurações. Essa ação não ocupa um destino adicional da barra. A barra não aparece em etapas internas de aula, exercício, feedback ou resultado, para não competir com ações pedagógicas.

Os quatro cartões abaixo preservam a quantidade de mundos solicitada e agrupam os objetivos já presentes nos requisitos. **Nomes e agrupamento não existem na documentação anterior e dependem de aprovação.**

| Mundo (proposta) | Conteúdo vinculado | Referência |
|---|---|---|
| 1 — Frações e significados | partes iguais, comparação, equivalência e ordenação | EF06MA07 |
| 2 — Frações na reta e decimais | reta numérica e relação fração/decimal | EF06MA08 |
| 3 — Fração de uma quantidade | problemas com quantidades | EF06MA09 |
| 4 — Operações com frações | adição e subtração de frações positivas | EF06MA10 |

O mapa não usa bloqueio visual ou cor como única indicação de disponibilidade. A situação deve ser escrita em texto e anunciada. O protótipo não inventa percentuais, medalhas ou dependências entre mundos.

## 2. Fluxos principais

```text
Início ── Continuar ───────────────────────────> última atividade em andamento
   ├── Mundos ── Mundo ── Seleção ── Aula ── Exercício
   │                                            ├── incorreta → Feedback → tentar → Exercício
   │                                            └── correta ──> Feedback → continuar → Resultado
   ├── Progresso ── atividade/habilidade ──────> Aula ou Exercício
   ├── Caderno de erros ── questão ────────────> Exercício de revisão
   └── Configurações
```

### Seleção → aula → exercício

- Identificar o mundo e o objetivo antes da lista de atividades; cada item tem nome, tipo e estado em texto.
- A aula apresenta um conceito por etapa, representação e ação principal “Fazer exercício”.
- No exercício, manter enunciado e resposta visíveis, representar a fração visual e numericamente e oferecer controles equivalentes com pelo menos **48 × 48 dp**. Arrastar não pode ser a única forma de resposta.
- “Conferir resposta” é a única ação principal de resposta. Evitar envios repetidos enquanto o resultado está sendo preparado.
- Feedback matemático é explicativo, persistente e distinguível de erro técnico. Na resposta incorreta, manter a seleção e oferecer correção; em acerto, permitir avançar.
- Resultado resume a atividade sem ranking, deixa claro o que foi concluído e oferece “Próxima atividade”, “Revisar” ou retorno ao mundo conforme disponibilidade.

## 3. Retorno e navegação Android

- O botão de voltar do cabeçalho e o voltar do sistema executam a mesma ação: fecham a tela/diálogo mais recente ou retornam uma etapa da pilha.
- Se o teclado estiver aberto, o primeiro voltar apenas o dispensa. O conteúdo digitado permanece.
- De exercício para aula/seleção, voltar preserva a tentativa e o ponto de leitura; não reinicia atividade nem apaga resposta.
- Feedback → voltar retorna ao exercício com a tentativa preservada. Resultado → voltar mostra o exercício concluído em modo de consulta, sem reenviar a resposta.
- Ao abrir uma tela, posicionar o foco de leitura no título ou em um ponto inicial coerente; ao voltar, restaurar o foco no controle que iniciou a navegação, quando tecnicamente possível.
- Trocar destinos raiz mantém o rascunho e não envia a resposta. Ao retomar, oferecer “Continuar atividade” se houver uma em andamento.
- Em um destino raiz diferente de Início, o voltar do sistema leva ao Início. No Início, delega o comportamento de saída/background padrão do Android; o progresso já registrado não deve ser perdido.
- Só pedir confirmação antes de uma ação explicitamente destrutiva, como descartar uma tentativa ou apagar dados. O diálogo nomeia a consequência e oferece “Cancelar” como opção segura.

## 4. Responsividade planejada

| Quadro | Largura documental | Composição prevista |
|---|---:|---|
| Compacto | 320 dp | Coluna única; mundos empilhados; conteúdo rola; rótulos e controles quebram linha sem redução de fonte. |
| Intermediário | 393 dp | Cartões dos quatro mundos em grade 2 × 2 quando o texto couber; etapas de exercício continuam em coluna. |
| Amplo de telefone | 430 dp | Grade 2 × 2 com mais espaço interno; não esticar texto em linhas excessivamente longas nem mudar a hierarquia. |

Esses quadros são wireframes documentais em CSS pixels a escala 1×, não medição de densidade física. Os cartões refluem sem rolagem horizontal; se texto ampliado reduzir a largura útil, a composição volta a uma coluna. Não há breakpoint validado em aparelho.

### Safe Area, rolagem, orientação e teclado

- Respeitar insets superior e inferior do sistema e gestos Android. Cabeçalho e ações não ficam atrás da barra de status, recortes ou barra de navegação.
- Manter conteúdo em coluna flexível, com rolagem vertical quando necessário. CTA não usa posição absoluta sobre o conteúdo; pode ficar no fluxo após o conteúdo.
- Permitir quebra de texto e crescimento de cartões, botões e mensagens. Não fixar altura que corte conteúdo e não comprimir a fonte para preservar o wireframe.
- Planejar orientação retrato como apresentação principal. Em paisagem, manter rolagem e acesso a ações; a política final (suporte integral ou retrato preferido) precisa ser confirmada e verificada em aparelho.
- Em campo digitável, preservar valor e foco ao abrir o teclado, ajustar a área rolável aos insets do teclado e manter o campo e a ação acessíveis. O teclado não deve cobrir o único meio de continuar.
- Não usar rolagem horizontal para conteúdo da atividade. A reta numérica, se maior que a área, exige alternativa de resposta acessível sem arraste.

## 5. Estados transversais

| Estado | Apresentação e recuperação |
|---|---|
| **Carregamento** | Preservar título e conteúdo já disponível; mostrar “Preparando…” ou “Carregando…” em texto. Não permitir ação que dependa de dados ainda indisponíveis. Não usar animação como única indicação. |
| **Vazio** | Explicar o que está ausente e oferecer próximo passo útil, por exemplo abrir um mundo; diferenciar “ainda não há progresso” de falha. |
| **Erro técnico** | Informar a operação que falhou, preservar tentativa e contexto e oferecer “Tentar novamente” para repetir só essa operação. Não apresentar erro técnico como erro matemático. |
| **Sucesso** | Mostrar resultado por texto, manter a explicação disponível para releitura e indicar claramente como avançar ou retornar. |
| **Interrupção** | Ao sair, bloquear o aparelho ou alternar aplicativo, não descartar uma tentativa sem aviso. Propor preservação local do rascunho e da atividade atual; confirmar persistência na implementação. |
| **Recuperação** | No retorno, oferecer continuação explícita e restaurar a atividade e a resposta registrada. Se a restauração falhar, explicar isso, preservar o que for possível e oferecer recomeço com confirmação. |

Persistência de rascunho e restauração são recomendações de UX; precisam de decisão de produto/arquitetura e testes antes de serem tratadas como garantidas.

## 6. Checklist de IHC por wireframe

| Tela | Hierarquia e ação principal | Estados/retorno a representar |
|---|---|---|
| Início | Retomar atividade ou escolher mundo; configurações identificáveis | Primeiro uso sem atividade; retomada e falha ao restaurar |
| Mapa dos quatro mundos | Quatro destinos com habilidade/objetivo legíveis | Situação de cada mundo em texto; sem depender de cor |
| Seleção de atividades | Mundo atual, objetivo e lista com nomes claros | Vazio, indisponibilidade, retomada e voltar ao mapa |
| Aula | Conceito, representação e ação “Fazer exercício” | Avançar/voltar sem perder etapa; ampliar conteúdo |
| Exercício | Uma instrução, resposta acessível e “Conferir resposta” | Carregando, erro técnico, vazio, seleção, foco e interrupção |
| Feedback | Resultado + explicação + próximo passo | Acerto/incorreto; tentar de novo preserva seleção |
| Resultado | O que foi concluído e opções seguintes não competitivas | Carregamento, erro e retorno ao exercício em modo de consulta |
| Progresso | Dados individuais apresentados em texto por habilidade | Carregando, vazio, erro técnico e conteúdo disponível |
| Caderno de erros | Questões refeitas com contexto e ação de revisão | Vazio, indisponibilidade e retorno sem perder o lugar na lista |
| Configurações | Preferências nomeadas; não usar apenas ícones ou cor | Estado atual legível e retorno à tela de origem |

Os quadros visuais estão em [prototipos-g1.html](prototipos-g1.html). Eles são propostas estáticas e não confirmam comportamento real.

## 7. Acessibilidade especificada

- **Alvos:** cada ação e controle tem área de toque de pelo menos **48 × 48 dp**, com espaçamento que evite alvos sobrepostos. O protótipo usa botões com altura mínima equivalente, mas isso não valida dp em aparelho.
- **TalkBack:** título antes do conteúdo; rótulo persistente em cada controle; nome acessível descreve a ação; papel e estado selecionado/indisponível são expostos. Ícones decorativos ficam fora da leitura.
- **Ordem de foco:** título → objetivo/enunciado → representação e resumo → controles da resposta em ordem visual → ação principal → feedback e próximos passos. Navegação raiz segue Início, Mundos, Progresso, Caderno de erros.
- **Pizza:** resumo anuncia denominador, numerador e quantidade; controles equivalentes identificam “Fatia N de D” e estado marcado. A pizza estática não recebe foco acionável.
- **Feedback:** atualizar região de status sem interrupção indevida, preservar foco e oferecer conteúdo para releitura; nunca depender apenas de vermelho/verde, ícone ou som.
- **Texto ampliado:** obedecer à escala Android, quebra de linha e rolagem; aumentar containers, não reduzir texto nem truncar rótulos. Se necessário, empilhar conteúdo.
- **Cores:** acerto, erro, seleção e estado desabilitado também têm rótulo, forma, contorno ou estado semântico. Os pares cromáticos propostos estão separados e pendentes de aprovação em [08-proposta-paleta-atelie.md](../design-system/08-proposta-paleta-atelie.md).
- **Movimento:** respeitar redução de movimento e apresentar estado final e feedback sem depender de animação.

## 8. Revisão pelas dez heurísticas de Nielsen

| Heurística | Como a proposta atende | Verificação pendente |
|---|---|---|
| 1. Visibilidade do estado do sistema | Estados de carregamento, vazio, erro, conclusão e interrupção têm mensagens e recuperação. | Revisar tempos e anúncios em aparelho; não esconder estados em cor. |
| 2. Correspondência com o mundo real | Vocabulário simples, frações com pizza e objetivos ligados às habilidades do 6º ano. | Validar compreensão e nomes com equipe/professor; não houve estudo com estudantes. |
| 3. Controle e liberdade | Voltar, tentar novamente, continuar, preservar rascunho e cancelar ações destrutivas. | Confirmar contrato técnico de persistência e fluxo de saída. |
| 4. Consistência e padrões | Quatro destinos estáveis, hierarquia e ação principal coerentes; Material 3 como referência. | Aprovar navegação, paleta e tokens; testar consistência em todas as telas. |
| 5. Prevenção de erros | Instrução explícita, controle de seleção, conferência deliberada e confirmação de descarte. | Validar texto e prevenção de resposta incompleta nos tipos de exercício. |
| 6. Reconhecimento em vez de memorização | Mundo, habilidade, estado, rótulos e alternativas ficam visíveis junto à ação. | Verificar truncamento em 320 dp e fonte ampliada. |
| 7. Flexibilidade e eficiência | Retomada, revisão e dicas graduais sem exigir arrastar. | Definir regras de retomada e dica sem penalização nem fluxos ocultos. |
| 8. Estética e design minimalista | Um foco principal, paleta quente proposta e decoração subordinada à matemática. | Aprovar identidade e revisar densidade nos wireframes reais. |
| 9. Reconhecimento, diagnóstico e recuperação de erros | Erro matemático recebe orientação; falha técnica tem mensagem e repetição própria. | Testar recuperação de falha/interrupção sem perda de resposta. |
| 10. Ajuda e documentação | Aula contextual, instruções curtas e acesso a configurações e revisão. | Confirmar se ajuda contextual adicional é necessária; não há teste de compreensão. |

## 9. Pendências antes do Gate G1

1. Aprovar ou rejeitar formalmente a paleta e a proposta de tokens, sem alterar os valores oficiais antes disso.
2. Aprovar os quatro nomes/agrupamentos de mundos e os destinos da navegação.
3. Revisar os dez wireframes, textos e estados; ajustar componentes e affordances.
4. Validar visualmente 320 dp, 393 dp e 430 dp, ampliação de fonte, Safe Area e teclado em emulador/aparelho Android.
5. Testar TalkBack, ordem de foco, rótulos, anúncios e alvos de toque em Android real.
6. Confirmar com a equipe o contrato de retorno, rascunho local e recuperação após interrupção.

**Nenhum teste Android, TalkBack, contraste em tela ou avaliação com estudantes é declarado como executado nesta rodada.**
