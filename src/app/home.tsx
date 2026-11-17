import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { ActivityCard } from "@/view/components/ActivityCard";
import { PizzaAvatar } from "@/view/components/PizzaAvatar";
import { Screen } from "@/view/layouts/Screen";
import { useHomeViewModel } from "@/viewmodel/use-home-view-model";
import { tokens } from "@/view/tokens";

const activities = [
  { title: "Monte sua pizza", description: "Pinte as fatias e construa a fração pedida.", skill: "EF06MA07", questionId: "mount-3-of-4", numerator: 3, denominator: 4, tone: "accent" as const, route: "/pizza" },
  { title: "Compare as pizzas", description: "Descubra qual quantidade pintada é maior.", skill: "EF06MA07", questionId: "compare-3-4-2-3", numerator: 2, denominator: 3, tone: "success" as const, route: "/compare" },
  { title: "Frações equivalentes", description: "Encontre pizzas que mostram a mesma quantidade.", skill: "EF06MA07", questionId: "equivalent-2-3-4-6", numerator: 2, denominator: 3, tone: "info" as const, route: "/equivalent" },
  { title: "Reta numérica", description: "Veja onde cada fração fica entre os números.", skill: "EF06MA08", questionId: "number-line-3-2", numerator: 3, denominator: 4, tone: "info" as const, route: "/number-line" },
  { title: "Fração e decimal", description: "Escreva a mesma parte de outro jeito.", skill: "EF06MA08", questionId: "decimal-1-4", numerator: 1, denominator: 4, tone: "info" as const, route: "/decimal" },
  { title: "Fração de quantidade", description: "Reparta objetos em grupos iguais.", skill: "EF06MA09", questionId: "quantity-3-4-20", numerator: 3, denominator: 4, tone: "accent" as const, route: "/quantity" },
  { title: "Soma e subtração", description: "Junte ou tire partes de um inteiro.", skill: "EF06MA10", questionId: "operations-half-plus-third", numerator: 1, denominator: 2, tone: "success" as const, route: "/operations" }
];

export default function HomeScreen() {
  const { attempts, loading, error } = useHomeViewModel();

  return (
    <Screen title="Início" navigation>
      <View style={styles.greeting}>
        <PizzaAvatar size={84} />
        <View style={styles.greetingText}>
          <Text accessibilityRole="header" style={styles.title}>Olá! Vamos fatiar?</Text>
          <Text style={styles.subtitle}>Frações com pizza, passo a passo.</Text>
        </View>
      </View>
      <View style={styles.speech}>
        <Text style={styles.speechText}>Escolha uma atividade. Sem cronômetro — errar faz parte de aprender!</Text>
      </View>

      <View style={styles.catalog}>
        {activities.map((activity) => {
          const activityAttempts = attempts.filter((attempt) => attempt.questionId === activity.questionId);
          const correct = activityAttempts.filter((attempt) => attempt.correct).length;
          const progress = activityAttempts.length ? Math.round((correct / activityAttempts.length) * 100) : 0;
          const status = activityAttempts.length ? `${correct} de ${activityAttempts.length} acertos` : "Nova atividade";

          return (
            <ActivityCard
              key={activity.questionId}
              title={activity.title}
              description={activity.description}
              skill={activity.skill}
              status={status}
              progress={progress}
              numerator={activity.numerator}
              denominator={activity.denominator}
              tone={activity.tone}
              onPress={() => router.push(activity.route)}
            />
          );
        })}
      </View>

      <View style={styles.privacy}>
        <Text style={styles.privacyTitle}>Seu progresso fica neste dispositivo</Text>
        <Text style={styles.privacyBody}>
          {loading ? "Carregando seu progresso..." : error ?? "Você pode praticar no seu ritmo e voltar quando quiser."}
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  greeting: { flexDirection: "row", alignItems: "center", gap: tokens.space.sm },
  greetingText: { flex: 1, gap: tokens.space.xs },
  title: { color: tokens.color.onSurface, fontSize: tokens.type.title, lineHeight: 28, fontWeight: "500" },
  subtitle: { color: tokens.color.onSurface, fontSize: tokens.type.label, lineHeight: 20 },
  speech: { padding: tokens.space.md, borderRadius: tokens.shape.medium, backgroundColor: tokens.color.surfaceHigh },
  speechText: { color: tokens.color.onSurface, fontSize: tokens.type.label, lineHeight: 21, fontWeight: "500" },
  catalog: { gap: tokens.space.md },
  privacy: { gap: tokens.space.xs, padding: tokens.space.md, borderRadius: tokens.shape.medium, backgroundColor: tokens.color.successSoft },
  privacyTitle: { color: tokens.color.successInk, fontSize: tokens.type.label, fontWeight: "700" },
  privacyBody: { color: tokens.color.successInk, fontSize: tokens.type.label, lineHeight: 20 }
});
