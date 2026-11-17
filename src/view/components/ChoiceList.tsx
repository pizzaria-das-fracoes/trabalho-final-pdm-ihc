import { Pressable, StyleSheet, Text, View } from "react-native";
import { tokens } from "@/view/tokens";
import { Pizza } from "@/view/components/Pizza";

type Props = {
  options: string[];
  selected: string | null;
  onSelect: (option: string) => void;
  fractionOptions?: Record<string, { numerator: number; denominator: number }>;
};

export const ChoiceList = ({ options, selected, onSelect, fractionOptions }: Props) => (
  <View accessibilityRole="radiogroup" style={styles.list}>
    {options.map((option) => (
      <Pressable
        key={option}
        accessibilityRole="radio"
        accessibilityState={{ selected: selected === option }}
        onPress={() => onSelect(option)}
        style={styles.option}
      >
        <View style={[styles.radio, selected === option && styles.radioSelected]}>
          {selected === option && <View style={styles.radioDot} />}
        </View>
        {fractionOptions?.[option] ? (
          <View style={styles.fractionOption}>
            <Pizza
              denominator={fractionOptions[option].denominator}
              selected={Array.from({ length: fractionOptions[option].numerator }, (_, index) => index)}
              label={`Representação de ${option}`}
              size={72}
              showSummary={false}
            />
            <Text style={[styles.text, selected === option && styles.textSelected]}>{option}</Text>
          </View>
        ) : <Text style={[styles.text, selected === option && styles.textSelected]}>{option}</Text>}
      </Pressable>
    ))}
  </View>
);

const styles = StyleSheet.create({
  list: { gap: tokens.space.sm },
  option: {
    minHeight: tokens.touchTarget + tokens.space.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: tokens.space.md,
    borderBottomWidth: 1,
    borderColor: tokens.color.surfaceLow,
    borderRadius: tokens.shape.medium,
    justifyContent: "flex-start",
    paddingHorizontal: tokens.space.md
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: tokens.shape.full,
    borderWidth: 2,
    borderColor: tokens.color.outline,
    alignItems: "center",
    justifyContent: "center"
  },
  radioSelected: { borderColor: tokens.color.action },
  radioDot: { width: 10, height: 10, borderRadius: tokens.shape.full, backgroundColor: tokens.color.action },
  fractionOption: { flex: 1, flexDirection: "row", alignItems: "center", gap: tokens.space.md },
  text: { color: tokens.color.onSurface, fontSize: tokens.type.body, lineHeight: 24 },
  textSelected: { color: tokens.color.action, fontWeight: "700" }
});
