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
    setIsLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/history/getHistory?pastWorkoutQuantity=${pastWorkoutQuantity}&offset=${newOffset}`,
        { headers: { "Authorization": `Bearer ${token}` } }
      );
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
