# Mapa dos erros e ações preventivas

Fonte: problemas relatados durante as tentativas anteriores; nem todos foram reproduzidos no ambiente deste pacote.

| Falha observada/relatada | Causa ou hipótese | Prevenção e evidência futura |
|---|---|---|
| Projeto misturou Vite/React DOM com Expo | herança de implementação web | proibir DOM, `vite`, `react-dom` na árvore móvel sem justificativa; auditoria de dependências |
| Import de `firebase-applet-config.json` ausente | configuração externa não versionada | portas de persistência, adaptador local por padrão; nunca importar arquivo secreto inexistente |
| Expo Go SDK 58 × projeto SDK 54 | versões incompatíveis | matriz de versões; `npx expo install --check`, `npx expo-doctor` |
| `ERESOLVE` React × react-dom | versões peer incompatíveis | instalação limpa e versões via Expo; lockfile único |
| `ExponentAV` ausente | dependência `expo-av` incompatível com ambiente | áudio opcional; API suportada; fallback e teste no dispositivo |
| avisos `missing default export` | rotas possivelmente inválidas ou erro cascata de imports | testes de import de rotas e smoke test no Android |
| `ErrorBoundary` indefinido | provável falha de inicialização/rota | resolver erro primário e validar layout de navegação |
| aviso `scheme` ausente | configuração de deep linking incompleta | definir esquema ao implementar app; testar navegação |
| `SafeAreaView` descontinuado | uso de API antiga | `react-native-safe-area-context`; teste em aparelhos com notch |
| Botões fora da tela | responsividade/insets/scroll insuficientes | layouts flexíveis, ScrollView onde necessário, safe area, 320dp, fontes ampliadas |
| Telas minimalistas/genéricas | design system pouco operacionalizado | protótipos aprovados, componentes com identidade e revisão visual |
| Informação excessiva | hierarquia e densidade ruins | uma ação primária, divulgação progressiva, testes de IHC |
| Botões sem efeito | ausência de fluxo e critério de aceite | matriz ação→resultado e testes de interação para todos os controles |
| Progresso apenas em memória | persistência não implementada | contrato de armazenamento local, migração e teste de reinício |
| Incerteza sobre publicação | fluxo de distribuição não planejado | plano EAS/Play Store e checklist G5 |
