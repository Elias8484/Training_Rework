// Full workout history as an infinite-scroll list, 6 at a time. Pushed within the Home tab's stack
// Tapping a card opens history/[id].
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import WorkoutSummaryCard from "@/components/WorkoutSummaryCard";
import { useWorkoutHistory } from "@/hooks/useWorkoutHistory";
import { useAuth } from "@/context/auth";
import { useRouter} from "expo-router";
import { useTabBarPadding } from "@/hooks/useTabBarPadding";

const PAGE_SIZE = 6;

export default function HistoryScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const { workouts, fetchWorkouts, loadMore, isLoading } = useWorkoutHistory();
  const tabBarPadding = useTabBarPadding();

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
          <WorkoutSummaryCard
            muscles={item.muscleGroups.map(m => ({ name: m.muscleGroup, sets: m.sets }))}
            date={new Date(item.createdAt).toLocaleDateString()}
            totalKg={item.totalKg}
            onPress={() => router.push({ pathname: "/history/[id]", params: { id: String(item.id) } })}
          />
        )}
        onEndReached={() => loadMore(PAGE_SIZE)}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarPadding }}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No recent workouts</Text>
            </View>
          ) : null
        }
        ListFooterComponent={isLoading ? <ActivityIndicator style={{ marginVertical: 16 }} color="#0dd8ac" /> : null}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 20, paddingTop: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: -5 },
  sectionTitle: { fontSize: 16, fontWeight: "500", marginBottom: 12, color: "white" },
  emptyBox: { height: 100, borderRadius: 16, backgroundColor: "#1c1c1e", justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#8e8e93", fontSize: 15 },
});
