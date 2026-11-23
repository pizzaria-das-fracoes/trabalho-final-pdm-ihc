import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { ActionButton } from "@/view/components/actionButton";
import { Feedback } from "@/view/components/feedback";
import { FractionDisplay } from "@/view/components/fractionDisplay";
import { Screen } from "@/view/components/screen";
import { StageHeader, VictoryCard } from "@/view/components/stageProgress";
import { theme } from "@/view/theme";
import { useQuantityViewModel } from "@/viewmodel/useQuantityViewModel";

const QuantityScreen = () => {
  const { width, height } = useWindowDimensions();
  const isWide = width >= 540;
  const isCompact = !isWide || height < 740;
  const [state, actions] = useQuantityViewModel();

  const columns =
    isWide || state.challenge.denominator >= 5 || state.challenge.denominator === 3 ? 3 : 2;
  const trayRows: Array<Array<number | null>> = [];
  for (let i = 0; i < state.challenge.denominator; i += columns) {
    const row: Array<number | null> = Array.from(
      { length: Math.min(columns, state.challenge.denominator - i) },
      (_, offset) => i + offset
    );
    while (row.length < columns) row.push(null);
    trayRows.push(row);
  }

  return (
    <Screen
      title="Festa dos Pedidos"
      navigation
      coins={state.profile.coins}
      soundEnabled={state.profile.soundEnabled}
      equippedTopping={state.profile.equippedTopping}
      activeRoute={state.activeRoute}
      onNavigate={actions.handleNavigate}
      onToggleSound={actions.handleToggleSound}
    >
      <StageHeader
        title="Festa dos Pedidos"
        roundIndex={state.roundIndex}
        totalRounds={state.totalRounds}
        coins={state.profile.coins}
        streak={state.profile.streak}
        onBackToMap={actions.handleBackToMap}
      />

      {state.error && <Text style={styles.errorText}>{state.error}</Text>}

      {state.completed ? (
        <VictoryCard
          worldTitle="Festa dos Pedidos"
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
              <Text style={styles.missionKicker}>Preparar Bandejas</Text>
              <Text style={[styles.missionTitle, isCompact && styles.missionTitleCompact]}>
                {state.challenge.prompt}
              </Text>
              <Text style={[styles.missionSub, isCompact && styles.missionSubCompact]} numberOfLines={2}>
                Toque nas bandejas abaixo para escolher quantas vão para a festa!
              </Text>
            </View>
            <View style={[styles.targetFraction, isCompact && styles.targetFractionCompact]}>
              <FractionDisplay
                numerator={state.challenge.numerator}
                denominator={state.challenge.denominator}
                compact={isCompact}
                tone="accent"
              />
            </View>
          </View>

          <View style={styles.trayRowsWrap}>
            {trayRows.map((row, rowIdx) => (
              <View key={`tray-row-${rowIdx}`} style={styles.trayRow}>
                {row.map((groupIdx, colIdx) => {
                  if (groupIdx === null) {
                    return <View key={`tray-spacer-${colIdx}`} style={styles.traySpacer} />;
                  }
                  const active = state.selectedGroups.includes(groupIdx);
                  const circleSize =
                    state.challenge.denominator >= 5 && !isWide ? 14 : isCompact ? 16 : 20;

                  return (
                    <Pressable
                      key={groupIdx}
                      onPress={() => actions.handleToggleGroup(groupIdx)}
                      accessibilityRole="button"
                      accessibilityLabel={`Bandeja ${groupIdx + 1}`}
                      accessibilityState={{ selected: active }}
                      style={({ pressed }) => [
                        styles.trayCard,
                        isCompact && styles.trayCardCompact,
                        active ? styles.trayCardActive : styles.trayCardDefault,
                        pressed && styles.trayCardPressed
                      ]}
                    >
                      <Text
                        style={[styles.trayTitle, isCompact && styles.trayTitleCompact]}
                        selectable={false}
                      >
                        Bandeja {groupIdx + 1}
                      </Text>
                      <View style={styles.itemsWrap}>
                        {Array.from({ length: state.itemsPerGroup }, (_, itemIdx) => (
                          <Svg
                            key={itemIdx}
                            width={circleSize}
                            height={circleSize}
                            viewBox="0 0 24 24"
                          >
                            <Circle
                              cx={12}
                              cy={12}
                              r={10}
                              fill={active ? theme.color.action : theme.color.surfaceMid}
                              stroke={theme.color.onSurface}
                              strokeWidth={1.8}
                            />
                            <Circle
                              cx={9}
                              cy={10}
                              r={2}
                              fill={active ? theme.color.goldSoft : theme.color.goldEdge}
                            />
                            <Circle
                              cx={15}
                              cy={14}
                              r={2}
                              fill={active ? theme.color.goldSoft : theme.color.goldEdge}
                            />
                          </Svg>
                        ))}
                      </View>
                      <Text
                        style={[styles.trayCount, isCompact && styles.trayCountCompact]}
                        selectable={false}
                        numberOfLines={1}
                      >
                        {state.itemsPerGroup} {state.challenge.itemName}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>

          <View style={[styles.summaryBar, isCompact && styles.summaryBarCompact]}>
            <Text style={[styles.summaryText, isCompact && styles.summaryTextCompact]}>
              Total separado: {state.selectedGroups.length} de {state.challenge.denominator} bandejas ={" "}
              {state.selectedTotal} de {state.challenge.totalItems} {state.challenge.itemName}
            </Text>
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
              label={state.roundIndex + 1 < state.totalRounds ? "Próxima festa" : "Pegar estrelas!"}
              variant="success"
              size={isCompact ? "sm" : "md"}
              onPress={actions.handleNextRound}
            />
          ) : (
            <ActionButton
              label="Servir bandejas!"
              variant="primary"
              size={isCompact ? "sm" : "md"}
              onPress={actions.handleCheck}
              disabled={state.selectedGroups.length === 0}
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
  missionBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.space.md,
    padding: theme.space.base,
    borderRadius: 16,
    backgroundColor: theme.color.accentSoft,
    borderWidth: 1.5,
    borderColor: theme.color.actionBorderSoft
  },
  missionBannerCompact: {
    padding: theme.space.smPlus,
    borderRadius: 13
  },
  missionTexts: {
    flex: 1,
    gap: theme.space.hair
  },
  missionKicker: {
    fontFamily: theme.font.bodyBold,
    fontSize: 10.5,
    color: theme.color.onAccentSoft
  },
  missionTitle: {
    fontFamily: theme.font.display,
    fontSize: 17,
    color: theme.color.onSurface
  },
  missionTitleCompact: {
    fontSize: 14.5,
    lineHeight: 18.5
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
    borderRadius: 12,
    backgroundColor: theme.color.surface,
    borderWidth: 1.5,
    borderColor: theme.color.actionBorderSoft
  },
  targetFractionCompact: {
    paddingHorizontal: theme.space.smPlus,
    paddingVertical: theme.space.xxs,
    borderRadius: 10
  },
  trayRowsWrap: {
    gap: theme.space.smPlus
  },
  trayRow: {
    flexDirection: "row",
    gap: theme.space.smPlus,
    alignItems: "stretch"
  },
  traySpacer: {
    flex: 1
  },
  trayCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.space.xsPlus,
    padding: theme.space.md,
    borderRadius: 16,
    borderWidth: 2,
    borderBottomWidth: 4
  },
  trayCardCompact: {
    gap: theme.space.tiny,
    padding: theme.space.sm,
    borderRadius: 13,
    borderBottomWidth: 3
  },
  trayCardDefault: {
    backgroundColor: theme.color.surfaceLow,
    borderColor: theme.color.outlineVariant
  },
  trayCardActive: {
    backgroundColor: theme.color.accentSoft,
    borderColor: theme.color.action,
    borderBottomWidth: 2,
    transform: [{ translateY: 2 }]
  },
  trayCardPressed: {
    opacity: 0.92
  },
  trayTitle: {
    fontFamily: theme.font.bodyExtraBold,
    fontSize: 13,
    color: theme.color.onSurface
  },
  trayTitleCompact: {
    fontSize: 11.5
  },
  itemsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: theme.space.tiny
  },
  trayCount: {
    fontFamily: theme.font.display,
    fontSize: 12,
    color: theme.color.onSurfaceMuted
  },
  trayCountCompact: {
    fontSize: 10.5
  },
  summaryBar: {
    padding: theme.space.mdPlus,
    borderRadius: 12,
    backgroundColor: theme.color.surfaceLow,
    borderWidth: 1.5,
    borderColor: theme.color.outlineVariant,
    alignItems: "center"
  },
  summaryBarCompact: {
    padding: theme.space.sm,
    borderRadius: 10
  },
  summaryText: {
    fontFamily: theme.font.display,
    fontSize: 13.5,
    color: theme.color.onSurface,
    textAlign: "center"
  },
  summaryTextCompact: {
    fontSize: 12
  }
});

export default QuantityScreen;
