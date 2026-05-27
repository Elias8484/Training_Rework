import React, { useState } from "react";
import { StyleSheet, Text, Pressable, TextInput, ScrollView, View } from "react-native";
import BottomSheetModal from "./BottomSheetModal";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  workoutNames: string[];
};

export default function SaveProgramModal({ visible, onClose, onSave, workoutNames }: Props) {
  const [name, setName] = useState("");

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name);
    setName("");
  };

  return (
    <BottomSheetModal visible={visible} onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.modalTitle}>Save Program</Text>
        <TextInput
          style={styles.input}
          placeholder="Program Name (e.g., Push Day)"
          value={name}
          onChangeText={setName}
          autoFocus={true}
        />
        {workoutNames.length > 0 && (
          <View style={styles.workoutList}>
            <Text style={styles.workoutListLabel}>Save Exercises to program{name.trim() ? ` (${name.trim()})` : ""}</Text>
            {workoutNames.map((n, i) => (
              <Text key={i} style={styles.workoutItem}>• {n}</Text>
            ))}
          </View>
        )}
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save Program</Text>
        </Pressable>
      </ScrollView>

      <Pressable 
        style={({ pressed }) => [styles.closeModalSection, pressed && { backgroundColor: '#f0f0f0' }]} 
        onPress={onClose}
      >
        <Text style={styles.cancelTextCentered}>Cancel</Text>
      </Pressable>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  modalTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 20, color: "black", textAlign: "center" },
  input: { backgroundColor: "white", borderWidth: 1, borderColor: "lightgrey", borderRadius: 16, padding: 12, marginHorizontal: 8 ,marginBottom: 15, fontSize: 14, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  saveButton: { backgroundColor: "#000", paddingVertical: 12, borderRadius: 16, alignItems: "center", marginBottom: 5, marginHorizontal: 25 },
  saveText: { color: "white", fontWeight: "bold", fontSize: 14 },
  closeModalSection: { paddingVertical: 18, borderTopWidth: 1, borderTopColor: "#eee", alignItems: "center", justifyContent: "center", marginHorizontal: -25, marginBottom: -40, marginTop: 10 },
  cancelTextCentered: { color: "#000000ad", fontSize: 16, fontWeight: "600" },
  workoutList: { backgroundColor: "#f5f5f5", borderRadius: 10, padding: 12, marginBottom: 20 },
  workoutListLabel: { fontSize: 12, fontWeight: "600", color: "#888", marginBottom: 6, textTransform: "uppercase" },
  workoutItem: { fontSize: 15, color: "#222", paddingVertical: 2 },
});