import { Pressable, Text } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/context/auth";

export function LogoutButton() {
  const { logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace("/sign-in");
  }

  return (
    <Pressable onPress={handleLogout} style={{ marginRight: 16 }}>
      <Text style={{ color: "red", fontSize: 16 }}>Logout</Text>
    </Pressable>
  );
}
