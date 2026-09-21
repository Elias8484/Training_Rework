// Compact one-line card for a past workout: top 2 muscle groups by sets, date and total kg.
// Used on the home screen and in the history list. Tapping it opens the full breakdown.
import { View, Text, StyleSheet, Pressable} from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export type MuscleGroup = { name: string; sets: number };

export type WorkoutSummaryCardProps = {
  onPress?: () => void;
  muscles: MuscleGroup[];
  date: string;
  totalKg: number;
};

export default function WorkoutSummaryCard({ muscles, date, totalKg, onPress }: WorkoutSummaryCardProps) {
  const sorted = [...muscles].sort((a, b) => b.sets - a.sets);
  const displayed = sorted.slice(0, 2);
  const remaining = sorted.slice(2);
  const otherSets = remaining.reduce((sum, m) => sum + m.sets, 0);
  const muscleDisplay = remaining.length > 0
    ? [...displayed, { name: "Other", sets: otherSets }]
    : displayed;

  return (
    <Pressable style={({pressed}) => [styles.card, pressed && {opacity: 0.7}]} onPress={onPress}>
      <FontAwesome5 name="dumbbell" size={24} color="#0dd8ac" />

      <View style={styles.muscleRow}>
        {muscleDisplay.map((m) => (
          <View key={m.name} style={styles.muscleItem}>
            <Text style={styles.muscleText}>{m.name}</Text>
            <Text style={styles.setText}><Text style={{ fontSize: 20 }}>{m.sets}</Text> sets</Text>
          </View>
        ))}
      </View>

      <View style={{ gap: 2 }}>
        <Text style={styles.dateText}>{date}</Text>
        <Text style={styles.kgText}>{totalKg}kg</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { height: 100, borderRadius: 16, marginBottom: 12, backgroundColor: "#1c1c1e", paddingHorizontal: 16, flexDirection: "row", alignItems: "center", gap: 14 },
  muscleRow: { flex: 1, flexDirection: "row", flexWrap: "wrap", gap: 16 },
  muscleItem: { gap: 2 },
  muscleText: { fontSize: 15, color: "#8e8e93" },
  setText: { fontSize: 15, color: "white" },
  dateText: { fontSize: 15, color: "#8e8e93" },
  kgText: { fontSize: 14, color: "#0dd8ac", marginLeft: 25 },
});
