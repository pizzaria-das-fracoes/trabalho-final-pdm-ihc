# Feedback de aprendizagem (FeedbackAprendizagem)

Origem no sistema base: Não existe componente pedagógico equivalente no Google Material Design 3. Situação: **Novo**. Motivo: aplicar o princípio **Feedback que ensina**, explicando o resultado e orientando a compreensão de frações. Herde as regras gerais M3 de legibilidade e acessibilidade; não confunda esta mensagem com snackbar obrigatório.

Os valores e os modos claro/escuro são resolvidos por [02-tokens.md](../02-tokens.md); aplique [03-fundamentos.md](../03-fundamentos.md). Nenhum token novo é definido aqui.

## Quando usar

- Use após a conferência de uma resposta ou quando o estudante solicitar orientação.
- Relacione a tentativa à representação matemática e ofereça um próximo passo curto.

## Quando não usar

- Não responda apenas “Certo” ou “Errado”.
- Não use mensagem temporária que desapareça antes da leitura.
- Não interrompa a resolução com diálogo modal sem necessidade.

## Anatomia

1. Região de mensagem: `color.surface`, `space.md`.
2. Resultado e explicação: `font.body`, `color.on-surface`; mantenha texto explícito tanto em acerto quanto em tentativa incorreta.
3. Orientação: descreva relação entre partes selecionadas e total; use `space.sm` entre trechos.
4. Variante textual básica sem ícone: utilizável com os tokens atuais. Se incluir ícone Material Symbols como apoio, siga as orientações M3 de ícones e mantenha o texto completo, sem criar dimensões ou aliases locais.
5. Ação de tentar novamente pertence à tela e usa o botão já documentado; a mensagem não é botão.

## Variantes

| Variante | Uso | Tokens |
| --- | --- | --- |
| Acerto explicado | Confirmar e explicar a relação representada | `color.surface`, `color.on-surface`, `font.body`, `space.md`, `space.sm` |
| Tentativa incorreta orientada | Descrever a tentativa e orientar correção sem julgamento | Mesmos tokens; sem fundo vermelho obrigatório |
| Orientação solicitada | Oferecer uma pista curta sem declarar acerto ou erro | Mesmos tokens |

## Estados

| Estado | Aparência (tokens) | Comportamento | Acessibilidade |
| --- | --- | --- | --- |
| Padrão | Texto sobre superfície com tokens da anatomia | Apresente a explicação vinculada à atividade. | Mantenha mensagem disponível para releitura. |
| Hover | Não se aplica: mensagem não interativa | Não altere informação ao passar ponteiro. | Não esconda orientação em tooltip. |
| Pressionado | Não se aplica: mensagem não interativa | Não execute ação ao tocar no texto. | Não atribua papel de botão. |
| Foco | Não se aplica como controle acionável; leitura continua disponível | Não mova foco automaticamente ao atualizar. | Permita encontrar a região pela navegação de leitura. |
| Desabilitado | Não se aplica: informação não é um controle | Não esmaeça nem oculte a explicação quando a atividade estiver bloqueada. | Preserve leitura e ampliação. |
| Acerto | Texto “Muito bem!” seguido da explicação; sem verde obrigatório | Exemplo: “Você selecionou 3 de 4 fatias. Isso representa 3/4.” | Anuncie o resultado e sua explicação juntos. |
| Tentativa incorreta | Texto “Quase!” seguido da relação e orientação; sem vermelho obrigatório | Exemplo: “Você selecionou 2 de 4 fatias. Para representar 3/4, precisamos selecionar 3 das 4 fatias.” | Não anuncie somente erro; preserve a tentativa para correção. |

## Acessibilidade

- Anuncie atualização em região de status de forma não interruptiva, após ação explícita do estudante; não repita o anúncio a cada renderização.
- Mantenha resultado e orientação como texto, sem depender de ícone ou cor.
- Respeite ampliação e quebra de linha; não imponha desaparecimento automático.
- Não se aplica alvo de toque ao texto estático. Qualquer ação adjacente deve ter alvo mínimo de 48 dp e semântica própria.
- Contraste `color.on-surface`/`color.surface`: 16,21:1 claro e 14,26:1 escuro em `02-tokens.md`; ainda não há teste TalkBack ou registro de validação em aparelho.

## Faça e evite

- **Faça:** Explique o que a seleção representa e como aproximá-la da fração solicitada.
- **Evite:** Não rotule o estudante como incapaz nem apague a tentativa ao anunciar erro.

**Lacunas a resolver:** Nenhuma para o componente textual básico, que já é utilizável conforme este contrato. Redigir o resultado e a orientação de cada exercício é trabalho de conteúdo pedagógico, não ausência de tokens. Uma futura composição gráfica própria além do texto e do ícone M3 exigiria decisão específica; não integra o contrato básico. Validar anúncios com TalkBack na implementação futura, sem apresentar essa verificação como uma lacuna estrutural.

## Código

Trecho ilustrativo de contrato TSX, sem implementação, imports ou biblioteca escolhida. `t` representa os tokens existentes já resolvidos para o tema; props de aparência são um contrato conceitual, não uma API instalada. Callbacks e dados vêm da tela futura. O trecho demonstra somente parte do contrato e não é código executável autossuficiente.

```tsx
<FeedbackAprendizagem
  result="incorrect"
  message="Quase! Você selecionou 2 de 4 fatias. Para representar 3/4, precisamos selecionar 3 das 4 fatias."
  announcement="polite"
  appearance={{
    surface: t["color.surface"], content: t["color.on-surface"],
    typography: t["font.body"], padding: t["space.md"], gap: t["space.sm"],
  }}
/>
```
