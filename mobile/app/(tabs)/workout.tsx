import { useState } from "react";
import { StyleSheet, Text, View, Pressable, TextInput, FlatList, Dimensions, Modal, ScrollView, Alert } from "react-native";
import { useAuth } from "../../context/auth";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE;

const width = Dimensions.get("window").width;

// 1. Opdaterede datastrukturer
type WorkoutSet = { id: string; weight: string; reps: string };
type Exercise = { id: string; name: string; muscleGroup: string; sets: WorkoutSet[] };

// Lidt "falsk" data, så vi kan teste 'Choose Existing'-knappen
const PREDEFINED_EXERCISES = [
  { id: "p1", name: "Bench Press", muscleGroup: "Chest" },
  { id: "p2", name: "Squat", muscleGroup: "Legs" },
  { id: "p3", name: "Pull Up", muscleGroup: "Back" },
];

export default function WorkoutScreen() {
  /* For getting the current users id (will be handled from the backend instead
  when setting up persistent login with Json Web Tokens) */
  const { user } = useAuth();
  // Tilstanden for den aktive træning
  const [activeExercises, setActiveExercises] = useState<Exercise[]>([]);

  // Tilstande for pop-ups (Modals)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showChooseModal, setShowChooseModal] = useState(false);

  // Formular-tilstande til at oprette en ny øvelse
  const [newName, setNewName] = useState("");
  const [newMuscle, setNewMuscle] = useState("");

  // --- FUNKTIONER ---

  const createNewExercise = async () => {
    if (!newName.trim()) return;
    // Send post request to backend exercise controller with the data needed for an exercise row
      try {
        const res = await fetch(`${API_BASE}/api/exercises/createNewExercise`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName, muscleGroup: newMuscle || "None", userId: user?.id }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data);
    /* create object from the returned data, the generated id from the backend
       can be used later to reference the correct database row*/
    const newEx: Exercise = {
      id: data.id.toString(),
      name: data.name,
      muscleGroup: data.muscleGroup,
      sets: [{ id: Date.now().toString() + "-set", weight: "", reps: "" }],
    };

    setActiveExercises([...activeExercises, newEx]);
    setNewName("");
    setNewMuscle("");
    setShowCreateModal(false);
  } catch (err: any) {
    Alert.alert("Error", err.message);
  }
  };

  const addExistingExercise = (ex: { name: string; muscleGroup: string }) => {
    const newEx: Exercise = {
      id: Date.now().toString(),
      name: ex.name,
      muscleGroup: ex.muscleGroup,
      sets: [{ id: Date.now().toString() + "-set", weight: "", reps: "" }],
    };
    setActiveExercises([...activeExercises, newEx]);
    setShowChooseModal(false);
  };

  const addSet = (exerciseId: string) => {
    setActiveExercises(
      activeExercises.map((ex) => {
        if (ex.id === exerciseId) {
          return { ...ex, sets: [...ex.sets, { id: Date.now().toString(), weight: "", reps: "" }] };
        }
        return ex;
      })
    );
  };

  const updateSet = (exerciseId: string, setId: string, field: "weight" | "reps", value: string) => {
    setActiveExercises(
      activeExercises.map((ex) => {
        if (ex.id === exerciseId) {
          const updatedSets = ex.sets.map((s) => (s.id === setId ? { ...s, [field]: value } : s));
          return { ...ex, sets: updatedSets };
        }
        return ex;
      })
    );
  };

  // --- RENDER FUNKTIONER ---

  // Sådan ser et enkelt øvelseskort ud i vores swipe-liste
  const renderExerciseCard = ({ item: exercise }: { item: Exercise }) => (
    <View style={styles.cardContainer}>
      <View style={styles.exerciseCard}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.cardHeader}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.muscleGroup}>{exercise.muscleGroup}</Text>
          </View>

          <View style={styles.setHeader}>
            <Text style={styles.headerText}>Set</Text>
            <Text style={styles.headerText}>kg</Text>
            <Text style={styles.headerText}>Reps</Text>
          </View>

          {exercise.sets.map((set, index) => (
            <View key={set.id} style={styles.setRow}>
              <Text style={styles.setIndex}>{index + 1}</Text>
              <TextInput
                style={styles.numberInput}
                placeholder="0"
                keyboardType="numeric"
                value={set.weight}
                onChangeText={(val) => updateSet(exercise.id, set.id, "weight", val)}
              />
              <TextInput
                style={styles.numberInput}
                placeholder="0"
                keyboardType="numeric"
                value={set.reps}
                onChangeText={(val) => updateSet(exercise.id, set.id, "reps", val)}
              />
            </View>
          ))}

          <Pressable style={styles.addSetButton} onPress={() => addSet(exercise.id)}>
            <Text style={styles.addSetText}>+ Add Set</Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Workout</Text>

      {/* Top knapper til at tilføje øvelser */}
      <View style={styles.topButtonsRow}>
        <Pressable style={styles.primaryButton} onPress={() => setShowChooseModal(true)}>
          <Text style={styles.buttonText}>Exercises</Text>
        </Pressable>
        <Pressable style={styles.programButton} onPress={() => console.log("program clicked")}>
          <Text style={styles.buttonText}>Program</Text>
        </Pressable>
        <Pressable style={styles.createIconButton} onPress={() => setShowCreateModal(true)}>
          <Text style={styles.createIconText}>+</Text>
        </Pressable>
      </View>

      {/* Horisontal Swipe Liste */}
      {activeExercises.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Add an exercise to start your workout.</Text>
        </View>
      ) : (
          <FlatList
          data={activeExercises}
          renderItem={renderExerciseCard}
          keyExtractor={(item) => item.id}
          // --- DISSE LINJER GØR DEN HORISONTAL ---
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.swipeList}
        />
      )}

      {activeExercises.length > 0 && (
        <View style={styles.fixedFooter}>
          <Pressable style={styles.saveWorkoutButton} onPress={() => console.log("Save clicked")}>
            <Text style={styles.saveWorkoutText}>Save Workout</Text>
          </Pressable>
        </View>
      )}

      {/* Modal: Opret ny øvelse */}
      <Modal visible={showCreateModal} animationType="fade" transparent={true}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowCreateModal(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Create Custom Exercise</Text>
            <TextInput
              style={styles.input}
              placeholder="Exercise Name"
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={styles.input}
              placeholder="Muscle Group"
              value={newMuscle}
              onChangeText={setNewMuscle}
            />
            <View style={styles.modalActions}>
              <Pressable onPress={() => setShowCreateModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={createNewExercise}>
                <Text style={styles.saveText}>Save & Add</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Modal: Vælg eksisterende */}
      <Modal visible={showChooseModal} animationType="fade" transparent={true}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowChooseModal(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Select Exercise</Text>
            {PREDEFINED_EXERCISES.map((ex) => (
              <Pressable key={ex.id} style={styles.existingExerciseRow} onPress={() => addExistingExercise(ex)}>
                <Text style={styles.existingName}>{ex.name}</Text>
                <Text style={styles.existingMuscle}>{ex.muscleGroup}</Text>
              </Pressable>
            ))}
            <Pressable style={styles.closeModalButton} onPress={() => setShowChooseModal(false)}>
              <Text style={styles.cancelText}>Close</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", paddingTop: 30 },
  title: { fontSize: 28, fontWeight: "800", marginBottom: 15, color: "black", paddingHorizontal: 20 },
  
  topButtonsRow: { flexDirection: "row", gap: 10, paddingHorizontal: 20, marginBottom: 20 },
  programButton: { flex: 2, backgroundColor: "#000", padding: 12, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  primaryButton: { flex: 2, backgroundColor: "#000", padding: 12, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  buttonText: { color: "white", fontWeight: "600", fontSize: 16 },
  createIconButton: { flex: 1, backgroundColor: "#4CAF50", padding: 12, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  createIconText: { color: "white", fontWeight: "bold", fontSize: 24, lineHeight: 24 },
  
  fixedFooter: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, backgroundColor: "#f8f9fa" },
  saveWorkoutButton: { backgroundColor: "#000", paddingVertical: 18, borderRadius: 16, alignItems: "center", shadowColor: "#000", shadowOpacity: 1, shadowRadius: 8, elevation: 3,},
  saveWorkoutText: { color: "white", fontSize: 20, fontWeight: "bold" },

  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#888", fontSize: 16 },

  swipeList: { flex: 1 },
  // Hvert kort gøres præcis lige så bredt som skærmen
  cardContainer: { width: width, paddingHorizontal: 20, paddingBottom: 20 },
  exerciseCard: { backgroundColor: "white", padding: 20, borderRadius: 16, flex: 1, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, elevation: 3, },
  cardHeader: { marginBottom: 20, paddingBottom: 10 },
  exerciseName: { fontSize: 24, fontWeight: "bold", color: "black" },
  muscleGroup: { fontSize: 14, color: "#888", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 },

  setHeader: { flexDirection: "row", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#f0f0f0", marginBottom: 10 },
  headerText: { flex: 1, fontWeight: "700", color: "#888", textAlign: "left", fontSize: 12, textTransform: "uppercase" },
  setRow: { flexDirection: "row", alignItems: "center", marginBottom: 8, paddingVertical: 4 },
  setIndex: { flex: 1, textAlign: "left", fontSize: 16, fontWeight: "600", color: "#333" },
  numberInput: { flex: 1, backgroundColor: "#f0f0f0", borderRadius: 8, padding: 12, marginHorizontal: 5, textAlign: "center", fontSize: 16, fontWeight: "500" },
  
  addSetButton: { marginTop: 15, paddingVertical: 10, backgroundColor: "#f0f8ff", borderRadius: 8 },
  addSetText: { color: "#007AFF", fontWeight: "600", textAlign: "center", fontSize: 16 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "white", padding: 25, borderTopLeftRadius: 20, borderTopRightRadius: 20, minHeight: 300, },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 15, marginBottom: 15, fontSize: 16 },
  modalActions: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  cancelText: { color: "red", fontSize: 16, fontWeight: "600" },
  saveButton: { backgroundColor: "#000", paddingHorizontal: 25, paddingVertical: 12, borderRadius: 10 },
  saveText: { color: "white", fontWeight: "bold", fontSize: 16 },
  
  existingExerciseRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#eee" },
  existingName: { fontSize: 18, fontWeight: "500" },
  existingMuscle: { color: "#888" },
  closeModalButton: { marginTop: 20, alignItems: "center", paddingVertical: 10 },
});