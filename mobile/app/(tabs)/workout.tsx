import { useState, useRef, useEffect } from "react";
import {StyleSheet, Text, View, Pressable, TextInput, FlatList, Dimensions, ScrollView, Alert, Animated, ViewToken, Platform } from "react-native";
import { useAuth } from "../../context/auth";
import Paginator from "../../components/Paginator";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import CreateExerciseModal from "../../components/modals/CreateExerciseModal";
import ChooseExerciseModal from "../../components/modals/ChooseExerciseModal";
import ExerciseMenuModal from "../../components/modals/ExerciseMenuModal";
import ProgramsModal from "../../components/modals/ProgramsModal";
import SaveProgramModal from "../../components/modals/SaveProgramModal";
import Toast, { ToastRef } from "../../components/ui/Toast";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE;
const width = Dimensions.get("window").width;
const MUSCLE_GROUPS = ["Chest", "Back", "Biceps", "Triceps", "Shoulders", "Quads", "Hamstrings", "Glutes", "Calves", "Core", "Forearms", "Traps", "Other"];

type WorkoutSet = { id: string; weight: string; reps: string;
                    lastKg?: number; lastReps?: number;
                  };
type Exercise = { id: string; name: string; muscleGroup: string;
                  sets: WorkoutSet[];
                  lastSets?: { kg: number; reps: number }[]; };

type Program = { id: string; name: string; exercises: string[] };

function TrendBadge({ set }: { set: WorkoutSet }) {
  if (set.lastKg === undefined || set.lastReps === undefined) return <View style={{ flex: 0.5 }} />;

  const currentKg = parseFloat(set.weight.replace(',', '.')) || 0;
  const currentReps = parseInt(set.reps) || 0;
  if (currentKg === 0 || currentReps === 0) return <View style={{ flex: 0.5 }} />;

  const e1RM = (kg: number, reps: number) => reps === 1 ? kg : kg * (1 + reps / 30);
  const current = e1RM(currentKg, currentReps);
  const last = e1RM(set.lastKg, set.lastReps);

  const diff = ((current - last) / last) * 100;
  const trend = diff > 0 ? 1 : diff < 0 ? -1 : 0;
  if (trend === 0) return <Text style={{ flex: 0.5, textAlign: "center", color: "#aaa", fontSize: 12 }}>—</Text>;

  const color = trend === 1 ? "#4CAF50" : "#e53935";
  const arrow = trend === 1 ? "↑" : "↓";
  return (
    <Text style={{ flex: 0.5, textAlign: "center", color, fontSize: 11, fontWeight: "700" }}>
      {arrow}{Math.abs(diff).toFixed(1)}%
    </Text>
  );
}

export default function WorkoutScreen() {
  const { token, user} = useAuth();
  const sessionKey = `activeWorkout_${user?.id}`;

  const [activeExercises, setActiveExercises] = useState<Exercise[]>([]);
  const [predefinedExercises, setPredefinedExercises] = 
  useState<{id: string, name: string, muscleGroup: string}[]>([])

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showChooseModal, setShowChooseModal] = useState(false);
  const toastRef = useRef<ToastRef>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [showProgramsModal, setShowProgramsModal] = useState(false);
  const [showSaveProgramModal, setShowSaveProgramModal] = useState(false);
  const [menuExerciseId, setMenuExerciseId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [emptyFields, setEmptyFields] = useState<string[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  
  const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const fetchExercises = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/exercises/getExercises`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();
      setPredefinedExercises(data);
    } catch(err){
      console.error("Failed to fetch exercises", err);
    }
  };

const saveWorkoutPost = async () => {
    let newEmptyFields: string[] = [];
    let firstErrorIndex = -1;

    // Gennemgå alle øvelser og sæt for at finde tomme felter
    activeExercises.forEach((exercise, exIndex) => {
      exercise.sets.forEach((set) => {
        if (!set.weight.trim()) {
          newEmptyFields.push(`${exercise.id}-${set.id}-weight`);
          if (firstErrorIndex === -1) firstErrorIndex = exIndex;
        }
        if (!set.reps.trim()) {
          newEmptyFields.push(`${exercise.id}-${set.id}-reps`);
          if (firstErrorIndex === -1) firstErrorIndex = exIndex;
        }
      });
    });

    // Hvis vi fandt tomme felter, afbryder vi og viser fejl
    if (newEmptyFields.length > 0) {
      setEmptyFields(newEmptyFields); // Gør felterne røde
      toastRef.current?.show("Please fill out both weight and reps for all sets.");

      // Scroll hen til det første kort med et tomt felt
      if (firstErrorIndex !== -1 && flatListRef.current) {
        flatListRef.current.scrollToIndex({ index: firstErrorIndex, animated: true });
      }
      return; 
    }

    Alert.alert("Save Workout?", undefined, [
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
                exerciseId: parseInt(ex.id.split('-')[0]),
                sets: ex.sets.map(s => ({
                  kg: parseFloat(s.weight.replace(',', '.')) || 0,
                  reps: parseInt(s.reps) || 0
                }))
              }))
            }),
          });
          if(res.ok){
            await AsyncStorage.removeItem(sessionKey);
            setActiveExercises([]);
          } else {
            const text = await res.text();
            console.error("Save workout failed", text);
            Alert.alert("Error", "Failed to save workout. Please try again.");
          }
        } catch(err) {
          console.error("Failed to save workout", err);
        }
      }}
    ]);
  };

  useEffect(() => { fetchExercises(); }, []);

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
  }, [activeExercises]);

  const createNewExercise = async (name: string, muscle: string) => {
    if (!name.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/api/exercises/createNewExercise`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name, muscleGroup: muscle || "None" }),
      });
      const text = await res.text();
      const data = JSON.parse(text);
      if (!res.ok) throw new Error(data);
      const newEx: Exercise = {
        id: data.id.toString(),
        name: data.name,
        muscleGroup: data.muscleGroup,
        sets: [{ id: Date.now().toString() + "-set", weight: "", reps: "" }],
      };
      setActiveExercises([newEx, ...activeExercises]);
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

  const addExistingExercise = async (ex: { id: string; name: string; muscleGroup: string }, skipDuplicateCheck = false) => {
    let sets: WorkoutSet[] = [{ id: Date.now() + "-set-0", weight: "", reps: "" }];
    let lastSets: { kg: number; reps: number }[] | undefined;

    try {
      const res = await fetch(`${API_BASE}/api/exercises/getLastExerciseData/${ex.id}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok){
        const data = await res.json();
        if (data.sets?.length > 0){
          sets = data.sets.map((s: any, i: number) => ({
            id: `${Date.now()}-set-${i}`,
            weight: "",
            reps: "",
            lastKg: s.kg,
            lastReps: s.reps,
          }));
          lastSets = data.sets.map((s: any) => ({ kg: s.kg, reps: s.reps}));
        }
      }
    } catch (err) {
      console.error("Failed to fetch individual exercise set data");
    }

    const newEx: Exercise = {
      id: `${ex.id}-${Date.now()}`,
      name: ex.name,
      muscleGroup: ex.muscleGroup,
      sets,
      lastSets,
    };

    if (!skipDuplicateCheck && activeExercises.some(e => e.name === newEx.name)) {
      Alert.alert("Duplicate Exercise", "This exercise is already in your workout.");
      return;
    }

    setActiveExercises(prev => [newEx, ...prev]);
    setShowChooseModal(false);
  };

  const removeExercise = (exerciseId: string) => {
    setActiveExercises(activeExercises.filter((ex) => ex.id !== exerciseId));
    setMenuExerciseId(null);
  };

  const addSet = (exerciseId: string) => {
    setActiveExercises(
      activeExercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const last = ex.lastSets?.[ex.sets.length];
        return {
          ...ex,
          sets: [...ex.sets, {
            id: Date.now().toString(),
            weight: "",
            reps: "",
            lastKg: last?.kg,
            lastReps: last?.reps,
          }],
        };
      })
    );
  };

const updateSet = (exerciseId: string, setId: string, field: "weight" | "reps", value: string) => {
    // Fjern dette felt fra "tomme felter" listen
    setEmptyFields((prev) => prev.filter((id) => id !== `${exerciseId}-${setId}-${field}`));

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
        if (ex.id !== exerciseId) return ex;
        const updatedSets = ex.sets
          .filter((s) => s.id !== setId)
          .map((s, i) => ({
            ...s,
            lastKg: ex.lastSets?.[i]?.kg,
            lastReps: ex.lastSets?.[i]?.reps,
          }));
        return { ...ex, sets: updatedSets };
      })
    );
  };

  useEffect(() => { fetchPrograms(); }, []);

  const fetchPrograms = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/exercises/getPrograms`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok) setPrograms(await res.json());
    } catch (err) {
      console.error("Failed to fetch programs", err);
    }
  };

  const saveCurrentAsProgram = async (programName: string) => {
    if (activeExercises.length === 0) {
      Alert.alert("Error", "You need to add exercises before saving a program.");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/exercises/saveProgram`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: programName,
          exerciseIds: activeExercises.map(ex => parseInt(ex.id.split('-')[0])),
        }),
      });
      if(res.ok) {
        await fetchPrograms();
        setShowSaveProgramModal(false);
        toastRef.current?.show("Program saved!");
      } else {
        toastRef.current?.show("Failed to save program.");
      }
    } catch (err) {
      console.error("Failed to save exercise program", err);
    }
  };

  const deleteProgram = async (programId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/exercises/deleteProgram/${programId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok) await fetchPrograms();
    } catch (err) {
      console.error("Failed to delete program", err);
    }
  };

  // Load each exercise from the selected program by matching IDs with predefinedExercises,
  // then add them one by one as exercise cards using addExistingExercise.
  const loadProgram = async (program: Program) => {
    setShowProgramsModal(false);
    setActiveExercises([]);
    for (const exId of program.exercises) {
      const exDetails = predefinedExercises.find(e => e.id.toString() === exId.toString());
      if (exDetails) await addExistingExercise(exDetails, true);
    }
  };

  const renderExerciseCard = ({ item: exercise }: { item: Exercise }) => (
    <View style={styles.cardContainer}>
      <View style={styles.exerciseCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderText}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Text style={styles.muscleGroup}>{exercise.muscleGroup}</Text>
          </View>
          <Pressable style={styles.menuButton} onPress={() => setMenuExerciseId(exercise.id)} hitSlop={10}>
            <Text style={styles.menuDots}>⋮</Text>
          </Pressable>
        </View>

        <View style={styles.setHeader}>
          <Text style={[styles.headerText, { flex: 0.5, textAlign: "left" }]}>Set</Text>
          <Text style={[styles.headerText, { flex: 0.5, textAlign: "center", marginLeft: 12 }]}>kg</Text>
          <Text style={[styles.headerText, { flex: 1, textAlign: "center", marginLeft: 30 }]}>Reps</Text>
          <View style={{ flex: 0.5 }} />
          <View style={{ flex: 0.5 }} />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {exercise.sets.map((set, index) => (
            <View key={set.id} style={styles.setRow}>
              <Text style={styles.setIndex}>{index + 1}</Text>
                <TextInput
                style={[
                  styles.numberInput,
                  emptyFields.includes(`${exercise.id}-${set.id}-weight`) && styles.errorBorder
                ]}
                placeholder={set.lastKg !== undefined ? String(set.lastKg) : "0"}
                placeholderTextColor="#ddd"
                keyboardType="numeric"
                value={set.weight}
                onChangeText={(val) => updateSet(exercise.id, set.id, "weight", val)}
              />
              <TextInput
                style={[
                  styles.numberInput,
                  emptyFields.includes(`${exercise.id}-${set.id}-reps`) && styles.errorBorder
                ]}
                placeholder={set.lastReps !== undefined ? String(set.lastReps) : "0"}
                placeholderTextColor="#ddd"
                keyboardType="numeric"
                value={set.reps}
                onChangeText={(val) => updateSet(exercise.id, set.id, "reps", val)}
              />
              <TrendBadge set={set} />
              <Pressable style={styles.removeSetButton} onPress={() => removeSet(exercise.id, set.id)}>
                <Text style={styles.removeSetText}>×</Text>
              </Pressable>
            </View>
          ))}
          <Pressable style={styles.addSetButton} onPress={() => addSet(exercise.id)}>
            <Text style={styles.addSetText}>+</Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Toast ref={toastRef} />
      <Text style={styles.title}>Track Workout</Text>

      <View style={styles.topButtonsRow}>
        <Pressable style={styles.primaryButton} onPress={() => setShowChooseModal(true)}>
          <Text style={styles.buttonText}>Exercises</Text>
        </Pressable>
        <Pressable style={styles.programButton} onPress={() => setShowProgramsModal(true)}>
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
          ref={flatListRef}
          getItemLayout={(data, index) => ({ length: width, offset: width * index, index })}
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
          <Pressable style={styles.saveWorkoutButton} onPress={() => {
            if (Platform.OS === "ios") {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            } else if (Platform.OS === "android") {
              Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm);
            }
            saveWorkoutPost();
          }}>
            <Text style={styles.saveWorkoutText}>Save Workout</Text>
          </Pressable>
          <Pressable style={styles.saveAsProgramButton} onPress={() => setShowSaveProgramModal(true)}>
            <Text style={styles.saveAsProgramText}>Save as Program</Text>
          </Pressable>
        </View>
      )}

      <CreateExerciseModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={createNewExercise}
      />
      <ChooseExerciseModal
        visible={showChooseModal}
        onClose={() => setShowChooseModal(false)}
        exercises={predefinedExercises}
        onSelect={addExistingExercise}
        onDelete={deleteExercise}
      />
      <ExerciseMenuModal
        visible={menuExerciseId !== null}
        onClose={() => setMenuExerciseId(null)}
        onRemove={() => menuExerciseId && removeExercise(menuExerciseId)}
      />
      <ProgramsModal
        visible={showProgramsModal}
        onClose={() => setShowProgramsModal(false)}
        programs={programs}
        onSelect={loadProgram}
        onDelete={deleteProgram}
      />
      <SaveProgramModal
        visible={showSaveProgramModal}
        onClose={() => setShowSaveProgramModal(false)}
        onSave={saveCurrentAsProgram}
        workoutNames={activeExercises.map(ex => ex.name)}
      />
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
  fixedFooter: { paddingHorizontal: 50, paddingBottom: 12, backgroundColor: "#f8f9fa" },
  saveWorkoutButton: { backgroundColor: "#000", paddingVertical: 12, borderRadius: 16, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 5, elevation: 4 },
  saveWorkoutText: { color: "white", fontSize: 16, fontWeight: "bold" },
  saveAsProgramButton: { backgroundColor: "#e0e0e0", paddingVertical: 10, borderRadius: 16, alignItems: "center", marginTop: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 5, elevation: 4 },
  saveAsProgramText: { color: "black", fontSize: 14, fontWeight: "600" },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#888", fontSize: 16 },
  swipeList: { flex: 1 },
  cardContainer: { width: width, paddingHorizontal: 20, paddingBottom: 20, paddingTop: 5 },
  exerciseCard: { backgroundColor: "white", padding: 20, borderRadius: 16, flex: 1, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 10 },
  cardHeaderText: { flex: 1 },
  exerciseName: { fontSize: 20, fontWeight: "bold", color: "black" },
  muscleGroup: { fontSize: 12, color: "#888", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 },
  menuButton: { padding: 4 },
  menuDots: { fontSize: 24, color: "#888", fontWeight: "bold", lineHeight: 24 },
  setHeader: { flexDirection: "row", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#f0f0f0", marginBottom: 10 },
  headerText: { flex: 1, fontWeight: "700", color: "#888", textAlign: "left", fontSize: 12, textTransform: "uppercase" },
  setRow: { flexDirection: "row", alignItems: "center", marginBottom: 8, paddingVertical: 4 },
  setIndex: { flex: 0.3, textAlign: "left", fontSize: 16, fontWeight: "600", color: "#333" },
  numberInput: { flex: 0.7, backgroundColor: "#f0f0f0", borderRadius: 8, padding: 12, marginHorizontal: 5, textAlign: "center", fontSize: 16, fontWeight: "500" },
  removeSetButton: { flex: 0.4, alignItems: "center", justifyContent: "flex-end" },
  removeSetText: { color: "grey", fontSize: 20, fontWeight: "300" },
  addSetButton: { width: "50%", marginTop: 1, paddingVertical: 10, backgroundColor: "#f0f8ff", borderRadius: 8, marginHorizontal: 50, alignSelf: "flex-start" },
  addSetText: { color: "#007AFF", fontWeight: "600", textAlign: "center", fontSize: 16 },
  errorBorder: {borderWidth: 1, borderColor: "#ff19006f", }
});