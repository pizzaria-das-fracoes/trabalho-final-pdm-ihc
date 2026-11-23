import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { ActionButton } from "@/view/components/actionButton";
import { Pizza } from "@/view/components/pizza";
import { PizzaAvatar } from "@/view/components/pizzaAvatar";
import { Screen } from "@/view/components/screen";
import { theme } from "@/view/theme";
import { useWelcomeViewModel } from "@/viewmodel/useWelcomeViewModel";

const WelcomeScreen = () => {
  const { width } = useWindowDimensions();
  const [state, actions] = useWelcomeViewModel();
  const isWide = width >= 720;

  return (
    <Screen
      title="FatiaMática"
      navigation={false}
      coins={state.profile.coins}
      soundEnabled={state.profile.soundEnabled}
      equippedTopping={state.profile.equippedTopping}
      activeRoute={state.activeRoute}
      onNavigate={actions.handleNavigate}
      onToggleSound={actions.handleToggleSound}
    >
      <View style={[styles.hero, isWide && styles.heroWide]}>
        <View style={[styles.copyCol, isWide && styles.copyColWide]}>
          <Text style={[styles.title, isWide && styles.titleLeft]}>
            Pizzaria <Text style={styles.titleAccent}>FatiaMática</Text>
          </Text>
          <Text style={[styles.subtitle, isWide && styles.titleLeft]}>
            Monte pizzas deliciosas, duele na arena, brinque na bancada mágica e ganhe moedas de queijo para equipar o Chef Fatia!
          </Text>
          {state.error && <Text style={styles.errorText}>{state.error}</Text>}
          <View style={styles.ctaCol}>
            <ActionButton label="Entrar na Pizzaria" variant="primary" onPress={actions.handleStart} />
            <ActionButton
              label="Abrir Bancada Mágica"
              variant="outline"
              onPress={() => actions.handleNavigate("/sandbox")}
            />
          </View>
          <Text style={[styles.note, isWide && styles.titleLeft]}>
            Sem cadastro e sem cronômetro obrigatório — jogue no seu ritmo!
          </Text>
        </View>

        <View style={styles.showcaseCard}>
          <PizzaAvatar size={isWide ? 132 : 104} hat={state.profile.equippedHat} mood="excited" animated />
          <View style={styles.pizzaShowcase}>
            <Pizza
              denominator={6}
              selected={[0, 1, 2, 4]}
              label="Pizza especial da casa"
              size={isWide ? 136 : 112}
              showSummary={false}
              topping={state.profile.equippedTopping}
            />
            <Text style={styles.pizzaCaption}>4/6 saindo do forno!</Text>
          </View>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.space.xxl
  },
  heroWide: {
    flexDirection: "row",
    gap: theme.space.xxxxl
  },
  copyCol: {
    width: "100%",
    maxWidth: 480,
    alignItems: "center",
    gap: theme.space.lg
  },
  copyColWide: {
    flex: 1,
    alignItems: "flex-start"
  },
  title: {
    fontFamily: theme.font.display,
    fontSize: 32,
    lineHeight: 38,
    color: theme.color.onSurface,
    textAlign: "center"
  },
  titleLeft: {
    textAlign: "left"
  },
  titleAccent: {
    color: theme.color.action
  },
  subtitle: {
    fontFamily: theme.font.body,
    fontSize: 16,
    lineHeight: 22,
    color: theme.color.onSurfaceMuted,
    textAlign: "center"
  },
  errorText: {
    fontFamily: theme.font.bodyBold,
    fontSize: 13,
    color: theme.color.error
  },
  ctaCol: {
    width: "100%",
    maxWidth: 320,
    gap: theme.space.md
  },
  note: {
    fontFamily: theme.font.bodyBold,
    fontSize: 13,
    color: theme.color.onSurfaceMuted,
    textAlign: "center"
  },
  showcaseCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.space.xl,
    padding: theme.space.xxl,
    borderRadius: 24,
    backgroundColor: theme.color.surface,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: theme.color.outlineVariant
  },
  pizzaShowcase: {
    alignItems: "center",
    gap: theme.space.md
  },
  pizzaCaption: {
    fontFamily: theme.font.bodyExtraBold,
    fontSize: 13,
    color: theme.color.onSurfaceMuted
  }
});

export default WelcomeScreen;
