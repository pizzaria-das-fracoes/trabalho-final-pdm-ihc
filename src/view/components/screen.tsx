import { type PropsWithChildren } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, Path, Pattern, Rect } from "react-native-svg";
import type { ToppingId } from "@/model/entities/progress";
import { Pizza } from "@/view/components/pizza";
import { theme } from "@/view/theme";

type NavItem = {
  route: string;
  label: string;
  path: string;
};

const navItems: NavItem[] = [
  {
    route: "/home",
    label: "Mapa",
    path: "M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.3L17.5 7.7 12 11 6.5 7.7 12 4.3z"
  },
  {
    route: "/sandbox",
    label: "Bancada",
    path: "M4 5h16v4H4V5zm0 6h10v4H4v-4zm12 0h4v4h-4v-4zm-12 6h16v2H4v-2z"
  },
  {
    route: "/arcade",
    label: "Arcade",
    path: "M13 2L4 14h6l-1 8 9-12h-6l1-8z"
  },
  {
    route: "/shop",
    label: "Oficina",
    path: "M12 2l3 5h5l-3 5 2 8-7-4-7 4 2-8-3-5h5l3-5z"
  },
  {
    route: "/progress",
    label: "Troféus",
    path: "M5 3h14v4a5 5 0 0 1-4 4.9V15h3v2H6v-2h3v-3.1A5 5 0 0 1 5 7V3z"
  }
];

type ScreenProps = PropsWithChildren<{
  navigation?: boolean;
  title?: string;
  scrollable?: boolean;
  coins: number;
  soundEnabled: boolean;
  equippedTopping: ToppingId;
  activeRoute: string;
  onNavigate: (route: string) => void;
  onToggleSound: () => void;
}>;

export const Screen = ({
  children,
  navigation = true,
  scrollable = false,
  coins,
  soundEnabled,
  equippedTopping,
  activeRoute,
  onNavigate,
  onToggleSound
}: ScreenProps) => {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isWide = width >= 540;
  const isShort = height < 740;
  const useScroll = scrollable || height < 580;

  const isNavActive = (route: string): boolean => {
    if (route === "/home") {
      return (
        activeRoute === "/home" ||
        activeRoute === "/pizza" ||
        activeRoute === "/compare" ||
        activeRoute === "/equivalent" ||
        activeRoute === "/number-line" ||
        activeRoute === "/decimal" ||
        activeRoute === "/quantity" ||
        activeRoute === "/operations"
      );
    }
    if (route === "/progress") {
      return activeRoute === "/progress" || activeRoute === "/about";
    }
    return activeRoute === route;
  };

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.header,
          isShort && styles.headerCompact,
          { paddingTop: Math.max(insets.top, theme.space.xs) }
        ]}
      >
        <View style={styles.headerInner}>
          <Pressable
            onPress={() => onNavigate("/home")}
            accessibilityRole="button"
            accessibilityLabel="Ir para o Mapa da Pizzaria"
            style={({ pressed }) => [styles.brandBtn, pressed && styles.brandBtnPressed]}
          >
            <Pizza
              denominator={4}
              selected={[0, 1, 2]}
              label="FatiaMática"
              size={30}
              showSummary={false}
              topping={equippedTopping}
            />
            <Text style={styles.brandText} selectable={false}>
              Fatia<Text style={styles.brandGold}>Mática</Text>
            </Text>
          </Pressable>

          <View style={styles.headerRight}>
            <View style={styles.coinBadge}>
              <Text style={styles.coinText} selectable={false}>
                {coins} {isWide ? "Queijos" : "Q"}
              </Text>
            </View>

            <Pressable
              onPress={onToggleSound}
              accessibilityRole="button"
              accessibilityLabel={soundEnabled ? "Desligar sons do jogo" : "Ligar sons do jogo"}
              style={({ pressed }) => [styles.soundBtn, pressed && styles.soundBtnPressed]}
            >
              <Svg width={14} height={14} viewBox="0 0 24 24">
                {soundEnabled ? (
                  <Path
                    fill={theme.color.hudText}
                    d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z"
                  />
                ) : (
                  <Path
                    fill={theme.color.hudText}
                    d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3z"
                  />
                )}
              </Svg>
              <Text style={styles.soundText} selectable={false}>
                {soundEnabled ? "Som" : "Mudo"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      <View style={styles.canvasWrap}>
        <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
          <Defs>
            <Pattern id="pizzeriaCheck" width={40} height={40} patternUnits="userSpaceOnUse">
              <Rect x={0} y={0} width={20} height={20} fill={theme.color.action} opacity={0.045} />
              <Rect x={20} y={20} width={20} height={20} fill={theme.color.action} opacity={0.045} />
            </Pattern>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#pizzeriaCheck)" />
        </Svg>

        {useScroll ? (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              isShort && styles.scrollContentCompact,
              {
                paddingBottom: navigation
                  ? theme.space.lg
                  : Math.max(insets.bottom + theme.space.lg, theme.space.xl)
              }
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.mainInnerScroll, isShort && styles.mainInnerCompact]}>{children}</View>
          </ScrollView>
        ) : (
          <View
            style={[
              styles.contentArea,
              isShort && styles.contentAreaCompact,
              {
                paddingBottom: navigation
                  ? isShort
                    ? theme.space.sm
                    : theme.space.base
                  : Math.max(insets.bottom + theme.space.base, theme.space.lgPlus)
              }
            ]}
          >
            <View style={[styles.mainInner, isShort && styles.mainInnerCompact]}>{children}</View>
          </View>
        )}
      </View>

      {navigation && (
        <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, theme.space.xs) }]}>
          {navItems.map((item) => {
            const active = isNavActive(item.route);
            return (
              <Pressable
                key={item.route}
                onPress={() => onNavigate(item.route)}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                style={styles.navTab}
              >
                <View style={[styles.navPill, active && styles.navPillActive]}>
                  <Svg width={18} height={18} viewBox="0 0 24 24">
                    <Path
                      d={item.path}
                      fill={active ? theme.color.hudGold : theme.color.hudInactive}
                    />
                  </Svg>
                </View>
                <Text style={[styles.navLabel, active && styles.navLabelActive]} selectable={false}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.color.canvas
  },
  header: {
    backgroundColor: theme.color.hudBg,
    borderBottomWidth: 4,
    borderBottomColor: theme.color.hudBorder,
    paddingHorizontal: theme.space.lgPlus,
    paddingBottom: theme.space.md
  },
  headerCompact: {
    paddingHorizontal: theme.space.base,
    paddingBottom: theme.space.sm,
    borderBottomWidth: 3
  },
  headerInner: {
    width: "100%",
    maxWidth: 1080,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.space.base
  },
  brandBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.md
  },
  brandBtnPressed: {
    opacity: 0.82
  },
  brandText: {
    fontFamily: theme.font.display,
    fontSize: 19,
    color: theme.color.hudText
  },
  brandGold: {
    color: theme.color.hudGold
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.md
  },
  coinBadge: {
    minHeight: 36,
    paddingHorizontal: theme.space.base,
    paddingVertical: theme.space.xsPlus,
    borderRadius: 11,
    backgroundColor: theme.color.hudButton,
    borderWidth: 2,
    borderColor: theme.color.hudBorder,
    justifyContent: "center"
  },
  coinText: {
    fontFamily: theme.font.display,
    fontSize: 13,
    color: theme.color.hudGold
  },
  soundBtn: {
    minHeight: 36,
    paddingHorizontal: theme.space.base,
    paddingVertical: theme.space.xsPlus,
    borderRadius: 11,
    backgroundColor: theme.color.hudButton,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: theme.color.hudBorder,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.xsPlus
  },
  soundBtnPressed: {
    borderBottomWidth: 2,
    transform: [{ translateY: 1.5 }]
  },
  soundText: {
    fontFamily: theme.font.bodyBold,
    fontSize: 12,
    color: theme.color.hudText
  },
  canvasWrap: {
    flex: 1,
    position: "relative",
    backgroundColor: theme.color.canvas
  },
  contentArea: {
    flex: 1,
    paddingHorizontal: theme.space.lg,
    paddingTop: theme.space.base
  },
  contentAreaCompact: {
    paddingHorizontal: theme.space.md,
    paddingTop: theme.space.sm
  },
  mainInner: {
    flex: 1,
    width: "100%",
    maxWidth: 1080,
    alignSelf: "center",
    gap: theme.space.base
  },
  mainInnerCompact: {
    gap: theme.space.sm
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.space.lg,
    paddingTop: theme.space.lg
  },
  scrollContentCompact: {
    paddingHorizontal: theme.space.md,
    paddingTop: theme.space.sm
  },
  mainInnerScroll: {
    width: "100%",
    maxWidth: 1080,
    alignSelf: "center",
    gap: theme.space.lg
  },
  bottomNav: {
    backgroundColor: theme.color.hudBg,
    borderTopWidth: 2,
    borderTopColor: theme.color.hudBorder,
    paddingHorizontal: theme.space.sm,
    paddingTop: theme.space.xs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  },
  navTab: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.space.xxs
  },
  navPill: {
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.tiny,
    borderRadius: theme.shape.full
  },
  navPillActive: {
    backgroundColor: theme.color.hudButton
  },
  navLabel: {
    fontFamily: theme.font.bodyBold,
    fontSize: 11,
    color: theme.color.hudInactive
  },
  navLabelActive: {
    color: theme.color.hudGold
  }
});
