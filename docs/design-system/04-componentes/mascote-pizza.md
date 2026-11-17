# Mascote Pizza (MascotePizza)

Origem: Novo, personagem ilustrado criado para o FatiaMática e demonstrado em `docs/oi.html`.

## Quando usar

- Boas-vindas, saudação no início/progresso e feedback de resultado.
- Use expressão coerente com o estado: feliz/acolhedor no início, contente no acerto, pensativo no erro.
- Não use mascote como substituto de rótulo, instrução ou explicação.

## Aparência

- Corpo em forma de fatia, crosta e coberturas reconhecíveis; contorno usa `color.on-surface`.
- Expressão e sabor usam somente tokens; os olhos usam `avatar.eye`.
- Animação de flutuar/piscar somente em telas de repouso, conforme `motion.avatar-float` e `motion.avatar-blink`; sem animação durante a resolução.
- Celebração do mascote ocorre só após resultado correto; movimento reduzido mostra diretamente a expressão final.

## Acessibilidade

- Mascote informativo recebe descrição curta (“Mascote Fatia, personagem de pizza”). Se for decorativo junto a saudação equivalente, oculte-o da leitura.
- Expressão não carrega resultado sozinha; sempre acompanhe com texto e feedback semântico.
- O desenho permanece legível em tamanho pequeno e em tons de cinza.

## Estado no app

O app nativo possui uma ilustração de mascote estática. Seleção persistente entre os seis avatares e preferências individuais aparece no HTML, mas permanece proposta no app.
