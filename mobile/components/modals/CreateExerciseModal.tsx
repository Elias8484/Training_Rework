import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable, TextInput, ScrollView, Dimensions, Keyboard, Platform } from "react-native";
import BottomSheetModal from "./BottomSheetModal";
import * as Haptics from 'expo-haptics';

const MUSCLE_GROUPS = ["Chest", "Back", "Biceps", "Triceps", "Shoulders", "Quads", "Hamstrings", "Glutes", "Calves", "Core", "Forearms", "Traps", "Other"];
const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, muscle: string) => void;
};

export default function CreateExerciseModal({ visible, onClose, onSave }: Props) {
  const [name, setName] = useState("");
  const [muscle, setMuscle] = useState("");

  const handleSave = () => {
    Keyboard.dismiss();
    onSave(name, muscle);
    setName("");
    setMuscle("");
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onClose(); 
    setName("");
    setMuscle("");
  };

  return (
    <BottomSheetModal visible={visible} onClose={handleClose}>
      <ScrollView 
      style= {{maxHeight: SCREEN_HEIGHT*0.45}}
      showsVerticalScrollIndicator={false} 
      keyboardShouldPersistTaps="handled">

        <Text style={styles.modalTitle}>Add Exercise</Text>
        <TextInput
          style={styles.input}
          placeholder="Exercise Name"
          placeholderTextColor="#6e6e73"
          value={name}
          onChangeText={setName}
          autoCorrect={false}
        />
        <Text style={styles.sectionLabel}>Select Muscle Group</Text>
        <View style={styles.chipContainer}>
          {MUSCLE_GROUPS.map((group) => (
            <Pressable
              key={group}
              style={[styles.chip, muscle === group && styles.chipSelected]}
              onPress={() => {
                if (Platform.OS === "ios") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                } else if (Platform.OS === "android") {
                  Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm);
                }
                setMuscle(group)}
              }
            >
              <Text style={[styles.chipText, muscle === group && styles.chipTextSelected]}>
                {group}
              </Text>
            </Pressable>
          ))}
        </View>
        
        {/* Save knappen ligger nu alene nederst i din ScrollView */}
        <Pressable style={styles.saveButton} onPress={ () => {
          if (Platform.OS === "ios") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          } else if (Platform.OS === "android") {
            Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm);
          }
          handleSave();}
        }>
          <Text style={styles.saveText}>Save & Add</Text>
        </Pressable>
      </ScrollView>

      {/* Cancel knappen trukket udenfor ScrollView for at sidde fast i bunden */}
      <Pressable 
        style={({ pressed }) => [styles.closeModalSection, pressed && { backgroundColor: '#2c2c2e' }]}
        onPress={handleClose}
      >
        <Text style={styles.cancelTextCentered}>Cancel</Text>
      </Pressable>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  modalTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 14, color: "white", textAlign: "left" },
  input: { backgroundColor: "#2c2c2e", color: "white", borderRadius: 16, padding: 12, marginHorizontal: 8 ,marginBottom: 15, fontSize: 14 },
  sectionLabel: { fontSize: 14, fontWeight: "600", color: "#8e8e93", marginBottom: 10, marginTop: 5, textAlign: "center" },
  chipContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 25, gap: 8, justifyContent: "center" },
  chip: { paddingVertical: 7, paddingHorizontal: 12, borderRadius: 20, backgroundColor: "#2c2c2e", borderWidth: 1, borderColor: "transparent" },
  chipSelected: { backgroundColor: "#0dd8ac", borderColor: "#0dd8ac" },
  chipText: { fontSize: 10, color: "#a0a0a5", fontWeight: "800" },
  chipTextSelected: { color: "#000" },
  saveButton: { backgroundColor: "#0dd8ac", paddingVertical: 12, borderRadius: 16, alignItems: "center", marginBottom: 5, marginHorizontal: 25 },
  saveText: { color: "#000", fontWeight: "bold", fontSize: 14 },
  closeModalSection: { padding: 18 ,borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#3a3a3c", alignItems: "center", justifyContent: "center", marginHorizontal: -25, marginBottom: -40, marginTop: 5 },
  cancelTextCentered: { color: "#a0a0a5", fontSize: 16, fontWeight: "600" },
});