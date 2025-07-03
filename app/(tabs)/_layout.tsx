import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useTheme } from '../../lib/theme/theme';
import React from 'react';
import { HomeIcon, CompassIcon, CreateIcon, ChatIcon, SettingsIcon } from '../../components/icons';
import HeaderBar from '../../components/ui/HeaderBar';

export const TabBarContext = React.createContext<{
  tabBarOffset: Animated.SharedValue<number>;
}>({
  tabBarOffset: { value: 0 } as Animated.SharedValue<number>,
});

export default function TabsLayout() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const tabBarOffset = useSharedValue(0);

  // Get theme colors based on current theme
  const getThemeColors = () => {
    switch (theme) {
      case 'light':
        return {
          background: '#FFFFFF',
          text: '#1C1C1E',
          secondaryText: '#8E8E93',
          tabBarBackground: 'rgba(255, 255, 255, 0.8)',
        };
      case 'dark':
        return {
          background: '#000000',
          text: '#F2F2F2',
          secondaryText: '#8E8E93',
          tabBarBackground: 'rgba(30, 30, 30, 0.8)',
        };
      case 'reader':
        return {
          background: '#FAF4E6',
          text: '#2E2C28',
          secondaryText: '#6C6A67',
          tabBarBackground: 'rgba(250, 244, 230, 0.8)',
        };
      default:
        return {
          background: '#FFFFFF',
          text: '#1C1C1E',
          secondaryText: '#8E8E93',
          tabBarBackground: 'rgba(255, 255, 255, 0.8)',
        };
    }
  };

  const colors = getThemeColors();
  const animatedTabBarStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: tabBarOffset.value }],
  }));

  const getHeaderTitle = (route: string) => {
    switch (route) {
      case 'home':
        return 'Home';
      case 'discover':
        return 'Discover';
      case 'create':
        return 'Create';
      case 'notifications':
        return 'Notifications';
      case 'settings':
        return 'Settings';
      default:
        return '';
    }
  };

  return (
    <TabBarContext.Provider value={{ tabBarOffset }}>
      <Tabs
        screenOptions={({ route }) => ({
          header: () => (
            <HeaderBar 
              title={getHeaderTitle(route.name)}
              showBackButton={route.name !== 'home'}
            />
          ),
          contentStyle: {
            paddingTop: 256,
            backgroundColor: colors.background,
          },
          headerTransparent: true,
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: colors.secondaryText,
          tabBarStyle: [
            {
              position: 'absolute',
              left: 20,
              right: 20,
              bottom: insets.bottom === 0 ? 12 : insets.bottom,
              height: 64,
              backgroundColor: colors.tabBarBackground,
              borderRadius: 32,
              borderTopWidth: 0,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 10,
              overflow: 'hidden',
            },
            animatedTabBarStyle,
          ],
          tabBarBackground: () => (
            <BlurView
              tint={theme === 'dark' ? 'dark' : 'light'}
              intensity={40}
              style={StyleSheet.absoluteFill}
            />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          tabBarShowLabel: false,
          tabBarItemStyle: {
            paddingTop: 8,
          },
        })}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <HomeIcon color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="discover"
          options={{
            title: 'Discover',
            tabBarIcon: ({ color }) => (
              <CompassIcon color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: 'Create',
            tabBarIcon: ({ color }) => (
              <CreateIcon color={color} size={24} />
            ),
            headerShown: false,
            tabBarHideOnKeyboard: true,
            href: '/(modal)/create'
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            title: 'Notifications',
            tabBarIcon: ({ color }) => (
              <ChatIcon color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => (
              <SettingsIcon color={color} size={24} />
            ),
          }}
        />
      </Tabs>
    </TabBarContext.Provider>
  );
}