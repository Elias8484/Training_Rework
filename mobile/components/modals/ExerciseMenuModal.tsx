// components/modals/ExerciseMenuModal.tsx
import React from "react";
import { StyleSheet, Text, Pressable } from "react-native";
import BottomSheetModal from "./BottomSheetModal";

type Props = {
  visible: boolean;
  onClose: () => void;
  onRemove: () => void;
};

export default function ExerciseMenuModal({ visible, onClose, onRemove }: Props) {
  return (
    <BottomSheetModal visible={visible} onClose={onClose}>
      <Text style={styles.modalTitle}>Exercise Options</Text>
      <Pressable style={styles.menuActionRow} onPress={onRemove}>
        <Text style={styles.menuActionDestructive}>Remove Exercise</Text>
      </Pressable>
      <Pressable style={styles.closeModalButton} onPress={onClose}>
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  modalTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 20, color: "black" },
  menuActionRow: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },
  menuActionDestructive: { fontSize: 18, color: "#e53935", fontWeight: "500" },
  closeModalButton: { marginTop: 5, paddingTop: 10, alignItems: "center" },
  cancelText: { color: "black", fontSize: 16, fontWeight: "600" },
});