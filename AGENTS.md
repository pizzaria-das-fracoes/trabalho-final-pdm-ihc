# FatiaMática — contexto e regras para agentes

## Escopo e estado atual

- Projeto acadêmico de IHC + PDM, IFPI Campus Piripiri.
- Aplicativo: **FatiaMática**. Sistema de design: **Fatia Design System**, versão documental **1.0.0**.
- Objetivo: apoiar estudantes do 6º ano na aprendizagem de frações por meio de pizzas visuais e atividades interativas, em alinhamento conceitual com a BNCC EF06MA07.
- Plataforma principal: Android.
- Stack planejada para a implementação futura: **React Native + TypeScript + Expo**.
- A entrega atual é o Design System em `docs/design-system/`. O aplicativo ainda não deve ser inicializado: não criar projeto Expo/React Native, `package.json`, `src/`, `app/` nem instalar dependências sem uma decisão posterior da equipe.
- O Design System já possui princípios, tokens, fundamentos, seis componentes, padrões, acessibilidade, teste com IA e changelog. Não trate esses arquivos como templates vazios nem reabra decisões consolidadas sem uma inconsistência concreta.
- A fase atual é documental e de design; não inicialize o aplicativo nesta etapa.

## Fonte de verdade e requisitos acadêmicos

- Use `docs/design-system/` como fonte de verdade para decisões de interface.
- Leia `01-principios.md`, `02-tokens.md`, `03-fundamentos.md`, o componente relevante em `04-componentes/` e `06-acessibilidade.md` antes de propor uma tela.
- Use exclusivamente **Google Material Design 3** como sistema base.
- Preserve as classificações **Herdado**, **Adaptado** e **Novo** e suas justificativas.
- Não invente tokens, componentes, estados, resultados de testes, requisitos ou funcionalidades para preencher lacunas.
- Não adicione login, cadastro, backend, persistência remota, autenticação ou ranking competitivo na versão 1.0.0.
- Preserve nomes de arquivos e a organização atual da documentação.

## Experiência e funcionalidades

Telas planejadas:

1. Boas-vindas
2. Início
3. Monte sua pizza
4. Compare as pizzas
5. Frações equivalentes
6. Meu progresso

Funcionalidades centrais:

- **Monte sua pizza:** representar uma fração por meio de partes iguais da pizza.
- **Compare as pizzas:** comparar duas representações de frações.
- **Frações equivalentes:** reconhecer representações equivalentes.
- **Meu progresso:** apresentar o progresso individual do estudante, sem ranking competitivo.

Direção visual: educativa, amigável, lúdica e simples, adequada ao 6º ano sem infantilização excessiva. A pizza é principalmente uma representação matemática, não decoração.

## Princípios consolidados

- **Aprender visualmente:** relacionar representação numérica e visual da fração quando pertinente.
- **Foco na tarefa:** manter hierarquia clara e uma ação principal por etapa.
- **Feedback que ensina:** explicar o resultado da ação; não limitar o retorno a “certo” ou “errado”.

## Tokens e fundamentos consolidados

- Paleta clara principal: `color.action = #8C3900`, `color.on-action = #FFFFFF`, `color.surface = #FFF8F4`, `color.on-surface = #241A14`.
- Paleta escura principal: `color.action = #FFB68A`, `color.on-action = #512000`, `color.surface = #1B120D`, `color.on-surface = #F1DFD4`.
- Erro segue os papéis Material 3 documentados em `02-tokens.md`.
- Tipografia: Roboto; estilos documentados em `02-tokens.md`.
- Ícones: Material Symbols.
- Espaçamento preserva a escala acadêmica em px: `space-4`, `space-8`, `space-16`, `space-24`, `space-32`.
- Semânticos: `space.sm → space-8`, `space.md → space-16`, `space.lg → space-24`.
- Não converter automaticamente os tokens de espaçamento de px para dp.
- Alvo mínimo de toque: **48 dp**.
- Use tokens nos componentes; não espalhe valores visuais arbitrários.
- Não comunicar acerto, erro, seleção ou estado somente por cor.
- Preserve `color.action` e seus papéis semânticos documentados; não substitua a ação principal por uma cor arbitrária.

## Componentes documentados

Os seis componentes oficiais da versão 1.0.0 estão em `docs/design-system/04-componentes/`:

- `botao.md`
- `campo-de-texto.md`
- `card-atividade.md`
- `barra-navegacao.md`
- `pizza-fracao.md`
- `feedback-aprendizagem.md`

### PizzaFracao

Componente **Novo** e central do FatiaMática. A versão 1.0.0 define:

- `pizza.size = 176 dp`;
- `pizza.separator-width = 2 dp`;
- partes selecionadas por `pizza.selected` e não selecionadas por `pizza.unselected`;
- denominadores de 2 a 8;
- resumo textual obrigatório;
- controles textuais equivalentes com alvo mínimo de 48 dp quando houver interação;
- seleção nunca comunicada somente por cor.

Não substitua esses valores por medidas arbitrárias nem torne fatias pequenas o único meio de interação.

Em “Compare as pizzas”, as duas representações são estáticas e a seleção da resposta ocorre por Radio Buttons Material 3; as fatias não são opções de resposta.

## Acessibilidade e verificação

- Contraste de texto: mínimo de 4,5:1 quando aplicável; use as razões já calculadas em `02-tokens.md` e `06-acessibilidade.md`.
- Alvos de toque: mínimo de 48 dp.
- Foco visível e ordem coerente.
- Rótulos, papéis e estados acessíveis.
- Representações gráficas precisam de alternativa textual.
- Respeitar texto ampliado e redução de movimento.
- Não declarar teste em Android, TalkBack ou com usuários sem evidência de execução real.

## Implementação futura

- React Native + TypeScript + Expo é a stack planejada, mas ainda não há aplicativo inicializado.
- Backend, autenticação, persistência remota, navegação e bibliotecas concretas serão decididos na fase de implementação.
- Até essas decisões existirem, não presumir Firebase, Supabase, login ou serviço remoto.
- Exemplos TSX presentes na documentação são ilustrativos do contrato do Design System e não constituem código do aplicativo.

## Regra para geração de interface

Ao gerar ou revisar uma tela, use exclusivamente o Fatia Design System fornecido. Liste ao final os tokens e componentes utilizados. Se uma necessidade não estiver coberta, registre a lacuna em vez de inventar um valor.
