# Relatório de cobertura de testes (parcial): FatiaMática

Instituto Federal do Piauí, Campus Piripiri · Análise e Desenvolvimento de Sistemas  
Disciplina: Engenharia de Software III · Professor: Jeferson Soares  
Equipe: Nilson Rodrigo, Ana Rosa e Wesley Tiago · 20/10/2026

## 1. Situação do projeto

O aplicativo FatiaMática (React Native, TypeScript e Expo, tema "Pizzaria das Frações") está na etapa de **Design System e requisitos**. O repositório contém o Design System v1.0.0, o protótipo no Figma e a documentação do projeto. As telas, o login e o backend **ainda não foram implementados**.

Por isso, este relatório cobre **somente o primeiro módulo de código** do aplicativo: a lógica de frações (`src/domain/fracoes.ts`). Os números abaixo **não representam a cobertura do aplicativo completo**. A cobertura global será gerada quando componentes, hooks e telas existirem (seção 7).

## 2. Execução

| Campo | Valor |
| --- | --- |
| Comando | `npm test -- --coverage` |
| Ferramentas | Jest 30.5.2, ts-jest 29.4.15, TypeScript 6.0.3, Node 24.12.0 (versões das dependências fixadas no `package-lock.json`) |
| Branch | `test/logica-fracoes` |
| Commit (`git rev-parse --short HEAD`) | `6fbd6fe` |
| Executado por, data e hora | Ana Rosa (AnaRosa2), 20/10/2026, registro dos commits às 21:28 |
| Suítes e testes | 1 suíte, 28 testes, 28 aprovados |

Saída do terminal:

```
------------|---------|----------|---------|---------|-------------------
File        | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
------------|---------|----------|---------|---------|-------------------
All files   |     100 |      100 |     100 |     100 |
 fracoes.ts |     100 |      100 |     100 |     100 |
------------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       28 passed, 28 total
```

## 3. Resumo

| Métrica | Obtido | Meta da disciplina | Atende? |
| --- | --- | --- | --- |
| Statements | 100 % | 80 % | Sim |
| Branches | 100 % | 80 % | Sim |
| Functions | 100 % | 80 % | Sim |
| Lines | 100 % | 80 % | Sim |

A meta de 80% está configurada no `package.json` (`coverageThreshold`). Se a cobertura cair abaixo dela, o comando de cobertura falha.

Arquivos considerados: `src/**/*.ts`, exceto os arquivos de teste. Nenhum arquivo de produção foi excluído.

## 4. O que os testes protegem

| Função | Regra | Origem da regra | Tela relacionada | Casos de teste |
| --- | --- | --- | --- | --- |
| `ehFracaoValida` | Denominador inteiro de 2 a 8; numerador inteiro de 0 até o denominador | Denominador: Design System v1.0.0. Numerador: proposta | Monte sua pizza | 13 (5 válidos e 8 inválidos, incluindo decimal e NaN) |
| `criarFracao` | Cria a fração ou lança `RangeError` com a fração inválida | Proposta | Todas as atividades | 2 |
| `compararFracoes` | Comparação por produto cruzado, só com inteiros | Proposta | Compare as pizzas | 4 |
| `saoEquivalentes` | Duas frações são equivalentes quando o produto cruzado é igual | Proposta | Frações equivalentes | 4 (inclui 0/2 e 0/8 e a pizza inteira) |
| `formatarFracao` | Escreve numerador/denominador | Proposta | Todas as atividades | 1 |
| `conferirRepresentacao` | Acerta quem marca o numerador de partes em pizza com o mesmo denominador | Proposta | Monte sua pizza | 4 |

As regras marcadas como proposta ainda precisam da aprovação da equipe (`docs/projeto/requisitos.md`).

## 5. Análise

1. **Ramos não cobertos:** nenhum neste módulo. Os ramos de rejeição de `ehFracaoValida` (decimal, denominador fora do intervalo, numerador negativo ou maior que o denominador) e o de erro de `criarFracao` estão cobertos.
2. **Sensibilidade dos testes:** ao trocar `>` por `>=` em `compararFracoes`, 4 testes de igualdade e equivalência falham. Isso mostra que a suíte detecta a mudança de regra. A verificação foi feita durante a preparação e pode ser repetida editando a linha `if (esquerda > direita) return 1;`.
3. **Limite da cobertura:** 100% neste módulo **não significa** que o aplicativo está bem testado. A cobertura mede o que foi executado, não a qualidade das asserções, e este módulo é uma parte pequena do app. Telas, estado, persistência e integração com o backend ainda não existem nem foram testados.

## 6. Característica de qualidade (ISO/IEC 25010)

**Adequação funcional.** A criança só aprende fração se o app corrigir certo. Por isso a comparação, a equivalência e a conferência da pizza são testadas com sucesso, falha e casos de borda. As evidências são os testes de `compararFracoes`, `saoEquivalentes` e `conferirRepresentacao`. As outras características escolhidas (usabilidade e confiabilidade) dependem de componentes e telas e entram no plano de testes completo (`docs/projeto/plano-de-testes-e-cobertura.md`).

## 7. O que falta para a cobertura do aplicativo completo

| Categoria exigida | Situação |
| --- | --- |
| Testes unitários | Iniciados (este relatório) |
| Testes de componentes (React Native Testing Library) | Dependem do projeto Expo e dos componentes |
| Componentes com mock | Dependem da camada de dados e do backend (decisão pendente) |
| Testes de hooks | Dependem da arquitetura da atividade e do progresso |
| Testes de integração | Dependem das telas |
| 3 fluxos E2E em emulador ou dispositivo | Dependem do app rodando |
| Cobertura global de 80% | Será medida quando o código do app existir |

Ao criar o projeto Expo, o preset do Jest passa para `jest-expo` (https://docs.expo.dev/develop/unit-testing/) e a lógica de frações é movida sem alterações.

## 8. Como reproduzir

```
npm install
npm test
npm test -- --coverage
```

O relatório HTML fica em `coverage/lcov-report/index.html`.

## 9. Uso de IA

O módulo, os testes e este relatório foram preparados com apoio de uma ferramenta de IA e revisados pela equipe. Todos os integrantes devem saber explicar cada teste, a regra que ele protege e por que não há mocks neste módulo (a lógica é pura e não depende de recurso externo).
