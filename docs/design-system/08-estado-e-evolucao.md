# Referência visual e evolução de recursos

**Versão documental:** 1.1.0  
**Referência visual:** [`docs/oi.html`](../oi.html)  
**Plataforma deste Design System:** app Android nativo; o protótipo HTML também apresenta um palco desktop para avaliação.

Este arquivo distingue o que o HTML demonstra, o que já existe no app e o que permanece como proposta. A presença de uma função no protótipo não comprova implementação ou validação no app nativo.

## Decisões de apresentação para o app nativo

- Reproduza a composição **mobile** do HTML: área segura, cabeçalho, conteúdo rolável e navegação inferior.
- Não reproduza a moldura de telefone nem o palco desktop do protótipo no Android.
- Use cabeçalho com título de tela e marca Pizza; a barra inferior tem destinos `Início`, `Sobre` e `Progresso`.
- A tela `Início` mostra saudação breve, mascote e catálogo de atividades em cards com mini PizzaFracao, código da habilidade, estado e indicador de progresso disponível.
- Atividades mostram uma pergunta por vez, uma representação matemática relacionada, controles apropriados, dica quando existir e feedback persistente até a próxima ação.
- Pizzas de comparação têm tamanho igual. Cards de fração mostram desenho e notação juntos.
- Privacidade, progresso local, erro e acerto são comunicados por texto além da cor.

## Recursos e estado de implementação

| ID | Recurso demonstrado no HTML | Regra de design | Estado no app Android | Antes de declarar concluído |
|---|---|---|---|---|
| DSF-01 | Entrada com nome/apelido e escolha entre seis personagens | Campo persistente rotulado; avatar selecionado com estado claro; opção de continuar perfil local; privacidade explicada | **Parcial:** tela de entrada tem marca, mascote e CTA; ainda não coleta nome nem persiste perfil/avatar | Requisitos, UC, modelo de dados local, consentimento/contexto de menores, testes de persistência e recuperação |
| DSF-02 | Tema claro/escuro e alternância | Resolver os mesmos papéis sem inversão automática; contraste para cada par | **Proposto:** cores de ambos os temas estão documentadas; alternância não foi implementada no app | Especificar preferência local, comportamento do sistema, todas as superfícies e conferir contraste em runtime |
| DSF-03 | Efeitos sonoros desligados por padrão | Nunca tocar automaticamente; controle com nome/estado; fallback silencioso quando áudio nativo indisponível | **Proposto:** sem controle de áudio no app | Aprovar casos de uso, acessibilidade, fallback e operação sem rede/áudio |
| DSF-04 | Painel de acessibilidade e IHC | Painel modal/bottom sheet, foco devolvido ao controle de origem, rótulos persistentes e cada chave com estado anunciado | **Demonstrado no HTML; proposto no app** | Definir se é ferramenta de avaliação ou função do estudante; aprovar API de cada controle e não alegar conformidade pelo painel |
| DSF-05 | Escala do texto de 100% a 200% | Reflow, rolagem, sem corte nem redução do texto | **Proposto no app:** HTML tem slider; app ainda depende da escala nativa | Testar 100–200% no Android, com todas as telas e barras visíveis |
| DSF-06 | Redução de movimento e alternância de animações | Respeitar `prefers-reduced-motion`/configuração Android; preservar estado final e feedback | **Parcial:** componentes nativos atuais não usam animações contínuas; controle local ainda não existe | Integrar com preferência do sistema e validar movimento reduzido |
| DSF-07 | Tons de cinza e guias de alvos de 48 dp | Recursos de inspeção não substituem contraste, semântica ou medição física | **Proposto no app:** presentes no painel HTML | Decidir se permanecem como ferramentas internas de IHC; documentar limites e validar alvos em aparelho |
| DSF-08 | Contrastes calculados no painel | Mostrar pares e razões do tema atual, origem e ressalvas | **Proposto no app:** documentação inclui pares medidos; painel nativo não existe | Gerar valores a partir de tokens reais; validar foreground, background, alpha e estados |
| DSF-09 | Rodadas, estrelas, fatias ganhas, resultado e animação de celebração | Recompensa acompanha explicação; não penaliza erro nem compete entre estudantes | **Parcial:** app registra tentativas e feedback; não implementa rodadas, estrelas ou fatias ganhas | Definir métrica, critérios transparentes, persistência e mensagens sem prometer domínio validado |
| DSF-10 | Dicas progressivas e “Como jogar” | Dica curta relacionada ao objetivo; não revelar resposta antes da tentativa; controles com ação real | **Parcial:** orientações existem em especificações/Use Cases, mas nem todas aparecem nas telas atuais | Ligar ações e estado ao Use Case e validar fluxo de pedir dica, erro e nova tentativa |
| DSF-11 | Progresso por habilidade, histórico e revisão de erros | Métricas individuais, origem explicável, sem ranking; vazio e erro diferenciados | **Parcial:** app tem resumo por habilidade e revisão; histórico/critério de maestria não está completo | Compatibilizar cálculo, armazenamento, critérios e filtros com requisitos e casos de uso |
| DSF-12 | Sobre, habilidades e privacidade local | Conteúdo de apoio, separado da instrução da atividade | **Implementado parcialmente:** app tem tela Sobre e informação resumida; revisar texto contra os documentos do projeto | Revisão curricular e de privacidade antes de publicação |

## Aprovação e rastreabilidade para novas funções

Os itens `Proposto` e `Parcial` não autorizam a criação automática de recursos. Antes da implementação, registrar a decisão do produto, requisito funcional/não funcional, caso de uso, critérios de aceite, testes e evidência no Harness. Componentes visuais podem ser especificados nesta pasta sem afirmar que a função já existe.

### Entradas requeridas para uma proposta

1. Necessidade e público afetado.
2. Fluxo principal e estados de carregamento, vazio, erro e sucesso.
3. Dados armazenados e período de retenção, especialmente para perfil de estudante.
4. Rótulos, papéis, estados, foco e leitura por TalkBack.
5. Dependências Android e alternativa quando o recurso não estiver disponível.
6. Testes e evidências que permitirão declarar a função validada.
