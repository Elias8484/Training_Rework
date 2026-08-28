import { View, Text, StyleSheet, Pressable } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter } from "expo-router";

type MuscleGroup = { name: string; sets: number };
type WorkoutCardProps = {
  muscles: MuscleGroup[];
  date: string;
  totalKg: number;
};

function WorkoutCard({ muscles, date, totalKg }: WorkoutCardProps) {
  const sorted = [...muscles].sort((a, b) => b.sets - a.sets);
  const displayed = sorted.slice(0, 2);
  const remaining = sorted.slice(2);
  const otherSets = remaining.reduce((sum, m) => sum + m.sets, 0);
  const muscleDisplay = remaining.length > 0
    ? [...displayed, { name: "Other", sets: otherSets }]
    : displayed;

  return (
    <View style={styles.card}>
      <FontAwesome5 name="dumbbell" size={24} color="#0dd8ac" />

      <View style={styles.muscleRow}>
        {muscleDisplay.map((m) => (
          <View key={m.name} style={styles.muscleItem}>
            <Text style={styles.muscleText}>{m.name}</Text>
            <Text style={styles.setText}><Text style={{ fontSize: 20 }}>{m.sets}</Text> sets</Text>
          </View>
        ))}
      </View>

      <View style={{ gap: 2 }}>
        <Text style={styles.dateText}>{date}</Text>
        <Text style={styles.kgText}>{totalKg}kg</Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: -5, marginTop: 350 }}>
        <Text style={styles.sectionTitle}>Recent Workouts</Text>
        <Pressable onPress={() => router.push("/workoutHistory" as any)} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text style={styles.viewMoreButtonText}>View more</Text>
          <FontAwesome5 name="chevron-right" size={12} color="#0dd8ac" />
        </Pressable>
      </View>

      <WorkoutCard
        muscles={[{ name: "Chest", sets: 3 }, { name: "Back", sets: 6 }, { name: "Biceps", sets: 4 }, { name: "Shoulders", sets: 2 }]}
        date="July 17, 2026"
        totalKg={1500}
      />
      <WorkoutCard
        muscles={[{ name: "Quads", sets: 5 }, { name: "Hamstrings", sets: 3 }]}
        date="July 15, 2026"
        totalKg={1200}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 20, paddingTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "500", marginBottom: 12, color: "#111" },
  card: { height: 100, borderRadius: 16, borderWidth: 1, marginBottom: 12, borderColor: "#e0e0e0", backgroundColor: "#f9f9f9", paddingHorizontal: 16, flexDirection: "row", alignItems: "center", gap: 14 },
  muscleRow: { flex: 1, flexDirection: "row", flexWrap: "wrap", gap: 16 },
  muscleItem: { gap: 2 },
  muscleText: { fontSize: 15, color: "#747272" },
  setText: { fontSize: 15, color: "#0a0a0a" },
  dateText: { fontSize: 15, color: "#747272" },
  kgText: { fontSize: 14, color: "#747272", marginLeft: 25 },
  viewMoreButtonText: { fontSize: 15, color: "#0dd8ac", fontWeight: "500" },
});
