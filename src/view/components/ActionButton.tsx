import { Pressable, StyleSheet, Text } from "react-native";
import { tokens } from "@/view/tokens";

type Props = { label: string; onPress: () => void; disabled?: boolean };

export const ActionButton = ({ label, onPress, disabled = false }: Props) => (
  <Pressable
    accessibilityRole="button"
    accessibilityState={{ disabled }}
    disabled={disabled}
    onPress={onPress}
    style={({ pressed }) => [styles.button, pressed && !disabled && styles.pressed, disabled && styles.disabled]}
  >
    <Text style={[styles.label, disabled && styles.disabledLabel]}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    minHeight: tokens.touchTarget,
    borderRadius: tokens.shape.full,
    backgroundColor: tokens.color.action,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: tokens.space.lg
  },
  pressed: { backgroundColor: tokens.color.actionPressed },
  disabled: { backgroundColor: tokens.color.disabledBg },
  label: { color: tokens.color.onAction, fontSize: tokens.type.label, fontWeight: "500" },
  disabledLabel: { color: tokens.color.disabledLabel }
});
