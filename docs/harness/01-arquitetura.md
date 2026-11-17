# Arquitetura alvo — MVVM sofisticado

Esta é uma especificação para o futuro app, não uma descrição de código existente.

```text
src/
  app/            # Expo Router: grupos, layouts e rotas finas
  view/           # React Native: renderização, acessibilidade e tokens
  viewmodel/      # hooks: estado, intenções, validação e efeitos de tela
  usecase/        # orquestração de domínio e regras de aplicação
  model/          # frações, entidades, contratos e regras puras
  infra/          # armazenamento local e implementações de portas
  di/             # composição e injeção de dependências
```

## Responsabilidades e dependências

- **Model** contém valores e regras matemáticas puras. Não importa React Native,
  Expo, armazenamento ou qualquer camada externa.
- **Use case** coordena uma ação do estudante e depende somente de `model` e
  portas/contratos definidos internamente. Não conhece componentes ou rotas.
- **ViewModel** expõe estado observável, intenções, validação de entrada,
  mensagens de feedback e comandos de navegação. Recebe use cases e portas por
  injeção; não contém JSX.
- **View** renderiza o estado do ViewModel usando o Fatia Design System,
  incluindo acessibilidade, tokens e alternativa textual para gráficos.
- **App/Expo Router** compõe layouts e rotas finas; cada rota exporta um
  componente padrão e conecta uma View ao ViewModel.
- **Infra** implementa persistência local e outras portas. Não deve ser
  importada diretamente por View ou ViewModel.
- **DI** instancia implementações concretas e injeta contratos nas telas.

O fluxo permitido é `app → view → viewmodel → usecase → model`; `di` pode
compor todas as camadas e `infra` implementa contratos consumidos por
ViewModel/use case. Não são permitidos ciclos nem imports inversos. Erros de
domínio devem ser valores tipados; falhas de infraestrutura devem ser
convertidas em estados compreensíveis pelo ViewModel.

## Rotas Expo Router e navegação Android

Rotas previstas (nomes ilustrativos para o G2, sem criar o app nesta fase):

| Arquivo | Rota | Parâmetros |
|---|---|---|
| `src/app/index.tsx` | `/` | nenhum; redireciona para boas-vindas |
| `src/app/boas-vindas.tsx` | `/boas-vindas` | nenhum |
| `src/app/inicio.tsx` | `/inicio` | nenhum |
| `src/app/atividade/[atividadeId].tsx` | `/atividade/:atividadeId` | `atividadeId` obrigatório |
| `src/app/progresso.tsx` | `/progresso` | nenhum |

As atividades “Monte sua pizza”, “Compare as pizzas” e “Frações equivalentes”
usam `atividadeId` validado contra um catálogo local; parâmetro ausente ou
desconhecido deve resultar em tela de erro recuperável, não em exceção não
tratada. A navegação usa `router.push` para iniciar uma atividade, `router.back`
para retornar e `router.replace` apenas ao concluir a entrada inicial, evitando
empilhar a tela de boas-vindas. A barra de navegação Android e o gesto de voltar
devem preservar o estado salvo antes de sair; o botão voltar nunca deve perder
uma tentativa em andamento sem confirmação ou salvamento definido.

Cada tela deve considerar safe area, teclado, rolagem, orientação suportada,
largura mínima de 320 dp, texto ampliado e alvo de toque de 48 dp. A versão
inicial não define deep links, autenticação ou navegação remota.
