import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export type ToastRef = {
  show: (message: string) => void;
};

const Toast = forwardRef<ToastRef, {}>((props, ref) => {
  const [message, setMessage] = useState('');
  
  const translateY = useSharedValue(0); 

  useImperativeHandle(ref, () => ({
    show: (msg: string) => {
      setMessage(msg);
      
      translateY.value = withSequence(
        withTiming(130, { duration: 400 }), 
        withDelay(2000, withTiming(0, { duration: 300 })) 
      );
    },
  }));

  // Create the swipe gesture
  const panGesture = Gesture.Pan()
    .onChange((event) => {
      // Only allow the user to drag it UP (negative translation)
      if (event.translationY < 0) {
        translateY.value = 130 + event.translationY;
      }
    })
    .onEnd((event) => {
      // If they swiped up more than 30 pixels OR flicked it really fast
      if (event.translationY < -30 || event.velocityY < -500) {
        // Dismiss it immediately
        translateY.value = withTiming(0, { duration: 250 });
      } else {
        // Otherwise, snap it back into place
        translateY.value = withTiming(130, { duration: 250 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.toastContent}>
          <MaterialIcons name="error-outline" size={24} color="#e53935" />
          <Text style={styles.message}>{message}</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -200,
    left: 20,
    right: 20,
    zIndex: 9999,
    elevation: 10,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#e53935',
    borderRightWidth: 2,
    borderRightColor: '#e53935',  
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  message: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
});

export default Toast;