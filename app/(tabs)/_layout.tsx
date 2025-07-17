import { Tabs } from 'expo-router';
import { House, MagnifyingGlass, PlusCircle, Bell, GearSix } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/components/shared/theme-provider';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: isDark ? '#9ca3af' : '#64748b',
        tabBarStyle: {
          backgroundColor: isDark ? '#1f2937' : '#fff',
          borderTopWidth: 0,
          height: 62 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
          paddingTop: 6,
          paddingLeft: Math.max(insets.left, 12),
          paddingRight: Math.max(insets.right, 12),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDark ? 0.3 : 0.06,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600', marginBottom: 2 },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <House color={color} size={focused ? size + 2 : size} weight={focused ? 'fill' : 'regular'} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size, focused }) => (
            <MagnifyingGlass color={color} size={focused ? size + 2 : size} weight="bold" />
          ),
        }}
      />
      <Tabs.Screen
        name="compose"
        options={{
          title: '',
          tabBarIcon: ({ color, size, focused }) => (
            <PlusCircle
              color="#fff"
              size={focused ? size + 18 : size + 14}
              weight="fill"
              style={{
                backgroundColor: '#0ea5e9',
                borderRadius: 32,
                padding: 8,
                marginTop: -18,
                shadowColor: '#0ea5e9',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.18,
                shadowRadius: 8,
                elevation: 8,
              }}
            />
          ),
          tabBarLabel: '',
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, size, focused }) => (
            <Bell color={color} size={focused ? size + 2 : size} weight="bold" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size, focused }) => (
            <GearSix color={color} size={focused ? size + 2 : size} weight="bold" />
          ),
        }}
      />
    </Tabs>
  );
}
