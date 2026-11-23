import { useFonts } from "expo-font";
import { Fredoka_600SemiBold, Fredoka_700Bold } from "@expo-google-fonts/fredoka";
import { Nunito_400Regular, Nunito_700Bold, Nunito_800ExtraBold } from "@expo-google-fonts/nunito";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { theme } from "@/view/theme";

const RootLayout = () => {
  useFonts({
    Fredoka_600SemiBold,
    Fredoka_700Bold,
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_800ExtraBold
  });

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.color.canvas },
          animation: "fade"
        }}
      />
    </SafeAreaProvider>
  );
};

export default RootLayout;
