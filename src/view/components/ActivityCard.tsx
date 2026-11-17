import { Pressable, StyleSheet, Text, View } from "react-native";
import { Pizza } from "@/view/components/Pizza";
import { tokens } from "@/view/tokens";

type ActivityCardProps = {
  title: string;
  description: string;
  skill: string;
  status: string;
  progress: number;
  numerator: number;
  denominator: number;
  tone: "accent" | "success" | "info";
  onPress: () => void;
};

export const ActivityCard = ({ title, description, skill, status, progress, numerator, denominator, tone, onPress }: ActivityCardProps) => (
  <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
    <Pizza
      denominator={denominator}
      selected={Array.from({ length: numerator }, (_, index) => index)}
      label={`${title}: exemplo de ${numerator}/${denominator}`}
      size={80}
    />
    <View style={styles.info}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.meta}>
        <Text style={[styles.skill, tone === "accent" ? styles.accent : tone === "success" ? styles.success : styles.infoTone]}>{skill}</Text>
        <Text style={styles.status}>{status}</Text>
      </View>
      <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: progress }} accessibilityLabel={`Acertos em ${title}`} style={styles.track}>
        <View style={[styles.fill, { width: `${progress}%` }]} />
      </View>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", gap: tokens.space.sm, padding: tokens.space.sm, borderRadius: tokens.shape.medium, backgroundColor: tokens.color.surfaceLow, elevation: tokens.elevation.card },
  pressed: { backgroundColor: tokens.color.surfaceMid },
  info: { flex: 1, minWidth: 0, gap: tokens.space.xs },
  title: { color: tokens.color.onSurface, fontSize: tokens.type.body, lineHeight: 24, fontWeight: "500" },
  description: { color: tokens.color.onSurface, fontSize: tokens.type.label, lineHeight: 20 },
  meta: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: tokens.space.sm },
  skill: { overflow: "hidden", paddingHorizontal: tokens.space.sm, paddingVertical: tokens.space.xs, borderRadius: tokens.shape.small, fontSize: tokens.type.chip, lineHeight: 16, fontWeight: "700" },
  accent: { backgroundColor: tokens.color.accentSoft, color: tokens.color.onAccentSoft },
  success: { backgroundColor: tokens.color.successSoft, color: tokens.color.successInk },
  infoTone: { backgroundColor: tokens.color.infoSoft, color: tokens.color.info },
  status: { color: tokens.color.action, fontSize: tokens.type.label, lineHeight: 20, fontWeight: "500" },
  track: { height: 4, overflow: "hidden", borderRadius: tokens.shape.full, backgroundColor: tokens.color.surfaceHigh },
  fill: { height: "100%", borderRadius: tokens.shape.full, backgroundColor: tokens.color.action }
});
