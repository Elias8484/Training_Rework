import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from "react-native";
import { router } from "expo-router";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE;

export default function SignUpScreen() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function register() {
    if (!fullName || !username || !password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data);
      Alert.alert("Success");
      router.replace("/sign-in");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Pressable style={styles.button} onPress={register} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Creating..." : "Sign Up"}</Text>
      </Pressable>
      <Pressable onPress={() => router.replace("/sign-in")}>
        <Text style={styles.link}>Already have an account? Sign In</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 12, color: "black" },
  button: { backgroundColor: "#007AFF", padding: 14, borderRadius: 8, alignItems: "center", marginBottom: 12 },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  link: { textAlign: "center", color: "#007AFF", textDecorationLine: "underline" },
});
