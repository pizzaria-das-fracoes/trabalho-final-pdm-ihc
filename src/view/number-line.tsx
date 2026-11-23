import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
import { ActionButton } from "@/view/components/actionButton";
import { Feedback } from "@/view/components/feedback";
import { FractionDisplay } from "@/view/components/fractionDisplay";
import { Screen } from "@/view/components/screen";
import { StageHeader, VictoryCard } from "@/view/components/stageProgress";
import { theme } from "@/view/theme";
import { useNumberLineViewModel } from "@/viewmodel/useNumberLineViewModel";

const NumberLineScreen = () => {
  const { width, height } = useWindowDimensions();
  const isCompact = width < 480 || height < 740;
  const [state, actions] = useNumberLineViewModel();

  return (
    <Screen
      title="Pista do Entregador"
      navigation
      coins={state.profile.coins}
      soundEnabled={state.profile.soundEnabled}
      equippedTopping={state.profile.equippedTopping}
      activeRoute={state.activeRoute}
      onNavigate={actions.handleNavigate}
      onToggleSound={actions.handleToggleSound}
    >
      <StageHeader
        title="Pista do Entregador"
        roundIndex={state.roundIndex}
        totalRounds={state.totalRounds}
        coins={state.profile.coins}
        streak={state.profile.streak}
        onBackToMap={actions.handleBackToMap}
      />

      {state.error && <Text style={styles.errorText}>{state.error}</Text>}

      {state.completed ? (
        <VictoryCard
          worldTitle="Pista do Entregador"
          stars={state.earnedStars}
          chefName={state.profile.chefName}
          hat={state.profile.equippedHat}
          onReplay={actions.handleRestart}
          onMap={actions.handleBackToMap}
        />
      ) : (
        <View style={[styles.card, isCompact && styles.cardCompact]}>
          <View style={[styles.missionBanner, isCompact && styles.missionBannerCompact]}>
            <View style={styles.missionTexts}>
              <Text style={styles.missionKicker}>Missão de Entrega</Text>
              <Text style={[styles.missionTitle, isCompact && styles.missionTitleCompact]}>
                {state.challenge.label}
              </Text>
              <Text style={[styles.missionSub, isCompact && styles.missionSubCompact]}>
                Toque em um ponto da avenida entre 0 e 2 para estacionar!
              </Text>
            </View>
            <View style={[styles.targetFraction, isCompact && styles.targetFractionCompact]}>
              <FractionDisplay
                numerator={state.challenge.numerator}
                denominator={state.challenge.denominator}
                compact={isCompact}
              />
            </View>
          </View>

          <View style={styles.trackBox}>
            <View style={styles.trackRow}>
              {state.ticks.map((tick) => {
                const isWhole = tick % state.challenge.stepDenominator === 0;
                const wholeNum = tick / state.challenge.stepDenominator;
                const isPicked = state.selectedTick === tick;

                return (
                  <Pressable
                    key={tick}
                    onPress={() => actions.handleSelectTick(tick)}
                    accessibilityRole="button"
                    accessibilityLabel={`Parada ${tick} de ${state.totalTicks}`}
                    accessibilityState={{ selected: isPicked }}
                    style={[styles.tickCol, isPicked && styles.tickColPicked]}
                  >
                    <View style={styles.markerSlot}>
                      {isPicked ? (
                        <Svg width={28} height={28} viewBox="0 0 24 24">
                          <Path
                            fill={theme.color.action}
                            d="M19 13v-2l-2-5H7L5 11v2H3v4h2a2 2 0 1 0 4 0h6a2 2 0 1 0 4 0h2v-4h-2zM7.8 8h8.4l1.2 3H6.6l1.2-3z"
                          />
                        </Svg>
                      ) : (
                        <View style={isWhole ? styles.wholeDot : styles.minorDot} />
                      )}
                    </View>

                    <View style={[styles.roadBar, isPicked && styles.roadBarPicked]} />

                    <View style={styles.labelSlot}>
                      {isWhole ? (
                        <View style={styles.wholePlaque}>
                          <Text style={styles.wholePlaqueText} selectable={false}>{wholeNum}</Text>
                        </View>
                      ) : (
                        <Text
                          selectable={false}
                          style={[styles.minorLabel, state.totalTicks > 9 && styles.minorLabelDense]}
                          numberOfLines={1}
                        >
                          {tick}/{state.challenge.stepDenominator}
                        </Text>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>
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
              label={state.roundIndex + 1 < state.totalRounds ? "Próxima entrega" : "Pegar estrelas!"}
              variant="success"
              size={isCompact ? "sm" : "md"}
              onPress={actions.handleNextRound}
            />
          ) : (
            <ActionButton
              label="Estacionar aqui!"
              variant="primary"
              size={isCompact ? "sm" : "md"}
              onPress={actions.handleCheck}
              disabled={state.selectedTick === null}
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
    gap: theme.space.base
  },
  cardCompact: {
    padding: theme.space.mdPlus,
    borderRadius: 18,
    gap: theme.space.sm
  },
  missionBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.space.md,
    padding: theme.space.base,
    borderRadius: 16,
    backgroundColor: theme.color.goldSoft,
    borderWidth: 1.5,
    borderColor: theme.color.gold
  },
  missionBannerCompact: {
    padding: theme.space.smPlus,
    borderRadius: 13
  },
  missionTexts: {
    flex: 1,
    gap: theme.space.xxs
  },
  missionKicker: {
    fontFamily: theme.font.bodyBold,
    fontSize: 10.5,
    color: theme.color.goldInk
  },
  missionTitle: {
    fontFamily: theme.font.display,
    fontSize: 18,
    color: theme.color.onSurface
  },
  missionTitleCompact: {
    fontSize: 15
  },
  missionSub: {
    fontFamily: theme.font.body,
    fontSize: 12,
    color: theme.color.onSurfaceMuted
  },
  missionSubCompact: {
    fontSize: 11,
    lineHeight: 14
  },
  targetFraction: {
    paddingHorizontal: theme.space.base,
    paddingVertical: theme.space.xs,
    borderRadius: 14,
    backgroundColor: theme.color.surface,
    borderWidth: 1.5,
    borderColor: theme.color.gold
  },
  targetFractionCompact: {
    paddingHorizontal: theme.space.smPlus,
    paddingVertical: theme.space.xxs,
    borderRadius: 10
  },
  trackBox: {
    paddingVertical: theme.space.lgPlus,
    paddingHorizontal: theme.space.md,
    borderRadius: 18,
    backgroundColor: theme.color.surfaceLow,
    borderWidth: 2,
    borderColor: theme.color.outlineVariant
  },
  trackRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: theme.space.xxs
  },
  tickCol: {
    flex: 1,
    alignItems: "center",
    gap: theme.space.md,
    paddingVertical: theme.space.md,
    borderRadius: 10
  },
  tickColPicked: {
    backgroundColor: theme.color.accentSoft
  },
  markerSlot: {
    height: 32,
    alignItems: "center",
    justifyContent: "center"
  },
  wholeDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: theme.color.gold,
    borderWidth: 2,
    borderColor: theme.color.onSurface
  },
  minorDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: theme.color.outlineVariant
  },
  roadBar: {
    width: "100%",
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.color.roadNeutral
  },
  roadBarPicked: {
    backgroundColor: theme.color.action
  },
  labelSlot: {
    height: 26,
    alignItems: "center",
    justifyContent: "center"
  },
  wholePlaque: {
    paddingHorizontal: theme.space.smPlus,
    paddingVertical: theme.space.xxs,
    borderRadius: 7,
    backgroundColor: theme.color.hudBg
  },
  wholePlaqueText: {
    fontFamily: theme.font.display,
    fontSize: 13,
    color: theme.color.hudGold
  },
  minorLabel: {
    fontFamily: theme.font.bodyBold,
    fontSize: 11,
    color: theme.color.onSurfaceMuted
  },
  minorLabelDense: {
    fontSize: 9.5
  }
});

export default NumberLineScreen;
