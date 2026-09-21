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
          placeholderTextColor="#6e6e73"
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
        style={({ pressed }) => [styles.closeModalSection, pressed && { backgroundColor: '#2c2c2e' }]}
        onPress={onClose}
      >
        <Text style={styles.cancelTextCentered}>Cancel</Text>
      </Pressable>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  modalTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 20, color: "white", textAlign: "center" },
  input: { backgroundColor: "#2c2c2e", color: "white", borderRadius: 16, padding: 12, marginHorizontal: 8 ,marginBottom: 15, fontSize: 14 },
  saveButton: { backgroundColor: "#0dd8ac", paddingVertical: 12, borderRadius: 16, alignItems: "center", marginBottom: 5, marginHorizontal: 25 },
  saveText: { color: "#000", fontWeight: "bold", fontSize: 14 },
  closeModalSection: { paddingVertical: 18, borderTopWidth: 1, borderTopColor: "#3a3a3c", alignItems: "center", justifyContent: "center", marginHorizontal: -25, marginBottom: -40, marginTop: 10 },
  cancelTextCentered: { color: "#a0a0a5", fontSize: 16, fontWeight: "600" },
  workoutList: { backgroundColor: "#2c2c2e", borderRadius: 10, padding: 12, marginBottom: 20 },
  workoutListLabel: { fontSize: 12, fontWeight: "600", color: "#8e8e93", marginBottom: 6, textTransform: "uppercase" },
  workoutItem: { fontSize: 15, color: "white", paddingVertical: 2 },
});