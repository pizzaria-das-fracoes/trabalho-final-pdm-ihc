import { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { tokens } from "@/view/tokens";
import { NavigationBar } from "@/view/components/NavigationBar";
import { Pizza } from "@/view/components/Pizza";

export const Screen = ({ children, navigation = false, title = "FatiaMática" }: PropsWithChildren<{ navigation?: boolean; title?: string }>) => (
  <SafeAreaView style={styles.safe}>
    <View style={styles.header}>
      <Pizza denominator={4} selected={[0, 2]} label="FatiaMática" size={40} showSummary={false} />
      <Text accessibilityRole="header" numberOfLines={1} style={styles.headerTitle}>{title}</Text>
    </View>
    <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
    {navigation && <NavigationBar />}
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: tokens.color.surface },
  header: { minHeight: 64, flexDirection: "row", alignItems: "center", gap: tokens.space.sm, paddingHorizontal: tokens.space.md, borderBottomWidth: 1, borderBottomColor: tokens.color.outlineVariant, backgroundColor: tokens.color.surface },
  headerTitle: { flex: 1, color: tokens.color.onSurface, fontSize: tokens.type.title, lineHeight: 28, fontWeight: "400" },
  content: { flexGrow: 1, padding: tokens.space.md, gap: tokens.space.md }
});
