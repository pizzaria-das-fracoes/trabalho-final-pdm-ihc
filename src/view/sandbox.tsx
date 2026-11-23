import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import Slider from "@react-native-community/slider";
import type { Fraction } from "@/model/entities/fraction";
import type { SandboxStripSpec } from "@/model/entities/game";
import { ActionButton } from "@/view/components/actionButton";
import { ChipButton } from "@/view/components/chipButton";
import { FractionDisplay } from "@/view/components/fractionDisplay";
import { Pizza } from "@/view/components/pizza";
import { PizzaAvatar } from "@/view/components/pizzaAvatar";
import { Screen } from "@/view/components/screen";
import { SegmentedTabs } from "@/view/components/segmentedTabs";
import { SliceCutControl } from "@/view/components/sliceCutControl";
import { sandboxBlockPalette, theme } from "@/view/theme";
import { useSandboxViewModel } from "@/viewmodel/useSandboxViewModel";

const findBlockColors = (d: number) =>
  sandboxBlockPalette.find((item) => item.d === d) ?? sandboxBlockPalette[0];

const SandboxScreen = () => {
  const { width } = useWindowDimensions();
  const isWide = width >= 680;
  const [state, actions] = useSandboxViewModel();

  const renderTray = (
    label: string,
    trayKey: "A" | "B",
    strips: SandboxStripSpec[],
    total: Fraction,
    formattedTotal: string
  ) => {
    const isFocused = state.activeTray === trayKey;
    const isFull = total.denominator > 0 && total.numerator === total.denominator;
    const pizzaDen = total.denominator === 1 ? 4 : Math.min(100, total.denominator);
    const pizzaNum = total.denominator === 1 ? (total.numerator === 0 ? 0 : 4) : total.numerator;

    return (
      <View style={[styles.trayBox, isFocused ? styles.trayBoxFocused : styles.trayBoxDefault]}>
        <View style={styles.trayPizzaCol}>
          <Pizza
            denominator={pizzaDen}
            selected={Array.from({ length: Math.min(pizzaDen, pizzaNum) }, (_, i) => i)}
            label={`${label} igual a ${formattedTotal}`}
            size={isWide ? 68 : 56}
            showSummary={false}
            topping={state.profile.equippedTopping}
          />
          <Text style={styles.trayTotalText}>{formattedTotal}</Text>
        </View>

        <View style={styles.trayBarCol}>
          <View style={styles.trayHeaderRow}>
            <ChipButton
              label={isFocused ? `${label} ✓ Ativa` : `${label} · Usar`}
              variant={isFocused ? "magic" : "neutral"}
              onPress={() => actions.handleSetActiveTray(trayKey)}
              style={styles.trayChip}
            />

            <View style={styles.trayHeaderActions}>
              {isFull && <Text style={styles.fullBadge}>1 inteira!</Text>}
              <ChipButton
                label="Limpar"
                variant="danger"
                disabled={strips.length === 0}
                onPress={() => actions.handleClearTray(trayKey)}
                style={styles.trayChip}
              />
            </View>
          </View>

          <View style={styles.barRuler}>
            <View style={styles.halfLine} pointerEvents="none" />
            {strips.length === 0 ? (
              <Text style={styles.emptyBarText} numberOfLines={1}>
                Toque nos blocos acima para preencher
              </Text>
            ) : (
              <View style={styles.barStripsRow}>
                {strips.map((strip) => {
                  const blockColors = findBlockColors(strip.d);
                  return (
                    <Pressable
                      key={strip.id}
                      onPress={() => actions.handleRemovePiece(trayKey, strip.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`Remover fração ${strip.n} sobre ${strip.d}`}
                      style={[
                        styles.stripBlock,
                        {
                          width: `${(strip.n / strip.d) * 100}%`,
                          backgroundColor: blockColors.bg
                        }
                      ]}
                    >
                      <Text
                        style={[styles.stripText, { color: blockColors.text }]}
                        numberOfLines={1}
                        selectable={false}
                      >
                        {strip.n}/{strip.d} ×
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>

          <View style={styles.rulerMarks}>
            <Text style={styles.rulerMarkText}>0</Text>
            <Text style={styles.rulerMarkText}>1/2</Text>
            <Text style={styles.rulerMarkText}>1 inteira</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Screen
      title="Bancada Mágica"
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

        <View style={styles.headerBanner}>
          <View style={styles.headerTexts}>
            <Text style={styles.headerKicker}>Laboratório Livre</Text>
            <Text style={styles.pageTitle}>Bancada Mágica</Text>
            <Text style={styles.pageSubtitle}>
              Compare frações nas bandejas ou some duas pizzas de até 100 fatias!
            </Text>
          </View>
          <View style={isWide ? styles.tabsWrapWide : styles.tabsWrap}>
            <SegmentedTabs
              value={state.mode}
              onChange={actions.handleSetMode}
              items={[
                { id: "compare", label: "Comparar Barras", activeColor: theme.color.magic },
                { id: "mix", label: "Somar Pizzas", activeColor: theme.color.action }
              ]}
            />
          </View>
        </View>

        {state.mode === "compare" ? (
          <View style={styles.tabContent}>
            <View
              style={[
                styles.missionCard,
                state.missionSolvedNow ? styles.missionCardSolved : styles.missionCardDark
              ]}
            >
              <View style={styles.missionInfoRow}>
                <PizzaAvatar
                  size={44}
                  hat={state.profile.equippedHat}
                  mood={state.missionSolvedNow ? "excited" : "happy"}
                />
                <View style={styles.missionTextCol}>
                  <Text
                    style={[
                      styles.missionBadge,
                      { color: state.missionSolvedNow ? theme.color.successInk : theme.color.hudGold }
                    ]}
                  >
                    {state.mission.title} {state.missionClaimed ? "· Concluído!" : "· +10 Q"}
                  </Text>
                  <Text
                    style={[
                      styles.missionGoal,
                      { color: state.missionSolvedNow ? theme.color.onSurface : theme.color.hudText }
                    ]}
                    numberOfLines={2}
                  >
                    {state.mission.goal}
                  </Text>
                  {state.showHint && !state.missionSolvedNow && (
                    <Text style={styles.missionHint} numberOfLines={2}>
                      Dica: {state.mission.hint}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.missionActions}>
                {state.missionSolvedNow && !state.missionClaimed ? (
                  <View style={styles.missionBtnWrap}>
                    <ActionButton
                      label="Pegar +10 Q!"
                      variant="success"
                      size="sm"
                      onPress={actions.handleClaimMission}
                    />
                  </View>
                ) : (
                  <View style={styles.missionBtnWrap}>
                    <ActionButton
                      label={state.showHint ? "Ocultar" : "Ver dica"}
                      variant="outline"
                      size="sm"
                      onPress={actions.handleToggleHint}
                    />
                  </View>
                )}

                <View style={styles.missionBtnWrap}>
                  <ActionButton
                    label="Outro →"
                    variant="gold"
                    size="sm"
                    onPress={actions.handleNextMission}
                  />
                </View>
              </View>
            </View>

            <View style={styles.workspaceCard}>
              <View style={styles.paletteRow}>
                {sandboxBlockPalette.map((item) => (
                  <Pressable
                    key={item.d}
                    onPress={() => actions.handleAddPiece(item.d)}
                    accessibilityRole="button"
                    accessibilityLabel={`Adicionar fração ${item.label}`}
                    style={({ pressed }) => [
                      styles.paletteBtn,
                      { backgroundColor: item.bg, borderColor: item.edge },
                      pressed && styles.chipPressed
                    ]}
                  >
                    <Text style={[styles.paletteText, { color: item.text }]} selectable={false}>
                      + {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <View style={[styles.traysStack, isWide && styles.traysStackWide]}>
                <View style={isWide ? styles.trayColHalf : styles.trayColFull}>
                  {renderTray("Bandeja A", "A", state.trayA, state.totalA, state.formattedTotalA)}
                </View>
                <View style={isWide ? styles.trayColHalf : styles.trayColFull}>
                  {renderTray("Bandeja B", "B", state.trayB, state.totalB, state.formattedTotalB)}
                </View>
              </View>

              <View style={[styles.compareBanner, state.cmp === 0 ? styles.compareEqual : styles.compareDiff]}>
                <Text
                  style={[
                    styles.compareText,
                    { color: state.cmp === 0 ? theme.color.successInk : theme.color.onSurface }
                  ]}
                >
                  {state.compareSummary}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.workspaceCard}>
            <View style={[styles.mixGrid, isWide && styles.mixGridWide]}>
              <View style={[styles.mixPizzaBox, isWide && styles.mixPizzaCol]}>
                <View style={styles.mixTopLine}>
                  <Pizza
                    denominator={state.pizzaDenA}
                    selected={state.pizzaSelA}
                    label="Pizza 1 do somador"
                    size={isWide ? 128 : 108}
                    showSummary={false}
                    topping={state.profile.equippedTopping}
                    onToggleSlice={actions.handleTogglePizzaSliceA}
                  />
                  <View style={styles.mixInfoCol}>
                    <Text style={styles.mixPizzaTitle}>
                      Pizza 1 ({state.pizzaSelA.length}/{state.pizzaDenA})
                    </Text>
                    <Text style={styles.mixTapHint}>Toque nas fatias ou deslize:</Text>
                    <Slider
                      minimumValue={0}
                      maximumValue={state.pizzaDenA}
                      step={1}
                      value={state.pizzaSelA.length}
                      minimumTrackTintColor={theme.color.action}
                      maximumTrackTintColor={theme.color.outlineVariant}
                      thumbTintColor={theme.color.action}
                      accessibilityLabel="Quantidade de fatias da Pizza 1"
                      onValueChange={actions.handleSetPizzaCountA}
                      style={styles.paintSlider}
                    />
                  </View>
                </View>

                <SliceCutControl
                  label="Cortes Pizza 1"
                  value={state.pizzaDenA}
                  presets={[2, 4, 8, 12, 20, 100]}
                  onChange={actions.handleSetPizzaDenA}
                />
              </View>

              <View style={[styles.mixPizzaBox, isWide && styles.mixPizzaCol]}>
                <View style={styles.mixTopLine}>
                  <Pizza
                    denominator={state.pizzaDenB}
                    selected={state.pizzaSelB}
                    label="Pizza 2 do somador"
                    size={isWide ? 128 : 108}
                    showSummary={false}
                    topping={state.profile.equippedTopping}
                    onToggleSlice={actions.handleTogglePizzaSliceB}
                  />
                  <View style={styles.mixInfoCol}>
                    <Text style={styles.mixPizzaTitle}>
                      Pizza 2 ({state.pizzaSelB.length}/{state.pizzaDenB})
                    </Text>
                    <Text style={styles.mixTapHint}>Toque nas fatias ou deslize:</Text>
                    <Slider
                      minimumValue={0}
                      maximumValue={state.pizzaDenB}
                      step={1}
                      value={state.pizzaSelB.length}
                      minimumTrackTintColor={theme.color.action}
                      maximumTrackTintColor={theme.color.outlineVariant}
                      thumbTintColor={theme.color.action}
                      accessibilityLabel="Quantidade de fatias da Pizza 2"
                      onValueChange={actions.handleSetPizzaCountB}
                      style={styles.paintSlider}
                    />
                  </View>
                </View>

                <SliceCutControl
                  label="Cortes Pizza 2"
                  value={state.pizzaDenB}
                  presets={[2, 4, 8, 12, 20, 100]}
                  onChange={actions.handleSetPizzaDenB}
                />
              </View>
            </View>

            <View style={styles.resultPlate}>
              <View style={styles.resultPizzasRow}>
                {Array.from({ length: state.wholePizzas }, (_, i) => (
                  <Pizza
                    key={`whole-${i}`}
                    denominator={4}
                    selected={[0, 1, 2, 3]}
                    label="1 pizza inteira"
                    size={isWide ? 78 : 62}
                    showSummary={false}
                    topping={state.profile.equippedTopping}
                  />
                ))}
                {(state.remainderNum > 0 || state.wholePizzas === 0) && (
                  <Pizza
                    denominator={state.clampedResultDen}
                    selected={Array.from({ length: state.clampedResultNum }, (_, i) => i)}
                    label={`Parte restante ${state.remainderNum}/${state.sumPizza.denominator}`}
                    size={isWide ? 84 : 68}
                    showSummary={false}
                    topping={state.profile.equippedTopping}
                  />
                )}
              </View>

              <View style={styles.resultFormulaCol}>
                <Text style={styles.resultKicker}>Soma Total</Text>
                <FractionDisplay
                  numerator={state.sumPizza.numerator}
                  denominator={state.sumPizza.denominator}
                  tone="accent"
                />
                {state.wholePizzas > 0 && (
                  <Text style={styles.resultMixedText}>
                    = {state.wholePizzas} inteira{state.wholePizzas > 1 ? "s" : ""}
                    {state.remainderNum > 0 ? ` e ${state.remainderNum}/${state.sumPizza.denominator}` : "!"}
                  </Text>
                )}
              </View>

              <View style={styles.resetMixWrap}>
                <ActionButton
                  label="Zerar"
                  variant="outline"
                  size="sm"
                  onPress={actions.handleResetMix}
                />
              </View>
            </View>
          </View>
        )}
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
  headerBanner: {
    padding: theme.space.lg,
    borderRadius: 20,
    backgroundColor: theme.color.hudBg,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: theme.color.hudBorder,
    gap: theme.space.base
  },
  headerTexts: {
    gap: theme.space.xxs
  },
  headerKicker: {
    fontFamily: theme.font.bodyBold,
    fontSize: 12,
    color: theme.color.hudGold
  },
  pageTitle: {
    fontFamily: theme.font.display,
    fontSize: 22,
    color: theme.color.hudText
  },
  pageSubtitle: {
    fontFamily: theme.font.body,
    fontSize: 13,
    color: theme.color.hudMuted
  },
  tabsWrap: {
    width: "100%"
  },
  tabsWrapWide: {
    width: 360
  },
  tabContent: {
    gap: theme.space.lg
  },
  missionCard: {
    padding: theme.space.lg,
    borderRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 4,
    gap: theme.space.base
  },
  missionCardDark: {
    backgroundColor: theme.color.hudBg,
    borderColor: theme.color.hudBorder
  },
  missionCardSolved: {
    backgroundColor: theme.color.successSoft,
    borderColor: theme.color.success
  },
  missionInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.base
  },
  missionTextCol: {
    flex: 1,
    gap: theme.space.xxs
  },
  missionBadge: {
    fontFamily: theme.font.bodyBold,
    fontSize: 12
  },
  missionGoal: {
    fontFamily: theme.font.display,
    fontSize: 16,
    lineHeight: 21
  },
  missionHint: {
    fontFamily: theme.font.bodyBold,
    fontSize: 12,
    color: theme.color.hudGold
  },
  missionActions: {
    flexDirection: "row",
    gap: theme.space.md
  },
  missionBtnWrap: {
    flex: 1
  },
  workspaceCard: {
    padding: theme.space.lgPlus,
    borderRadius: 22,
    backgroundColor: theme.color.surface,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: theme.color.outlineVariant,
    gap: theme.space.lg
  },
  paletteRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.space.md
  },
  paletteBtn: {
    flex: 1,
    minWidth: 64,
    minHeight: 42,
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm,
    borderRadius: 12,
    borderWidth: 2,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center"
  },
  chipPressed: {
    borderBottomWidth: 2,
    transform: [{ translateY: 2 }]
  },
  paletteText: {
    fontFamily: theme.font.display,
    fontSize: 14
  },
  traysStack: {
    gap: theme.space.base
  },
  traysStackWide: {
    flexDirection: "row",
    alignItems: "stretch"
  },
  trayColFull: {
    width: "100%"
  },
  trayColHalf: {
    flex: 1
  },
  trayBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.lg,
    padding: theme.space.lg,
    borderRadius: 18,
    borderWidth: 2
  },
  trayBoxDefault: {
    backgroundColor: theme.color.surfaceLow,
    borderColor: theme.color.outlineVariant
  },
  trayBoxFocused: {
    backgroundColor: theme.color.surface,
    borderColor: theme.color.magic
  },
  trayPizzaCol: {
    alignItems: "center",
    gap: theme.space.xs
  },
  trayTotalText: {
    fontFamily: theme.font.display,
    fontSize: 14,
    color: theme.color.onSurface
  },
  trayBarCol: {
    flex: 1,
    gap: theme.space.md
  },
  trayHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.space.sm
  },
  trayChip: {
    minHeight: 34,
    paddingHorizontal: theme.space.base,
    paddingVertical: theme.space.xs
  },
  trayHeaderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.md
  },
  fullBadge: {
    fontFamily: theme.font.bodyExtraBold,
    fontSize: 11,
    color: theme.color.successInk
  },
  barRuler: {
    position: "relative",
    width: "100%",
    height: 44,
    borderRadius: 10,
    backgroundColor: theme.color.surfaceMid,
    borderWidth: 2,
    borderColor: theme.color.outlineVariant,
    overflow: "hidden",
    justifyContent: "center"
  },
  halfLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "50%",
    width: 1.5,
    borderLeftWidth: 1.5,
    borderStyle: "dashed",
    borderColor: theme.color.rulerMidline,
    zIndex: 2
  },
  emptyBarText: {
    paddingHorizontal: theme.space.md,
    fontFamily: theme.font.bodyBold,
    fontSize: 11,
    color: theme.color.onSurfaceMuted
  },
  barStripsRow: {
    flexDirection: "row",
    width: "100%",
    height: "100%"
  },
  stripBlock: {
    height: "100%",
    borderRightWidth: 2,
    borderRightColor: theme.color.white,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.space.xxs
  },
  stripText: {
    fontFamily: theme.font.display,
    fontSize: 11
  },
  rulerMarks: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  rulerMarkText: {
    fontFamily: theme.font.bodyBold,
    fontSize: 10,
    color: theme.color.onSurfaceMuted
  },
  compareBanner: {
    padding: theme.space.base,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center"
  },
  compareEqual: {
    backgroundColor: theme.color.successSoft,
    borderColor: theme.color.success
  },
  compareDiff: {
    backgroundColor: theme.color.surfaceLow,
    borderColor: theme.color.outlineVariant
  },
  compareText: {
    fontFamily: theme.font.display,
    fontSize: 15,
    textAlign: "center"
  },
  mixGrid: {
    gap: theme.space.base
  },
  mixGridWide: {
    flexDirection: "row",
    alignItems: "stretch"
  },
  mixPizzaBox: {
    gap: theme.space.md,
    padding: theme.space.base,
    borderRadius: 16,
    backgroundColor: theme.color.surfaceLow,
    borderWidth: 1.5,
    borderColor: theme.color.outlineVariant,
    justifyContent: "space-between"
  },
  mixPizzaCol: {
    flex: 1
  },
  mixTopLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.base
  },
  mixInfoCol: {
    flex: 1,
    gap: theme.space.xxs
  },
  mixPizzaTitle: {
    fontFamily: theme.font.display,
    fontSize: 15,
    color: theme.color.onSurface
  },
  mixTapHint: {
    fontFamily: theme.font.bodyBold,
    fontSize: 11,
    color: theme.color.onSurfaceMuted
  },
  paintSlider: {
    width: "100%",
    height: 30
  },
  resultPlate: {
    padding: theme.space.base,
    borderRadius: 16,
    backgroundColor: theme.color.successSoft,
    borderWidth: 2,
    borderColor: theme.color.success,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.space.base
  },
  resultPizzasRow: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: theme.space.sm
  },
  resultFormulaCol: {
    alignItems: "center",
    gap: theme.space.xxs
  },
  resultKicker: {
    fontFamily: theme.font.bodyBold,
    fontSize: 11,
    color: theme.color.successInk
  },
  resultMixedText: {
    fontFamily: theme.font.bodyExtraBold,
    fontSize: 12,
    color: theme.color.successInk
  },
  resetMixWrap: {
    width: 82
  }
});

export default SandboxScreen;
