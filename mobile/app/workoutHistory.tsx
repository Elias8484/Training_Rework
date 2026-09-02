import { View, Text, StyleSheet, Pressable } from "react-native";
import { useEffect } from "react";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter, useFocusEffect } from "expo-router";
import WorkoutHistoryCard from "@/components/WorkoutHistoryCard";
import { useWorkoutHistory } from "../hooks/useWorkoutHistory";

export default function HomeScreen() {
  const { workouts, fetchWorkouts } = useWorkoutHistory();

  useEffect(() => { fetchWorkouts(6); }, []);

  return (
    <View style={styles.container}>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: -5, marginTop: 0 }}>
        <Text style={styles.sectionTitle}>Complete Workout History</Text>
      </View>

      {workouts.length === 0 ? (
        <View style={{ height: 100, borderRadius: 16, borderWidth: 1, borderColor: "#e0e0e0", backgroundColor: "#f9f9f9", justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "#aaa", fontSize: 15 }}>No recent workouts</Text>
        </View>
      ) : (
        workouts.map(w => (
          <WorkoutHistoryCard
            key={w.id}
            muscles={w.muscleGroups.map(m => ({ name: m.muscleGroup, sets: m.sets }))}
            date={new Date(w.createdAt).toLocaleDateString()}
            totalKg={w.totalKg}
          />
        ))
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 20, paddingTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "500", marginBottom: 12, color: "#111" },
  viewMoreButtonText: { fontSize: 15, color: "#0dd8ac", fontWeight: "500" },
});
