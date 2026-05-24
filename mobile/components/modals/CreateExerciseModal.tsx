import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable, TextInput, ScrollView } from "react-native";
import BottomSheetModal from "./BottomSheetModal";

const MUSCLE_GROUPS = ["Chest", "Back", "Biceps", "Triceps", "Shoulders", "Quads", "Hamstrings", "Glutes", "Calves", "Core", "Forearms", "Traps", "Other"];

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, muscle: string) => void;
};

export default function CreateExerciseModal({ visible, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [muscle, setMuscle] = useState("");

  const handleSave = () => {
    onSave(name, muscle);
    setName("");
    setMuscle("");
  };

  const handleClose = () => {
    setName("");
    setMuscle("");
    onClose();
  };

  return (
    <BottomSheetModal visible={visible} onClose={handleClose}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.modalTitle}>Add Exercise</Text>
        <TextInput
          style={styles.input}
          placeholder="Exercise Name"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.sectionLabel}>Select Muscle Group</Text>
        <View style={styles.chipContainer}>
          {MUSCLE_GROUPS.map((group) => (
            <Pressable
              key={group}
              style={[styles.chip, muscle === group && styles.chipSelected]}
              onPress={() => setMuscle(group)}
            >
              <Text style={[styles.chipText, muscle === group && styles.chipTextSelected]}>
                {group}
              </Text>
            </Pressable>
          ))}
        </View>
        
        {/* Save knappen ligger nu alene nederst i din ScrollView */}
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save & Add</Text>
        </Pressable>
      </ScrollView>

      {/* Cancel knappen trukket udenfor ScrollView for at sidde fast i bunden */}
      <Pressable 
        style={({ pressed }) => [styles.closeModalSection, pressed && { backgroundColor: '#f0f0f0' }]} 
        onPress={handleClose}
      >
        <Text style={styles.cancelTextCentered}>Cancel</Text>
      </Pressable>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  modalTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 20, color: "black", textAlign: "left" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 15, marginBottom: 15, fontSize: 16 },
  sectionLabel: { fontSize: 14, fontWeight: "600", color: "#666", marginBottom: 10, marginTop: 5, textAlign: "center" },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 25, gap: 8, justifyContent: "center" },
  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: "#f0f0f0", borderWidth: 1, borderColor: "transparent" },
  chipSelected: { backgroundColor: "#000", borderColor: "#000" },
  chipText: { fontSize: 14, color: "#333", fontWeight: "500" },
  chipTextSelected: { color: "white" },
  saveButton: { backgroundColor: "#000", paddingVertical: 12, borderRadius: 16, alignItems: "center", marginBottom: 5, marginHorizontal: 25 },
  saveText: { color: "white", fontWeight: "bold", fontSize: 14 },
  closeModalSection: { paddingVertical: 18, borderTopWidth: 1, borderTopColor: "#eee", alignItems: "center", justifyContent: "center", marginHorizontal: -25, marginBottom: -40, marginTop: 10 },
  cancelTextCentered: { color: "black", fontSize: 16, fontWeight: "600" },
});