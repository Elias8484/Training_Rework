import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { Presets } from 'react-native-pulsar';

export function HapticTab(props: BottomTabBarButtonProps) {
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