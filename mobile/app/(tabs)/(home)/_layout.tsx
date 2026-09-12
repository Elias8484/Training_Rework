import { Stack } from "expo-router";
import { LogoutButton } from "@/components/LogoutButton";

export default function HomeStackLayout() {
  return (
    <Stack screenOptions={{ headerRight: () => <LogoutButton /> }}>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="workoutHistory" options={{ title: "Workout History" }} />
      <Stack.Screen name="workoutDetail/[id]" options={{ title: "Workout" }} />
    </Stack>
  );
}
