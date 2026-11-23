import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";
import { theme } from "@/view/theme";

export type ChipVariant = "neutral" | "primary" | "magic" | "success" | "danger";

type ChipButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ChipVariant;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const variantPalette: Record<
  ChipVariant,
  { bg: string; edge: string; text: string }
> = {
  neutral: {
    bg: theme.color.surfaceLow,
    edge: theme.color.outlineVariant,
    text: theme.color.onSurface
  },
  primary: {
    bg: theme.color.action,
    edge: theme.color.actionEdge,
    text: theme.color.onAction
  },
  magic: {
    bg: theme.color.magic,
    edge: theme.color.magicEdge,
    text: theme.color.onMagic
  },
  success: {
    bg: theme.color.success,
    edge: theme.color.successEdge,
    text: theme.color.onSuccess
  },
  danger: {
    bg: theme.color.surface,
    edge: theme.color.outlineVariant,
    text: theme.color.error
  }
};

export const ChipButton = ({
  label,
  onPress,
  variant = "neutral",
  disabled = false,
  accessibilityLabel,
  style
}: ChipButtonProps) => {
  const palette = variantPalette[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        disabled
          ? styles.disabled
          : {
              backgroundColor: palette.bg,
              borderColor: palette.edge,
              borderBottomWidth: pressed ? 2 : 4,
              transform: [{ translateY: pressed ? 1.5 : 0 }]
            },
        style
      ]}
    >
      <Text
        numberOfLines={1}
        selectable={false}
        style={[
          styles.label,
          { color: disabled ? theme.color.disabledLabel : palette.text }
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 38,
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.sm,
    borderRadius: 12,
    borderWidth: 2,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center"
  },
  disabled: {
    backgroundColor: theme.color.disabledBg,
    borderColor: theme.color.outlineVariant,
    borderBottomWidth: 4
  },
  label: {
    fontFamily: theme.font.bodyExtraBold,
    fontSize: 12,
    letterSpacing: 0.2
  }
});
