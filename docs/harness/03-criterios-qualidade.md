# Critérios de qualidade e checagens

- **Matemática:** denominador > 0, simplificação por MDC, equivalência por multiplicação cruzada, comparação exata, soma/subtração com denominadores diferentes, casos de zero e números grandes. Não usar igualdade de floats para frações.
- **Android:** safe area superior/inferior, gestos, teclado, ScrollView, orientação retrato, dispositivos compactos (referência 320dp), fonte ampliada, contraste e alvos de 48dp.
- **Interação:** todo controle visível deve ter função, feedback, estado desabilitado ou justificativa explícita.
- **Pedagogia:** cada questão apresenta objetivo, solução correta, feedback explicativo e oportunidade de nova tentativa; medir domínio com critério documentado.
- **Privacidade:** dados locais por padrão; sem identificadores pessoais, contas, analytics de terceiros ou coleta de dados de menores nesta versão.
- **Validação futura:** `npm run arquitetura`, `npm run check`, `npx tsc --noEmit`, `npx expo-doctor`, testes unitários e teste manual em Android. Não executar esses comandos nesta fase sem projeto Expo.
