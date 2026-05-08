import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from "react-native";
import { router } from "expo-router";
import { addWhitelistedNativeProps } from "react-native-reanimated/lib/typescript/ConfigHelper";

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
      <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#000" value={fullName} onChangeText={setFullName} />
      <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#000" value={username} onChangeText={setUsername} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#000" value={password} onChangeText={setPassword} secureTextEntry />
      <Pressable style={styles.button} onPress={register} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Creating..." : "Sign Up"}</Text>
      </Pressable>
      <Pressable style={styles.link} onPress={() => router.replace("/sign-in")}>
        <Text style={styles.linktext}>Already have an account? Sign in</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 30, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "black" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 12, padding: 12, marginBottom: 12, color: "black" },
  button: { backgroundColor: "#000", padding: 14, borderRadius: 12, alignItems: "center", marginBottom: 12 },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  link: { borderRadius: 16, backgroundColor: "#aba2a2", width: "60%", alignSelf: "center", padding: 5, marginTop: 3 },
  linktext: { fontSize: 12, textAlign: "center", color: "black" },
});