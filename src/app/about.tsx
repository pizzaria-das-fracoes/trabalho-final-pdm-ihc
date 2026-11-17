import { StyleSheet, Text, View } from "react-native";
import { Screen } from "@/view/layouts/Screen";
import { tokens } from "@/view/tokens";

const skills = [
  { code: "EF06MA07", description: "Representar, comparar e ordenar frações." },
  { code: "EF06MA08", description: "Relacionar frações, decimais e reta numérica." },
  { code: "EF06MA09", description: "Calcular frações de quantidades." },
  { code: "EF06MA10", description: "Somar e subtrair frações positivas." }
];

export default function AboutScreen() {
  return (
    <Screen title="Sobre" navigation>
      <View style={styles.intro}>
        <Text accessibilityRole="header" style={styles.title}>Sobre o FatiaMática</Text>
        <Text style={styles.body}>Um jeito visual de aprender frações, fatia a fatia.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Habilidades estudadas</Text>
        {skills.map((skill) => (
          <View key={skill.code} style={styles.skill}>
            <Text style={styles.code}>{skill.code}</Text>
            <Text style={styles.description}>{skill.description}</Text>
          </View>
        ))}
      </View>

      <View style={styles.privacy}>
        <Text style={styles.privacyTitle}>Privacidade</Text>
        <Text style={styles.privacyBody}>O app não pede conta. Seu progresso fica salvo neste dispositivo.</Text>
      </View>
      <Text style={styles.footer}>PDM + IHC · IFPI Campus Piripiri · 6º ano</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: tokens.space.xs },
  title: { color: tokens.color.onSurface, fontSize: tokens.type.title, lineHeight: 28, fontWeight: "500" },
  body: { color: tokens.color.onSurface, fontSize: tokens.type.body, lineHeight: 24 },
  card: { gap: tokens.space.sm, padding: tokens.space.md, borderRadius: tokens.shape.medium, backgroundColor: tokens.color.surfaceLow },
  sectionTitle: { color: tokens.color.onSurface, fontSize: tokens.type.body, lineHeight: 24, fontWeight: "700" },
  skill: { gap: tokens.space.xs, paddingVertical: tokens.space.sm, borderBottomWidth: 1, borderBottomColor: tokens.color.outlineVariant },
  code: { color: tokens.color.info, fontSize: tokens.type.label, lineHeight: 20, fontWeight: "700" },
  description: { color: tokens.color.onSurface, fontSize: tokens.type.label, lineHeight: 20 },
  privacy: { gap: tokens.space.xs, padding: tokens.space.md, borderRadius: tokens.shape.medium, backgroundColor: tokens.color.successSoft },
  privacyTitle: { color: tokens.color.successInk, fontSize: tokens.type.label, fontWeight: "700" },
  privacyBody: { color: tokens.color.successInk, fontSize: tokens.type.label, lineHeight: 20 },
  footer: { color: tokens.color.onSurface, fontSize: tokens.type.chip, lineHeight: 16, textAlign: "center", opacity: 0.75 }
});
