import { useState } from "react";
import { View, Button, Text, Alert } from "react-native";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE ?? "http://localhost:5252";

export default function HomeScreen() {
  const [result, setResult] = useState<string | null>(null);

  async function handleTest() {
    try {
      const res = await fetch(`${API_BASE}/api/todo/test`);
      const text = await res.text();
      setResult(text);
    } catch (e) {
      Alert.alert("Error", String(e));
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center", gap: 12 }}>
      <Button title="Test API" onPress={handleTest} />
      {result && <Text>{result}</Text>}
    </View>
  );
}
