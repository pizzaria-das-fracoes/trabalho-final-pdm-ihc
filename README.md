# FatiaMática — reinício controlado | fase 0: Harness e especificações

**Estado: SOMENTE DOCUMENTAÇÃO E HARNESS. Não há aplicativo implementado neste ZIP.**

Fonte de origem: `trabalho-final-pdm-ihc(8).zip` (documentação original), confrontada com o pacote anterior `FatiaMatica_Expo_Corrigido.zip` e os erros relatados em Android. O design system original foi preservado em `docs/design-system/`; a proposta de evolução visual está separada e **não aprovada**.

## Ordem obrigatória
1. Ler `AGENTS.md` e `docs/harness/00-estado-e-gates.md`.
2. Ler `docs/engenharia/` (requisitos, casos de uso, testes e rastreabilidade BNCC).
3. Aprovar visualmente os protótipos e os tokens propostos; não confundir proposta com decisão consolidada.
4. Criar aplicativo novo **somente depois** da aprovação do gate G1. Expo + RN + TS + Expo Router, MVVM Sofisticado.
5. Implementar uma atividade por vez, com testes e validação Android.
6. Publicar apenas após os gates G2–G5 e teste em aparelho real.

## Como usar com qualquer IA
> Leia AGENTS.md, docs/harness/00-estado-e-gates.md, docs/engenharia/README.md e docs/design-system/README.md. Informe o estado atual e o próximo gate. Não implemente código antes da autorização explícita. Antes de modificar arquivos, apresente plano e checklist; depois execute os verificadores e relate o que passou, falhou ou não foi executado.

`python3 scripts/check_harness.py` valida a documentação. Não valida um aplicativo inexistente.
