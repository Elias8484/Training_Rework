// Detail page for one past workout. Reads the id from the URL, fetches via useWorkout,
// and maps the API shape (createdAt, kg) into what WorkoutBreakdownCard wants (date, weight).
import { View, Text, StyleSheet, ScrollView, ActivityIndicator} from "react-native";
import { useLocalSearchParams } from "expo-router";
import WorkoutBreakdownCard from "@/components/WorkoutBreakdownCard";
import { useWorkout } from "@/hooks/useWorkout";
import { useTabBarPadding } from "@/hooks/useTabBarPadding";


export default function WorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { workout, isLoading } = useWorkout(id);
  const tabBarPadding = useTabBarPadding();

  if (isLoading) return (
    <View style={styles.container}>
      <ActivityIndicator style={{ marginTop: 40 }} color="#0dd8ac" />
    </View>
  );
  if (!workout) return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout not found</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: tabBarPadding }} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Workout {id}</Text>
      <WorkoutBreakdownCard
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
  container: { flex: 1, backgroundColor: "#000", padding: 20, paddingTop: 20 },
  title: { fontSize: 16, fontWeight: "500", color: "#a0a0a5", marginBottom: 12 },
});
