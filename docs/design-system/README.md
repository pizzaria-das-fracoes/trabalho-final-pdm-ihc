# Fatia Design System · Sistema de design do app FatiaMática

> Versão documental: **1.1.0** · Referência visual mobile: [`docs/oi.html`](../oi.html) · Grupo: Nilson Rodrigo, Ana Rosa e Wesley Tiago · Disciplinas: IHC e PDM · IFPI Piripiri

## 1. Visão geral

O FatiaMática é um aplicativo educacional para estudantes do 6º ano que ensina frações com representações visuais, atividades interativas e feedback explicativo. Esta versão do Design System registra a linguagem visual e os padrões mobile demonstrados em `docs/oi.html`, traduzindo-os em regras, componentes e estados reutilizáveis. O HTML é a referência visual desta versão; este diretório descreve como reproduzir e evoluir esses padrões no app nativo.

- **App:** FatiaMática
- **Plataforma e stack:** Android com React Native + TypeScript + Expo (implementação parcial em andamento)
- **Sistema base:** Google Material Design 3
- **Referência visual:** `docs/oi.html`, protótipo mobile FatiaMática, modo claro inicial e alternativa escura demonstrada.
- **Escopo desta versão:** cabeçalho, navegação inferior, entrada, catálogo, atividades, PizzaFracao, frações, feedback, progresso, sobre, avatar e controles de acessibilidade demonstrados no HTML; recursos ainda ausentes do app estão marcados como propostos em [08-estado-e-evolucao.md](08-estado-e-evolucao.md).

## 2. Por que este sistema base (as cinco forças)

| Força | Justificativa em uma linha |
| --- | --- |
| Usuários | Estudantes do 6º ano precisam reconhecer rapidamente o que fazer e relacionar a representação numérica das frações às representações visuais, reduzindo ações e informações desnecessárias durante as atividades. |
| Acessibilidade | O Material Design 3 fornece uma base de diretrizes e componentes acessíveis; o Fatia Design System acrescenta requisitos explícitos de contraste, alvo mínimo de toque de 48 dp, identificação para leitores de tela e comunicação que não dependa somente de cores. |
| Marca | O FatiaMática combina uma identidade educativa e lúdica com uma interface simples e amigável, usando a pizza principalmente como recurso de representação matemática, e não apenas como decoração. |
| Plataforma | Android, utilizando o Material Design 3 como base para componentes e padrões de interação. |
| Tecnologia | A implementação Android usa React Native, TypeScript e Expo. Os tokens e componentes documentados neste sistema orientam a interface sem valores visuais arbitrários. |

## 3. Inventário: telas × componentes


| Tela | Componentes necessários |
| --- | --- |
| Entrada | Mascote Pizza, título e ação principal; coleta de perfil do protótipo marcada como proposta para o app |
| Início | Saudação com mascote, fala curta, catálogo de `CardAtividade`, estado/progresso por atividade e navegação |
| Monte sua pizza | Alvo de fração, PizzaFracao, coberturas, caixas de seleção equivalentes, leitura do numerador/denominador, dica, conferência e feedback |
| Compare as pizzas | Duas pizzas do mesmo tamanho, frações A/B, Radio Buttons para maior/menor/igual, conferência e feedback |
| Frações equivalentes | Pizza de referência, opções com mini pizzas, Radio Buttons, dica e feedback |
| Reta, decimal, quantidade e operações | Representação específica da ideia matemática, opções e feedback; detalhamento em `ActivityVisual` |
| Resultado e revisão | Resultado da rodada, progresso, explicação e retorno para nova tentativa |
| Meu progresso | Resumo por habilidade, barra de progresso, histórico e revisão de respostas |
| Sobre | Objetivo do app, habilidades e privacidade local |
| Acessibilidade e IHC | Painel de tema, escala de texto, movimento, tons de cinza, guias de alvo e medições; painel demonstrado em HTML, ainda não implementado no app |

## 4. Mapa dos arquivos

| Arquivo | Conteúdo |
| --- | --- |
| [01-principios.md](01-principios.md) | Valores que guiam as decisões |
| [02-tokens.md](02-tokens.md) | Tokens primitivos, semânticos e de componente |
| [03-fundamentos.md](03-fundamentos.md) | Regras de cor, tipografia, espaço, ícones, elevação e movimento |
| [04-componentes/](04-componentes/) | Um arquivo por componente |
| [05-padroes.md](05-padroes.md) | Fluxos de resolução de atividades e acompanhamento de progresso |
| [06-acessibilidade.md](06-acessibilidade.md) | Contraste, alvos de toque, foco, leitor de tela |
| [07-teste-com-ia.md](07-teste-com-ia.md) | Validação do sistema com um assistente de IA |
| [08-estado-e-evolucao.md](08-estado-e-evolucao.md) | Relação HTML → Design System → app e status dos recursos propostos |
| [CHANGELOG.md](CHANGELOG.md) | Versões e mudanças |

## 5. Etiquetas de origem

Cada token, componente e regra traz uma etiqueta:

- **Herdado:** veio do sistema base sem mudança (cite a diretriz ou o token de origem).
- **Adaptado:** veio do sistema base com mudança (explique o motivo).
- **Novo:** não existe no sistema base (explique por que o app precisa).

## 6. Glossário


| Termo | Significado |
| --- | --- |
| Token | Decisão de design com nome e valor (`color.action` → `#8C3900`) |
| Componente | Elemento reutilizável da interface, definido pelo sistema de design com regras, estados e comportamento. |
| Padrão | Solução reutilizável para organizar componentes em uma tarefa ou fluxo da interface. |
| Herdado | Elemento utilizado conforme o sistema base, sem alteração. |
| Adaptado | Elemento proveniente do sistema base que recebeu alterações justificadas para atender ao contexto do FatiaMática. |
| Novo | Elemento que não existe no sistema base e foi criado para atender a uma necessidade específica do FatiaMática. |

## 7. Quem mantém

- **Modelo de governança:** Centralizado. Durante o desenvolvimento acadêmico, as mudanças no Fatia Design System são discutidas pela equipe e registradas de forma centralizada nos arquivos da pasta `design-system/`, evitando versões conflitantes das decisões de design.
- **Responsável por revisar mudanças:** A equipe responsável pelo FatiaMática.
- **Como propor uma mudança:** Criar uma alteração em branch própria, submetê-la para revisão da equipe e, quando aprovada, atualizar os arquivos afetados do Design System e registrar a mudança no `CHANGELOG.md`.

## 8. Uso de IA na redação

Ferramentas de inteligência artificial foram utilizadas como apoio na organização, redação e revisão da documentação do Fatia Design System. As decisões de design são discutidas e validadas pela equipe, que permanece responsável pelo conteúdo final.

## 9. Instruções para assistentes de IA

Ao gerar ou alterar interface neste projeto:

1. Leia `01-principios.md`, `02-tokens.md`, `03-fundamentos.md` e `08-estado-e-evolucao.md` antes de alterar uma tela.
2. Use **somente tokens**. Nunca escreva cores, tamanhos ou raios literais no código.
3. Para cada componente, siga o arquivo correspondente em `04-componentes/`, incluindo todos os estados.
4. Respeite `06-acessibilidade.md`: contraste mínimo de 4,5:1, alvo de toque mínimo e foco visível.
5. Use `docs/oi.html` como referência visual mobile da versão 1.1.0. Consulte os tokens documentados para nomear papéis e estados; não substitua a composição do HTML por uma tela genérica.
6. Se faltar um token, componente ou regra, **pergunte ou registre a lacuna**. Não invente valores.
7. Recursos que aparecem no HTML, mas não estão no app, permanecem propostas até aprovação e rastreabilidade de requisito/UC.
8. Ao final, liste os tokens e componentes que você usou.
