import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LogoutButton } from '@/components/LogoutButton';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM_GAP } from '@/hooks/useTabBarPadding';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0dd8ac',
        tabBarInactiveTintColor: '#8e8e93',
        headerShown: true,
        headerRight: () => <LogoutButton />,
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: 'white',
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: '#000' },
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: 'absolute',
          bottom: insets.bottom + TAB_BAR_BOTTOM_GAP,
          left: 80,
          right: 80,
          height: TAB_BAR_HEIGHT,
          borderRadius: 32,
          backgroundColor: '#1c1c1e',
          borderTopWidth: 0,
          paddingBottom: 0,
          paddingTop: 0,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 10,
        },
        tabBarItemStyle: { paddingVertical: 8 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Workout',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
