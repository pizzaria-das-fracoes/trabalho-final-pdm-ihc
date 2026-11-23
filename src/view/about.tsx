import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { ActionButton } from "@/view/components/actionButton";
import { PizzaAvatar } from "@/view/components/pizzaAvatar";
import { Screen } from "@/view/components/screen";
import { theme } from "@/view/theme";
import { useAboutViewModel } from "@/viewmodel/useAboutViewModel";

const AboutScreen = () => {
  const { width } = useWindowDimensions();
  const isWide = width >= 660;
  const [state, actions] = useAboutViewModel();

  return (
    <Screen
      title="Como Jogar"
      navigation
      scrollable
      coins={state.profile.coins}
      soundEnabled={state.profile.soundEnabled}
      equippedTopping={state.profile.equippedTopping}
      activeRoute={state.activeRoute}
      onNavigate={actions.handleNavigate}
      onToggleSound={actions.handleToggleSound}
    >
      <View style={styles.page}>
        {state.error && <Text style={styles.errorText}>{state.error}</Text>}

        <View style={styles.heroCard}>
          <PizzaAvatar size={64} hat={state.profile.equippedHat} mood="happy" />
          <View style={styles.heroText}>
            <Text style={styles.kicker}>Guia do Chef</Text>
            <Text style={styles.title}>Sobre o FatiaMática</Text>
            <Text style={styles.subtitle}>
              Um jogo divertido para explorar frações, fatia por fatia!
            </Text>
          </View>
        </View>

        <View style={[styles.grid, isWide && styles.gridWide]}>
          <View style={[styles.infoCard, isWide && styles.infoCardWide]}>
            <Text style={[styles.cardTitle, { color: theme.color.action }]}>
              1. Trilha da Pizzaria
            </Text>
            <Text style={styles.cardBody}>
              Jogue 7 mundos com pedidos de clientes, duelos de bandejas, entregas na avenida e receitas secretas para ganhar estrelas.
            </Text>
          </View>

          <View style={[styles.infoCard, isWide && styles.infoCardWide]}>
            <Text style={[styles.cardTitle, { color: theme.color.magicInk }]}>
              2. Bancada & Relâmpago
            </Text>
            <Text style={styles.cardBody}>
              Experimente blocos coloridos na Bancada Mágica ou teste seus reflexos no Duelo Relâmpago com ou sem relógio!
            </Text>
          </View>

          <View style={[styles.infoCard, isWide && styles.infoCardWide]}>
            <Text style={[styles.cardTitle, { color: theme.color.goldInk }]}>
              3. Oficina do Chef
            </Text>
            <Text style={styles.cardBody}>
              Junte Queijos acertando desafios e desbloqueie chapéus, óculos e novos sabores para suas pizzas!
            </Text>
          </View>
        </View>

        <View style={styles.privacyBanner}>
          <Text style={styles.privacyTitle}>Privacidade em 1º lugar</Text>
          <Text style={styles.privacyBody}>
            Não precisa criar conta nem colocar e-mail. Suas estrelas e moedas ficam salvas apenas neste aparelho.
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <View style={styles.btnWrap}>
            <ActionButton
              label="Voltar aos Troféus"
              variant="outline"
              onPress={() => actions.handleNavigate("/progress")}
            />
          </View>
          <View style={styles.btnWrap}>
            <ActionButton
              label="Ir para o Mapa"
              variant="primary"
              onPress={() => actions.handleNavigate("/home")}
            />
          </View>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  page: {
    gap: theme.space.lg
  },
  errorText: {
    fontFamily: theme.font.bodyBold,
    fontSize: 13,
    color: theme.color.error
  },
  heroCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.lg,
    padding: theme.space.lgPlus,
    borderRadius: 20,
    backgroundColor: theme.color.hudBg,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: theme.color.hudBorder
  },
  heroText: {
    flex: 1,
    gap: theme.space.xxs
  },
  kicker: {
    fontFamily: theme.font.bodyBold,
    fontSize: 12,
    color: theme.color.hudGold
  },
  title: {
    fontFamily: theme.font.display,
    fontSize: 22,
    color: theme.color.hudText
  },
  subtitle: {
    fontFamily: theme.font.body,
    fontSize: 13,
    color: theme.color.hudMuted
  },
  grid: {
    gap: theme.space.base
  },
  gridWide: {
    flexDirection: "row",
    alignItems: "stretch"
  },
  infoCard: {
    padding: theme.space.lgPlus,
    borderRadius: 18,
    backgroundColor: theme.color.surface,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: theme.color.outlineVariant,
    gap: theme.space.sm
  },
  infoCardWide: {
    flex: 1
  },
  cardTitle: {
    fontFamily: theme.font.display,
    fontSize: 17
  },
  cardBody: {
    fontFamily: theme.font.body,
    fontSize: 13,
    lineHeight: 19,
    color: theme.color.onSurfaceMuted
  },
  privacyBanner: {
    padding: theme.space.lgPlus,
    borderRadius: 18,
    backgroundColor: theme.color.successSoft,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: theme.color.success,
    gap: theme.space.xs
  },
  privacyTitle: {
    fontFamily: theme.font.display,
    fontSize: 16,
    color: theme.color.successInk
  },
  privacyBody: {
    fontFamily: theme.font.body,
    fontSize: 13,
    lineHeight: 19,
    color: theme.color.successInk
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.space.base
  },
  btnWrap: {
    flex: 1,
    minWidth: 160
  }
});

export default AboutScreen;
