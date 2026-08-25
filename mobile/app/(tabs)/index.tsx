import { View, Text, StyleSheet } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      <Text style={styles.sectionTitle}>Recent Workouts</Text>

      <View style={styles.card}>
        <FontAwesome5 name="dumbbell" size={24} color="#aaa" />
      </View>

      <View style={styles.card}>
        <FontAwesome5 name="dumbbell" size={24} color="#aaa" />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 20, paddingTop: 380  },
  sectionTitle: { fontSize: 16, fontWeight: "500", marginBottom: 12, color: "#111" },
  card: { height: 100, borderRadius: 16, borderWidth: 1, marginBottom: 12, borderColor: "#e0e0e0", backgroundColor: "#f9f9f9", justifyContent: "center", paddingLeft: 30 },
});
