import React, { useEffect, useState } from "react";
import { StyleSheet, View, Pressable, Dimensions, Modal, KeyboardAvoidingView, Platform } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
} from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function BottomSheetModal({ visible, onClose, children }: Props) {
  // Vi bruger et lokalt state til at holde modalen i live, MENS den animerer ud
  const [isMounted, setIsMounted] = useState(visible);
  
  // Starter helt nede under skærmen
  const translateY = useSharedValue(SCREEN_HEIGHT);
  // Baggrundens gennemsigtighed
  const opacity = useSharedValue(0);

useEffect(() => {
    if (visible) {
      setIsMounted(true); 
      translateY.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });
    } else if (isMounted) {
      opacity.value = withTiming(0, { duration: 300 });
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 });
      setTimeout(() => {
        setIsMounted(false);
      }, 300);
    }
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!isMounted) return null;

  return (
    // Bemærk: animationType er "none", fordi vi styrer animationen selv nu!
    <Modal visible={true} transparent={true} animationType="none" onRequestClose={onClose}>
      
      <KeyboardAvoidingView 
      style={styles.overlayContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}>
        
        <Animated.View style={[styles.backdrop, overlayStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        {/* Selve den hvide boks der slider op og ned */}
        <Animated.View style={[styles.bottomSheet, sheetStyle]}>
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: "flex-end", // Skubber indholdet ned i bunden
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    paddingBottom: 40,
    maxHeight: SCREEN_HEIGHT * 0.9,
  },
});