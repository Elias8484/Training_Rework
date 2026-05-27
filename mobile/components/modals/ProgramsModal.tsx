// components/modals/ProgramsModal.tsx
import React from "react";
import { StyleSheet, Text, View, Pressable, ScrollView, Modal, Platform, Dimensions } from "react-native";
import * as Haptics from 'expo-haptics';

// Vi bruger skærmhøjden til procenter, præcis som vi aftalte til ChooseExerciseModal!
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onClose: () => void;
  programs: any[];
  onSelect: (program: any) => void;
  onDelete: (id: string) => void;
};

export default function ProgramsModal({ visible, onClose, programs, onSelect, onDelete }: Props) {
  return (
    <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.centeredOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.modalContent}>
          
          {/* Titlen har nu sin egen indre padding, så kanten kan gå helt ud til siderne */}
          <View style={styles.modalTitleContainer}>
            <Text style={styles.modalTitle}>My Programs</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {programs.length === 0 ? (
              <Text style={{ textAlign: "center", color: "#888", marginTop: 30, paddingHorizontal: 20 }}>
                No programs saved yet.
              </Text>
            ) : (
              programs.map((prog) => (
                <Pressable 
                  key={prog.id} 
                  style={({ pressed }) => [
                    styles.existingRow,
                    pressed && { backgroundColor: '#f8f8f8' }
                  ]}
                  onPress={() => { 
                    if (Platform.OS === "ios") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    else if (Platform.OS === "android") Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm);
                    onSelect(prog);
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.existingName}>{prog.name}</Text>
                    <Text style={styles.existingDetails}>{prog.exercises.length} exercises</Text>
                  </View>
                  <Pressable hitSlop={15} style={styles.deleteButton} onPress={() => onDelete(prog.id)}>
                    <Text style={styles.deleteButtonText}>×</Text>
                  </Pressable>
                </Pressable>
              ))
            )}
          </ScrollView>

          <Pressable 
            style={({ pressed }) => [styles.closeModalSection, pressed && { backgroundColor: '#f0f0f0' }]} 
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
  
  modalContent: { 
    backgroundColor: "white", 
    paddingTop: 20, 
    borderRadius: 16,
    minHeight: SCREEN_HEIGHT * 0.35, 
    maxHeight: SCREEN_HEIGHT * 0.70 
  },
  
  modalTitleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 5
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "black", textAlign: "center" },
  
  existingRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingVertical: 15, 
    paddingHorizontal: 20,
    borderBottomWidth: 1, 
    borderBottomColor: "#f0f0f0" 
  },
  existingName: { fontSize: 16, fontWeight: "600" },
  existingDetails: { color: "#888", fontSize: 13, marginTop: 2 },
  
  deleteButton: { padding: 5, justifyContent: "center", alignItems: "center" },
  deleteButtonText: { color: "lightgrey", fontSize: 26, fontWeight: "400", lineHeight: 26 },

  closeModalSection: { paddingVertical: 12, borderTopWidth: 1, borderTopColor: "#eee", alignItems: "center", justifyContent: "center", borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  cancelTextCentered: { color: "#000000ad", fontSize: 16, fontWeight: "600" },
});