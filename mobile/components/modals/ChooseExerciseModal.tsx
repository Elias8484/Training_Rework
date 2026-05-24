// components/modals/ChooseExerciseModal.tsx
import React from "react";
import { StyleSheet, Text, View, Pressable, ScrollView, Modal, Platform } from "react-native";
import * as Haptics from 'expo-haptics';

type ExerciseData = { id: string; name: string; muscleGroup: string };

type Props = {
  visible: boolean;
  onClose: () => void;
  exercises: ExerciseData[];
  onSelect: (ex: ExerciseData) => void;
  onDelete: (id: string) => void;
};

export default function ChooseExerciseModal({ visible, onClose, exercises, onSelect, onDelete }: Props) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.centeredOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.modalContent}>
          <View style={styles.modalTitleRow}>
            <Pressable style={styles.modalTitleButton} onPress={() => console.log("Select clicked")}>
              <Text style={styles.modalTitle2}>Select Exercise</Text>
            </Pressable>
            <Pressable style={styles.modalTitleButton} onPress={() => console.log("Discover clicked")}>
              <Text style={styles.modalTitle2}>Discover</Text>
              <Text>comming soon..</Text>
            </Pressable>
          </View>
          <ScrollView onStartShouldSetResponder={() => true}>
            {exercises.map((ex) => (
              <View key={ex.id} style={styles.existingExerciseRow}>
                <Pressable style={{ flex: 1 }} onPress={() => { 
                  if (Platform.OS === "ios") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  } else if (Platform.OS === "android") {
                    Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm);
                  }
                  onSelect(ex);
                }}>
                  <Text style={styles.existingName}>{ex.name}</Text>
                  <Text style={styles.existingMuscle}>{ex.muscleGroup}</Text>
                </Pressable>
                <Pressable onPress={() => { console.log("Deleting id:", ex.id); onDelete(ex.id); }}>
                  <Text style={{ color: "lightgrey", fontSize: 30, fontWeight: "400" }}>×</Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>
          <Pressable 
            style={({ pressed }) => [
              styles.closeModalSection,
              pressed && { backgroundColor: '#f0f0f0' }
            ]} 
            onPress={onClose}
          >
            <Text style={styles.cancelTextCentered}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: "center", paddingHorizontal: 20 },
  modalContent: { backgroundColor: "white", padding: 20, minHeight: 300, maxHeight: 600, borderRadius: 16, marginHorizontal: 20, marginBottom: "auto", marginTop: "auto" },
  modalTitleRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  modalTitleButton: { flex: 1, backgroundColor: "#f0f0f0", paddingVertical: 12, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  modalTitle2: { fontSize: 14, fontWeight: "bold", color: "black" },
  existingExerciseRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#eee" },
  existingName: { fontSize: 16, fontWeight: "500" },
  existingMuscle: { color: "#888" },
  closeModalSection: { marginTop: 10, paddingVertical: 18, borderTopWidth: 1, borderTopColor: "#eee", alignItems: "center", justifyContent: "center", marginHorizontal: -20, marginBottom: -20, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  cancelTextCentered: { color: "black", fontSize: 16, fontWeight: "600" },
});