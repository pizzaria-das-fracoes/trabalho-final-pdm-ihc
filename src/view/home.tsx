import { useMemo } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
import type { GameWorld } from "@/model/entities/game";
import { ActionButton } from "@/view/components/actionButton";
import { ChipButton } from "@/view/components/chipButton";
import { Pizza } from "@/view/components/pizza";
import { PizzaAvatar } from "@/view/components/pizzaAvatar";
import { Screen } from "@/view/components/screen";
import { accentColors, theme } from "@/view/theme";
import { useHomeViewModel } from "@/viewmodel/useHomeViewModel";

const HomeScreen = () => {
  const { width } = useWindowDimensions();
  const isWide = width >= 720;
  const compactModes = width < 480;
  const columns = width >= 920 ? 4 : width >= 560 ? 3 : 2;
  const [state, actions] = useHomeViewModel();

  const worldRows = useMemo(() => {
    const rows: Array<Array<GameWorld | null>> = [];
    for (let i = 0; i < state.worlds.length; i += columns) {
      const slice: Array<GameWorld | null> = state.worlds.slice(i, i + columns);
      while (slice.length < columns) slice.push(null);
      rows.push(slice);
    }
    return rows;
  }, [columns, state.worlds]);

  return (
    <Screen
      title="Mapa da Aventura"
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

        <View style={[styles.heroCard, isWide && styles.heroCardWide]}>
          <View style={styles.heroLeft}>
            <PizzaAvatar size={isWide ? 66 : 52} hat={state.profile.equippedHat} mood="happy" animated />
            <View style={styles.heroInfo}>
              <Text style={styles.titleMeta} numberOfLines={1}>
                {state.activeTitle} · Nível {state.level} · {state.totalStars}/{state.maxStars} ★
              </Text>

              {!state.editingName ? (
                <View style={styles.nameRow}>
                  <Text style={styles.helloTitle} numberOfLines={1}>
                    Olá, {state.profile.chefName}!
                  </Text>
                  <ChipButton
                    label="Editar nome"
                    variant="neutral"
                    onPress={actions.handleStartEditName}
                    style={styles.inlineChip}
                  />
                </View>
              ) : (
                <View style={styles.nameEditRow}>
                  <TextInput
                    maxLength={18}
                    value={state.draftName}
                    onChangeText={actions.handleDraftNameChange}
                    onSubmitEditing={actions.handleSaveName}
                    accessibilityLabel="Nome do Chef"
                    style={styles.nameInput}
                  />
                  <ChipButton
                    label="Salvar"
                    variant="success"
                    onPress={actions.handleSaveName}
                    style={styles.inlineChip}
                  />
                </View>
              )}

              <View style={styles.xpInlineRow}>
                <View style={styles.xpTrack} accessibilityLabel="XP do nível">
                  <View style={[styles.xpFill, { width: `${Math.min(100, state.currentXp)}%` }]} />
                </View>
                <Text style={styles.xpLabel}>{state.currentXp}/100 XP</Text>
              </View>
            </View>
          </View>

          <View style={[styles.heroRight, isWide && styles.heroRightWide]}>
            <ActionButton
              label={`Jogar: ${state.nextWorld.title}`}
              variant="primary"
              size="sm"
              onPress={() => actions.handleNavigate(state.nextWorld.route)}
            />
          </View>
        </View>

        <View style={[styles.modeGrid, compactModes && styles.modeGridStack]}>
          <Pressable
            onPress={() => actions.handleNavigate("/arcade")}
            accessibilityRole="button"
            accessibilityLabel="Abrir Duelo Relâmpago"
            style={({ pressed }) => [
              styles.modeCardDark,
              compactModes && styles.modeCardCompactRow,
              pressed && styles.cardPressed
            ]}
          >
            <Text style={styles.modeDarkTitle} numberOfLines={1}>
              Duelo Relâmpago
            </Text>
            <Text style={styles.modeDarkSub} numberOfLines={1}>
              3 vidas · {state.profile.arcadeHighScore} pts
            </Text>
          </Pressable>

          <Pressable
            onPress={() => actions.handleNavigate("/sandbox")}
            accessibilityRole="button"
            accessibilityLabel="Abrir Bancada Mágica"
            style={({ pressed }) => [
              styles.modeCardMagic,
              compactModes && styles.modeCardCompactRow,
              pressed && styles.cardPressed
            ]}
          >
            <Text style={styles.modeTitle} numberOfLines={1}>
              Bancada Mágica
            </Text>
            <Text style={styles.modeSub} numberOfLines={1}>
              Barras e 100 fatias
            </Text>
          </Pressable>

          <Pressable
            onPress={() => actions.handleNavigate("/shop")}
            accessibilityRole="button"
            accessibilityLabel="Abrir Oficina do Chef"
            style={({ pressed }) => [
              styles.modeCardGold,
              compactModes && styles.modeCardCompactRow,
              pressed && styles.cardPressed
            ]}
          >
            <Text style={styles.modeTitle} numberOfLines={1}>
              Oficina do Chef
            </Text>
            <Text style={styles.modeGoldSub} numberOfLines={1}>
              {state.profile.coins} Queijos
            </Text>
          </Pressable>
        </View>

        <View style={styles.trailSection}>
          <View style={styles.trailHeader}>
            <Text style={styles.trailTitle}>Estações da Pizzaria</Text>
            {state.loading && <Text style={styles.loadingText}>Carregando...</Text>}
          </View>

          <View style={styles.worldRows}>
            {worldRows.map((row, rowIdx) => (
              <View key={`row-${rowIdx}`} style={styles.worldRow}>
                {row.map((world, colIdx) => {
                  if (!world) {
                    return <View key={`empty-${colIdx}`} style={styles.worldSpacer} />;
                  }

                  const stars = state.profile.worldStars[world.id] ?? 0;
                  const isFrontier = world.id === state.nextWorld.id;
                  const accent = accentColors[world.accent];

                  return (
                    <Pressable
                      key={world.id}
                      onPress={() => actions.handleNavigate(world.route)}
                      accessibilityRole="button"
                      accessibilityLabel={`Jogar ${world.title}`}
                      style={({ pressed }) => [
                        styles.worldCard,
                        { borderColor: isFrontier ? theme.color.gold : accent.border },
                        pressed && styles.cardPressed
                      ]}
                    >
                      <View style={styles.worldCardTop}>
                        <View
                          style={[
                            styles.orderBadge,
                            { backgroundColor: accent.bg, borderColor: accent.edge }
                          ]}
                        >
                          <Text style={[styles.orderBadgeText, { color: accent.text }]} selectable={false}>
                            {world.order}
                          </Text>
                        </View>

                        <Pizza
                          denominator={world.denominator}
                          selected={Array.from({ length: world.numerator }, (_, i) => i)}
                          label={world.title}
                          size={36}
                          showSummary={false}
                          topping={state.profile.equippedTopping}
                        />

                        <View style={styles.starsRow} accessibilityLabel={`${stars} de 3 estrelas`}>
                          {[1, 2, 3].map((n) => (
                            <Svg key={n} width={13} height={13} viewBox="0 0 24 24">
                              <Path
                                fill={n <= stars ? theme.color.gold : theme.color.surfaceHigh}
                                stroke={theme.color.onSurface}
                                strokeWidth={1.3}
                                d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5L2.6 9.3l6.5-.9z"
                              />
                            </Svg>
                          ))}
                        </View>
                      </View>

                      <View style={styles.worldCardBody}>
                        <Text style={styles.worldTitle} numberOfLines={1}>
                          {world.title}
                        </Text>
                        <Text style={styles.worldSubtitle} numberOfLines={2}>
                          {world.subtitle}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.playPill,
                          isFrontier ? styles.playPillFrontier : styles.playPillDefault
                        ]}
                      >
                        <Text
                          selectable={false}
                          style={[styles.playLink, isFrontier && styles.playLinkFrontier]}
                        >
                          {isFrontier ? "Próximo →" : stars === 3 ? "Repetir →" : "Jogar →"}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ))}
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
    padding: theme.space.base,
    borderRadius: 18,
    backgroundColor: theme.color.surface,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: theme.color.outlineVariant,
    gap: theme.space.md
  },
  heroCardWide: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.space.lg
  },
  heroLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.base,
    flex: 1
  },
  heroInfo: {
    flex: 1,
    gap: theme.space.tiny
  },
  titleMeta: {
    fontFamily: theme.font.bodyBold,
    fontSize: 11,
    color: theme.color.magicInk
  },
  nameRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: theme.space.md
  },
  helloTitle: {
    fontFamily: theme.font.display,
    fontSize: 19,
    color: theme.color.onSurface
  },
  inlineChip: {
    minHeight: 30,
    paddingHorizontal: theme.space.mdPlus,
    paddingVertical: theme.space.tiny
  },
  nameEditRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.md
  },
  nameInput: {
    width: 136,
    height: 32,
    paddingHorizontal: theme.space.md,
    borderRadius: 10,
    backgroundColor: theme.color.surfaceLow,
    borderWidth: 2,
    borderColor: theme.color.magic,
    fontFamily: theme.font.bodyBold,
    fontSize: 13,
    color: theme.color.onSurface
  },
  xpInlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.md,
    marginTop: 1
  },
  xpTrack: {
    flex: 1,
    maxWidth: 220,
    height: 9,
    borderRadius: theme.shape.full,
    backgroundColor: theme.color.surfaceMid,
    borderWidth: 1.5,
    borderColor: theme.color.outlineVariant,
    overflow: "hidden"
  },
  xpFill: {
    height: "100%",
    backgroundColor: theme.color.success
  },
  xpLabel: {
    fontFamily: theme.font.bodyExtraBold,
    fontSize: 11,
    color: theme.color.onSurfaceMuted
  },
  heroRight: {
    width: "100%"
  },
  heroRightWide: {
    width: 230
  },
  modeGrid: {
    flexDirection: "row",
    gap: theme.space.base
  },
  modeGridStack: {
    flexDirection: "column",
    gap: theme.space.md
  },
  modeCardDark: {
    flex: 1,
    padding: theme.space.base,
    borderRadius: 16,
    backgroundColor: theme.color.hudBg,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: theme.color.hudBorder,
    gap: theme.space.xxs
  },
  modeCardMagic: {
    flex: 1,
    padding: theme.space.base,
    borderRadius: 16,
    backgroundColor: theme.color.magicSurfaceTint,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: theme.color.magicBorderSoft,
    gap: theme.space.xxs
  },
  modeCardGold: {
    flex: 1,
    padding: theme.space.base,
    borderRadius: 16,
    backgroundColor: theme.color.goldSoft,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: theme.color.gold,
    gap: theme.space.xxs
  },
  modeCardCompactRow: {
    flex: undefined,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.space.base,
    paddingHorizontal: theme.space.lg
  },
  cardPressed: {
    borderBottomWidth: 2,
    transform: [{ translateY: 2 }]
  },
  modeDarkTitle: {
    fontFamily: theme.font.display,
    fontSize: 14,
    color: theme.color.hudGold
  },
  modeDarkSub: {
    fontFamily: theme.font.bodyBold,
    fontSize: 11,
    color: theme.color.hudMuted
  },
  modeTitle: {
    fontFamily: theme.font.display,
    fontSize: 14,
    color: theme.color.onSurface
  },
  modeSub: {
    fontFamily: theme.font.bodyBold,
    fontSize: 11,
    color: theme.color.onSurfaceMuted
  },
  modeGoldSub: {
    fontFamily: theme.font.bodyExtraBold,
    fontSize: 11,
    color: theme.color.goldInk
  },
  trailSection: {
    gap: theme.space.base
  },
  trailHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  trailTitle: {
    fontFamily: theme.font.display,
    fontSize: 17,
    color: theme.color.onSurface
  },
  loadingText: {
    fontFamily: theme.font.body,
    fontSize: 12,
    color: theme.color.onSurfaceMuted
  },
  worldRows: {
    gap: theme.space.base
  },
  worldRow: {
    flexDirection: "row",
    gap: theme.space.base,
    alignItems: "stretch"
  },
  worldSpacer: {
    flex: 1
  },
  worldCard: {
    flex: 1,
    padding: theme.space.base,
    borderRadius: 16,
    backgroundColor: theme.color.surface,
    borderWidth: 2,
    borderBottomWidth: 4,
    justifyContent: "space-between",
    gap: theme.space.sm
  },
  worldCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.space.xs
  },
  orderBadge: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderBottomWidth: 3,
    alignItems: "center",
    justifyContent: "center"
  },
  orderBadgeText: {
    fontFamily: theme.font.display,
    fontSize: 11
  },
  starsRow: {
    flexDirection: "row",
    gap: theme.space.hair
  },
  worldCardBody: {
    gap: theme.space.xxs
  },
  worldTitle: {
    fontFamily: theme.font.display,
    fontSize: 14,
    color: theme.color.onSurface
  },
  worldSubtitle: {
    fontFamily: theme.font.body,
    fontSize: 11.5,
    lineHeight: 15,
    color: theme.color.onSurfaceMuted
  },
  playPill: {
    alignSelf: "flex-start",
    paddingHorizontal: theme.space.mdPlus,
    paddingVertical: theme.space.tiny,
    borderRadius: 8,
    borderWidth: 1.5
  },
  playPillDefault: {
    backgroundColor: theme.color.surfaceLow,
    borderColor: theme.color.outlineVariant
  },
  playPillFrontier: {
    backgroundColor: theme.color.accentSoft,
    borderColor: theme.color.action
  },
  playLink: {
    fontFamily: theme.font.bodyExtraBold,
    fontSize: 11,
    color: theme.color.onSurface
  },
  playLinkFrontier: {
    color: theme.color.action
  }
});

export default HomeScreen;
