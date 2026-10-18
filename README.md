# FatiaMática

Projeto final de **PDM** e **IHC** · IFPI Campus Piripiri · Análise e Desenvolvimento de Sistemas.

Aplicativo Android educativo para apoiar estudantes do 6º ano na aprendizagem de frações por meio de representações visuais e atividades interativas com pizzas, em alinhamento conceitual com a BNCC EF06MA07.

## Equipe

| Integrante |
| --- |
| Nilson Rodrigo |
| Ana Rosa |
| Wesley Tiago |

## Stack planejada

A implementação futura do aplicativo está planejada para **React Native + TypeScript + Expo**, com foco inicial em Android. Backend, autenticação e persistência remota ainda não fazem parte do escopo atual e serão definidos na etapa de implementação.

Login, cadastro, backend e ranking não fazem parte da versão 1.0.0 do Design System.

## Estado atual

O repositório está na etapa de **Design System**. O aplicativo ainda não foi inicializado, portanto não há comandos de instalação ou execução nesta versão.

As decisões de interface têm como fonte de verdade o [Fatia Design System](docs/design-system/README.md).

## Estrutura do repositório

| Pasta ou arquivo | Conteúdo |
| --- | --- |
| `docs/design-system/` | Fatia Design System. Comece por [docs/design-system/README.md](docs/design-system/README.md) |
| `docs/projeto/` | Documentação de requisitos, diagramas, arquitetura e relatório de PDM |
| `.github/` | Modelo de pull request |
| `AGENTS.md` | Contexto e regras para assistentes de IA que trabalhem no repositório |

## Como contribuir

1. Crie uma branch por funcionalidade, a partir da `main`.
2. Nunca desenvolva direto na `main`.
3. Abra um pull request e peça revisão de outro integrante.
4. Na fase de implementação, faça merge de código somente após revisão, compilação e teste aplicáveis.
5. Mudanças no Design System devem atualizar a documentação correspondente e, quando necessário, o `CHANGELOG.md`.

## Segurança

Nunca envie ao repositório senhas, tokens, chaves privadas nem o keystore de assinatura do app (`*.jks`, `*.keystore`).
