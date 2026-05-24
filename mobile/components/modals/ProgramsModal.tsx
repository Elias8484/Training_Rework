// components/modals/ProgramsModal.tsx
import React from "react";
import { StyleSheet, Text, View, Pressable, ScrollView, Modal, Platform } from "react-native";
import * as Haptics from 'expo-haptics';

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
          
          <Text style={styles.modalTitle}>My Programs</Text>

          <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
            {programs.length === 0 ? (
              <Text style={{ textAlign: "center", color: "#888", marginTop: 20 }}>No programs saved yet.</Text>
            ) : (
              programs.map((prog) => (
                <View key={prog.id} style={styles.existingRow}>
                  <Pressable style={{ flex: 1 }} onPress={() => { 
                    if (Platform.OS === "ios") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    else if (Platform.OS === "android") Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm);
                    onSelect(prog);
                  }}>
                    <Text style={styles.existingName}>{prog.name}</Text>
                    <Text style={styles.existingDetails}>{prog.exercises.length} exercises</Text>
                  </Pressable>
                  <Pressable onPress={() => onDelete(prog.id)}>
                    <Text style={{ color: "lightgrey", fontSize: 30, fontWeight: "400" }}>×</Text>
                  </Pressable>
                </View>
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
  modalContent: { backgroundColor: "white", padding: 20, minHeight: 300, maxHeight: 600, borderRadius: 16 },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "black", marginBottom: 15, textAlign: "center" },
  existingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#eee" },
  existingName: { fontSize: 16, fontWeight: "600" },
  existingDetails: { color: "#888", fontSize: 12, marginTop: 2 },
  closeModalSection: { marginTop: 10, paddingVertical: 18, borderTopWidth: 1, borderTopColor: "#eee", alignItems: "center", justifyContent: "center", marginHorizontal: -20, marginBottom: -20, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  cancelTextCentered: { color: "black", fontSize: 16, fontWeight: "600" },
});