import { StyleSheet, Text, View } from "react-native";
import { tokens } from "@/view/tokens";

type Props = { numerator: number; denominator: number; labels?: boolean; tone?: "default" | "accent" };

export const FractionDisplay = ({ numerator, denominator, labels = false, tone = "default" }: Props) => (
  <View accessible accessibilityRole="image" accessibilityLabel={`Numerador ${numerator}; denominador ${denominator}`} style={styles.container}>
    {labels && <Text style={styles.label}>numerador</Text>}
    <Text style={[styles.number, tone === "accent" && styles.accent]}>{numerator}</Text>
    <View style={[styles.rule, tone === "accent" && styles.ruleAccent]} />
    <Text style={[styles.number, tone === "accent" && styles.accent]}>{denominator}</Text>
    {labels && <Text style={styles.label}>denominador</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: tokens.space.xs },
  number: { minWidth: tokens.space.lg, color: tokens.color.onSurface, fontSize: tokens.type.title, lineHeight: 28, textAlign: "center", fontVariant: ["tabular-nums"] },
  rule: { width: "100%", height: tokens.pizza.separatorWidth, borderRadius: tokens.shape.full, backgroundColor: tokens.color.onSurface },
  label: { color: tokens.color.onSurface, fontSize: tokens.type.chip, lineHeight: 16, fontWeight: "700", textTransform: "uppercase" },
  accent: { color: tokens.color.onAccentSoft, fontWeight: "700" },
  ruleAccent: { backgroundColor: tokens.color.onAccentSoft }
});
