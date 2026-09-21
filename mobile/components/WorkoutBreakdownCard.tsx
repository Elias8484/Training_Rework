// Full read-only view of one past workout: every exercise in its own bubble with a set-by-set table.
// Only used on the history/[id] screen/page.
import { View, Text, StyleSheet } from "react-native";

export type WorkoutSet = { weight: number; reps: number;};

export type Exercise = { name: string; muscleGroup: string; sets: WorkoutSet[];};

export type WorkoutBreakdownCardProps = {
  exercises: Exercise[];
  date: string;
  totalKg: number;
};


export default function WorkoutBreakdownCard({ exercises, date, totalKg }: WorkoutBreakdownCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.dateText}>{date}</Text>
        <Text style={styles.kgText}>{totalKg} kg</Text>
      </View>

      {exercises.map((ex) => (
        <View key={ex.name} style={styles.exerciseBubble}>
          <Text style={styles.exerciseName}>{ex.name}</Text>
          <Text style={styles.muscleGroup}>{ex.muscleGroup}</Text>

          <View style={styles.setHeader}>
            <Text style={[styles.headerText, { flex: 0.4 }]}>Set</Text>
            <Text style={styles.headerText}>kg</Text>
            <Text style={styles.headerText}>Reps</Text>
          </View>

          {ex.sets.map((set, i) => (
            <View key={i} style={styles.setRow}>
              <Text style={[styles.setIndex, { flex: 0.4 }]}>{i + 1}</Text>
              <Text style={styles.setValue}>{set.weight}</Text>
              <Text style={styles.setValue}>{set.reps}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}


const styles = StyleSheet.create({
  card: { borderRadius: 16, backgroundColor: "#1c1c1e", padding: 16, marginBottom: 24 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  dateText: { fontSize: 15, color: "#0dd8ac" },
  kgText: { fontSize: 15, fontWeight: "600", color: "#0dd8ac" },

  exerciseBubble: { backgroundColor: "#2c2c2e", borderRadius: 12, padding: 16, marginBottom: 12 },
  exerciseName: { fontSize: 18, fontWeight: "bold", color: "white" },
  muscleGroup: { fontSize: 12, color: "#8e8e93", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 },

  setHeader: { flexDirection: "row", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#3a3a3c", marginTop: 12, marginBottom: 6 },
  headerText: { flex: 1, fontWeight: "700", color: "#8e8e93", fontSize: 12, textTransform: "uppercase", textAlign: "center" },
  setRow: { flexDirection: "row", alignItems: "center", paddingVertical: 6 },
  setIndex: { fontSize: 15, fontWeight: "600", color: "#a0a0a5", textAlign: "center" },
  setValue: { flex: 1, fontSize: 16, fontWeight: "500", color: "white", textAlign: "center" },
});
