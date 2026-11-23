import { StyleSheet, Text, View } from "react-native";
import { ActionButton } from "@/view/components/actionButton";
import { theme } from "@/view/theme";
import { useRedirectHomeViewModel } from "@/viewmodel/useRedirectHomeViewModel";

const ActivitiesScreen = () => {
  const [state, actions] = useRedirectHomeViewModel();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Redirecionando para {state.targetRoute}...</Text>
      <ActionButton label="Ir para o Mapa" variant="primary" onPress={actions.handleRedirectNow} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.space.xl,
    gap: theme.space.lg,
    backgroundColor: theme.color.canvas
  },
  text: {
    fontFamily: theme.font.bodyBold,
    fontSize: 14,
    color: theme.color.onSurfaceMuted
  }
});

export default ActivitiesScreen;
