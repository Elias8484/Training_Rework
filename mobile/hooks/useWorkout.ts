// Fetches one past workout by id with every exercise and set. Refetches automatically when id changes.
// Unlike useWorkoutHistory it owns the fetch timing itself, so screens just read { workout, isLoading }.
import { useEffect, useState } from "react";
import { useAuth } from "../context/auth";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE;

export type WorkoutDetailSet = { kg: number; reps: number };
export type WorkoutDetailExercise = { name: string; muscleGroup: string; sets: WorkoutDetailSet[] };
export type WorkoutDetail = {
  id: number;
  createdAt: string;
  totalKg: number;
  exercises: WorkoutDetailExercise[];
};

export function useWorkout(id: string) {
  const { token } = useAuth();
  const [workout, setWorkout] = useState<WorkoutDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token || !id) return;
    setWorkout(null);
    setIsLoading(true);

    const fetchDetail = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/workouts/getWorkout/${id}`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!res.ok) {
          const reason = res.status === 401
            ? res.headers.get("www-authenticate")
            : await res.text();
          console.error("getWorkout failed", res.status, reason);
          return;
        }
        const data: WorkoutDetail = await res.json();
        setWorkout(data);
      } catch (err) {
        console.error("Failed to fetch workout detail", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id, token]);

  return { workout, isLoading };
}
