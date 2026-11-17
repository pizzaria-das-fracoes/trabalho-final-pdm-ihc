import { StyleSheet, Text, View } from "react-native";
import { tokens } from "@/view/tokens";

export const Feedback = ({ message }: { message: string | null }) => {
  if (!message) return null;
  const correct = message.startsWith("Muito bem") || message.startsWith("Correto");

  return (
    <View accessibilityLiveRegion="polite" style={[styles.container, correct ? styles.correct : styles.tryAgain]}>
      <View style={styles.heading}>
        <View style={[styles.icon, correct ? styles.correctIcon : styles.errorIcon]}>
          <Text style={[styles.iconText, correct ? styles.correctIconText : styles.errorIconText]}>{correct ? "✓" : "!"}</Text>
        </View>
        <Text style={[styles.title, correct && styles.correctText]}>{correct ? "Muito bem!" : "Quase lá — tente de novo"}</Text>
      </View>
      <Text style={[styles.message, correct && styles.correctText]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: tokens.space.sm, padding: tokens.space.md, borderRadius: tokens.shape.medium },
  correct: { backgroundColor: tokens.color.success },
  tryAgain: { backgroundColor: tokens.color.surface, borderWidth: 1, borderColor: tokens.color.error },
  heading: { flexDirection: "row", alignItems: "center", gap: tokens.space.sm },
  icon: { width: 32, height: 32, borderRadius: tokens.shape.full, alignItems: "center", justifyContent: "center" },
  correctIcon: { backgroundColor: tokens.color.onSuccess },
  errorIcon: { backgroundColor: tokens.color.error },
  iconText: { fontSize: tokens.type.body, fontWeight: "700" },
  correctIconText: { color: tokens.color.success },
  errorIconText: { color: tokens.color.onError },
  title: { color: tokens.color.error, fontSize: tokens.type.body, lineHeight: 24, fontWeight: "700" },
  message: { color: tokens.color.onSurface, fontSize: tokens.type.label, lineHeight: 21 },
  correctText: { color: tokens.color.onSuccess }
});
