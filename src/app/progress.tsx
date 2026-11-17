import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ActionButton } from "@/view/components/ActionButton";
import { PizzaAvatar } from "@/view/components/PizzaAvatar";
import { Screen } from "@/view/layouts/Screen";
import { useHomeViewModel } from "@/viewmodel/use-home-view-model";
import { tokens } from "@/view/tokens";

const skillLabels: Record<string, string> = {
  EF06MA07: "Frações e comparação",
  EF06MA08: "Decimais e reta numérica",
  EF06MA09: "Frações de quantidades",
  EF06MA10: "Soma e subtração"
};

const activityLabels: Record<string, string> = {
  "mount-3-of-4": "Monte sua pizza",
  "compare-3-4-2-3": "Compare as pizzas",
  "equivalent-2-3-4-6": "Frações equivalentes",
  "number-line-3-2": "Reta numérica",
  "decimal-1-4": "Fração e decimal",
  "quantity-3-4-20": "Fração de quantidade",
  "operations-half-plus-third": "Soma e subtração"
};

export default function ProgressScreen() {
  const { attempts, loading, error } = useHomeViewModel();
  const skills = Object.keys(skillLabels).map((skillCode) => {
    const skillAttempts = attempts.filter((attempt) => attempt.skillCode === skillCode);
    const correct = skillAttempts.filter((attempt) => attempt.correct).length;
    return { skillCode, skillAttempts, correct, progress: skillAttempts.length ? Math.round((correct / skillAttempts.length) * 100) : 0 };
  });
  const missed = attempts.filter((attempt) => !attempt.correct).slice(-5).reverse();

  return (
    <Screen title="Meu progresso" navigation>
      <View style={styles.greeting}>
        <PizzaAvatar size={56} />
        <View style={styles.greetingCopy}>
          <Text accessibilityRole="header" style={styles.title}>Cada tentativa ensina!</Text>
          <Text style={styles.subtitle}>{attempts.length} desafio(s) tentados</Text>
        </View>
      </View>

      {loading && <Text style={styles.subtitle}>Carregando seu progresso...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}

      {!loading && !error && (
        <View style={styles.skillCard}>
          <Text style={styles.sectionTitle}>Trilha de aprendizagem</Text>
          {skills.map(({ skillCode, skillAttempts, correct, progress }) => (
            <View key={skillCode} style={styles.skillRow}>
              <View style={styles.skillHeading}>
                <Text style={styles.skillCode}>{skillCode}</Text>
                <Text style={styles.skillName}>{skillLabels[skillCode]}</Text>
                <Text style={styles.percent}>{progress}%</Text>
              </View>
              <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: progress }} accessibilityLabel={`Acertos em ${skillLabels[skillCode]}`} style={styles.track}>
                <View style={[styles.fill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.detail}>{skillAttempts.length ? `${correct} acerto(s) em ${skillAttempts.length} tentativa(s)` : "Vamos começar?"}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.historyCard}>
        <Text style={styles.sectionTitle}>Respostas para revisar</Text>
        {!missed.length ? (
          <Text style={styles.subtitle}>Nenhum erro pendente. Continue praticando!</Text>
        ) : missed.map((attempt) => (
          <Pressable
            key={`${attempt.questionId}-${attempt.timestamp}`}
            accessibilityRole="button"
            onPress={() => router.push(`/review?questionId=${encodeURIComponent(attempt.questionId)}`)}
            style={styles.historyItem}
          >
            <View style={[styles.resultIcon, styles.resultWrong]}><Text style={styles.resultMark}>×</Text></View>
            <Text style={styles.historyText}>{activityLabels[attempt.questionId] ?? "Atividade"}</Text>
            <Text style={styles.reviewLink}>Rever ›</Text>
          </Pressable>
        ))}
      </View>

      {attempts.length === 0 && !loading && (
        <ActionButton label="Escolher minha primeira atividade" onPress={() => router.replace("/home")} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  greeting: { flexDirection: "row", alignItems: "center", gap: tokens.space.sm },
  greetingCopy: { flex: 1, gap: tokens.space.xs },
  title: { color: tokens.color.onSurface, fontSize: tokens.type.title, lineHeight: 28, fontWeight: "500" },
  subtitle: { color: tokens.color.onSurface, fontSize: tokens.type.label, lineHeight: 20 },
  error: { color: tokens.color.error, fontSize: tokens.type.body, lineHeight: 24 },
  skillCard: { gap: tokens.space.md, padding: tokens.space.md, borderRadius: tokens.shape.medium, backgroundColor: tokens.color.surfaceLow },
  sectionTitle: { color: tokens.color.onSurface, fontSize: tokens.type.body, lineHeight: 24, fontWeight: "700" },
  skillRow: { gap: tokens.space.xs },
  skillHeading: { flexDirection: "row", alignItems: "center", gap: tokens.space.sm },
  skillCode: { paddingHorizontal: tokens.space.sm, paddingVertical: tokens.space.xs, borderRadius: tokens.shape.small, backgroundColor: tokens.color.infoSoft, color: tokens.color.info, fontSize: tokens.type.chip, fontWeight: "700" },
  skillName: { flex: 1, color: tokens.color.onSurface, fontSize: tokens.type.label, lineHeight: 20, fontWeight: "500" },
  percent: { color: tokens.color.action, fontSize: tokens.type.body, fontWeight: "700" },
  track: { height: tokens.activity.line * 2, overflow: "hidden", borderRadius: tokens.shape.full, backgroundColor: tokens.color.surfaceHigh },
  fill: { height: "100%", borderRadius: tokens.shape.full, backgroundColor: tokens.color.action },
  detail: { color: tokens.color.onSurface, fontSize: tokens.type.label, lineHeight: 20 },
  historyCard: { gap: tokens.space.sm, padding: tokens.space.md, borderRadius: tokens.shape.medium, backgroundColor: tokens.color.surfaceLow },
  historyItem: { minHeight: tokens.touchTarget, flexDirection: "row", alignItems: "center", gap: tokens.space.sm, paddingVertical: tokens.space.xs, borderBottomWidth: 1, borderBottomColor: tokens.color.outlineVariant },
  resultIcon: { width: 32, height: 32, borderRadius: tokens.shape.full, alignItems: "center", justifyContent: "center" },
  resultWrong: { backgroundColor: tokens.color.error },
  resultMark: { color: tokens.color.onError, fontSize: tokens.type.body, fontWeight: "700" },
  historyText: { flex: 1, color: tokens.color.onSurface, fontSize: tokens.type.label, lineHeight: 20 },
  reviewLink: { color: tokens.color.action, fontSize: tokens.type.label, fontWeight: "700" }
});
