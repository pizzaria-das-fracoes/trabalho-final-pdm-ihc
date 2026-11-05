# Especificação de Requisitos — FatiaMática

| Campo | Valor |
| --- | --- |
| Projeto | FatiaMática (tema "Pizzaria das Frações") |
| Disciplinas | PDM e IHC — IFPI Campus Piripiri |
| Equipe | Nilson Rodrigo, Ana Rosa e Wesley Tiago |
| Versão do documento | 0.1 (rascunho para revisão da equipe) |
| Data | 05/11/2026 |
| Estado do produto | Fase documental. O aplicativo não está implementado na `main`. |

> **Aviso de estado.** Todos os requisitos abaixo estão **planejados**. Nenhum teste foi executado e nenhuma validação em Android, com estudantes ou pedagógica foi realizada. Este documento organiza a especificação existente em `docs/engenharia/` e `docs/design-system/`; ele não comprova implementação nem conformidade curricular.

## 1. Introdução

### 1.1 Propósito

Consolidar, em um único documento de leitura acadêmica, os requisitos do FatiaMática e a sua rastreabilidade (habilidade BNCC → requisito → caso de uso → critério de aceitação → teste), seguindo a estrutura recomendada pela norma ISO/IEC/IEEE 29148 (engenharia de requisitos), adaptada ao porte do projeto.

### 1.2 Escopo

O FatiaMática é um aplicativo Android educacional para estudantes do 6º ano do Ensino Fundamental aprenderem frações por meio de representações visuais (pizzas), atividades práticas e feedback explicativo, com uso offline e progresso guardado no próprio dispositivo.

- **Dentro do MVP:** trilha, aulas curtas, pizza, comparação, equivalência, reta numérica, fração de quantidade, soma e subtração, feedback, progresso local.
- **Fora do MVP:** login, chat com IA, ranking, pagamentos, publicidade, backend e geração de exercícios por LLM.
- **Futuro opcional:** diagnóstico inicial e prática adaptativa por regras transparentes (RF13 e RF14).

### 1.3 Definições e siglas

| Termo | Significado |
| --- | --- |
| BNCC | Base Nacional Comum Curricular. Os códigos EF06MA07 a EF06MA10 são habilidades do 6º ano, unidade temática Números. |
| RF / RNF | Requisito funcional / não funcional. |
| UC | Caso de uso. |
| CA | Critério de aceitação. |
| T | Teste planejado (T01–T15). |
| MVVM | Padrão de arquitetura Model–View–ViewModel, aqui na variante "MVVM Sofisticado" do projeto. |
| M3 | Google Material Design 3, sistema base do design system. |
| dp | Pixel independente de densidade (Android). |
| MDC | Máximo divisor comum, usado para simplificar frações. |

### 1.4 Referências (arquivos do repositório)

- [`docs/engenharia/visao-e-escopo.md`](../engenharia/visao-e-escopo.md)
- [`docs/engenharia/requisitos.md`](../engenharia/requisitos.md) — fonte dos IDs RF e RNF
- [`docs/engenharia/casos-de-uso.md`](../engenharia/casos-de-uso.md) — fonte dos IDs UC
- [`docs/engenharia/criterios-de-aceite.md`](../engenharia/criterios-de-aceite.md) — fonte dos IDs CA
- [`docs/engenharia/matriz-bncc.md`](../engenharia/matriz-bncc.md)
- [`docs/engenharia/modelo-dominio.md`](../engenharia/modelo-dominio.md)
- [`docs/engenharia/plano-testes.md`](../engenharia/plano-testes.md) — fonte dos IDs T
- [`docs/harness/`](../harness/00-estado-e-gates.md) — gates, arquitetura e critérios de qualidade
- [`docs/design-system/`](../design-system/README.md) — Fatia Design System v1.0.0

### 1.5 Convenções

- **Fonte única da verdade:** os identificadores (RF, RNF, UC, CA, T) são os de `docs/engenharia/`. Este documento **não renomeia nem redefine** nenhum deles; em caso de divergência, prevalece o arquivo de origem.
- **Prioridade:** alta, média ou futura, conforme `requisitos.md`.
- **Status:** *Planejado* (especificado, sem implementação nem evidência), *Implementado* e *Verificado* (ambos exigem evidência registrada; nenhum requisito está nesses estados).
- **†** marca uma associação **proposta neste documento** a partir do conteúdo dos itens, que não consta explicitamente na documentação de origem e deve ser confirmada pela equipe.

## 2. Descrição geral

### 2.1 Perspectiva do produto

Aplicativo móvel independente, sem backend, executado no dispositivo Android. A arquitetura alvo é MVVM Sofisticado em camadas (`app`, `view`, `viewmodel`, `usecase`, `model`, `infra`, `di`), descrita em [`docs/harness/01-arquitetura.md`](../harness/01-arquitetura.md). É uma especificação para o futuro aplicativo, não uma descrição de código existente.

### 2.2 Partes interessadas e usuários

| Ator | Descrição |
| --- | --- |
| Estudante (principal) | Aluno do 6º ano que realiza as atividades. |
| Professor/avaliador | Consulta as evidências e observa as atividades; não exige conta. |

### 2.3 Restrições

- Stack: Expo, React Native e TypeScript, com Expo Router (conforme `README.md` da raiz e `visao-e-escopo.md`).
- Plataforma: Android; dispositivos de baixo desempenho.
- Arquitetura: MVVM Sofisticado, com dependências apontando para dentro e proibição de importar `infra` em `view`, `viewmodel`, `model` e `usecase`.
- Design: Material Design 3 com o Fatia Design System; somente tokens documentados, sem valores visuais literais.
- Dados: offline por padrão; sem coleta de dados pessoais de crianças.

### 2.4 Premissas e dependências

- A redação oficial das habilidades BNCC deve ser validada com o documento oficial antes de qualquer publicação; as descrições do projeto são sínteses operacionais.
- A criação do aplicativo depende da aprovação do gate G1 (UX e arquitetura).
- O design visual novo em `docs/design-proposta/` está **pendente de aprovação** e não substitui o design system original.

## 3. Requisitos funcionais

| ID | Requisito | Prioridade | BNCC | UC | CA | Status |
| --- | --- | --- | --- | --- | --- | --- |
| RF01 | Exibir trilha com objetivos por habilidade | alta | EF06MA07–10 | — | — | Planejado |
| RF02 | Ensinar partes iguais, numerador e denominador com pizza | alta | EF06MA07 | UC01 | — | Planejado |
| RF03 | Montar pizza com fração válida e feedback visual | alta | EF06MA07 | UC01 | CA01 | Planejado |
| RF04 | Comparar e ordenar frações com justificativa | alta | EF06MA07 | UC02 | CA02 | Planejado |
| RF05 | Identificar e construir frações equivalentes | alta | EF06MA07 | UC03 | CA03 | Planejado |
| RF06 | Posicionar frações na reta numérica | alta | EF06MA08 | UC04 | CA04 | Planejado |
| RF07 | Relacionar frações e decimais positivos | média | EF06MA08 | UC05 | CA05 | Planejado |
| RF08 | Resolver fração de quantidade em problemas cotidianos | alta | EF06MA09 | UC06 | CA06 | Planejado |
| RF09 | Resolver adição e subtração de frações positivas | alta | EF06MA10 | UC07 | CA07 | Planejado |
| RF10 | Mostrar dicas graduais e explicar respostas | alta | EF06MA07–10 | UC01–UC07 | CA08 | Planejado |
| RF11 | Guardar progresso por habilidade no dispositivo | alta | apoio | UC08 | CA09 | Planejado |
| RF12 | Revisar respostas erradas e tentar novamente | média | apoio | UC08 | — | Planejado |
| RF13 | Oferecer diagnóstico inicial curto | futura | apoio | UC09 | — | Planejado (futuro) |
| RF14 | Selecionar desafios por regras de dificuldade | futura | apoio | UC09 | — | Planejado (futuro) |

Os campos UC e CA foram extraídos dos arquivos `casos-de-uso.md` e `criterios-de-aceite.md`. O símbolo "—" indica que **a documentação atual não registra** a ligação (ver seção 7.2).

### 3.1 Critérios de aceitação documentados

Resumo dos valores de referência de [`criterios-de-aceite.md`](../engenharia/criterios-de-aceite.md):

| CA | Requisito | Valor de referência |
| --- | --- | --- |
| CA01 | RF03 | Escolher 3 de 4 partes apresenta 3/4, com quatro partes iguais; zerar apresenta 0/4 sem falha. |
| CA02 | RF04 | 1/2 = 2/4; 3/4 > 2/3; 1/3 < 1/2; resposta errada recebe explicação. |
| CA03 | RF05 | 2/3 equivale a 4/6; 2/3 não equivale a 3/5. |
| CA04 | RF06 | 1/2 em 0,5 e 3/2 em 1,5 na reta 0–2; controle acessível sem arrastar obrigatório. |
| CA05 | RF07 | 1/4 corresponde a 0,25; 1/3 não é tratado como decimal finito exato. |
| CA06 | RF08 | 3/4 de 20 = 15 com explicação visual. |
| CA07 | RF09 | 1/2 + 1/3 = 5/6; 3/4 − 1/2 = 1/4; fração reduzida. |
| CA08 | RF10 | Após erro, dica conceitual antes da resposta; linguagem respeitosa e instrutiva. |
| CA09 | RF11 | Ao encerrar e reabrir o app, o progresso permanece sem internet. |
| CA10 | RNF02, RNF05 | Todos os botões acionáveis em Android compacto, com fontes ampliadas e barras de navegação ativas. |

## 4. Requisitos não funcionais

| ID | Requisito verificável | Verificação planejada | Status |
| --- | --- | --- | --- |
| RNF01 | Compatibilidade Android com versão Expo/React Native alinhada por ferramenta oficial | T15 † | Planejado |
| RNF02 | Nenhum controle interativo fora da área visível; verificar 320 dp e escala de fonte ampliada | CA10; T12 † | Planejado |
| RNF03 | Alvos de toque de pelo menos 48 dp; contraste de texto normal ≥ 4,5:1 | T12 † (medição dos alvos ≥ 48 dp, planejada e não executada); contraste calculado em `docs/design-system/06-acessibilidade.md` | Planejado |
| RNF04 | Fluxo principal utilizável offline, com dados locais | CA09 (parcial) | Planejado |
| RNF05 | Navegação sem rotas quebradas; botões com ação/feedback testados | CA10; T13 † | Planejado |
| RNF06 | Testes unitários de operações com frações e de integração dos fluxos críticos | T01–T04, T06–T09 (conforme `plano-testes.md`) | Planejado |
| RNF07 | Separação de camadas MVVM e auditoria automatizada de imports | T14 † | Planejado |
| RNF08 | Sem coleta remota de dados pessoais de crianças no MVP | — (ver seção 6) | Planejado |

## 5. Requisitos de interface e acessibilidade (IHC)

Decisões já registradas no Fatia Design System v1.0.0 e que restringem toda a interface. Cada item aponta para o arquivo de origem.

| Requisito de design | Origem |
| --- | --- |
| Usar Material Design 3 como sistema base e **somente tokens documentados**, sem cores, tamanhos ou raios literais | `docs/design-system/README.md` (seção 9), `03-fundamentos.md` |
| Apresentar, quando pertinente, a representação numérica junto à visual (princípio "Aprender visualmente") | `01-principios.md` |
| Manter uma ação principal por etapa, como "Conferir resposta" (princípio "Foco na tarefa") | `01-principios.md`, `05-padroes.md` |
| Feedback explicativo em texto e elementos visuais, sem depender somente de cor (princípio "Feedback que ensina") | `01-principios.md`, `03-fundamentos.md` |
| Contraste mínimo de 4,5:1 para texto comum; exceção documentada para controles inativos | `06-acessibilidade.md` |
| Alvo de toque mínimo de 48 dp por controle interativo | `06-acessibilidade.md` |
| Respeitar escala de fonte do Android e redução de movimento; permitir quebra de linha | `03-fundamentos.md`, `06-acessibilidade.md` |
| Pizza interativa com controles textuais equivalentes por parte; na comparação, pizzas estáticas e seleção por Radio Buttons M3 | `04-componentes/pizza-fracao.md`, `05-padroes.md` |
| Acompanhar progresso apenas de forma individual, sem ranking ou comparação competitiva | `05-padroes.md` (Padrão 2) |

Os contrastes citados foram **calculados** na documentação; não foram medidos em aparelho. Testes com TalkBack, foco e alvos em Android continuam pendentes.

## 6. Dados e privacidade

- Os dados ficam no dispositivo (RNF04, RNF08). Sem login, telemetria, analytics de terceiros ou coleta de dados de menores nesta versão (`AGENTS.md`, `03-criterios-qualidade.md`).
- Invariante do modelo de domínio: a persistência local **não armazena** nome, telefone, e-mail ou identificadores pessoais (`modelo-dominio.md`).
- **Não definido na documentação atual:** política de retenção, redefinição e exclusão do progresso local. Registrado como lacuna na seção 7.2.

## 7. Rastreabilidade

### 7.1 Habilidade BNCC → requisitos → casos de uso → critérios → testes

| Habilidade | Foco | RF | UC | CA | Testes planejados |
| --- | --- | --- | --- | --- | --- |
| EF06MA07 | Significados, comparação, equivalência e ordenação | RF02–RF05, RF10 | UC01–UC03 | CA01, CA02, CA03, CA08 | T01–T04 |
| EF06MA08 | Fração/decimal e reta numérica | RF06–RF07, RF10 | UC04–UC05 | CA04, CA05, CA08 | T05–T06 |
| EF06MA09 | Fração de uma quantidade | RF08, RF10 | UC06 | CA06, CA08 | T07 |
| EF06MA10 | Adição e subtração de frações positivas | RF09, RF10 | UC07 | CA07, CA08 | T08 |
| apoio | Progresso e revisão (sem habilidade BNCC própria) | RF11–RF12 | UC08 | CA09 | T09–T10 |
| futuro | Diagnóstico e prática adaptativa | RF13–RF14 | UC09 | — | T11 |

As colunas Habilidade, RF, UC e Testes reproduzem [`matriz-bncc.md`](../engenharia/matriz-bncc.md). A coluna CA resulta do cruzamento dos RF desta linha com a coluna CA da seção 3.

**Evidência:** nenhuma. Todos os testes estão **NÃO EXECUTADOS** (`plano-testes.md`), pois não há aplicativo implementado.

### 7.2 Lacunas de rastreabilidade identificadas

1. **RF01** não tem caso de uso nem critério de aceitação associados.
2. **RF02, RF12, RF13 e RF14** não têm critério de aceitação próprio.
3. **RNF01, RNF03, RNF04, RNF06, RNF07 e RNF08** não têm critério de aceitação; CA10 cobre apenas RNF02 e RNF05, e CA09 cobre parcialmente RNF04.
4. O plano de testes não registra ligações explícitas entre **T12 a T15** (Android, botões, arquitetura e build) e RNFs; as associações propostas nesta especificação, incluindo T12/RNF03, estão marcadas com †.
5. **Retenção, redefinição e exclusão do progresso local** não estão especificadas.
6. **Ordem de entrega** entre os RFs de prioridade alta não está definida.
7. A **redação oficial das habilidades BNCC** ainda precisa ser validada com o documento oficial.

Cada lacuna deve virar uma decisão da equipe antes do gate G1, e os documentos de origem em `docs/engenharia/` devem ser atualizados por Pull Request próprio.

## 8. Fora do escopo desta especificação

Login, chat com IA, ranking, pagamentos, publicidade, backend e geração de exercícios por LLM (`visao-e-escopo.md`). A publicação em loja segue o roteiro futuro de [`docs/publicacao/guia-android.md`](../publicacao/guia-android.md) e não está executada.

## 9. Histórico de revisões

| Versão | Data | Descrição |
| --- | --- | --- |
| 0.1 | 05/11/2026 | Primeira versão, consolidada a partir de `docs/engenharia/`, `docs/harness/` e `docs/design-system/`. |
