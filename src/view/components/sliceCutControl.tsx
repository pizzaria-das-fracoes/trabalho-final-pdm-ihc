import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import Slider from "@react-native-community/slider";
import { theme } from "@/view/theme";

type SliceCutControlProps = {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  presets?: number[];
  onChange: (next: number) => void;
};

export const SliceCutControl = ({
  label = "Cortador de Pizza (2 a 100)",
  value,
  min = 2,
  max = 100,
  presets = [2, 4, 6, 8, 10, 12, 20, 100],
  onChange
}: SliceCutControlProps) => {
  const { width, height } = useWindowDimensions();
  const isCompact = width < 480 || height < 740;
  const [textValue, setTextValue] = useState(String(value));

  useEffect(() => {
    setTextValue(String(value));
  }, [value]);

  const clamp = (n: number): number => Math.min(max, Math.max(min, Math.round(n)));

  const update = (next: number) => {
    const clamped = clamp(next);
    if (clamped !== value) {
      onChange(clamped);
    }
  };

  return (
    <View style={[styles.container, isCompact && styles.containerCompact]}>
      <View style={styles.topRow}>
        <Text style={styles.label} numberOfLines={1}>
          {isCompact && label.includes("(2 a 100)") ? "Cortes da pizza (2 a 100)" : label}
        </Text>
        <View style={styles.stepper}>
          <Pressable
            onPress={() => update(value - 1)}
            disabled={value <= min}
            accessibilityRole="button"
            accessibilityLabel="Diminuir número de fatias"
            style={({ pressed }) => [
              styles.stepBtn,
              isCompact && styles.stepBtnCompact,
              value <= min && styles.stepBtnDisabled,
              pressed && value > min && styles.stepBtnPressed
            ]}
          >
            <Text style={[styles.stepBtnText, isCompact && styles.stepBtnTextCompact]} selectable={false}>
              −
            </Text>
          </Pressable>

          <TextInput
            value={textValue}
            keyboardType="number-pad"
            maxLength={3}
            accessibilityLabel="Quantidade de fatias"
            onChangeText={(txt) => {
              const cleaned = txt.replace(/[^0-9]/g, "");
              setTextValue(cleaned);
              if (cleaned !== "") {
                const parsed = Number(cleaned);
                if (!Number.isNaN(parsed) && parsed >= min && parsed <= max) {
                  update(parsed);
                }
              }
            }}
            onBlur={() => {
              const parsed = Number(textValue);
              if (Number.isNaN(parsed) || textValue === "") {
                setTextValue(String(value));
              } else {
                const clamped = clamp(parsed);
                setTextValue(String(clamped));
                update(clamped);
              }
            }}
            style={[styles.numberInput, isCompact && styles.numberInputCompact]}
          />

          <Pressable
            onPress={() => update(value + 1)}
            disabled={value >= max}
            accessibilityRole="button"
            accessibilityLabel="Aumentar número de fatias"
            style={({ pressed }) => [
              styles.stepBtn,
              isCompact && styles.stepBtnCompact,
              value >= max && styles.stepBtnDisabled,
              pressed && value < max && styles.stepBtnPressed
            ]}
          >
            <Text style={[styles.stepBtnText, isCompact && styles.stepBtnTextCompact]} selectable={false}>
              +
            </Text>
          </Pressable>
        </View>
      </View>

      <Slider
        minimumValue={min}
        maximumValue={max}
        step={1}
        value={value}
        onValueChange={(next) => update(next)}
        minimumTrackTintColor={theme.color.magic}
        maximumTrackTintColor={theme.color.outlineVariant}
        thumbTintColor={theme.color.magic}
        accessibilityLabel="Escolher número de fatias"
        style={[styles.slider, isCompact && styles.sliderCompact]}
      />

      {presets.length > 0 && (
        <View style={styles.presetRow}>
          {presets.map((preset) => {
            const active = value === preset;
            return (
              <Pressable
                key={preset}
                onPress={() => update(preset)}
                accessibilityRole="button"
                accessibilityLabel={`Cortar em ${preset} fatias`}
                style={({ pressed }) => [
                  styles.presetChip,
                  isCompact && styles.presetChipCompact,
                  active && styles.presetChipActive,
                  pressed && styles.presetPressed
                ]}
              >
                <Text
                  selectable={false}
                  style={[
                    styles.presetText,
                    isCompact && styles.presetTextCompact,
                    active && styles.presetTextActive
                  ]}
                >
                  {preset}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: theme.space.md,
    borderRadius: 16,
    backgroundColor: theme.color.magicSurfaceTint,
    borderWidth: 2,
    borderColor: theme.color.magicBorderTint,
    gap: theme.space.xs
  },
  containerCompact: {
    padding: theme.space.sm,
    borderRadius: 14,
    gap: theme.space.xxs
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.space.md
  },
  label: {
    fontFamily: theme.font.bodyBold,
    fontSize: 12,
    color: theme.color.magicInk,
    flex: 1
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.xsPlus
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.color.surface,
    borderWidth: 2,
    borderBottomWidth: 4,
    borderColor: theme.color.outlineVariant,
    alignItems: "center",
    justifyContent: "center"
  },
  stepBtnCompact: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderBottomWidth: 3
  },
  stepBtnPressed: {
    borderBottomWidth: 2,
    transform: [{ translateY: 2 }]
  },
  stepBtnDisabled: {
    opacity: 0.4
  },
  stepBtnText: {
    fontFamily: theme.font.display,
    fontSize: 18,
    color: theme.color.onSurface
  },
  stepBtnTextCompact: {
    fontSize: 15
  },
  numberInput: {
    width: 48,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.color.surface,
    borderWidth: 2,
    borderColor: theme.color.magicBorderSoft,
    textAlign: "center",
    fontFamily: theme.font.display,
    fontSize: 14,
    color: theme.color.onSurface,
    paddingVertical: theme.space.none
  },
  numberInputCompact: {
    width: 42,
    height: 30,
    borderRadius: 8,
    fontSize: 13
  },
  slider: {
    width: "100%",
    height: 26
  },
  sliderCompact: {
    height: 20
  },
  presetRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.space.xs
  },
  presetChip: {
    minWidth: 30,
    minHeight: 28,
    paddingHorizontal: theme.space.smPlus,
    paddingVertical: theme.space.xxs,
    borderRadius: 8,
    backgroundColor: theme.color.surface,
    borderWidth: 1.5,
    borderBottomWidth: 3,
    borderColor: theme.color.outlineVariant,
    alignItems: "center",
    justifyContent: "center"
  },
  presetChipCompact: {
    minWidth: 27,
    minHeight: 24,
    paddingHorizontal: theme.space.sm,
    paddingVertical: theme.space.hair,
    borderRadius: 7,
    borderBottomWidth: 2
  },
  presetChipActive: {
    backgroundColor: theme.color.magic,
    borderColor: theme.color.magicEdge
  },
  presetPressed: {
    borderBottomWidth: 1.5,
    transform: [{ translateY: 1 }]
  },
  presetText: {
    fontFamily: theme.font.bodyExtraBold,
    fontSize: 11,
    color: theme.color.onSurface
  },
  presetTextCompact: {
    fontSize: 10.5
  },
  presetTextActive: {
    color: theme.color.onAction
  }
});
