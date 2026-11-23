import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { ActionButton } from "@/view/components/actionButton";
import { Feedback } from "@/view/components/feedback";
import { FractionDisplay } from "@/view/components/fractionDisplay";
import { Pizza } from "@/view/components/pizza";
import { Screen } from "@/view/components/screen";
import { StageHeader, VictoryCard } from "@/view/components/stageProgress";
import { theme } from "@/view/theme";
import { useCompareViewModel } from "@/viewmodel/useCompareViewModel";

const CompareScreen = () => {
  const { width, height } = useWindowDimensions();
  const isWide = width >= 620;
  const isCompact = width < 480 || height < 740;
  const [state, actions] = useCompareViewModel();
  const { left, right } = state.challenge;
  const pizzaSize = width < 420 ? 78 : isWide ? 136 : 98;

  return (
    <Screen
      title="Duelo de Pizzas"
      navigation
      coins={state.profile.coins}
      soundEnabled={state.profile.soundEnabled}
      equippedTopping={state.profile.equippedTopping}
      activeRoute={state.activeRoute}
      onNavigate={actions.handleNavigate}
      onToggleSound={actions.handleToggleSound}
    >
      <StageHeader
        title="Duelo de Pizzas"
        roundIndex={state.roundIndex}
        totalRounds={state.totalRounds}
        coins={state.profile.coins}
        streak={state.profile.streak}
        onBackToMap={actions.handleBackToMap}
      />

      {state.error && <Text style={styles.errorText}>{state.error}</Text>}

      {state.completed ? (
        <VictoryCard
          worldTitle="Duelo de Pizzas"
          stars={state.earnedStars}
          chefName={state.profile.chefName}
          hat={state.profile.equippedHat}
          onReplay={actions.handleRestart}
          onMap={actions.handleBackToMap}
        />
      ) : (
        <View style={[styles.card, isCompact && styles.cardCompact]}>
          <View style={styles.heading}>
            <Text style={[styles.title, isCompact && styles.titleCompact]}>
              Quem tem mais pizza no prato?
            </Text>
            <Text style={[styles.subtitle, isCompact && styles.subtitleCompact]} numberOfLines={2}>
              Toque na bandeja campeã ou escolha Empate se forem iguais!
            </Text>
          </View>

          <View style={styles.arena}>
            <Pressable
              onPress={() => actions.handleSelectChoice("left")}
              accessibilityRole="button"
              accessibilityLabel="Escolher Pizza A"
              accessibilityState={{ selected: state.choice === "left" }}
              style={({ pressed }) => [
                styles.trayCard,
                state.choice === "left" ? styles.traySelected : styles.trayDefault,
                pressed && styles.trayPressed
              ]}
            >
              <Text style={styles.trayTitle} selectable={false}>Pizza A</Text>
              <Pizza
                denominator={left.denominator}
                selected={Array.from({ length: left.numerator }, (_, i) => i)}
                label={`Pizza A com ${left.numerator} de ${left.denominator}`}
                size={pizzaSize}
                showSummary={false}
                topping={state.profile.equippedTopping}
              />
              <FractionDisplay
                numerator={left.numerator}
                denominator={left.denominator}
                compact={isCompact}
              />
            </Pressable>

            <View style={styles.vsCol}>
              <Text style={styles.vsText}>VS</Text>
              <Pressable
                onPress={() => actions.handleSelectChoice("tie")}
                accessibilityRole="button"
                accessibilityLabel="Escolher Empate"
                accessibilityState={{ selected: state.choice === "tie" }}
                style={({ pressed }) => [
                  styles.tieBtn,
                  state.choice === "tie" ? styles.tieSelected : styles.tieDefault,
                  pressed && styles.trayPressed
                ]}
              >
                <Text
                  selectable={false}
                  style={[styles.tieText, state.choice === "tie" && styles.tieTextSelected]}
                >
                  {isWide ? "Empate (=)" : "Empate\n(=)"}
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() => actions.handleSelectChoice("right")}
              accessibilityRole="button"
              accessibilityLabel="Escolher Pizza B"
              accessibilityState={{ selected: state.choice === "right" }}
              style={({ pressed }) => [
                styles.trayCard,
                state.choice === "right" ? styles.traySelected : styles.trayDefault,
                pressed && styles.trayPressed
              ]}
            >
              <Text style={styles.trayTitle} selectable={false}>Pizza B</Text>
              <Pizza
                denominator={right.denominator}
                selected={Array.from({ length: right.numerator }, (_, i) => i)}
                label={`Pizza B com ${right.numerator} de ${right.denominator}`}
                size={pizzaSize}
                showSummary={false}
                topping={state.profile.equippedTopping}
              />
              <FractionDisplay
                numerator={right.numerator}
                denominator={right.denominator}
                compact={isCompact}
              />
            </Pressable>
          </View>

          {state.feedback && (
            <Feedback
              correct={state.feedback.correct}
              message={state.feedback.message}
              xp={state.feedback.xp}
              hat={state.profile.equippedHat}
            />
          )}

          {state.feedback?.correct ? (
            <ActionButton
              label={state.roundIndex + 1 < state.totalRounds ? "Próximo duelo!" : "Pegar estrelas!"}
              variant="success"
              size={isCompact ? "sm" : "md"}
              onPress={actions.handleNextRound}
            />
          ) : (
            <ActionButton
              label="Conferir duelo"
              variant="primary"
              size={isCompact ? "sm" : "md"}
              onPress={actions.handleCheck}
              disabled={state.choice === null}
            />
          )}
        </View>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  errorText: {
    fontFamily: theme.font.bodyBold,
    fontSize: 13,
    color: theme.color.error
  },
  card: {
    flex: 1,
    padding: theme.space.lg,
    borderRadius: 22,
    backgroundColor: theme.color.surface,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: theme.color.outlineVariant,
    justifyContent: "space-between",
    gap: theme.space.md
  },
  cardCompact: {
    padding: theme.space.mdPlus,
    borderRadius: 18,
    gap: theme.space.sm
  },
  heading: {
    gap: theme.space.xxs
  },
  title: {
    fontFamily: theme.font.display,
    fontSize: 18,
    color: theme.color.onSurface
  },
  titleCompact: {
    fontSize: 16
  },
  subtitle: {
    fontFamily: theme.font.body,
    fontSize: 13,
    color: theme.color.onSurfaceMuted
  },
  subtitleCompact: {
    fontSize: 11.5,
    lineHeight: 15
  },
  arena: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.md
  },
  trayCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.space.sm,
    padding: theme.space.md,
    borderRadius: 16,
    borderWidth: 2,
    borderBottomWidth: 5
  },
  trayDefault: {
    backgroundColor: theme.color.surfaceLow,
    borderColor: theme.color.outlineVariant
  },
  traySelected: {
    backgroundColor: theme.color.accentSoft,
    borderColor: theme.color.action,
    borderBottomWidth: 2,
    transform: [{ translateY: 2 }]
  },
  trayPressed: {
    opacity: 0.92
  },
  trayTitle: {
    fontFamily: theme.font.display,
    fontSize: 16,
    color: theme.color.onSurface
  },
  vsCol: {
    alignItems: "center",
    gap: theme.space.sm
  },
  vsText: {
    fontFamily: theme.font.display,
    fontSize: 17,
    color: theme.color.onSurfaceMuted
  },
  tieBtn: {
    minHeight: 44,
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.md,
    borderRadius: 14,
    borderWidth: 2,
    borderBottomWidth: 4,
    justifyContent: "center"
  },
  tieDefault: {
    backgroundColor: theme.color.surface,
    borderColor: theme.color.outlineVariant
  },
  tieSelected: {
    backgroundColor: theme.color.magicSoft,
    borderColor: theme.color.magic,
    borderBottomWidth: 2,
    transform: [{ translateY: 2 }]
  },
  tieText: {
    fontFamily: theme.font.display,
    fontSize: 13,
    color: theme.color.onSurface,
    textAlign: "center"
  },
  tieTextSelected: {
    color: theme.color.magicInk
  }
});

export default CompareScreen;
