import { Pressable, StyleSheet, Text, View } from "react-native";
import { tokens } from "@/view/tokens";

type Props = { index: number; denominator: number; checked: boolean; onPress: () => void };

export const SliceCheckbox = ({ index, denominator, checked, onPress }: Props) => (
  <Pressable
    accessibilityRole="checkbox"
    accessibilityLabel={`Fatia ${index + 1} de ${denominator}`}
    accessibilityState={{ checked }}
    onPress={onPress}
    style={({ pressed }) => [styles.control, pressed && styles.pressed]}
  >
    <View style={[styles.box, checked && styles.boxChecked]}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </View>
    <Text style={styles.label}>Fatia {index + 1}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  control: {
    minHeight: tokens.touchTarget,
    minWidth: tokens.touchTarget,
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space.sm,
    paddingHorizontal: tokens.space.sm,
    borderRadius: tokens.shape.medium
  },
  pressed: { backgroundColor: tokens.color.surfaceLow },
  box: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: tokens.color.outline,
    borderRadius: tokens.shape.small,
    alignItems: "center",
    justifyContent: "center"
  },
  boxChecked: { backgroundColor: tokens.color.action, borderColor: tokens.color.action },
  checkmark: { color: tokens.color.onAction, fontSize: tokens.type.label, fontWeight: "700" },
  label: { color: tokens.color.onSurface, fontSize: tokens.type.body, lineHeight: 24 }
});
