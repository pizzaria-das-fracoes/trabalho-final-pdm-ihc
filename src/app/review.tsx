import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { ActionButton } from "@/view/components/ActionButton";
import { Screen } from "@/view/layouts/Screen";
import { tokens } from "@/view/tokens";

export default function ReviewScreen() {
  const { questionId } = useLocalSearchParams<{ questionId?: string }>();
  const routeByQuestion: Record<string, string> = {
    "mount-3-of-4": "/pizza",
    "compare-3-4-2-3": "/compare",
    "equivalent-2-3-4-6": "/equivalent",
    "number-line-3-2": "/number-line",
    "decimal-1-4": "/decimal",
    "quantity-3-4-20": "/quantity",
    "operations-half-plus-third": "/operations"
  };
  const route = questionId ? routeByQuestion[questionId] : undefined;
  return (
    <Screen title="Revisar resposta" navigation>
      <Text style={styles.title}>Revisar resposta</Text>
      <Text style={styles.body}>
        {questionId ? `Refaça a atividade ${questionId} para entender o próximo passo.` : "Escolha uma atividade para revisar."}
      </Text>
      {route ? (
        <ActionButton label="Refazer atividade" onPress={() => router.replace(route)} />
      ) : (
        <Text style={styles.body}>Essa atividade não está disponível para revisão nesta versão.</Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: tokens.color.onSurface, fontSize: tokens.type.title, fontWeight: "700" },
  body: { color: tokens.color.onSurface, fontSize: tokens.type.body, lineHeight: 24 }
});
