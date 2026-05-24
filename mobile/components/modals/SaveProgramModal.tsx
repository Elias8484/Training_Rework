import React, { useState } from "react";
import { StyleSheet, Text, Pressable, TextInput, ScrollView } from "react-native";
import BottomSheetModal from "./BottomSheetModal";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
};

export default function SaveProgramModal({ visible, onClose, onSave }: Props) {
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
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 15, marginBottom: 20, fontSize: 16 },
  saveButton: { backgroundColor: "#000", paddingVertical: 12, borderRadius: 16, alignItems: "center", marginBottom: 5, marginHorizontal: 25 },
  saveText: { color: "white", fontWeight: "bold", fontSize: 14 },
  closeModalSection: { paddingVertical: 18, borderTopWidth: 1, borderTopColor: "#eee", alignItems: "center", justifyContent: "center", marginHorizontal: -25, marginBottom: -40, marginTop: 10 },
  cancelTextCentered: { color: "black", fontSize: 16, fontWeight: "600" },
});