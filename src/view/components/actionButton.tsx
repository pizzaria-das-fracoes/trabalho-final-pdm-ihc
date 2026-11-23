import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";
import { theme } from "@/view/theme";

type Variant = "primary" | "success" | "magic" | "gold" | "outline" | "danger";
type Size = "md" | "sm";

type ActionButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: Variant;
  size?: Size;
  style?: StyleProp<ViewStyle>;
};

const variantColors: Record<Variant, { bg: string; edge: string; text: string }> = {
  primary: {
    bg: theme.color.action,
    edge: theme.color.actionEdge,
    text: theme.color.onAction
  },
  success: {
    bg: theme.color.success,
    edge: theme.color.successEdge,
    text: theme.color.onSuccess
  },
  magic: {
    bg: theme.color.magic,
    edge: theme.color.magicEdge,
    text: theme.color.onMagic
  },
  gold: {
    bg: theme.color.gold,
    edge: theme.color.goldEdge,
    text: theme.color.onSurface
  },
  outline: {
    bg: theme.color.surface,
    edge: theme.color.outlineVariant,
    text: theme.color.onSurface
  },
  danger: {
    bg: theme.color.error,
    edge: theme.color.errorEdge,
    text: theme.color.onError
  }
};

export const ActionButton = ({
  label,
  onPress,
  disabled = false,
  variant = "primary",
  size = "md",
  style
}: ActionButtonProps) => {
  const palette = variantColors[variant];
  const isSmall = size === "sm";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isSmall ? styles.sm : styles.md,
        disabled
          ? styles.disabled
          : {
              backgroundColor: palette.bg,
              borderColor: palette.edge,
              borderBottomWidth: pressed ? 2 : isSmall ? 4 : 5,
              transform: [{ translateY: pressed ? 2 : 0 }]
            },
        style
      ]}
    >
      <Text
        numberOfLines={1}
        selectable={false}
        style={[
          styles.label,
          isSmall && styles.labelSm,
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
    width: "100%",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center"
  },
  md: {
    minHeight: theme.touchTarget,
    borderRadius: 16,
    borderBottomWidth: 5,
    paddingHorizontal: theme.space.xlPlus,
    paddingVertical: theme.space.base
  },
  sm: {
    minHeight: 40,
    borderRadius: 12,
    borderBottomWidth: 4,
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.sm
  },
  disabled: {
    backgroundColor: theme.color.disabledBg,
    borderColor: theme.color.outlineVariant,
    borderBottomWidth: 4
  },
  label: {
    fontFamily: theme.font.display,
    fontSize: 16,
    letterSpacing: 0.3
  },
  labelSm: {
    fontSize: 13
  }
});
