// components/modals/SaveProgramModal.tsx
import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable, TextInput, ScrollView } from "react-native";
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
        <View style={styles.modalActions}>
          <Pressable onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Save Program</Text>
          </Pressable>
        </View>
      </ScrollView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  modalTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 20, color: "black" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 15, marginBottom: 15, fontSize: 16 },
  modalActions: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  cancelText: { color: "black", fontSize: 16, fontWeight: "600" },
  saveButton: { backgroundColor: "#000", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
  saveText: { color: "white", fontWeight: "bold", fontSize: 16 },
});