import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { ActionButton } from "@/view/components/ActionButton";
import { Screen } from "@/view/layouts/Screen";
import { tokens } from "@/view/tokens";
import { PizzaAvatar } from "@/view/components/PizzaAvatar";

export default function WelcomeScreen() {
  return (
    <Screen title="FatiaMática">
      <View style={styles.container}>
        <PizzaAvatar size={120} />
        <Text style={styles.title}>Fatia<Text style={styles.brandAccent}>Mática</Text></Text>
        <Text style={styles.body}>Frações com pizza, para o 6º ano.</Text>
        <Text style={styles.body}>Quem vai fatiar hoje?</Text>
        <ActionButton label="Começar a fatiar" onPress={() => router.replace("/home")} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", gap: tokens.space.md, padding: tokens.space.md },
  title: { color: tokens.color.onSurface, fontSize: tokens.type.title, lineHeight: 28, fontWeight: "700" },
  brandAccent: { color: tokens.color.action },
  body: { color: tokens.color.onSurface, fontSize: tokens.type.body, lineHeight: 24 }
});
