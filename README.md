# FatiaMática

Aplicativo Android em React Native, Expo, TypeScript e MVVM Sofisticado para atividades de frações do 6º ano.

## Pré-requisitos

- Node.js compatível com Expo 58
- npm
- Android Studio e emulador, ou dispositivo Android conectado
- Maestro para os fluxos E2E

## Instalação

```bash
npm install
```

## Verificação do Harness

```bash
npm run check
```

Esse comando executa `scripts/check-arquitetura.mjs` e `tsc --noEmit`.

## Testes automatizados

```bash
npm test
npm run test:coverage
```

O relatório HTML é gerado em `coverage/lcov-report/index.html`.

As suítes estão organizadas em:

- `__tests__/unit/`: regras de negócio, domínio e infraestrutura;
- `__tests__/components/`: componentes reais com React Native Testing Library;
- `__tests__/components-mocked/`: isolamento de serviços ou dependências externas;
- `__tests__/hooks/`: estado e ações das ViewModels;
- `__tests__/integration/`: integrações reais entre ViewModel, Use Case e armazenamento em memória.

## Fluxos E2E com Maestro

Com o aplicativo instalado em um emulador ou dispositivo Android:

```bash
npx expo start
```

Em outro terminal:

```bash
maestro test .maestro
```

Os três fluxos existentes estão em `.maestro/01-boas-vindas-e-nome.yaml`, `.maestro/02-oficina-compra-titulo.yaml` e `.maestro/03-atividade-pizza-e-trofeus.yaml`.

O ambiente atual não possui Maestro ou `adb`; portanto, a execução E2E em dispositivo/emulador ainda não foi realizada.

## Cobertura atual

A execução registrada em 22/11/2026 obteve:

- Statements: 95,79%
- Branches: 80,14%
- Functions: 95,62%
- Lines: 97,18%
- Testes: 76 aprovados em 21 suítes

## Características ISO/IEC 25010

- **Adequação funcional:** protegida por testes unitários das operações com frações e pelos testes de Use Cases.
- **Usabilidade/acessibilidade:** protegida pelos testes de componentes que verificam rótulos, papéis, estado visível e ações.
- **Confiabilidade:** protegida pelos testes de recuperação de dados, erros de domínio e persistência em memória.

## Governança

Antes de alterar o projeto, leia `AGENTS.md`, `docs/harness/00-estado-e-gates.md`, `docs/engenharia/README.md` e `docs/design-system/README.md`.

A interface usa somente os tokens de `src/view/theme.ts`. A implementação do Harness segue `npm run check` e não altera o verificador para esconder violações.
