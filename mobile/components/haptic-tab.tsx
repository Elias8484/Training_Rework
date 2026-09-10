import type { BottomTabBarButtonProps } from 'expo-router/build/react-navigation/bottom-tabs/types';
import { PlatformPressable } from 'expo-router/build/react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (Platform.OS === "ios") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else if (Platform.OS === "android") {
          Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Segment_Tick);
        }

        props.onPressIn?.(ev);
      }}
    />
  );
}
/* export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        // Trigger a light, precise tap from Pulsar
        Presets.peck(); 
        
        props.onPressIn?.(ev);
      }}
    />
  );
}

*/