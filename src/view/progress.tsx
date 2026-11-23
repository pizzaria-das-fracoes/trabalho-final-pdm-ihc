import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { ActionButton } from "@/view/components/actionButton";
import { PizzaAvatar } from "@/view/components/pizzaAvatar";
import { Screen } from "@/view/components/screen";
import { SegmentedTabs } from "@/view/components/segmentedTabs";
import { theme } from "@/view/theme";
import { useProgressViewModel } from "@/viewmodel/useProgressViewModel";

const ProgressScreen = () => {
  const { width } = useWindowDimensions();
  const isWide = width >= 620;
  const [state, actions] = useProgressViewModel();

  return (
    <Screen
      title="Sala de Troféus"
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

        <View style={styles.banner}>
          <PizzaAvatar size={60} hat={state.profile.equippedHat} mood="excited" animated />
          <View style={styles.bannerTexts}>
            <Text style={styles.bannerKicker}>
              {state.activeTitle} · {state.profile.chefName}
            </Text>
            <Text style={styles.bannerTitle}>Sala de Troféus</Text>
          </View>
          <Text style={styles.totalCorrect}>
            {state.loading ? "..." : `${state.totalCorrect} acertos`}
          </Text>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Nível</Text>
            <Text style={[styles.metricVal, { color: theme.color.magicInk }]}>{state.level}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Estrelas</Text>
            <Text style={[styles.metricVal, { color: theme.color.goldInk }]}>
              {state.totalStars}/{state.maxStars}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Combo</Text>
            <Text style={[styles.metricVal, { color: theme.color.action }]}>
              {state.profile.bestStreak}
            </Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Arcade</Text>
            <Text style={[styles.metricVal, { color: theme.color.successInk }]}>
              {state.profile.arcadeHighScore}
            </Text>
          </View>
        </View>

        <SegmentedTabs
          value={state.tab}
          onChange={actions.handleSelectTab}
          items={[
            {
              id: "achievements",
              label: `Conquistas (${state.profile.achievements.length}/${state.achievements.length})`,
              activeColor: theme.color.magic
            },
            {
              id: "worlds",
              label: "Estrelas por Mundo",
              activeColor: theme.color.action
            }
          ]}
        />

        <View style={styles.tabBody}>
          {state.tab === "achievements" ? (
            <View style={styles.grid}>
              {state.achievements.map((ach) => {
                const unlocked = state.profile.achievements.includes(ach.id);
                return (
                  <View
                    key={ach.id}
                    style={[
                      styles.achCard,
                      isWide ? styles.cardHalf : styles.cardFull,
                      unlocked ? styles.achUnlocked : styles.achLocked
                    ]}
                  >
                    <View style={[styles.achIcon, unlocked ? styles.achIconOn : styles.achIconOff]}>
                      <Text style={[styles.achIconText, unlocked && styles.achIconTextOn]}>
                        {unlocked ? "★" : "?"}
                      </Text>
                    </View>
                    <View style={styles.achTexts}>
                      <Text style={styles.achTitle} numberOfLines={1}>
                        {ach.title}
                      </Text>
                      <Text style={styles.achDesc} numberOfLines={1}>
                        {ach.description}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.grid}>
              {state.worlds.map((world) => {
                const stars = state.profile.worldStars[world.id] ?? 0;
                return (
                  <Pressable
                    key={world.id}
                    onPress={() => actions.handleNavigate(world.route)}
                    accessibilityRole="button"
                    accessibilityLabel={`Abrir ${world.title}`}
                    style={({ pressed }) => [
                      styles.worldRow,
                      isWide ? styles.cardHalf : styles.cardFull,
                      pressed && styles.worldRowPressed
                    ]}
                  >
                    <Text style={styles.worldName} selectable={false}>{world.title}</Text>
                    <Text style={styles.worldStars} selectable={false}>{stars}/3 ★ →</Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.footerRow}>
          <View style={styles.footerBtnWrap}>
            <ActionButton
              label="Como jogar?"
              variant="outline"
              size="sm"
              onPress={() => actions.handleNavigate("/about")}
            />
          </View>

          {!state.confirmReset ? (
            <View style={styles.footerBtnWrap}>
              <ActionButton
                label="Zerar progresso"
                variant="outline"
                size="sm"
                onPress={actions.handleRequestReset}
              />
            </View>
          ) : (
            <View style={styles.confirmRow}>
              <View style={styles.confirmBtnWrap}>
                <ActionButton
                  label="Confirmar"
                  variant="danger"
                  size="sm"
                  onPress={actions.handleConfirmReset}
                />
              </View>
              <View style={styles.confirmBtnWrap}>
                <ActionButton
                  label="Cancelar"
                  variant="outline"
                  size="sm"
                  onPress={actions.handleCancelReset}
                />
              </View>
            </View>
          )}
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
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.lg,
    padding: theme.space.lg,
    borderRadius: 20,
    backgroundColor: theme.color.hudBg,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: theme.color.hudBorder
  },
  bannerTexts: {
    flex: 1,
    gap: theme.space.xxs
  },
  bannerKicker: {
    fontFamily: theme.font.bodyBold,
    fontSize: 12,
    color: theme.color.hudGold
  },
  bannerTitle: {
    fontFamily: theme.font.display,
    fontSize: 21,
    color: theme.color.hudText
  },
  totalCorrect: {
    fontFamily: theme.font.bodyExtraBold,
    fontSize: 12,
    color: theme.color.hudMuted
  },
  metricsGrid: {
    flexDirection: "row",
    gap: theme.space.md
  },
  metricCard: {
    flex: 1,
    padding: theme.space.base,
    borderRadius: 16,
    backgroundColor: theme.color.surface,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: theme.color.outlineVariant,
    alignItems: "center",
    gap: theme.space.xxs
  },
  metricLabel: {
    fontFamily: theme.font.bodyBold,
    fontSize: 11,
    color: theme.color.onSurfaceMuted
  },
  metricVal: {
    fontFamily: theme.font.display,
    fontSize: 20
  },
  tabBody: {
    gap: theme.space.base
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.space.base
  },
  cardFull: {
    width: "100%"
  },
  cardHalf: {
    width: "49%"
  },
  achCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.base,
    padding: theme.space.mdPlus,
    borderRadius: 14,
    borderWidth: 2
  },
  achUnlocked: {
    backgroundColor: theme.color.goldSoft,
    borderColor: theme.color.gold
  },
  achLocked: {
    backgroundColor: theme.color.surfaceLow,
    borderColor: theme.color.outlineVariant,
    opacity: 0.78
  },
  achIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center"
  },
  achIconOn: {
    backgroundColor: theme.color.gold
  },
  achIconOff: {
    backgroundColor: theme.color.surfaceHigh
  },
  achIconText: {
    fontFamily: theme.font.display,
    fontSize: 14,
    color: theme.color.onSurfaceMuted
  },
  achIconTextOn: {
    color: theme.color.onSurface
  },
  achTexts: {
    flex: 1,
    gap: theme.space.hair
  },
  achTitle: {
    fontFamily: theme.font.display,
    fontSize: 14,
    color: theme.color.onSurface
  },
  achDesc: {
    fontFamily: theme.font.body,
    fontSize: 12,
    color: theme.color.onSurfaceMuted
  },
  worldRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.space.basePlus,
    borderRadius: 14,
    backgroundColor: theme.color.surface,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: theme.color.outlineVariant
  },
  worldRowPressed: {
    borderBottomWidth: 2,
    transform: [{ translateY: 2 }]
  },
  worldName: {
    fontFamily: theme.font.bodyBold,
    fontSize: 14,
    color: theme.color.onSurface
  },
  worldStars: {
    fontFamily: theme.font.bodyExtraBold,
    fontSize: 13,
    color: theme.color.goldInk
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.space.base
  },
  footerBtnWrap: {
    flex: 1,
    maxWidth: 180
  },
  confirmRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.md
  },
  confirmBtnWrap: {
    width: 104
  }
});

export default ProgressScreen;
