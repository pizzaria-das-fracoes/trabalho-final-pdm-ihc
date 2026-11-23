import { StyleSheet, Text, View } from "react-native";
import { theme } from "@/view/theme";

type FractionDisplayProps = {
  numerator: number;
  denominator: number;
  labels?: boolean;
  compact?: boolean;
  tone?: "default" | "accent" | "magic";
};

export const FractionDisplay = ({
  numerator,
  denominator,
  labels = false,
  compact = false,
  tone = "default"
}: FractionDisplayProps) => {
  const ink =
    tone === "accent"
      ? theme.color.onAccentSoft
      : tone === "magic"
        ? theme.color.magicInk
        : theme.color.onSurface;

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Fração ${numerator} sobre ${denominator}`}
      style={[styles.container, compact && styles.containerCompact]}
    >
      {labels && <Text style={styles.caption}>parte pintada</Text>}
      <Text style={[styles.number, compact && styles.numberCompact, { color: ink }]}>
        {numerator}
      </Text>
      <View style={[styles.bar, compact && styles.barCompact, { backgroundColor: ink }]} />
      <Text style={[styles.number, compact && styles.numberCompact, { color: ink }]}>
        {denominator}
      </Text>
      {labels && <Text style={styles.caption}>total de fatias</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: theme.space.xxs
  },
  containerCompact: {
    gap: theme.space.hair
  },
  caption: {
    fontFamily: theme.font.bodyBold,
    fontSize: 12,
    color: theme.color.onSurfaceMuted
  },
  number: {
    minWidth: 28,
    textAlign: "center",
    fontFamily: theme.font.display,
    fontSize: 26,
    lineHeight: 30
  },
  numberCompact: {
    minWidth: 22,
    fontSize: 19,
    lineHeight: 21
  },
  bar: {
    width: 34,
    height: 3,
    borderRadius: theme.shape.full
  },
  barCompact: {
    width: 24,
    height: 2.5
  }
});
