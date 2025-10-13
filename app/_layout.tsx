import { colors } from "@/constants/theme";
import { GatesProvider } from "@/contexts/GatesContext";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Titles: require("../assets/fonts/MrsSheppards-Regular.ttf"),
  });

  return (
    <GatesProvider>
      <StatusBar style="light" backgroundColor={colors.primary.dark} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
          animation: "fade",
        }}
      >
        <Stack.Screen name="(intro)/Intro" />
      </Stack>
    </GatesProvider>
  );
}
