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
      
      <Pressable 
        style={({ pressed }) => [styles.actionButton, pressed && { backgroundColor: '#f0f0f0' }]} 
        onPress={onRemove}
      >
        <Text style={styles.menuActionDestructive}>Remove Exercise</Text>
      </Pressable>
      
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
  modalTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 20, color: "black", textAlign: "left" },
  actionButton: { paddingVertical: 18, borderTopWidth: 1, borderTopColor: "#eee", alignItems: "center", justifyContent: "center", marginHorizontal: -25 },
  menuActionDestructive: { fontSize: 16, color: "#e53935", fontWeight: "600" },
  closeModalSection: { paddingVertical: 18, borderTopWidth: 1, borderTopColor: "#eee", alignItems: "center", justifyContent: "center", marginHorizontal: -25, marginBottom: -40 },
  cancelTextCentered: { color: "#000000ad", fontSize: 16, fontWeight: "600" },
});