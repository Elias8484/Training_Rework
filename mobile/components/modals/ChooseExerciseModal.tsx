// components/modals/ChooseExerciseModal.tsx
import React, {useState} from "react";
import { StyleSheet, Text, View, Pressable, ScrollView, Modal, Platform, Dimensions, TextInput } from "react-native";
import * as Haptics from 'expo-haptics';

type ExerciseData = { id: string; name: string; muscleGroup: string; notes: string; };
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onClose: () => void;
  exercises: ExerciseData[];
  onSelect: (ex: ExerciseData) => void;
  onDelete: (id: string) => void;
};

export default function ChooseExerciseModal({ visible, onClose, exercises, onSelect, onDelete }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
const filteredExercises = exercises.filter((ex) => 
    ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ex.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase())
  );
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
              <Text style={{fontSize: 12, color: "#8e8e93", marginTop: 2}}>coming soon..</Text>
            </Pressable>
          </View>
          
          <TextInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          placeholderTextColor="#6e6e73"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
        />
          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredExercises.map((ex) => (
              <Pressable 
                key={ex.id} 
                style={({ pressed }) => [
                  styles.existingExerciseRow,
                  pressed && { backgroundColor: '#2c2c2e' }
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
                <View style={{flex: 1}}>
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
              pressed && { backgroundColor: '#2c2c2e' }
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
  centeredOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.7)", justifyContent: "center", paddingHorizontal: 20 },

  modalContent: { backgroundColor: "#1c1c1e", paddingTop: 14, height: SCREEN_HEIGHT * 0.50, borderRadius: 16, },
  modalTitleRow: { flexDirection: "row", gap: 10, marginBottom: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: "#3a3a3c", paddingBottom: 10 },
  modalTitleButton: { flex: 1, backgroundColor: "#2c2c2e", paddingVertical: 2, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  modalTitle2: { fontSize: 14, fontWeight: "bold", color: "white" },

  existingExerciseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#3a3a3c",
    borderTopWidth: 1,
    borderRadius: 10,
  },
  existingName: { fontSize: 16, fontWeight: "600", color: "white" },
  existingMuscle: { color: "#8e8e93", fontSize: 13, marginTop: 2 },

  deleteButton: { padding: 5, justifyContent: "center", alignItems: "center" },
  deleteButtonText: { color: "#6e6e73", fontSize: 26, fontWeight: "400", lineHeight: 26 },

  closeModalSection: { paddingVertical: 12, borderTopWidth: 1, borderTopColor: "#3a3a3c", alignItems: "center", justifyContent: "center", borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  cancelTextCentered: { color: "#a0a0a5", fontSize: 16, fontWeight: "600" },

  searchInput: {
  backgroundColor: "#2c2c2e",
  color: "white",
  borderRadius: 16,
  padding: 9,
  fontSize: 14,
  marginHorizontal: 10,
  marginBottom: 8,
},
});