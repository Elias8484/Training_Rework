import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import WorkoutHistoryCard from "@/components/WorkoutHistoryCard";
import { useWorkoutHistory } from "@/hooks/useWorkoutHistory";
import { useAuth } from "@/context/auth";
import { useRouter} from "expo-router";

const PAGE_SIZE = 6;

export default function WorkoutHistoryScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const { workouts, fetchWorkouts, loadMore, isLoading } = useWorkoutHistory();

  useEffect(() => { fetchWorkouts(PAGE_SIZE); }, [token]);

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Complete Workout History</Text>
      </View>

      <FlatList
        data={workouts}
        keyExtractor={w => String(w.id)}
        renderItem={({ item }) => (
          <WorkoutHistoryCard
            muscles={item.muscleGroups.map(m => ({ name: m.muscleGroup, sets: m.sets }))}
            date={new Date(item.createdAt).toLocaleDateString()}
            totalKg={item.totalKg}
            onPress={() => router.push({ pathname: "/workoutDetail/[id]", params: { id: String(item.id) } })}
          />
        )}
        onEndReached={() => loadMore(PAGE_SIZE)}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No recent workouts</Text>
            </View>
          ) : null
        }
        ListFooterComponent={isLoading ? <ActivityIndicator style={{ marginVertical: 16 }} /> : null}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 20, paddingTop: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: -5 },
  sectionTitle: { fontSize: 16, fontWeight: "500", marginBottom: 12, color: "#111" },
  emptyBox: { height: 100, borderRadius: 16, borderWidth: 1, borderColor: "#e0e0e0", backgroundColor: "#f9f9f9", justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#aaa", fontSize: 15 },
});
