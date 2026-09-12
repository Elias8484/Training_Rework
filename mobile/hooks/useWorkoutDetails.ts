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

export function useWorkoutDetail(id: string) {
  const { token } = useAuth();
  const [workout, setWorkout] = useState<WorkoutDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token || !id) return;
    setWorkout(null);
    setIsLoading(true);

    const fetchDetail = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/history/getDetails/${id}`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!res.ok) {
          const reason = res.status === 401
            ? res.headers.get("www-authenticate")
            : await res.text();
          console.error("getDetails failed", res.status, reason);
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
