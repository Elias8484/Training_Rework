// Fetches the paginated list of past workouts (summary shape: muscle groups + set counts, not full sets).
// fetchWorkouts(n) loads the first n; loadMore(n) appends the next n. Screens decide when to call them.
import { useState } from "react";
import { useAuth } from "../context/auth";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE;

export type WorkoutHistory = {
  id: number;
  createdAt: string;
  totalKg: number;
  muscleGroups: { muscleGroup: string; sets: number }[];
};

export function useWorkoutHistory() {
  const { token } = useAuth();
  const [workouts, setWorkouts] = useState<WorkoutHistory[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWorkouts = async (pastWorkoutQuantity: number, newOffset = 0) => {
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/workouts/getHistory?pastWorkoutQuantity=${pastWorkoutQuantity}&offset=${newOffset}`,
        { headers: { "Authorization": `Bearer ${token}` } }
      );
      if (!res.ok) {
        const reason = res.status === 401
          ? res.headers.get("www-authenticate")
          : await res.text();
        console.error("getHistory failed", res.status, reason);
        return;
      }
      const data: WorkoutHistory[] = await res.json();

      setWorkouts(prev => (newOffset === 0 ? data : [...prev, ...data]));
      setOffset(newOffset + data.length);
      setHasMore(data.length === pastWorkoutQuantity);
    } catch (err) {
      console.error("Failed to fetch workout history", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = (pastWorkoutQuantity: number) => {
    if (isLoading || !hasMore) return;
    fetchWorkouts(pastWorkoutQuantity, offset);
  };

  return { workouts, fetchWorkouts, loadMore, isLoading, hasMore };
}
