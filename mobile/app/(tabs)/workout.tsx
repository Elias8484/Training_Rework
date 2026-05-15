import { useState, useRef, useEffect } from "react";
import {StyleSheet, Text, View, Pressable, TextInput, FlatList, Dimensions, Modal, ScrollView, Alert, Animated, ViewToken, KeyboardAvoidingView, Platform } from "react-native";
import { useAuth } from "../../context/auth";
import Paginator from "../../components/Paginator";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE;
const width = Dimensions.get("window").width;

type WorkoutSet = { id: string; weight: string; reps: string };
type Exercise = { id: string; name: string; muscleGroup: string; sets: WorkoutSet[] };

// Reusable bottom-sheet modal with fade overlay + slide-up sheet
function BottomSheetModal({
  visible,
  onClose,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const slideAnim = useRef(new Animated.Value(300)).current;

  // When visibility changes, run the slide animation
  const prevVisible = useRef(false);
  if (visible && !prevVisible.current) {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  }
  if (!visible && prevVisible.current) {
    slideAnim.setValue(300);
  }
  prevVisible.current = visible;

  return (
    <Modal
      visible={visible}
      animationType="fade"        // overlay fades
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >

        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        
        <Animated.View
          style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }] }]}
          onStartShouldSetResponder={() => true}
        >
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function WorkoutScreen() {
  const { token, user} = useAuth();
  const sessionKey = `activeWorkout_${user?.id}`;

  const [activeExercises, setActiveExercises] = useState<Exercise[]>([]);
  
  // Array of exercise objects that starts as an empty array on first load, updated with the function
  const [predefinedExercises, setPredefinedExercises] = 
  useState<{id: string, name: string, muscleGroup: string}[]>([])

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showChooseModal, setShowChooseModal] = useState(false);

  // New: card action menu state
  const [menuExerciseId, setMenuExerciseId] = useState<string | null>(null);

  const [newName, setNewName] = useState("");
  const [newMuscle, setNewMuscle] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  
const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
  if (viewableItems && viewableItems.length > 0) {
    setCurrentIndex(viewableItems[0].index ?? 0);
  }
}).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;


  // --- FUNCTIONS ---

  /* Fetch all the exercises from the backend that belongs to the current user
    and store it in predefinedExercises */
  const fetchExercises = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/exercises/getExercises`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });
      const data = await res.json();
      setPredefinedExercises(data);

    } catch(err){
      console.error("Failed to fetch exercises", err);
    }
  };

  const saveWorkoutPost = async () => {
     Alert.alert(
      "Save Workout?",
      undefined,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Save", onPress: async () => {

          try {
            const res = await fetch(`${API_BASE}/api/exercises/saveWorkout`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify({
                name: "My Workout",
                exercises: activeExercises.map(ex => ({
                  exerciseId: ex.id.split('-')[0],
                  sets: ex.sets.map(s => ({
                    kg: parseFloat(s.weight.replace(',', '.')) || 0,
                    reps: parseInt(s.reps) || 0
                  }))
                }))
              }),
            });
            const text = await res.text();
            console.log("Response", text);
            if(res.ok){
              await AsyncStorage.removeItem(sessionKey);
              setActiveExercises([]);
            }
          } catch(err) {
            console.error("Failed to save workout", err);
          }
        }}
      ]
    );
  };

    // Runs fetchexercises when screen first loads
   useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const saved = await AsyncStorage.getItem(sessionKey);
        if (!saved) return;
        const { exercises, savedAt } = JSON.parse(saved);
        const hoursPassed = (Date.now() - savedAt) / (1000 * 60 * 60);
        if (hoursPassed > 12) {
          Alert.alert(
            "Continue Workout?",
            "You have an unfinished workout from earlier. Continue or start a new workout?",
            [
              { text: "Start New", onPress: () => AsyncStorage.removeItem(sessionKey) },
              { text: "Continue", onPress: () => setActiveExercises(exercises) }
            ]
          );
        } else {
          setActiveExercises(exercises);
        }
      } catch (err) {
        console.error("Failed to load session", err);
      }
    };
    loadSession();
  }, []);

  useEffect(() => {
    if (activeExercises.length > 0) {
      AsyncStorage.setItem(sessionKey, JSON.stringify({
        exercises: activeExercises,
        savedAt: Date.now()
      }));
    } else {
      AsyncStorage.removeItem(sessionKey);
    }
  } , [activeExercises]);

  const createNewExercise = async () => {
    if (!newName.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/api/exercises/createNewExercise`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName, muscleGroup: newMuscle || "None" }),
      });

       console.log("Status:", res.status);
       const text = await res.text();
       console.log("Response:", text);
       const data = JSON.parse(text);
       if (!res.ok) throw new Error(data);
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
      await fetchExercises();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  const deleteExercise = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/exercises/deleteExercise/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok) await fetchExercises();
    } catch (err) {
      console.error("Failed to delete exercise", err);
    }
  };

  const addExistingExercise = (ex: { id: string; name: string; muscleGroup: string }) => {
    const newEx: Exercise = {
      id: `${ex.id}-${Date.now()}`,
      name: ex.name,
      muscleGroup: ex.muscleGroup,
      sets: [{ id: Date.now().toString() + "-set", weight: "", reps: "" }],
    };
    setActiveExercises([...activeExercises, newEx]);
    setShowChooseModal(false);
  };

  const removeExercise = (exerciseId: string) => {
    setActiveExercises(activeExercises.filter((ex) => ex.id !== exerciseId));
    setMenuExerciseId(null);
  };

  const addSet = (exerciseId: string) => {
    setActiveExercises(
      activeExercises.map((ex) =>
        ex.id === exerciseId
          ? { ...ex, sets: [...ex.sets, { id: Date.now().toString(), weight: "", reps: "" }] }
          : ex
      )
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

  const removeSet = (exerciseId: string, setId: string) => {
    setActiveExercises(
      activeExercises.map((ex) => {
        if (ex.id === exerciseId) {
          // Filtrer det sæt fra, som har det id vi vil slette
          const updatedSets = ex.sets.filter((s) => s.id !== setId);
          return { ...ex, sets: updatedSets };
        }
        return ex;
      })
    );
  };

  

  // --- RENDER ---

  const renderExerciseCard = ({ item: exercise }: { item: Exercise }) => (
    <View style={styles.cardContainer}>
      <View style={styles.exerciseCard}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderText}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.muscleGroup}>{exercise.muscleGroup}</Text>
            </View>
            {/* Three-dot menu button */}
            <Pressable
              style={styles.menuButton}
              onPress={() => setMenuExerciseId(exercise.id)}
              hitSlop={10}
            >
              <Text style={styles.menuDots}>⋮</Text>
            </Pressable>
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
              <Pressable 
                style={styles.removeSetButton} 
                onPress={() => removeSet(exercise.id, set.id)}
              >
                <Text style={styles.removeSetText}>×</Text>
              </Pressable>

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

      {activeExercises.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Add an exercise to start your workout.</Text>
        </View>
      ) : (
        <FlatList
          data={activeExercises}
          renderItem={renderExerciseCard}
          keyExtractor={(item) => item.id}
          horizontal
          snapToInterval={width}
          showsHorizontalScrollIndicator={false}
          snapToAlignment="center"
          decelerationRate="normal"
          bounces={false}
          disableIntervalMomentum={true}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
          scrollEventThrottle={8}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          style={styles.swipeList}
        />
      )}
      
      {activeExercises.length > 0 && (
        <Paginator data={activeExercises} scrollX={scrollX} />
      )}

      {activeExercises.length > 0 && (
        <View style={styles.fixedFooter}>
          <Pressable style={styles.saveWorkoutButton} onPress={() => saveWorkoutPost()}>
            <Text style={styles.saveWorkoutText}>Save Workout</Text>
          </Pressable>
        </View>
      )}

      {/* Modal: Create new exercise (centered, fade — kept as-is) */}
{/* Modal: Add Exercise — bottom sheet */}
      <BottomSheetModal visible={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <Text style={styles.modalTitle}>Add Exercise</Text>
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
      </BottomSheetModal>

      {/* Modal: Choose existing — centered */}
      <Modal
        visible={showChooseModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowChooseModal(false)}
      >
        <View style={styles.centeredOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowChooseModal(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalTitleRow}>
              <Pressable style={styles.modalTitleButton} onPress={() => console.log("Select clicked")}>
                <Text style={styles.modalTitle}>Select Exercise</Text>
              </Pressable>
              <Pressable style={styles.modalTitleButton} onPress={() => console.log("Discover clicked")}>
                <Text style={styles.modalTitle}>Discover</Text>
              </Pressable>
            </View>
            <ScrollView onStartShouldSetResponder={() => true}>
              {predefinedExercises.map((ex) => (
                <View key={ex.id} style={styles.existingExerciseRow}>
                  <Pressable style={{ flex: 1 }} onPress={() => addExistingExercise(ex)}>
                    <Text style={styles.existingName}>{ex.name}</Text>
                    <Text style={styles.existingMuscle}>{ex.muscleGroup}</Text>
                  </Pressable>
                  <Pressable onPress={() => {console.log("Deleting id:", ex.id); deleteExercise(ex.id);}}>
                    <Text style={{ color: "lightgrey", fontSize: 30, fontWeight: "400" }}>×</Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
            <Pressable style={styles.closeModalButton} onPress={() => setShowChooseModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal: Card action menu — bottom sheet */}
      <BottomSheetModal
        visible={menuExerciseId !== null}
        onClose={() => setMenuExerciseId(null)}
      >
        <Text style={styles.modalTitle}>Exercise Options</Text>
        <Pressable
          style={styles.menuActionRow}
          onPress={() => menuExerciseId && removeExercise(menuExerciseId)}
        >
          <Text style={styles.menuActionDestructive}>Remove Exercise</Text>
        </Pressable>
        <Pressable style={styles.closeModalButton} onPress={() => setMenuExerciseId(null)}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </BottomSheetModal>
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

  fixedFooter: { paddingHorizontal: 20, paddingBottom: 20, backgroundColor: "#f8f9fa" },
  saveWorkoutButton: { backgroundColor: "#000", paddingVertical: 18, borderRadius: 16, alignItems: "center", shadowColor: "#000", shadowOpacity: 1, shadowRadius: 8, elevation: 3 },
  saveWorkoutText: { color: "white", fontSize: 20, fontWeight: "bold" },

  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#888", fontSize: 16 },

  swipeList: { flex: 1 },
  cardContainer: { width: width, paddingHorizontal: 20, paddingBottom: 20 },
  exerciseCard: { backgroundColor: "white", padding: 20, borderRadius: 16, flex: 1, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingBottom: 10 },
  cardHeaderText: { flex: 1 },
  exerciseName: { fontSize: 24, fontWeight: "bold", color: "black" },
  muscleGroup: { fontSize: 14, color: "#888", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 },

  // Three-dot button
  menuButton: { padding: 4 },
  menuDots: { fontSize: 24, color: "#888", fontWeight: "bold", lineHeight: 24 },

  setHeader: { flexDirection: "row", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#f0f0f0", marginBottom: 10 },
  headerText: { flex: 1, fontWeight: "700", color: "#888", textAlign: "left", fontSize: 12, textTransform: "uppercase" },
  setRow: { flexDirection: "row", alignItems: "center", marginBottom: 8, paddingVertical: 4 },
  setIndex: { flex: 0.5, textAlign: "left", fontSize: 16, fontWeight: "600", color: "#333" },
  numberInput: { flex: 1, backgroundColor: "#f0f0f0", borderRadius: 8, padding: 12, marginHorizontal: 5, textAlign: "center", fontSize: 16, fontWeight: "500" },
  removeSetButton: { flex: 0.5, alignItems: "center", justifyContent: "flex-end",},
  removeSetText: { color: "lightgrey", fontSize: 20, fontWeight: "400" },
  addSetButton: { marginTop: 15, paddingVertical: 10, backgroundColor: "#f0f8ff", borderRadius: 8 },
  addSetText: { color: "#007AFF", fontWeight: "600", textAlign: "center", fontSize: 16 },

  // Shared modal overlay
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: "flex-end" },

  // Bottom sheet (used by BottomSheetModal)
  bottomSheet: { backgroundColor: "white", padding: 25, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 40 },

  // Centered modal (Create exercise)
  modalContent: { backgroundColor: "white", padding: 20, minHeight: 300, maxHeight: 600, borderRadius: 16, marginHorizontal: 20, marginBottom: "auto", marginTop: "auto" },
  modalTitle: { fontSize: 16, fontWeight: "bold" },
  modalTitleRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  modalTitleButton: { flex: 1, backgroundColor: "#f0f0f0", paddingVertical: 12, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 15, marginBottom: 15, fontSize: 16 },
  modalActions: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  cancelText: { color: "black", fontSize: 16, fontWeight: "600", marginBottom: 10 },
  saveButton: { backgroundColor: "#000", paddingHorizontal: 25, paddingVertical: 12, borderRadius: 10, marginBottom: 20 },
  saveText: { color: "white", fontWeight: "bold", fontSize: 16 },

  existingExerciseRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#eee" },
  existingName: { fontSize: 18, fontWeight: "500" },
  existingMuscle: { color: "#888" },
  closeModalButton: { marginTop: 5, paddingTop: 10, alignItems: "center" },
  
  centeredOverlay: {flex: 1,backgroundColor: "rgba(0, 0, 0, 0.6)",justifyContent: "center",paddingHorizontal: 20,},

  // Card action menu
  menuActionRow: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },
  menuActionDestructive: { fontSize: 18, color: "#e53935", fontWeight: "500" },
});