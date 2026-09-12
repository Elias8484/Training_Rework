import { View, Text, StyleSheet, ScrollView } from "react-native";

export type WorkoutSet = { weight: number; reps: number;};

export type Exercise = { name: string; muscleGroup: string; sets: WorkoutSet[];};

export type WorkoutDetailsCardProps = {
  exercises: Exercise[];
  date: string;
  totalKg: number;
};


export default function WorkoutDetailsCard({ exercises, date, totalKg }: WorkoutDetailsCardProps) {
  const grouped = exercises.reduce((acc, ex) => {
    (acc[ex.muscleGroup] ??= []).push(ex);
    return acc;
  }, {} as Record<string, Exercise[]>);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.dateText}>{date}</Text>
        <Text style={styles.kgText}>{totalKg}kg</Text>
      </View>

      {Object.entries(grouped).map(([muscleGroup, groupExercises]) => (
        <View key={muscleGroup} style={styles.muscleSection}>
          <Text style={styles.muscleTitle}>{muscleGroup}:</Text>

          {groupExercises.map((ex) => (
            <View key={ex.name} style={styles.exercise}>
              <Text style={styles.exerciseName}>{ex.name}</Text>
              {ex.sets.map((set, i) => (
                <Text key={i} style={styles.setText}>{set.weight}kg  {set.reps} rep</Text>
              ))}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 20, paddingTop: 20 },
  title: { fontSize: 16, fontWeight: "500", color: "#111", marginBottom: 12 },
  card: { borderRadius: 16, borderWidth: 1, borderColor: "#e0e0e0", backgroundColor: "#f9f9f9", padding: 16, marginBottom: 24 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  dateText: { fontSize: 15, color: "#747272" },
  kgText: { fontSize: 15, color: "#747272" },
  muscleSection: { marginBottom: 20 },
  muscleTitle: { fontSize: 16, fontWeight: "600", color: "#111", marginBottom: 8 },
  exercise: { borderBottomWidth: 1, borderBottomColor: "#e0e0e0", paddingBottom: 10, marginBottom: 10 },
  exerciseName: { fontSize: 15, fontWeight: "500", color: "#0a0a0a", borderBottomWidth: 1, borderBottomColor: "#d0d0d0", alignSelf: "flex-start", paddingBottom: 2, marginBottom: 6 },
  setText: { fontSize: 14, color: "#333", lineHeight: 22 },
});
