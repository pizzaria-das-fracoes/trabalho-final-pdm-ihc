import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { ActionButton } from "@/view/components/actionButton";
import { Pizza } from "@/view/components/pizza";
import { PizzaAvatar } from "@/view/components/pizzaAvatar";
import { Screen } from "@/view/components/screen";
import { SegmentedTabs } from "@/view/components/segmentedTabs";
import { rarityColors, theme } from "@/view/theme";
import { useShopViewModel } from "@/viewmodel/useShopViewModel";

const ShopScreen = () => {
  const { width } = useWindowDimensions();
  const isWide = width >= 620;
  const [state, actions] = useShopViewModel();

  return (
    <Screen
      title="Oficina do Chef"
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

        <View style={styles.previewBanner}>
          <View style={styles.previewLeft}>
            <PizzaAvatar size={isWide ? 70 : 54} hat={state.profile.equippedHat} mood="excited" animated />
            <Pizza
              denominator={6}
              selected={[0, 1, 2, 3]}
              label="Prévia da sua pizza personalizada"
              size={isWide ? 68 : 52}
              showSummary={false}
              topping={state.profile.equippedTopping}
            />
            <View style={styles.previewTexts}>
              <Text style={styles.previewTitle} numberOfLines={1}>
                {state.activeTitle}
              </Text>
              <Text style={styles.previewName} numberOfLines={1}>
                {state.profile.chefName}
              </Text>
            </View>
          </View>

          <View style={styles.vaultCol}>
            <Text style={styles.vaultKicker}>Cofre</Text>
            <Text style={styles.vaultCoins}>{state.profile.coins} Q</Text>
          </View>
        </View>

        <SegmentedTabs
          value={state.tab}
          onChange={actions.handleSelectTab}
          items={[
            { id: "hats", label: "Acessórios", activeColor: theme.color.action },
            { id: "toppings", label: "Sabores", activeColor: theme.color.success },
            { id: "titles", label: "Títulos", activeColor: theme.color.magic }
          ]}
        />

        <View style={styles.grid}>
          {state.tab === "hats" &&
            state.hats.map((item) => {
              const unlocked = state.profile.unlockedHats.includes(item.id);
              const equipped = state.profile.equippedHat === item.id;
              const canAfford = state.profile.coins >= item.price;
              const rarity = state.rarityMeta[item.rarity];
              const rarityPalette = rarityColors[item.rarity];

              return (
                <View
                  key={item.id}
                  style={[
                    styles.itemCard,
                    isWide ? styles.itemCardHalf : styles.itemCardFull,
                    {
                      borderColor: equipped ? theme.color.action : rarityPalette.border,
                      backgroundColor: equipped ? theme.color.accentWarmBg : theme.color.surface
                    }
                  ]}
                >
                  <PizzaAvatar size={48} hat={item.id} mood="happy" />
                  <View style={styles.itemInfo}>
                    <Text style={[styles.rarityText, { color: rarityPalette.ink }]}>
                      {rarity.label}
                    </Text>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemDesc} numberOfLines={1}>
                      {item.description}
                    </Text>
                  </View>
                  <View style={styles.actionWrap}>
                    <ActionButton
                      label={equipped ? "Equipado" : unlocked ? "Equipar" : `${item.price} Q`}
                      variant={equipped ? "success" : unlocked ? "outline" : "gold"}
                      size="sm"
                      disabled={equipped || (!unlocked && !canAfford)}
                      onPress={() => actions.handleSelectHat(item.id)}
                    />
                  </View>
                </View>
              );
            })}

          {state.tab === "toppings" &&
            state.toppings.map((item) => {
              const unlocked = state.profile.unlockedToppings.includes(item.id);
              const equipped = state.profile.equippedTopping === item.id;
              const canAfford = state.profile.coins >= item.price;
              const rarity = state.rarityMeta[item.rarity];
              const rarityPalette = rarityColors[item.rarity];

              return (
                <View
                  key={item.id}
                  style={[
                    styles.itemCard,
                    isWide ? styles.itemCardHalf : styles.itemCardFull,
                    {
                      borderColor: equipped ? theme.color.action : rarityPalette.border,
                      backgroundColor: equipped ? theme.color.accentWarmBg : theme.color.surface
                    }
                  ]}
                >
                  <Pizza
                    denominator={4}
                    selected={[0, 1, 2]}
                    label={item.name}
                    size={50}
                    showSummary={false}
                    topping={item.id}
                  />
                  <View style={styles.itemInfo}>
                    <Text style={[styles.rarityText, { color: rarityPalette.ink }]}>
                      {rarity.label}
                    </Text>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemDesc} numberOfLines={1}>
                      {item.description}
                    </Text>
                  </View>
                  <View style={styles.actionWrap}>
                    <ActionButton
                      label={equipped ? "Em uso" : unlocked ? "Usar" : `${item.price} Q`}
                      variant={equipped ? "success" : unlocked ? "outline" : "gold"}
                      size="sm"
                      disabled={equipped || (!unlocked && !canAfford)}
                      onPress={() => actions.handleSelectTopping(item.id)}
                    />
                  </View>
                </View>
              );
            })}

          {state.tab === "titles" &&
            state.titles.map((item) => {
              const unlocked = state.profile.unlockedTitles.includes(item.id);
              const equipped = state.profile.equippedTitle === item.id;
              const canAfford = state.profile.coins >= item.price;
              const rarity = state.rarityMeta[item.rarity];
              const rarityPalette = rarityColors[item.rarity];

              return (
                <View
                  key={item.id}
                  style={[
                    styles.itemCard,
                    isWide ? styles.itemCardHalf : styles.itemCardFull,
                    {
                      borderColor: equipped ? theme.color.magic : rarityPalette.border,
                      backgroundColor: equipped ? theme.color.magicSurfaceTint : theme.color.surface
                    }
                  ]}
                >
                  <View style={styles.itemInfo}>
                    <Text style={[styles.rarityText, { color: rarityPalette.ink }]}>
                      {rarity.label}
                    </Text>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemDesc} numberOfLines={1}>
                      {item.description}
                    </Text>
                  </View>
                  <View style={styles.actionWrap}>
                    <ActionButton
                      label={equipped ? "Ativo" : unlocked ? "Equipar" : `${item.price} Q`}
                      variant={equipped ? "magic" : unlocked ? "outline" : "gold"}
                      size="sm"
                      disabled={equipped || (!unlocked && !canAfford)}
                      onPress={() => actions.handleSelectTitle(item.id)}
                    />
                  </View>
                </View>
              );
            })}
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
  previewBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.space.base,
    padding: theme.space.lg,
    borderRadius: 20,
    backgroundColor: theme.color.hudBg,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: theme.color.hudBorder
  },
  previewLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.base
  },
  previewTexts: {
    flex: 1,
    gap: theme.space.hair
  },
  previewTitle: {
    fontFamily: theme.font.bodyBold,
    fontSize: 12,
    color: theme.color.hudGold
  },
  previewName: {
    fontFamily: theme.font.display,
    fontSize: 19,
    color: theme.color.hudText
  },
  vaultCol: {
    alignItems: "flex-end"
  },
  vaultKicker: {
    fontFamily: theme.font.bodyBold,
    fontSize: 11,
    color: theme.color.hudMuted
  },
  vaultCoins: {
    fontFamily: theme.font.display,
    fontSize: 22,
    color: theme.color.hudGold
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.space.base
  },
  itemCard: {
    minHeight: 74,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.base,
    padding: theme.space.lg,
    borderRadius: 18,
    borderWidth: 2,
    borderBottomWidth: 4
  },
  itemCardFull: {
    width: "100%"
  },
  itemCardHalf: {
    width: "49%"
  },
  itemInfo: {
    flex: 1,
    gap: theme.space.hair
  },
  rarityText: {
    fontFamily: theme.font.bodyExtraBold,
    fontSize: 11
  },
  itemName: {
    fontFamily: theme.font.display,
    fontSize: 15,
    color: theme.color.onSurface
  },
  itemDesc: {
    fontFamily: theme.font.body,
    fontSize: 12,
    color: theme.color.onSurfaceMuted
  },
  actionWrap: {
    width: 106
  }
});

export default ShopScreen;
