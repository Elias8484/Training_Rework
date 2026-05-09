import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/context/auth";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE;

export default function SignInScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!username || !password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      console.log("Login response:", data);
      
      if (!res.ok) throw new Error(data);
      await login({ id: data.id, fullName: data.fullName, username: data.username }, data.token);
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#000" value={username} onChangeText={setUsername} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#000" value={password} onChangeText={setPassword} secureTextEntry />
      <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
      </Pressable>
      <Pressable style ={styles.link} onPress={() => router.replace("/sign-up")}>
        <Text style={styles.linktext}>No account? Sign Up</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "white" },
  title: { fontSize: 30, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "black" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 12, padding: 12, marginBottom: 12, color: "black", },
  button: { backgroundColor: "#000", padding: 14, borderRadius: 12, alignItems: "center", marginBottom: 12 },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  link: {borderRadius: 16, backgroundColor: "#aba2a2", width: "40%", alignSelf: "center", padding: 5, marginTop: 3},
  linktext: { fontSize: 12, textAlign: "center", color: "black" },
});