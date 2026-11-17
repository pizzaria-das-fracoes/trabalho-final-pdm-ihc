import { StyleSheet, Text, View } from "react-native";
import { Screen } from "@/view/layouts/Screen";
import { Pizza } from "@/view/components/Pizza";
import { ActionButton } from "@/view/components/ActionButton";
import { SliceCheckbox } from "@/view/components/SliceCheckbox";
import { Feedback } from "@/view/components/Feedback";
import { usePizzaViewModel } from "@/viewmodel/use-pizza-view-model";
import { tokens } from "@/view/tokens";
import { FractionDisplay } from "@/view/components/FractionDisplay";

export default function PizzaScreen() {
  const model = usePizzaViewModel();
  return (
    <Screen title="Monte sua pizza" navigation>
      <Text style={styles.title}>Monte a fração pedida</Text>
      <View style={styles.target}>
        <Text style={styles.targetText}>Pinte a pizza para mostrar</Text>
        <FractionDisplay numerator={3} denominator={4} tone="accent" />
      </View>
      <Pizza
        denominator={model.denominator}
        selected={model.selected}
        label={`Pizza dividida em ${model.denominator} partes iguais. ${model.selected.length} selecionadas.`}
        showSummary={false}
      />
      <Text style={styles.legend}>A pizza tem {model.denominator} partes iguais. Toque nas fatias ou marque as caixas abaixo.</Text>
      <Text accessibilityRole="header" style={styles.section}>Toque nas fatias que quer pintar</Text>
      <View style={styles.controls}>
        {Array.from({ length: model.denominator }, (_, index) => (
          <SliceCheckbox
            key={index}
            index={index}
            denominator={model.denominator}
            checked={model.selected.includes(index)}
            onPress={() => model.toggleSlice(index)}
          />
        ))}
      </View>
      <View style={styles.fractionCard}>
        <FractionDisplay numerator={model.selected.length} denominator={model.denominator} labels />
        <Text style={styles.counter}>Sua pizza: {model.selected.length} de {model.denominator} fatias pintadas</Text>
      </View>
      <ActionButton label="Conferir resposta" onPress={() => void model.check()} />
      <Feedback message={model.feedback} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: tokens.color.onSurface, fontSize: tokens.type.title, fontWeight: "700" },
  target: { minHeight: 88, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: tokens.space.md, padding: tokens.space.md, borderRadius: tokens.shape.medium, backgroundColor: tokens.color.accentSoft },
  targetText: { maxWidth: 144, color: tokens.color.onAccentSoft, fontSize: tokens.type.body, lineHeight: 24, fontWeight: "500" },
  legend: { color: tokens.color.onSurface, fontSize: tokens.type.label, lineHeight: 20, textAlign: "center" },
  section: { color: tokens.color.onSurface, fontSize: tokens.type.body, fontWeight: "700" },
  controls: { flexDirection: "row", flexWrap: "wrap", gap: tokens.space.sm },
  fractionCard: { alignItems: "center", gap: tokens.space.sm, padding: tokens.space.md, borderRadius: tokens.shape.medium, backgroundColor: tokens.color.surfaceLow },
  counter: { color: tokens.color.onSurface, fontSize: tokens.type.label, lineHeight: 20 }
});
