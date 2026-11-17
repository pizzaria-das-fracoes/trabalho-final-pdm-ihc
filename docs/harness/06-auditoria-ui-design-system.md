# Auditoria estática da UI e do Design System

**Data:** 17/11/2026  
**Escopo:** leitura estática de `src/`, dos tokens e componentes documentados em `docs/design-system/`, da proposta visual e das regras do Harness. Não houve edição do app nem validação visual em aparelho.

## Parecer

A implementação presente no projeto não está alinhada ao Design System em pontos centrais de representação matemática, seleção e hierarquia. A proposta do protótipo é útil como referência para priorizar pizza grande, instrução curta e menos elementos concorrentes; ela não prova conformidade nem substitui a aprovação do gate G1.

Os verificadores `check_architecture.py` e `check_harness.py` passaram, mas não verificam geometria da pizza, mapeamento de tokens, papéis de seleção, densidade de conteúdo, estados de foco, ou se as Views seguem o contrato do Harness. Portanto, seus resultados não certificam a experiência visual.

## Achados priorizados

| Prioridade | Arquivo(s) | Achado | Regra relacionada e consequência |
|---|---|---|---|
| **P0 — Gate** | `AGENTS.md`; `docs/harness/00-estado-e-gates.md`; `harness.config.json`; `scripts/check_harness.py` | As instruções dizem que esta fase é Harness/especificação e proíbem implementação; o estado marca G1 pendente e “app não implementado”; a configuração permite implementação parcial e indica G2 ativo; o código e o checklist já registram um app. O verificador exige `appImplementationAllowed: true`. | As fontes de verdade discordam sobre escopo e gate. Não tratar o “PASSOU” do checker como aprovação de G1/G2. O responsável pelo projeto precisa reconciliar esses estados antes de avançar gate ou implementar mais UI. |
| **P1 — Representação matemática** | `src/view/components/Pizza.tsx:4-37`; `src/view/tokens.ts:15`; `docs/design-system/04-componentes/pizza-fracao.md` | A pizza é montada com retângulos de 50% rotacionados e sobrepostos, não com setores radiais independentes. O componente aceita `onToggle`, mas não o usa. O token local define separador claro e parte vazia cinza (`#E5DDD9`); o contrato pede separador `color.on-surface` e parte vazia `color.surface`. A espessura de borda está literal no componente, sem token aplicado. | As fatias não representam partes iguais de forma confiável, e o visual diverge diretamente do contrato `PizzaFracao`. O resumo mostra apenas `N/D`, sem a descrição acessível completa especificada. |
| **P1 — Controles da pizza** | `src/app/pizza.tsx:21-30`; `src/view/components/ActionButton.tsx:4-15`; `docs/design-system/04-componentes/pizza-fracao.md` | A seleção alternativa usa botões genéricos. O rótulo muda entre “selecionada/não selecionada”, mas o controle não expõe `checkbox` nem estado `checked`. | O contrato exige uma caixa de seleção por fatia, rótulo “Fatia N de D”, estado checked e alvo de pelo menos 48 dp. Alvo mínimo existe, sem a semântica exigida. |
| **P1 — Comparação** | `src/app/compare.tsx:15-25`; `src/view/components/ActionButton.tsx`; `docs/design-system/05-padroes.md` | As opções “Escolher 3/4” e “Escolher 2/3” são botões primários preenchidos. O padrão exige Radio Buttons M3 para seleção única e um único botão principal “Conferir resposta”. | A tela mostra três controles com o mesmo peso de botão principal e não expõe seleção como rádio. Isso contraria o padrão documentado e aumenta a competição visual. |
| **P1 — Arquitetura de telas e estado** | `src/app/*.tsx`; `src/viewmodel/use-pizza-view-model.ts`; `src/viewmodel/use-activity-view-model.ts`; `src/di/container.ts` | As rotas em `app/` contêm JSX, estilos e conteúdo da tela em vez de importar uma View fina. `index.tsx` e `home.tsx` navegam com `expo-router` diretamente. ViewModels importam o container e fazem validação da resposta (`selected.length`, comparação com `expected`) antes de registrar tentativa. | Diverge do contrato de rotas finas e da separação de responsabilidades descrita em `AGENTS.md`/`docs/harness/01-arquitetura.md`. O verificador atual não detecta isso. |
| **P1 — Cobertura visual pedagógica** | `src/view/components/ActivityShell.tsx:9-27`; rotas `equivalent.tsx`, `quantity.tsx`, `number-line.tsx`, `decimal.tsx`, `operations.tsx` | O shell genérico recebe `definition`, mas não a usa; apresenta enunciado, texto e opções sem a representação visual correspondente. A mesma composição é reutilizada para equivalência, quantidade, reta numérica, decimal e operações. | A interface não materializa a representação exigida pelo objetivo de cada atividade; em particular, a rota de reta numérica não apresenta uma reta e a de quantidade não representa o inteiro em grupos. |
| **P2 — Densidade e foco** | `src/app/home.tsx:12-41` | A tela inicial expõe três linhas técnicas com códigos BNCC, quatro blocos descritivos com chamadas repetidas e um resumo de tentativas. | O estudante precisa percorrer conteúdo curricular e várias opções antes de distinguir a próxima ação. A hierarquia não segue o princípio “Foco na tarefa”. Os códigos BNCC servem à rastreabilidade, mas não são conteúdo prioritário da tela inicial do aluno. |
| **P2 — Tokens incompletos** | `src/view/tokens.ts`; `docs/design-system/02-tokens.md`; `src/app/index.tsx:21`; `src/view/components/ActionButton.tsx:18-30` | O tema de execução contém apenas parte da escala semântica e não mapeia tokens documentados de superfícies, sucesso, acento, informação, estados disabled, separador e tipografia completa. Há título de 32 sem token, enquanto o título documentado é 22 px; botão desabilitado usa opacidade em vez dos tokens de estado especificados. | As telas usam um tema paralelo e deixam decisões visuais sem origem rastreável. O checker não compara `src/view/tokens.ts` com `02-tokens.md`. |

## O que os checks demonstram

- `python3 scripts/check_architecture.py` verificou apenas imports diretos de `@/infra/` em quatro pastas; não avaliou rotas finas, navegação em Views, domínio em ViewModels ou fidelidade visual.
- `python3 scripts/check_harness.py` verificou documentos, códigos BNCC/RF/UC, existência de camadas, `export default` e alguns imports. Não avalia tokens, IHC, conteúdo visual ou estados acessíveis.
- `npm run check` executou `tsc --noEmit`; valida tipos, não desenho nem comportamento visual.
- Nenhum print do app, aparelho Android, TalkBack, 320 dp ou escala de fonte ampliada foi verificado nesta auditoria.

## Ordem recomendada para correção após decisão de gate

1. Resolver a divergência de fase/gate e aprovar a fonte visual G1. Preservar o Design System oficial até aprovação explícita das mudanças.
2. Refazer `PizzaFracao` com setores radiais verdadeiros, cores e espessura mapeadas aos tokens oficiais, descrição acessível completa e controles checkbox equivalentes.
3. Trocar as opções da comparação para seleção única por rádio; deixar “Conferir resposta” como única ação principal.
4. Definir composição visual por objetivo de atividade; não usar o mesmo shell textual para substituir pizza, reta ou representação de quantidade.
5. Reduzir a tela inicial para uma orientação curta e uma próxima ação evidente; mover códigos curriculares para informação de apoio.
6. Reconciliar a implementação de tokens e as rotas/ViewModels com a arquitetura especificada. Só então validar em 320 dp e 393 dp, fonte ampliada, TalkBack e dispositivo real.

Esta é uma auditoria estática. Não representa aprovação pedagógica, visual ou curricular, nem aprovação de gate.

## Acompanhamento das correções — CHG-002

Correções de implementação aplicadas aos achados desta auditoria:

- **P1 — pizza:** desenho vetorial com setores radiais iguais, contorno/separador tokenizados e resumo acessível; controles de fatia agora são checkboxes com rótulo “Fatia N de D”, estado checked e alvo mínimo de 48 dp.
- **P1 — comparação:** alternativas migradas para rádio com estado selecionado e há apenas uma ação principal “Conferir resposta”; em telas estreitas, as pizzas empilham para preservar o tamanho legível.
- **P2 — início:** removidos códigos BNCC e parágrafos técnicos da tela do estudante; há uma ação recomendada e links secundários compactos para os demais desafios.
- **Tokens/estados:** adicionados ao tema de execução aliases semânticos existentes no Design System; botão desabilitado usa tokens de estado em vez de opacidade arbitrária.

`npm run check`, `python3 scripts/check_architecture.py` e `python3 scripts/check_harness.py` passaram após a mudança. Isso confirma tipos e verificações textuais/arquiteturais existentes, não a aparência final. Screenshot em 320/393 dp, fonte ampliada, TalkBack e Android físico permanecem **NÃO EXECUTADOS**. Os achados arquiteturais de rotas/ViewModels e as representações específicas das demais atividades continuam abertos.

## Referência visual definida — CHG-003

Por orientação do usuário, `docs/.html` é a referência visual direta desta implementação. O Design System permanece como material de conhecimento e não foi alterado. CHG-003 porta os padrões mobile do HTML para as telas nativas; a equivalência visual ainda depende de screenshot comparativo e validação em dispositivo.
