# Contratos técnicos e pré-requisitos do G2

Este documento define contratos para a implementação futura. Nenhum app,
dependência ou serviço é criado no G1.

## Contratos de persistência offline

O fluxo principal deve funcionar sem rede. O domínio persiste somente dados
locais necessários ao progresso individual, tentativas e revisão de erros; não
há backend, autenticação, ranking ou coleta remota no MVP.

Uma porta de armazenamento deve expor operações assíncronas equivalentes a:

```text
loadProgress(): Result<Progress, StorageError>
saveAttempt(attempt): Result<void, StorageError>
listAttempts(filter): Result<Attempt[], StorageError>
```

O formato persistido deve ter versão e migração explícita antes de qualquer
mudança incompatível. Uma gravação deve ser atômica do ponto de vista da tela:
o ViewModel só informa sucesso após a confirmação da porta. Falha de leitura
não pode apagar o estado; deve oferecer retry e permitir continuar a atividade
sem marcar progresso como salvo. Falha de escrita deve manter a tentativa em
memória, informar o estudante com feedback pedagógico e oferecer nova tentativa.

## Tratamento de erros

- **Entrada inválida:** bloquear a ação, indicar o campo/controle e explicar
  como corrigir; nunca aceitar denominador zero.
- **Atividade inexistente:** mostrar estado de erro recuperável com retorno ao
  início; não renderizar uma rota parcialmente configurada.
- **Persistência indisponível:** preservar a sessão em memória, comunicar que
  o progresso ainda não foi salvo e oferecer retry.
- **Falha inesperada:** registrar contexto técnico sem dados pessoais, mostrar
  mensagem compreensível e oferecer retorno seguro. Não usar fallback que
  pareça sucesso.
- **Áudio opcional:** se adotado, falha no áudio não bloqueia a atividade e
  não substitui feedback textual/visual.

## Pré-requisitos técnicos do G2

Antes de iniciar o G2, a equipe deve:

1. Aprovar este contrato, os wireframes Android e a proposta visual no G1.
2. Fixar versões compatíveis de Expo, React Native e TypeScript usando a
   ferramenta oficial do Expo; registrar a matriz de versões escolhida.
3. Decidir a biblioteca de persistência local e documentar sua porta,
   serialização, versionamento e migração, sem introduzir backend.
4. Criar o app Expo somente após a aprovação, com Expo Router habilitado,
   estrutura de rotas e safe areas verificadas em Android.
5. Configurar lint, type-check e testes unitários/integrados, incluindo a
   auditoria automatizada dos imports MVVM.
6. Validar em Expo Go ou build Android compatível: abertura, navegação,
   gesto/botão voltar, largura de 320 dp, fonte ampliada, teclado e ausência
   de overflow.
7. Registrar evidências reproduzíveis no checklist; sem evidência, o item fica
   como `NÃO EXECUTADO`.

Os nomes das bibliotecas e versões permanecem uma decisão do G2. Não instalar
dependências nem declarar compatibilidade Android antes dessa decisão.
