# Arquitetura alvo — MVVM Sofisticado

Esta é uma especificação para o futuro app, não uma descrição de código existente.

```text
src/
  app/            # Expo Router: rotas finas com export default
  view/           # React Native: renderização, acessibilidade, tokens
  viewmodel/      # hooks: estado, intenção, validação de entrada, navegação
  usecase/        # orquestração de domínio, aplicação das regras
  model/          # frações, entidades, contratos e regras puras
  infra/          # armazenamento local, áudio opcional, implementações de portas
  di/             # instanciação/injeção dos serviços
```

Regras: `model` não importa camadas externas; `usecase` depende apenas de `model`; `viewmodel` depende de `usecase/model` e interfaces injetadas; `view` consome viewmodel e componentes; `app` aponta para view; `infra` implementa contratos internos; `di` pode compor todas. Proibidos ciclos. Rotas devem exportar componente padrão válido. A integração de áudio é opcional, com fallback silencioso. Evitar APIs descontinuadas. Validar dimensões Android, insets, rolagem e teclado.
