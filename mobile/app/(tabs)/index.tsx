import { View, Text, StyleSheet, Pressable } from "react-native";
import { useCallback } from "react";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter, useFocusEffect } from "expo-router";
import { useAuth } from "../../context/auth";
import WorkoutHistoryCard from "@/components/WorkoutHistoryCard";
import { useWorkoutHistory } from "../../hooks/useWorkoutHistory";

export default function HomeScreen() {
  const router = useRouter();
  const { lastWorkoutSaved, token } = useAuth();
  const { workouts, fetchWorkouts } = useWorkoutHistory();

  useFocusEffect(
    useCallback(() => {
      fetchWorkouts(2);
    }, [lastWorkoutSaved, token])
  );

  return (
    <View style={styles.container}>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: -5, marginTop: 350 }}>
        <Text style={styles.sectionTitle}>Recent Workouts</Text>
        <Pressable onPress={() => router.push("/workoutHistory" as any)} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text style={styles.viewMoreButtonText}>View more</Text>
          <FontAwesome5 name="chevron-right" size={12} color="#0dd8ac" />
        </Pressable>
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
            onPress={() => router.push({ pathname: "/workout/[id]", params: { id: String(w.id) } })}
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
