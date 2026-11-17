# Proposta de tokens — Ateliê Matemático

> **STATUS: PENDENTE DE APROVAÇÃO FORMAL.** Esta é uma alternativa documental para revisão. Não substitui nem altera os tokens oficiais da versão 1.0.0 em [02-tokens.md](02-tokens.md). As telas que usam esta amostra são wireframes, não interface aprovada.

## 1. Divergência registrada

O briefing de IHC solicita como referência desejada:

| Nome de marca | Cor proposta |
|---|---|
| Terracota | `#B94F27` |
| Amarelo queijo | `#F5B544` |
| Creme | `#FFF5E8` |
| Verde manjericão | `#3F8067` |
| Marrom cacau | `#44322C` |

A versão oficial atual usa, entre outras cores, `#8C3900` como ação, `#FFF8F4` como superfície e `#241A14` como texto claro, conforme [02-tokens.md](02-tokens.md). A paleta Ateliê não é, portanto, a paleta atualmente consolidada no Design System. A proposta visual já condiciona essa troca à aprovação da equipe.

## 2. Mapeamento semântico proposto (tema claro)

Os valores abaixo são **candidatos**. As razões de contraste não representam aprovação da paleta, da marca ou de uma tela.

| Token candidato | Cor proposta | Uso candidato | Decisão |
|---|---|---|---|
| `color.action` | Terracota `#B94F27` | Ação principal | Aprovação da equipe |
| `color.on-action` | Branco M3 `#FFFFFF` | Texto/ícone sobre ação | Manter só se a combinação for aprovada |
| `color.surface` | Creme `#FFF5E8` | Superfície clara | Aprovação da equipe |
| `color.on-surface` | Marrom cacau `#44322C` | Texto principal | Aprovação da equipe |
| `color.accent` | Amarelo queijo `#F5B544` | Destaque não textual/superfície auxiliar | Usar texto cacau; não usar branco |
| `color.on-accent` | Marrom cacau `#44322C` | Texto sobre amarelo queijo | Aprovação da equipe |
| `color.success` | Verde manjericão `#3F8067` | Superfície de sucesso com estado textual | Usar branco no texto; não usar como texto normal sobre creme |
| `color.on-success` | Branco M3 `#FFFFFF` | Texto sobre verde manjericão | Aprovação da equipe |
| `color.error` | Vermelho M3 claro `#B3261E` | Erro; cor semântica fora da paleta de marca | Manter separado da identidade de marca |
| `color.on-error` | Branco M3 `#FFFFFF` | Texto sobre vermelho de erro | Usar texto e rótulo, além da cor |
| `color.focus` | Terracota `#B94F27` | Referência cromática de foco | Verificar o indicador completo no controle |

Branco e vermelho de erro são cores semânticas de base M3, não novas cores da identidade Ateliê. Erro, acerto e seleção continuam exigindo rótulo e estado semântico; cor sozinha não transmite o significado.

### Combinações que não devem ser usadas para texto comum

| Primeiro plano | Fundo | Contraste | Resultado |
|---|---|---:|---|
| Verde manjericão `#3F8067` | Creme `#FFF5E8` | 4,33:1 | **Falha** no requisito textual de 4,5:1 |
| Branco `#FFFFFF` | Amarelo queijo `#F5B544` | 1,81:1 | **Falha** |
| Marrom cacau `#44322C` | Terracota `#B94F27` | 2,42:1 | **Falha** |

Manjericão sobre creme pode ser avaliado como elemento não textual separado, mas não deve ser promovido a texto sem uma cor aprovada que atinja o requisito textual. Não se deve inferir acessibilidade de controles a partir de uma medição de texto.

## 3. Razões de contraste calculadas

| Primeiro plano | Fundo | Uso proposto | Razão sRGB | Resultado para texto comum |
|---|---|---|---:|---|
| Cacau `#44322C` | Creme `#FFF5E8` | Texto principal | **11,20:1** | Passa 4,5:1 |
| Branco `#FFFFFF` | Terracota `#B94F27` | Rótulo de ação | **4,99:1** | Passa 4,5:1 |
| Cacau `#44322C` | Queijo `#F5B544` | Rótulo de destaque | **6,66:1** | Passa 4,5:1 |
| Branco `#FFFFFF` | Manjericão `#3F8067` | Rótulo em estado de sucesso | **4,67:1** | Passa 4,5:1 |
| Terracota `#B94F27` | Creme `#FFF5E8` | Texto/indicador de foco candidato | **4,63:1** | Passa para texto; não certifica geometria de foco |
| Vermelho M3 `#B3261E` | Creme `#FFF5E8` | Texto de erro | **6,06:1** | Passa 4,5:1 |
| Branco `#FFFFFF` | Vermelho M3 `#B3261E` | Texto em superfície de erro | **6,54:1** | Passa 4,5:1 |
| Cacau `#44322C` | Branco `#FFFFFF` | Texto sobre superfície branca M3 | **12,08:1** | Passa 4,5:1 |

### Método

Razões calculadas nesta etapa documental pela fórmula WCAG de contraste relativo sRGB: linearização do canal `c/12,92` para `c ≤ 0,04045`, caso contrário `((c + 0,055) / 1,055)^2,4`; luminância `L = 0,2126R + 0,7152G + 0,0722B`; razão `(L maior + 0,05) / (L menor + 0,05)`. A tabela arredonda a duas casas para exibição. Requisito de texto comum: **4,5:1**. Nenhum teste em tela ou aparelho foi executado.

## 4. Limites e decisões abertas

- **Tema escuro:** não proposto. Não derive inversões automáticas da paleta clara; um esquema escuro requer cores próprias e novo cálculo.
- **Estados de interação:** hover, pressionado, foco, desabilitado, bordas, chips, seleção e contornos de campo não estão integralmente medidos aqui. Recalcular as composições reais e seus fundos antes de aprovação.
- **Gráficos:** pizza, linhas divisórias, indicadores e ícones exigem avaliação de contraste não textual; o contraste textual não os aprova.
- **Disabled:** a versão oficial documenta valores abaixo de 4,5:1 com a exceção WCAG de controle inativo. A equipe deve decidir como esse caso atende ao requisito local do projeto, sem declarar que atingiu 4,5:1.
- **Marca:** aprovar a paleta, o uso de branco/vermelho semântico e o mapeamento de cada papel antes de atualizar tokens oficiais, componentes, changelog versionado ou qualquer implementação.
- **Wireframes:** a amostra de cores em [prototipos-g1.html](../design-proposta/prototipos-g1.html) serve somente para revisão da proposta.

## 5. Próximo passo

Após aprovação formal, reconciliar esta tabela com tokens, estados e componentes, recalcular todos os pares e registrar a decisão/versionamento. Até lá, a versão oficial segue [02-tokens.md](02-tokens.md) e esta proposta não deve ser tratada como fonte de implementação.
