import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "@/view/theme";

type SliceCheckboxProps = {
  index: number;
  denominator: number;
  checked: boolean;
  onPress: () => void;
};

export const SliceCheckbox = ({ index, denominator, checked, onPress }: SliceCheckboxProps) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="checkbox"
    accessibilityLabel={`Fatia ${index + 1} de ${denominator}`}
    accessibilityState={{ checked }}
    style={({ pressed }) => [
      styles.button,
      checked ? styles.buttonChecked : styles.buttonDefault,
      pressed && styles.buttonPressed
    ]}
  >
    <View style={[styles.box, checked ? styles.boxChecked : styles.boxDefault]}>
      {checked && (
        <Text style={styles.checkmark} selectable={false}>
          ✓
        </Text>
      )}
    </View>
    <Text
      selectable={false}
      style={[styles.label, checked ? styles.labelChecked : styles.labelDefault]}
    >
      Fatia {index + 1}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    minHeight: 46,
    paddingHorizontal: theme.space.lgPlus,
    paddingVertical: theme.space.md,
    borderRadius: 14,
    borderWidth: 2,
    borderBottomWidth: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.md
  },
  buttonDefault: {
    backgroundColor: theme.color.surface,
    borderColor: theme.color.outlineVariant
  },
  buttonChecked: {
    backgroundColor: theme.color.accentSoft,
    borderColor: theme.color.action,
    borderBottomWidth: 2,
    transform: [{ translateY: 2 }]
  },
  buttonPressed: {
    opacity: 0.92
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center"
  },
  boxDefault: {
    borderWidth: 2,
    borderColor: theme.color.outline
  },
  boxChecked: {
    backgroundColor: theme.color.action
  },
  checkmark: {
    color: theme.color.onAction,
    fontFamily: theme.font.bodyExtraBold,
    fontSize: 12
  },
  label: {
    fontFamily: theme.font.bodyBold,
    fontSize: 14
  },
  labelDefault: {
    color: theme.color.onSurface
  },
  labelChecked: {
    color: theme.color.onAccentSoft
  }
});
