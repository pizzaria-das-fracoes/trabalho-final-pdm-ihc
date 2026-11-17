import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { ActivityCard } from "@/view/components/ActivityCard";
import { Screen } from "@/view/layouts/Screen";
import { tokens } from "@/view/tokens";

const activities = [
  { title: "Reta numérica", description: "Veja onde as frações ficam entre os números.", skill: "EF06MA08", numerator: 3, denominator: 4, tone: "info" as const, route: "/number-line" },
  { title: "Fração e decimal", description: "Represente a mesma parte de outro jeito.", skill: "EF06MA08", numerator: 1, denominator: 4, tone: "info" as const, route: "/decimal" },
  { title: "Fração de quantidade", description: "Reparta objetos em grupos iguais.", skill: "EF06MA09", numerator: 3, denominator: 4, tone: "accent" as const, route: "/quantity" },
  { title: "Soma e subtração", description: "Junte ou tire partes de um inteiro.", skill: "EF06MA10", numerator: 1, denominator: 2, tone: "success" as const, route: "/operations" }
];

export default function ActivitiesScreen() {
  return (
    <Screen title="Atividades" navigation>
      <Text style={styles.title}>Outros desafios</Text>
      <Text style={styles.body}>Escolha uma atividade e pratique no seu ritmo.</Text>
      <View style={styles.catalog}>
        {activities.map((activity) => (
          <ActivityCard
            key={activity.route}
            title={activity.title}
            description={activity.description}
            skill={activity.skill}
            status="Nova atividade"
            progress={0}
            numerator={activity.numerator}
            denominator={activity.denominator}
            tone={activity.tone}
            onPress={() => router.push(activity.route)}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: tokens.color.onSurface, fontSize: tokens.type.body, lineHeight: 24, fontWeight: "700" },
  body: { color: tokens.color.onSurface, fontSize: tokens.type.label, lineHeight: 20 },
  catalog: { gap: tokens.space.md }
});
