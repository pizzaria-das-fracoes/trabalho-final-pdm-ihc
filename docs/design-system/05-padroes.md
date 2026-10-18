# Padrões


## Padrão 1: Resolver atividade de fração

- **Objetivo do usuário:** Compreender e responder uma atividade envolvendo frações por meio da representação visual da pizza.
- **Componentes usados:** [PizzaFracao](04-componentes/pizza-fracao.md), [Botao](04-componentes/botao.md) e [FeedbackAprendizagem](04-componentes/feedback-aprendizagem.md).
- **Passos:**
  1. Apresente o enunciado e a fração solicitada; use `font.title` para o título e `font.body` para a instrução.
  2. Apresente a representação visual correspondente com `PizzaFracao` e sua alternativa textual; não introduza outro componente para a fração numérica.
  3. Permita interagir com as partes somente quando a atividade exigir seleção; ofereça os controles textuais equivalentes e alvos mínimos de 48 dp previstos em `PizzaFracao`.
  4. Mantenha numerador, denominador, seleção textual e representação visual sincronizados.
  5. Permita conferir a resposta com `Botao`, rotulado “Conferir resposta”, como ação principal; use os tokens `button.*` definidos em `02-tokens.md`.
  6. Apresente `FeedbackAprendizagem` com uma explicação curta da relação entre a resposta e a fração solicitada; não dependa somente de cor.
  7. Em tentativa incorreta, preserve a seleção, permita corrigi-la e conferir novamente; não reinicie a atividade automaticamente.
- **Estados que precisam de tela:**

| Situação | O que o usuário vê | Componentes e tokens |
| --- | --- | --- |
| Carregando | Preserve o enunciado e a tentativa já disponíveis; informe “Preparando a atividade…”. Não permita conferir enquanto o conteúdo estiver incompleto. | Texto com `font.body`, `color.on-surface` sobre `color.surface`; `space.md` nas margens e `space.sm` entre elementos relacionados. Se `Botao` já estiver visível, use `button.bg-disabled` e `button.label-disabled`. Não acrescente spinner. |
| Erro | Informe “Não foi possível carregar a atividade” ou “Não foi possível conferir a resposta”, conforme a falha. Preserve o contexto e a tentativa. Ofereça “Tentar novamente” para repetir somente a operação que falhou. | Texto de erro com `font.body` e `color.error` sobre `color.surface`; `Botao` com `button.bg`, `button.label`, `button.radius` e `button.font`. Não apresente falha técnica como resposta matemática incorreta. |
| Vazio | Informe “Nenhuma atividade disponível no momento”. Não exiba uma pizza vazia como questão válida nem ofereça conferir uma resposta inexistente. | Texto com `font.body`, `color.on-surface` e `color.surface`; organização com `space.md` e `space.sm`. Não renderize `PizzaFracao` sem dados válidos. |
| Sucesso | Mostre enunciado, fração e `PizzaFracao`. Após a conferência, apresente `FeedbackAprendizagem`; em tentativa incorreta, mantenha a atividade disponível para correção. | `PizzaFracao`, `Botao` e `FeedbackAprendizagem`; `font.title`, `font.body`, `font.label`, `color.surface`, `color.on-surface`, tokens `button.*` existentes, `space.sm`, `space.md` e `space.lg`. Siga as especificações dos componentes sem criar cores para fatias. |

- **Faça:** Mantenha uma ação principal por vez, texto ampliável, alternativa textual da pizza e feedback que explique a resposta; siga `03-fundamentos.md` e as restrições gráficas de `PizzaFracao`.
- **Evite:** Não apague a tentativa incorreta, não dependa apenas de cor e não confunda erro de processamento com erro de aprendizagem.

### Variação: comparar duas frações

- **Objetivo do usuário:** Identificar qual de duas frações representa a maior quantidade.
- **Componentes e seleção:** Use [PizzaFracao](04-componentes/pizza-fracao.md) para as duas representações visuais, seleção única acessível herdada dos radio buttons Material 3 conforme esse componente, [Botao](04-componentes/botao.md) para conferir e [FeedbackAprendizagem](04-componentes/feedback-aprendizagem.md) para explicar o resultado. Não crie tokens ou um componente local adicional para a seleção única.
- **Passos:**
  1. Apresente o enunciado para identificar a fração que representa a maior quantidade.
  2. Apresente duas `PizzaFracao` estáticas, representando inteiros de dimensões equivalentes e com o mesmo `pizza.size`, com partes iguais dentro de cada inteiro; não altere fatias ao escolher uma opção.
  3. Apresente a representação numérica/textual de cada fração junto à pizza correspondente.
  4. Permita selecionar exatamente uma das duas opções exclusivamente por Radio Button Material 3 para seleção única. Identifique a fração no rótulo de cada opção, exponha seu estado selecionado e preserve alvo mínimo de 48 dp e foco herdado do controle M3; as fatias das pizzas não são opções de resposta.
  5. Não use dois botões principais preenchidos como opções; após a seleção, use uma única ação principal `Botao` com o rótulo “Conferir resposta”.
  6. Depois da conferência, use `FeedbackAprendizagem` para explicar qual fração representa a maior quantidade e relacionar o resultado às representações.
  7. Preserve a escolha quando estiver incorreta e permita selecionar novamente e conferir outra tentativa.
- **Composição e texto ampliado:** Em largura insuficiente ou com texto ampliado, empilhe as duas representações mantendo dimensões equivalentes. Não reduza arbitrariamente texto ou pizzas para forçar disposição lado a lado. Não defina breakpoint numérico. Use `space.md` nas margens, `space.sm` entre elementos relacionados e `space.lg` entre grupos, sem acrescentar valores visuais.
- **Estados:** Aplique os estados Carregando, Erro, Vazio e Sucesso do padrão acima. A seleção da opção não é seleção de fatias; herde os estados do controle de seleção única e preserve a escolha nas tentativas incorretas.
- **Recorte da versão 1.0.0:** O indicador de progresso não faz parte da tela “Compare as pizzas” no recorte atual do Design System v1.0.0; a IA não deve inventar componente, aparência, tokens ou comportamento para ele.

## Padrão 2: Acompanhar progresso

- **Objetivo do usuário:** Consultar o próprio progresso nas atividades, sem ranking ou comparação competitiva com outros estudantes.
- **Componentes usados:** [CardAtividade](04-componentes/card-atividade.md); use [BarraNavegacao](04-componentes/barra-navegacao.md) somente se a arquitetura final incluir “Meu progresso” como destino principal. Para recuperação de erro, use [Botao](04-componentes/botao.md) quando houver uma operação que possa ser repetida.
- **Passos:**
  1. Permita acessar “Meu progresso” pelo caminho definido na arquitetura futura; não defina agora os destinos finais da `BarraNavegacao`.
  2. Apresente as atividades realizadas e o progresso individual disponível em texto; use `font.title` no título e `font.body` nas informações. Não invente métricas ou dados ausentes.
  3. Organize as informações por atividade usando `CardAtividade` quando houver uma ação disponível; mantenha os demais dados como texto, sem criar outro componente.
  4. Permita abrir uma atividade para continuar ou praticar novamente quando a ação estiver disponível; preserve o nome e a finalidade no rótulo acessível do card.
  5. Mantenha o acompanhamento individual; não crie ranking, pontuação competitiva ou comparação com outros estudantes.
- **Estados que precisam de tela:**

| Situação | O que o usuário vê | Componentes e tokens |
| --- | --- | --- |
| Carregando | Informe “Carregando seu progresso…”. Preserve o título e o contexto; não apresente valores provisórios como resultados reais. | Texto com `font.body`, `color.on-surface` sobre `color.surface`; `space.md` nas margens. Preserve `BarraNavegacao` apenas quando já fizer parte da arquitetura; não acrescente indicador visual novo. |
| Erro | Informe “Não foi possível carregar seu progresso”. Preserve os dados já disponíveis, identificando-os como anteriores quando necessário; ofereça “Tentar novamente” se for possível repetir o carregamento. | Texto com `font.body` e `color.error` sobre `color.surface`; `Botao` de recuperação com `button.bg`, `button.label`, `button.radius` e `button.font`, somente quando aplicável. |
| Vazio | Informe “Você ainda não concluiu atividades” e oriente a realizar uma atividade. Se houver atividade disponível para abrir, apresente seu card; não trate ausência de progresso como erro. | Texto com `font.body`, `color.on-surface` e `color.surface`; `CardAtividade` quando apropriado, com `radius.lg`, `elevation.card`, `font.title`, `font.body`, `space.md` e `space.sm`. |
| Sucesso | Apresente o progresso individual disponível e as atividades correspondentes. Ofereça continuar ou praticar novamente somente quando houver essa ação. | Texto e `CardAtividade` quando apropriado; `color.surface`, `color.on-surface`, `font.title`, `font.body`, `radius.lg`, `elevation.card`, `space.sm`, `space.md` e `space.lg`. Use `BarraNavegacao` somente na condição arquitetural indicada. |

- **Faça:** Apresente somente dados disponíveis, diferencie ausência de progresso de falha de carregamento e preserve leitura com texto ampliado; garanta alvo mínimo de 48 dp nos cards, botões e destinos interativos.
- **Evite:** Não introduza login, cadastro, ranking, métricas competitivas ou destinos de navegação não aprovados; não crie gráficos ou componentes apenas para preencher os estados.
