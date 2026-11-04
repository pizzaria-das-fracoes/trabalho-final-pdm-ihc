# Publicação Android — roteiro futuro, não executado

1. **Antes de publicar:** concluir gates G1–G4; testar em Android real; preparar política de privacidade adequada a app educacional e eventual público infantil; verificar exigências atuais da Play Store.
2. **Identidade:** definir `android.package` único, nome, ícone, splash, versão, permissões mínimas e capturas de tela. Não usar credenciais no repositório.
3. **Conta:** criar conta Google Play Console (há taxas e requisitos de verificação; confirmar condições vigentes na data da publicação). Avaliar regras específicas para contas pessoais novas e testes fechados.
4. **Build:** instalar e configurar EAS CLI conforme documentação oficial, autenticar com conta Expo, configurar `eas.json` e gerar **AAB** de produção via `eas build --platform android --profile production` após configurar credenciais.
5. **Testes:** distribuir build de teste interno/fechado, corrigir crashes, verificar política de dados e classificação indicativa.
6. **Loja:** preencher ficha, screenshots, política de privacidade, seção de segurança de dados e público-alvo; enviar AAB e solicitar revisão.
7. **Pós-publicação:** monitorar falhas e versionar correções; não prometer publicação automática.

Alternativa inicial: distribuir build de teste Android para avaliação acadêmica, sem Play Store. Links: https://docs.expo.dev/build/introduction/ e https://support.google.com/googleplay/android-developer/ .
