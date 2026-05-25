// components/modals/ChooseExerciseModal.tsx
import React, {useState} from "react";
import { StyleSheet, Text, View, Pressable, ScrollView, Modal, Platform, Dimensions, TextInput } from "react-native";
import * as Haptics from 'expo-haptics';

type ExerciseData = { id: string; name: string; muscleGroup: string };
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
              <Text style={{fontSize: 12, color: "#888", marginTop: 2}}>coming soon..</Text>
            </Pressable>
          </View>
          
          <TextInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          placeholderTextColor="#888"
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
  
  modalContent: { backgroundColor: "white", paddingTop: 20, height: SCREEN_HEIGHT * 0.50, borderRadius: 16 },
  modalTitleRow: { flexDirection: "row", gap: 10, marginBottom: 10, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "#f0f0f0", paddingBottom: 10 },
  modalTitleButton: { flex: 1, backgroundColor: "#f0f0f0", paddingVertical: 12, borderRadius: 10, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  modalTitle2: { fontSize: 14, fontWeight: "bold", color: "black" },
  
  existingExerciseRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    padding: 10, 
    paddingHorizontal: 20, 
    borderBottomWidth: 1, 
    borderColor: "#f0f0f0",
    borderTopWidth: 1,
    borderRadius: 10,
  },
  existingName: { fontSize: 16, fontWeight: "600" },
  existingMuscle: { color: "#888", fontSize: 13, marginTop: 2 },
  
  deleteButton: { padding: 5, justifyContent: "center", alignItems: "center" },
  deleteButtonText: { color: "lightgrey", fontSize: 26, fontWeight: "400", lineHeight: 26 },

  closeModalSection: { paddingVertical: 18, borderTopWidth: 1, borderTopColor: "#eee", alignItems: "center", justifyContent: "center", borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  cancelTextCentered: { color: "black", fontSize: 16, fontWeight: "600" },

  searchInput: {
  backgroundColor: "white",
  borderRadius: 16,
  padding: 9,
  fontSize: 14,
  marginHorizontal: 10,
  marginBottom: 8,
  borderWidth: 1,
  borderColor: "lightgrey",
  shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, elevation: 5
},
});