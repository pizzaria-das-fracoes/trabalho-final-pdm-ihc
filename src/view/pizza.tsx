import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import Slider from "@react-native-community/slider";
import { ActionButton } from "@/view/components/actionButton";
import { ChipButton } from "@/view/components/chipButton";
import { Feedback } from "@/view/components/feedback";
import { FractionDisplay } from "@/view/components/fractionDisplay";
import { Pizza } from "@/view/components/pizza";
import { PizzaAvatar } from "@/view/components/pizzaAvatar";
import { Screen } from "@/view/components/screen";
import { SliceCutControl } from "@/view/components/sliceCutControl";
import { StageHeader, VictoryCard } from "@/view/components/stageProgress";
import { theme } from "@/view/theme";
import { usePizzaViewModel } from "@/viewmodel/usePizzaViewModel";

const PizzaScreen = () => {
  const { width, height } = useWindowDimensions();
  const isWide = width >= 660;
  const isCompact = !isWide || height < 740;
  const [state, actions] = usePizzaViewModel();
  const [countText, setCountText] = useState(String(state.selected.length));

  useEffect(() => {
    setCountText(String(state.selected.length));
  }, [state.selected.length]);

  return (
    <Screen
      title="Monte a Pizza"
      navigation
      coins={state.profile.coins}
      soundEnabled={state.profile.soundEnabled}
      equippedTopping={state.profile.equippedTopping}
      activeRoute={state.activeRoute}
      onNavigate={actions.handleNavigate}
      onToggleSound={actions.handleToggleSound}
    >
      <StageHeader
        title="Monte a Pizza"
        roundIndex={state.roundIndex}
        totalRounds={state.totalRounds}
        coins={state.profile.coins}
        streak={state.profile.streak}
        onBackToMap={actions.handleBackToMap}
      />

      {state.error && <Text style={styles.errorText}>{state.error}</Text>}

      {state.completed ? (
        <VictoryCard
          worldTitle="Monte a Pizza"
          stars={state.earnedStars}
          chefName={state.profile.chefName}
          hat={state.profile.equippedHat}
          onReplay={actions.handleRestart}
          onMap={actions.handleBackToMap}
        />
      ) : (
        <View style={[styles.card, isCompact && styles.cardCompact]}>
          <View style={[styles.comandaBanner, isCompact && styles.comandaBannerCompact]}>
            <View style={styles.comandaLeft}>
              <PizzaAvatar
                size={isWide ? 48 : 32}
                hat={state.profile.equippedHat}
                mood={state.feedback?.correct ? "excited" : state.feedback ? "thinking" : "happy"}
              />
              <View style={styles.comandaTexts}>
                <Text style={styles.comandaKicker}>
                  Comanda #{state.roundIndex + 1} · Balcão
                </Text>
                <Text
                  style={[styles.comandaCustomer, isCompact && styles.comandaCustomerCompact]}
                  numberOfLines={2}
                >
                  {state.challenge.customer}
                </Text>
              </View>
            </View>
            <View style={[styles.targetFractionBox, isCompact && styles.targetFractionBoxCompact]}>
              <FractionDisplay
                numerator={state.challenge.targetNumerator}
                denominator={state.challenge.targetDenominator}
                compact={isCompact}
                tone="accent"
              />
            </View>
          </View>

          <View style={[styles.workspace, isWide && styles.workspaceWide]}>
            <View style={[styles.pizzaTray, !isWide && styles.pizzaTrayCompact, isWide && styles.halfCol]}>
              <Pizza
                denominator={state.denominator}
                selected={state.selected}
                label={`Pizza cortada em ${state.denominator} fatias, com ${state.selected.length} pintadas`}
                size={isWide ? 164 : isCompact ? 76 : 92}
                showSummary={false}
                topping={state.profile.equippedTopping}
                onToggleSlice={actions.handleToggleSlice}
              />
              <View style={[styles.pizzaSummaryRow, !isWide && styles.pizzaSummaryCompact]}>
                <FractionDisplay
                  numerator={state.selected.length}
                  denominator={state.denominator}
                  labels={isWide}
                  compact={isCompact}
                />
                <View style={styles.statusTexts}>
                  <Text style={[styles.statusTitle, isCompact && styles.statusTitleCompact]}>
                    Sua pizza agora
                  </Text>
                  <Text style={[styles.statusSub, isCompact && styles.statusSubCompact]}>
                    {state.selected.length} de {state.denominator} fatias
                  </Text>
                  <Text style={styles.tapHint} selectable={false}>
                    Toque nas fatias para pintar!
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.controlsCol, isCompact && styles.controlsColCompact, isWide && styles.halfCol]}>
              <SliceCutControl
                value={state.denominator}
                presets={[2, 4, 6, 8, 12, 20, 100]}
                onChange={actions.handleSetDenominator}
              />

              <View style={[styles.quickPaintBox, isCompact && styles.quickPaintBoxCompact]}>
                <View style={styles.quickPaintHeader}>
                  <Text style={[styles.quickPaintLabel, isCompact && styles.quickPaintLabelCompact]}>
                    {isCompact ? "Pintar rápido:" : "Pintar fatias rapidamente:"}
                  </Text>
                  <View style={styles.quickPaintRight}>
                    <ChipButton
                      label="Zerar"
                      variant="danger"
                      disabled={state.selected.length === 0}
                      accessibilityLabel="Zerar fatias selecionadas"
                      onPress={() => actions.handleSetSelectedCount(0)}
                      style={styles.zeroChip}
                    />
                    <TextInput
                      value={countText}
                      keyboardType="number-pad"
                      maxLength={3}
                      accessibilityLabel="Quantidade de fatias pintadas"
                      onChangeText={(txt) => {
                        const cleaned = txt.replace(/[^0-9]/g, "");
                        setCountText(cleaned);
                        if (cleaned !== "") {
                          const parsed = Number(cleaned);
                          if (!Number.isNaN(parsed)) {
                            actions.handleSetSelectedCount(parsed);
                          }
                        }
                      }}
                      style={[styles.paintInput, isCompact && styles.paintInputCompact]}
                    />
                  </View>
                </View>
                <Slider
                  minimumValue={0}
                  maximumValue={state.denominator}
                  step={1}
                  value={state.selected.length}
                  minimumTrackTintColor={theme.color.action}
                  maximumTrackTintColor={theme.color.outlineVariant}
                  thumbTintColor={theme.color.action}
                  accessibilityLabel="Selecionar quantidade de fatias"
                  onValueChange={(next) => actions.handleSetSelectedCount(Math.round(next))}
                  style={[styles.paintSlider, isCompact && styles.paintSliderCompact]}
                />
              </View>
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
              label={state.roundIndex + 1 < state.totalRounds ? "Próximo pedido" : "Pegar estrelas!"}
              variant="success"
              size={isCompact ? "sm" : "md"}
              onPress={actions.handleNextRound}
            />
          ) : (
            <ActionButton
              label="Entregar pizza!"
              variant="primary"
              size={isCompact ? "sm" : "md"}
              onPress={actions.handleCheck}
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
    padding: theme.space.md,
    borderRadius: 18,
    gap: theme.space.xsPlus
  },
  comandaBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.space.md,
    padding: theme.space.md,
    borderRadius: 16,
    backgroundColor: theme.color.hudBg,
    borderWidth: 2,
    borderColor: theme.color.hudBorder
  },
  comandaBannerCompact: {
    padding: theme.space.sm,
    borderRadius: 13
  },
  comandaLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.md,
    flex: 1
  },
  comandaTexts: {
    flex: 1,
    gap: theme.space.hair
  },
  comandaKicker: {
    fontFamily: theme.font.bodyBold,
    fontSize: 10.5,
    color: theme.color.hudGold
  },
  comandaCustomer: {
    fontFamily: theme.font.display,
    fontSize: 15,
    lineHeight: 19,
    color: theme.color.hudText
  },
  comandaCustomerCompact: {
    fontSize: 13,
    lineHeight: 16.5
  },
  targetFractionBox: {
    paddingHorizontal: theme.space.mdPlus,
    paddingVertical: theme.space.xs,
    borderRadius: 12,
    backgroundColor: theme.color.surface,
    borderWidth: 2,
    borderColor: theme.color.hudBorder
  },
  targetFractionBoxCompact: {
    paddingHorizontal: theme.space.smPlus,
    paddingVertical: theme.space.xxs,
    borderRadius: 10
  },
  workspace: {
    gap: theme.space.sm
  },
  workspaceWide: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.lg
  },
  halfCol: {
    flex: 1
  },
  pizzaTray: {
    alignItems: "center",
    justifyContent: "center",
    gap: theme.space.base,
    padding: theme.space.lg,
    borderRadius: 18,
    backgroundColor: theme.color.surfaceLow,
    borderWidth: 1.5,
    borderColor: theme.color.outlineVariant
  },
  pizzaTrayCompact: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: theme.space.sm,
    borderRadius: 14,
    gap: theme.space.md
  },
  pizzaSummaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.base
  },
  pizzaSummaryCompact: {
    flex: 1,
    gap: theme.space.md
  },
  controlsCol: {
    gap: theme.space.md,
    justifyContent: "center"
  },
  controlsColCompact: {
    gap: theme.space.xsPlus
  },
  statusTexts: {
    flexShrink: 1,
    gap: theme.space.hair
  },
  statusTitle: {
    fontFamily: theme.font.display,
    fontSize: 15,
    color: theme.color.onSurface
  },
  statusTitleCompact: {
    fontSize: 13.5
  },
  statusSub: {
    fontFamily: theme.font.body,
    fontSize: 13,
    color: theme.color.onSurfaceMuted
  },
  statusSubCompact: {
    fontSize: 11.5
  },
  tapHint: {
    fontFamily: theme.font.bodyExtraBold,
    fontSize: 10.5,
    color: theme.color.action
  },
  quickPaintBox: {
    padding: theme.space.base,
    borderRadius: 16,
    backgroundColor: theme.color.surfaceLow,
    borderWidth: 1.5,
    borderColor: theme.color.outlineVariant,
    gap: theme.space.xs
  },
  quickPaintBoxCompact: {
    padding: theme.space.sm,
    borderRadius: 13,
    gap: theme.space.xxs
  },
  quickPaintHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.space.md
  },
  quickPaintLabel: {
    fontFamily: theme.font.bodyBold,
    fontSize: 12,
    color: theme.color.onSurface
  },
  quickPaintLabelCompact: {
    fontSize: 11.5
  },
  quickPaintRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.sm
  },
  zeroChip: {
    minHeight: 28,
    paddingHorizontal: theme.space.mdPlus,
    paddingVertical: theme.space.xxs
  },
  paintInput: {
    width: 48,
    height: 32,
    borderRadius: 10,
    backgroundColor: theme.color.surface,
    borderWidth: 2,
    borderColor: theme.color.action,
    textAlign: "center",
    fontFamily: theme.font.display,
    fontSize: 13,
    color: theme.color.onSurface,
    paddingVertical: theme.space.none
  },
  paintInputCompact: {
    width: 40,
    height: 28,
    borderRadius: 8
  },
  paintSlider: {
    width: "100%",
    height: 28
  },
  paintSliderCompact: {
    height: 20
  }
});

export default PizzaScreen;
