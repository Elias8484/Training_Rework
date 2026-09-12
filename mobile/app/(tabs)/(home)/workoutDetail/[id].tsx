import { View, Text, StyleSheet, ScrollView, ActivityIndicator} from "react-native";
import { useLocalSearchParams } from "expo-router";
import WorkoutDetailsCard from "@/components/WorkoutDetailsCard";
import { useWorkoutDetail } from "@/hooks/useWorkoutDetails";


export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { workout, isLoading } = useWorkoutDetail(id);

  if (isLoading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (!workout) return <Text style={styles.title}>Workout not found</Text>;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Workout {id}</Text>
      <WorkoutDetailsCard
        date={new Date(workout.createdAt).toLocaleDateString()}
        totalKg={workout.totalKg}
        exercises={workout.exercises.map(ex => ({
          ...ex,
          sets: ex.sets.map(s => ({ weight: s.kg, reps: s.reps })),
        }))}
      />
    </ScrollView>
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
