import { router, usePathname } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { tokens } from "@/view/tokens";

const tabs = [
  { route: "/home", label: "Início", path: "M12 3 2 12h3v9h6v-6h2v6h6v-9h3z" },
  { route: "/about", label: "Sobre", path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2zm0-8h-2V7h2z" },
  { route: "/progress", label: "Progresso", path: "M5 12h3v8H5zm5-5h3v13h-3zm5-4h3v17h-3z" }
];

export const NavigationBar = () => {
  const pathname = usePathname();

  return (
    <View accessibilityRole="tablist" accessibilityLabel="Navegação principal" style={styles.bar}>
      {tabs.map((tab) => {
        const selected = pathname === tab.route || (tab.route === "/home" && pathname !== "/activities" && pathname !== "/progress");
        return (
          <Pressable
            key={tab.route}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => router.replace(tab.route)}
            style={styles.item}
          >
            <View style={[styles.indicator, selected && styles.indicatorSelected]}>
              <Svg width={24} height={24} viewBox="0 0 24 24" accessibilityElementsHidden>
                <Path d={tab.path} fill={selected ? tokens.color.onAccentSoft : tokens.color.onSurface} />
              </Svg>
            </View>
            <Text style={[styles.label, selected && styles.labelSelected]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: { flexDirection: "row", backgroundColor: tokens.color.surfaceMid, paddingHorizontal: tokens.space.sm, paddingVertical: tokens.space.sm, borderTopWidth: 1, borderTopColor: tokens.color.outlineVariant },
  item: { flex: 1, minHeight: 64, alignItems: "center", justifyContent: "center", gap: tokens.space.xs, borderRadius: tokens.shape.medium },
  indicator: { width: 64, height: 32, borderRadius: tokens.shape.full, alignItems: "center", justifyContent: "center" },
  indicatorSelected: { backgroundColor: tokens.color.accentSoft },
  label: { color: tokens.color.onSurface, fontSize: tokens.type.label, lineHeight: 20, fontWeight: "500" },
  labelSelected: { color: tokens.color.onAccentSoft, fontWeight: "700" }
});
