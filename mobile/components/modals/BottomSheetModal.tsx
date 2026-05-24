// components/modals/BottomSheetModal.tsx
import React, { useRef } from "react";
import { 
  StyleSheet, 
  Modal, 
  Animated, 
  Pressable, 
  KeyboardAvoidingView, 
  Platform 
} from "react-native";

// Vi definerer de "props" (egenskaber) vores komponent skal bruge
type BottomSheetModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function BottomSheetModal({
  visible,
  onClose,
  children,
}: BottomSheetModalProps) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const prevVisible = useRef(false);

  // Kører animationen, når 'visible' ændrer sig
  if (visible && !prevVisible.current) {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  }
  if (!visible && prevVisible.current) {
    slideAnim.setValue(300);
  }
  prevVisible.current = visible;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Baggrund, som lukker modalen, når der klikkes udenfor */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        
        {/* Det animerede vindue i bunden */}
        <Animated.View
          style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }] }]}
          onStartShouldSetResponder={() => true}
        >
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    backgroundColor: "rgba(0, 0, 0, 0.6)", 
    justifyContent: "flex-end" 
  },
  bottomSheet: { 
    backgroundColor: "white", 
    padding: 25, 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    paddingBottom: 40 
  },
});