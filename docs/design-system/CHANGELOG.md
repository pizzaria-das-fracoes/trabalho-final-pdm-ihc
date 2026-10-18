# Changelog

Versões no formato `MAIOR.MENOR.CORREÇÃO`. Mudança grande = versão nova (ex.: 2.4.1 → 3.0.0).

## 1.0.0 · 21/10/2026

- Primeira versão do sistema, preparada para apresentação na aula de 21/10.
- **Responsáveis:** Nilson Rodrigo, Ana Rosa e Wesley Tiago.
- **Mudanças:** Definição inicial do Fatia Design System com base no Google Material Design 3, incluindo princípios, tokens, fundamentos, componentes, padrões de interação e requisitos de acessibilidade para o FatiaMática.
- **Ajustes feitos após o teste com IA:** Especificação da comparação entre duas frações com inteiros de dimensões equivalentes, seleção única acessível por radio buttons Material 3, regra de empilhamento em largura insuficiente ou com texto ampliado e delimitação do indicador de progresso fora do recorte da tela “Compare as pizzas” na versão 1.0.0.
- **Correção de ambiguidade após o primeiro teste com IA:** Substituída a expressão “botões de resposta” no inventário por “Radio Buttons Material 3 para seleção única” e explicitada a distinção entre `PizzaFracao` interativa, com controles equivalentes de no mínimo 48 dp nas atividades de montagem, e pizzas estáticas com seleção exclusivamente por Radio Buttons Material 3 em “Compare as pizzas”.
- **Rodada 2 do teste com IA concluída:** após a correção documental, a nova avaliação da tela “Compare as pizzas” confirmou a eliminação das ambiguidades identificadas na Rodada 1, incluindo a distinção entre pizzas estáticas e interativas, o uso de Radio Buttons Material 3 para seleção única e o uso de um único botão “Conferir resposta”.
- **Fechamento da PizzaFracao:** definidos `pizza.size` (176 dp), separador de 2 dp, tokens de partes selecionadas/não selecionadas, denominadores de 2 a 8 e interação acessível por controles textuais equivalentes de 48 dp.
- **Revisão final do README:** removidos textos residuais do template e exemplos de fluxos que não pertencem ao FatiaMática.
