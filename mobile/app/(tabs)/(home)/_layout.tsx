import { Stack } from "expo-router";
import { LogoutButton } from "@/components/LogoutButton";

export default function HomeStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerRight: () => <LogoutButton />,
        headerStyle: { backgroundColor: "#000" },
        headerTintColor: "white",
        headerShadowVisible: false,
        contentStyle: { backgroundColor: "#000" },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="history" options={{ title: "History" }} />
      <Stack.Screen name="history/[id]" options={{ title: "Workout" }} />
    </Stack>
  );
}
