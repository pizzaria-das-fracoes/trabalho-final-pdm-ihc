import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Screen } from "@/view/layouts/Screen";
import { Pizza } from "@/view/components/Pizza";
import { ActionButton } from "@/view/components/ActionButton";
import { Feedback } from "@/view/components/Feedback";
import { useCompareViewModel } from "@/viewmodel/use-compare-view-model";
import { tokens } from "@/view/tokens";
import { ChoiceList } from "@/view/components/ChoiceList";
import { FractionDisplay } from "@/view/components/FractionDisplay";

export default function CompareScreen() {
  const model = useCompareViewModel();
  const { width } = useWindowDimensions();
  const compact = width < 420;
  return (
    <Screen title="Compare as pizzas" navigation>
      <Text style={styles.title}>Compare as pizzas</Text>
      <Text style={styles.body}>Qual pizza tem mais partes pintadas?</Text>
      <View style={[styles.options, compact && styles.optionsCompact]}>
        <View style={[styles.option, model.choice === "left" && styles.chosen]}>
          <Text style={styles.pizzaLabel}>A</Text>
          <Pizza denominator={4} selected={[0, 1, 2]} label="Pizza de três quartos" showSummary={false} />
          <FractionDisplay numerator={3} denominator={4} />
        </View>
        <View style={[styles.option, model.choice === "right" && styles.chosen]}>
          <Text style={styles.pizzaLabel}>B</Text>
          <Pizza denominator={3} selected={[0, 1]} label="Pizza de dois terços" showSummary={false} />
          <FractionDisplay numerator={2} denominator={3} />
        </View>
      </View>
      <Text accessibilityRole="header" style={styles.choiceTitle}>Escolha uma resposta</Text>
      <ChoiceList
        options={["A pizza A tem mais", "A pizza B tem mais"]}
        selected={model.choice === "left" ? "A pizza A tem mais" : model.choice === "right" ? "A pizza B tem mais" : null}
        onSelect={(option) => model.setChoice(option === "A pizza A tem mais" ? "left" : "right")}
      />
      <ActionButton label="Conferir resposta" onPress={() => void model.check()} disabled={model.choice === null} />
      <Feedback message={model.feedback} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: tokens.color.onSurface, fontSize: tokens.type.title, fontWeight: "700" },
  body: { color: tokens.color.onSurface, fontSize: tokens.type.body, lineHeight: 24 },
  options: { flexDirection: "row", justifyContent: "space-around", gap: tokens.space.sm },
  optionsCompact: { flexDirection: "column" },
  option: { flex: 1, gap: tokens.space.sm, alignItems: "center", padding: tokens.space.sm, borderRadius: tokens.shape.medium, backgroundColor: tokens.color.surfaceLow },
  chosen: { borderWidth: 2, borderColor: tokens.color.focus },
  pizzaLabel: { width: 32, height: 32, overflow: "hidden", textAlign: "center", textAlignVertical: "center", borderRadius: tokens.shape.full, backgroundColor: tokens.color.infoSoft, color: tokens.color.info, fontWeight: "700" },
  choiceTitle: { color: tokens.color.onSurface, fontSize: tokens.type.body, fontWeight: "700" }
});
