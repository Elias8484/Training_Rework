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

  const fetchWorkouts = async (pastWorkoutQuantity: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/history/getHistory?pastWorkoutQuantity=${pastWorkoutQuantity}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();
      setWorkouts(data);
    } catch (err) {
      console.error("Failed to fetch workout history", err);
    }
  };

  return { workouts, fetchWorkouts };
}
