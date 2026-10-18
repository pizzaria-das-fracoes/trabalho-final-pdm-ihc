# Acessibilidade


## Contraste dos pares de cor

Base exclusiva: Google Material Design 3. Os pares abaixo reproduzem as cores de [02-tokens.md](02-tokens.md), recalculadas em sRGB por script nesta etapa documental. Normalize os canais, linearize-os e calcule a luminância conforme a fórmula WCAG registrada no arquivo de tokens; compare os valores integrais antes de arredondar para duas casas na tabela. Nas camadas de estado, use as composições já resolvidas em `02-tokens.md`.

| Par (texto sobre fundo) | Modo | Cores | Razão | Mínimo | Resultado |
| --- | --- | --- | --- | --- | --- |
| `color.on-action` sobre `color.action` | Claro | `#FFFFFF` sobre `#8C3900` | 7.78:1 | 4,5:1 | Aprovado para este par |
| `color.on-surface` sobre `color.surface` | Claro | `#241A14` sobre `#FFF8F4` | 16.21:1 | 4,5:1 | Aprovado para este par |
| `color.error` sobre `color.surface` | Claro | `#B3261E` sobre `#FFF8F4` | 6.22:1 | 4,5:1 | Aprovado para este par |
| `color.on-error` sobre `color.error` | Claro | `#FFFFFF` sobre `#B3261E` | 6.54:1 | 4,5:1 | Aprovado para este par |
| `color.focus` sobre `color.surface` | Claro | `#8C3900` sobre `#FFF8F4` | 7.40:1 | 3:1 (gráfico); meta local 4,5:1 | Aprovado para este par |
| `button.label` sobre `color.action-hover` | Claro | `#FFFFFF` sobre `#954914` | 6.48:1 | 4,5:1 | Aprovado para este par |
| `button.label` sobre `color.action-pressed` | Claro | `#FFFFFF` sobre `#9A511F` | 5.88:1 | 4,5:1 | Aprovado para este par |
| `button.label` sobre `color.action-focused` | Claro | `#FFFFFF` sobre `#9A511F` | 5.88:1 | 4,5:1 | Aprovado para este par |
| `color.on-disabled` sobre `color.disabled-bg` | Claro | `#9C938E` sobre `#E5DDD9` | 2.25:1 | Não exigido para controle inativo | Exceção WCAG; inferior a 4,5:1 |
| `color.on-action` sobre `color.action` | Escuro | `#512000` sobre `#FFB68A` | 7.91:1 | 4,5:1 | Aprovado para este par |
| `color.on-surface` sobre `color.surface` | Escuro | `#F1DFD4` sobre `#1B120D` | 14.26:1 | 4,5:1 | Aprovado para este par |
| `color.error` sobre `color.surface` | Escuro | `#F2B8B5` sobre `#1B120D` | 10.80:1 | 4,5:1 | Aprovado para este par |
| `color.on-error` sobre `color.error` | Escuro | `#601410` sobre `#F2B8B5` | 7.66:1 | 4,5:1 | Aprovado para este par |
| `color.focus` sobre `color.surface` | Escuro | `#FFB68A` sobre `#1B120D` | 10.81:1 | 3:1 (gráfico); meta local 4,5:1 | Aprovado para este par |
| `button.label` sobre `color.action-hover` | Escuro | `#512000` sobre `#F1AA7F` | 6.94:1 | 4,5:1 | Aprovado para este par |
| `button.label` sobre `color.action-pressed` | Escuro | `#512000` sobre `#EAA479` | 6.48:1 | 4,5:1 | Aprovado para este par |
| `button.label` sobre `color.action-focused` | Escuro | `#512000` sobre `#EAA479` | 6.48:1 | 4,5:1 | Aprovado para este par |
| `color.on-disabled` sobre `color.disabled-bg` | Escuro | `#7C6F68` sobre `#352B25` | 2.84:1 | Não exigido para controle inativo | Exceção WCAG; inferior a 4,5:1 |

- Aplique 4,5:1 ao texto comum, conforme [WCAG 1.4.3](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
- Registre a exceção de controles inativos sem declarar que seus rótulos atendem a 4,5:1; mantenha instruções necessárias fora do controle desabilitado e com contraste adequado.
- Use a linha de `color.focus` somente como medição dessa cor contra a superfície. Ela não valida geometria, área ou visibilidade de um indicador completo; observe também o contraste não textual de [WCAG 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).
- Não dependa somente de cor para erro, acerto, seleção ou indisponibilidade; associe texto, ícone ou outra indicação perceptível.
- Meça na integração real os pares herdados dos componentes Material 3 e o contraste não textual da `PizzaFracao`. A pizza já possui tokens gráficos definidos, mas a medição em execução continua necessária; não declare esses elementos aprovados apenas pelo contraste do texto.

## Alvos de toque

- Garanta pelo menos 48 dp em cada alvo interativo, conforme a base Material 3/Android. Preserve os espaçamentos em px do template sem assumir equivalência automática entre px e dp.
- Em [Botao](04-componentes/botao.md), garanta área acionável mínima mesmo quando o container visual herdado for menor.
- Em [CampoDeTexto](04-componentes/campo-de-texto.md), garanta área de entrada acionável e eventuais controles auxiliares com alvos mínimos.
- Em [CardAtividade](04-componentes/card-atividade.md), garanta alvo mínimo para a ação do card e não aninhe ações concorrentes na mesma área.
- Em [BarraNavegacao](04-componentes/barra-navegacao.md), garanta um alvo mínimo separado por destino, sem sobreposição; não defina novos destinos aqui.
- Em [PizzaFracao](04-componentes/pizza-fracao.md), diferencie imagem estática de partes acionáveis. Quando as fatias não comportarem alvos mínimos sem sobreposição, use a representação como visualização e ofereça caixas de seleção textuais equivalentes por parte.
- Em [FeedbackAprendizagem](04-componentes/feedback-aprendizagem.md), não aplique requisito de toque ao texto estático; aplique-o a qualquer ação adjacente.
- Trate essas dimensões como requisitos especificados por componente, ainda sem comprovação em aparelho.

## Foco

- Herde o foco visível do componente Material 3 correspondente para botão, campo, card, navegação e caixas de seleção textuais; não crie contorno personalizado ou novas medidas neste arquivo.
- Use `color.focus` como referência cromática local quando houver mapeamento aprovado; não substitua silenciosamente o tratamento completo herdado por uma mudança de cor.
- Preserve uma ordem de foco que acompanhe a ordem visual e a tarefa: enunciado, representação e resumo acessíveis, controles de resposta e ação de conferir. Exponha textos estáticos à leitura sem torná-los controles acionáveis.
- Na pizza interativa, ofereça uma parada por controle de parte em ordem previsível; evite duplicar a mesma ação no desenho e na lista textual. As fatias gráficas não são o único alvo acionável; o foco permanece nos controles equivalentes de 48 dp.
- Mantenha destinos de navegação na ordem aprovada pela arquitetura futura; não fixe a lista neste documento.
- Preserve o foco após erro ou feedback; anuncie a atualização sem deslocá-lo automaticamente. Após navegação, coloque-o em um ponto inicial coerente da nova tela.
- Verifique operação por teclado e TalkBack, ausência de armadilhas e foco não encoberto na implementação Android. Não apresente essas verificações como testes já realizados.

## Leitor de tela

- Dê a cada botão um nome que descreva sua ação, como “Conferir resposta”. Em botão só com ícone, forneça nome acessível equivalente; oculte ícones decorativos da leitura.
- Associe rótulo persistente, instrução e mensagem de erro ao campo. Anuncie o papel editável, o valor e a indisponibilidade; não substitua o rótulo por placeholder.
- Anuncie o nome e a finalidade do card acionável sem duplicar seu título; exponha sua indisponibilidade quando existir.
- Na navegação, anuncie rótulo, papel de aba e seleção do destino atual, preservando a ordem visual.
- Na pizza estática, anuncie numerador e denominador em uma descrição como “Pizza dividida em quatro partes iguais, três selecionadas, fração três quartos”; oculte detalhes gráficos redundantes.
- Na pizza interativa, rotule cada controle, por exemplo “Fatia 1 de 4”, e exponha papel de caixa de seleção e estado checked. Mantenha o resumo textual sincronizado; anuncie mudanças sem reler toda a tela.
- Anuncie disabled nos controles indisponíveis e impeça sua ativação; mantenha explicações necessárias acessíveis fora deles.
- Anuncie o feedback pedagógico como atualização de status não interruptiva após conferência explícita. Inclua resultado e orientação; não repita o anúncio a cada renderização.
- Diferencie falha técnica de tentativa matemática incorreta. Preserve a tentativa e permita corrigir quando a atividade admitir.
- Valide os rótulos, papéis e anúncios com TalkBack na implementação futura; esta documentação não comprova comportamento em execução.

## Texto ampliado e movimento

- Respeite a escala de fonte configurada no Android em títulos, rótulos, instruções, mensagens e controles.
- Permita quebra de linha e crescimento dos containers; não reduza arbitrariamente a fonte nem corte informação para conservar uma altura fixa.
- Preserve a relação entre pizza, fração e controles textuais com texto ampliado; mantenha todas as ações alcançáveis, usando rolagem quando necessária.
- Preserve rótulos reconhecíveis na navegação e mensagens disponíveis para releitura, sem desaparecimento automático.
- Use somente `motion.duration.short`, `motion.duration.medium` e `motion.easing.standard` nos usos previstos em `03-fundamentos.md`.
- Respeite redução de movimento: remova deslocamentos e transições decorativas e apresente imediatamente estado final, informação e feedback necessários.
- Não use animações contínuas ou meramente decorativas durante as atividades; não condicione a compreensão a acompanhar uma animação.
- Verifique ampliação, redução de movimento, leitura e alcance dos controles na implementação Android. Os contrastes foram calculados; os testes em aparelho e com usuários ainda não foram realizados.
