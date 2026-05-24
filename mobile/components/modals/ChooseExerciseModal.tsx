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
          
          {/* Titel-sektionen har nu sin egen padding, så den ikke rører kanten */}
          <View style={styles.modalTitleRow}>
            <Pressable style={styles.modalTitleButton} onPress={() => console.log("Select clicked")}>
              <Text style={styles.modalTitle2}>Select Exercise</Text>
            </Pressable>
            <Pressable style={styles.modalTitleButton} onPress={() => console.log("Discover clicked")}>
              <Text style={styles.modalTitle2}>Discover</Text>
              <Text style={{fontSize: 12, color: "#888", marginTop: 2}}>coming soon..</Text>
            </Pressable>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {exercises.map((ex) => (
              <Pressable 
                key={ex.id} 
                style={({ pressed }) => [
                  styles.existingExerciseRow,
                  pressed && { backgroundColor: '#f8f8f8' } // Flot grå tryk-effekt
                ]}
                onPress={() => { 
                  if (Platform.OS === "ios") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  } else if (Platform.OS === "android") {
                    Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm);
                  }
                  onSelect(ex);
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.existingName}>{ex.name}</Text>
                  <Text style={styles.existingMuscle}>{ex.muscleGroup}</Text>
                </View>
                
                <Pressable 
                  hitSlop={15} 
                  style={styles.deleteButton}
                  onPress={() => { console.log("Deleting id:", ex.id); onDelete(ex.id); }}
                >
                  <Text style={styles.deleteButtonText}>×</Text>
                </Pressable>
              </Pressable>
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
  
  /* * 1. ÆNDRING: Fjernet padding: 20! Nu går modalen helt ud til kanten indvendigt.
   * Vi har kun paddingTop: 20 for at give luft i toppen.
   */
  modalContent: { backgroundColor: "white", paddingTop: 20, minHeight: 300, maxHeight: 600, borderRadius: 16 },
  
  /* 2. ÆNDRING: Tilføjet paddingHorizontal: 20, så knapperne i toppen holdes væk fra kanten */
  modalTitleRow: { flexDirection: "row", gap: 10, marginBottom: 10, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "#f0f0f0", paddingBottom: 10 },
  modalTitleButton: { flex: 1, backgroundColor: "#f0f0f0", paddingVertical: 12, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  modalTitle2: { fontSize: 14, fontWeight: "bold", color: "black" },
  
  /* 3. ÆNDRING: Rækkerne har nu IKKE negative margins. De fylder bare kassen ud og bruger paddingHorizontal */
  existingExerciseRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    paddingBottom: 10, 
    paddingHorizontal: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: "#f0f0f0",
  },
  existingName: { fontSize: 16, fontWeight: "600" },
  existingMuscle: { color: "#888", fontSize: 13, marginTop: 2 },
  
  deleteButton: { padding: 5, justifyContent: "center", alignItems: "center" },
  deleteButtonText: { color: "lightgrey", fontSize: 26, fontWeight: "400", lineHeight: 26 },

  /* 4. ÆNDRING: Cancel-knappen sidder nu også naturligt fast i bunden uden negative margins */
  closeModalSection: { paddingVertical: 18, borderTopWidth: 1, borderTopColor: "#eee", alignItems: "center", justifyContent: "center", borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  cancelTextCentered: { color: "black", fontSize: 16, fontWeight: "600" },
});