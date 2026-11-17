# Painel de acessibilidade e IHC (PainelAcessibilidade)

Origem: Novo, demonstrado em `docs/oi.html`. **Status no app Android: proposto, não implementado.** Este contrato documenta a experiência potencial sem afirmar conformidade ou autorizar por si só a implementação.

## Conteúdo demonstrado

- Tema claro/escuro.
- Escala de texto de 100% a 200%.
- Animações/movimento ligado ou reduzido.
- Efeitos sonoros, desligados por padrão.
- Visualização em tons de cinza.
- Guias visuais para alvos de toque de 48 dp.
- Pares e razões de contraste do tema atual.
- Ações de restaurar configuração e exportar dados/configuração, sujeitas a definição de privacidade.

## Regras de interação

- Abrir como painel modal/sheet em mobile; aplicar `color.scrim`, superfície e elevação `level3`.
- Título, resumo e fechar são acessíveis. Fechar retorna o foco ao botão de abertura.
- Cada switch/slider/radio tem rótulo persistente, valor/estado anunciado e resultado aplicado imediatamente, quando for seguro.
- A escala muda texto e layout sem corte; guias e tons de cinza são ferramentas de inspeção, não substitutos de acessibilidade real.
- Preferências são locais e não enviadas a serviços. Som começa desligado e oferece fallback silencioso.
- “Exportar” e “Restaurar” precisam explicar o dado/efeito antes da ação; não mostre esses botões sem implementação.

## Estados e validação

Documente foco, tema claro/escuro, escala máxima, redução de movimento, preferências salvas, erro ao persistir e confirmação de restauração. Valide cada controle no app Android, inclusive TalkBack, antes de mudar seu estado para **Implementado** em `08-estado-e-evolucao.md`.
