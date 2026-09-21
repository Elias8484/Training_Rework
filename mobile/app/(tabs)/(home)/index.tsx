// Home tab. Shows the 2 most recent workouts and a "View more" link to the full history.
// Refetches on focus, but only when lastWorkoutSaved changes so tab switching doesn't hit the API.
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useCallback } from "react";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter, useFocusEffect } from "expo-router";
import { useAuth } from "@/context/auth";
import WorkoutSummaryCard from "@/components/WorkoutSummaryCard";
import { useWorkoutHistory } from "@/hooks/useWorkoutHistory";
import { useTabBarPadding } from "@/hooks/useTabBarPadding";

export default function HomeScreen() {
  const router = useRouter();
  const { lastWorkoutSaved, token } = useAuth();
  const { workouts, fetchWorkouts } = useWorkoutHistory();
  const tabBarPadding = useTabBarPadding();

  useFocusEffect(
    useCallback(() => {
      fetchWorkouts(2);
    }, [lastWorkoutSaved, token])
  );

  return (
    <View style={[styles.container, { paddingBottom: tabBarPadding }]}>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: -5, marginTop: 350 }}>
        <Text style={styles.sectionTitle}>Recent Workouts</Text>
        <Pressable onPress={() => router.push("/history")} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text style={styles.viewMoreButtonText}>View more</Text>
          <FontAwesome5 name="chevron-right" size={12} color="#0dd8ac" />
        </Pressable>
      </View>

      {workouts.length === 0 ? (
        <View style={{ height: 100, borderRadius: 16, backgroundColor: "#1c1c1e", justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "#8e8e93", fontSize: 15 }}>No recent workouts</Text>
        </View>
      ) : (
        workouts.map(w => (
          <WorkoutSummaryCard
            key={w.id}
            muscles={w.muscleGroups.map(m => ({ name: m.muscleGroup, sets: m.sets }))}
            date={new Date(w.createdAt).toLocaleDateString()}
            totalKg={w.totalKg}
            onPress={() => router.push({ pathname: "/history/[id]", params: { id: String(w.id) } })}
          />
        ))
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20, paddingTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "500", marginBottom: 12, color: "white" },
  viewMoreButtonText: { fontSize: 15, color: "#0dd8ac", fontWeight: "500" },
});
