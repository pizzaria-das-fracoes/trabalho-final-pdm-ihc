import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import type { ToppingId } from "@/model/entities/progress";
import { Pizza } from "@/view/components/pizza";
import { theme } from "@/view/theme";

type ChoiceListProps = {
  options: string[];
  selected: string | null;
  wrongAttempts?: string[];
  onSelect: (option: string) => void;
  fractionOptions?: Record<string, { numerator: number; denominator: number }>;
  topping?: ToppingId;
};

export const ChoiceList = ({
  options,
  selected,
  wrongAttempts = [],
  onSelect,
  fractionOptions,
  topping
}: ChoiceListProps) => {
  const { width, height } = useWindowDimensions();
  const horizontalGrid = width >= 340;
  const isCompact = width < 480 || height < 740;
  const miniPizzaSize = width >= 540 ? 64 : isCompact ? 40 : 48;

  return (
    <View
      accessibilityRole="radiogroup"
      style={[styles.grid, horizontalGrid && styles.gridHorizontal]}
    >
      {options.map((option, idx) => {
        const isSelected = selected === option;
        const isTriedWrong = wrongAttempts.includes(option) && !isSelected;
        const frac = fractionOptions?.[option];

        return (
          <Pressable
            key={option}
            disabled={isTriedWrong}
            onPress={() => onSelect(option)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected, disabled: isTriedWrong }}
            style={({ pressed }) => [
              styles.card,
              isCompact && styles.cardCompact,
              horizontalGrid && styles.cardHorizontal,
              frac ? styles.cardColumn : styles.cardRow,
              isTriedWrong
                ? styles.cardWrong
                : isSelected
                  ? styles.cardSelected
                  : styles.cardDefault,
              pressed && !isTriedWrong && styles.cardPressed
            ]}
          >
            {frac && (
              <Pizza
                denominator={frac.denominator}
                selected={Array.from({ length: frac.numerator }, (_, index) => index)}
                label={`Pizza de ${option}`}
                size={miniPizzaSize}
                showSummary={false}
                topping={topping}
              />
            )}
            <View style={[styles.labelRow, isCompact && styles.labelRowCompact]}>
              <View
                style={[
                  styles.badge,
                  isCompact && styles.badgeCompact,
                  isTriedWrong
                    ? styles.badgeWrong
                    : isSelected
                      ? styles.badgeSelected
                      : styles.badgeDefault
                ]}
              >
                <Text
                  selectable={false}
                  style={[
                    styles.badgeText,
                    isCompact && styles.badgeTextCompact,
                    (isTriedWrong || isSelected) && styles.badgeTextInverse
                  ]}
                >
                  {isTriedWrong ? "✕" : String(idx + 1)}
                </Text>
              </View>
              <Text
                selectable={false}
                style={[
                  styles.optionText,
                  isCompact && styles.optionTextCompact,
                  isTriedWrong && styles.optionTextWrong
                ]}
              >
                {option}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    gap: theme.space.md
  },
  gridHorizontal: {
    flexDirection: "row"
  },
  card: {
    minHeight: 46,
    padding: theme.space.md,
    borderRadius: 15,
    borderWidth: 2,
    borderBottomWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.space.xsPlus
  },
  cardCompact: {
    minHeight: 40,
    padding: theme.space.sm,
    borderRadius: 13,
    gap: theme.space.xs
  },
  cardHorizontal: {
    flex: 1
  },
  cardColumn: {
    flexDirection: "column"
  },
  cardRow: {
    flexDirection: "row"
  },
  cardDefault: {
    backgroundColor: theme.color.surface,
    borderColor: theme.color.outlineVariant
  },
  cardSelected: {
    backgroundColor: theme.color.accentSoft,
    borderColor: theme.color.action,
    borderBottomWidth: 2,
    transform: [{ translateY: 2 }]
  },
  cardWrong: {
    backgroundColor: theme.color.errorSoft,
    borderColor: theme.color.errorBorderSoft,
    opacity: 0.65
  },
  cardPressed: {
    opacity: 0.92
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.space.sm
  },
  labelRowCompact: {
    gap: theme.space.xsPlus
  },
  badge: {
    width: 22,
    height: 22,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center"
  },
  badgeCompact: {
    width: 19,
    height: 19,
    borderRadius: 6
  },
  badgeDefault: {
    backgroundColor: theme.color.surfaceMid
  },
  badgeSelected: {
    backgroundColor: theme.color.action
  },
  badgeWrong: {
    backgroundColor: theme.color.error
  },
  badgeText: {
    fontFamily: theme.font.display,
    fontSize: 12,
    color: theme.color.onSurfaceMuted
  },
  badgeTextCompact: {
    fontSize: 10.5
  },
  badgeTextInverse: {
    color: theme.color.onAction
  },
  optionText: {
    fontFamily: theme.font.display,
    fontSize: 19,
    color: theme.color.onSurface
  },
  optionTextCompact: {
    fontSize: 16
  },
  optionTextWrong: {
    textDecorationLine: "line-through",
    color: theme.color.onSurfaceMuted
  }
});
