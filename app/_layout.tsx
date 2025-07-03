import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../lib/theme/theme';
import { Home, Grid, PlusCircle, Settings, MessageCircle } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppThemeProvider } from './_theme';
import { TabBarProvider } from '../contexts/TabBarContext';

// Define types for tab bar props
type TabBarIconProps = {
  color: string;
  size: number;
  focused: boolean;
};

// Main navigation component
export default function RootLayout() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  
  // Get colors based on theme
  const getColors = () => {
    switch (theme) {
      case 'light':
        return {
          background: '#FFFFFF',
          tabBar: '#FFFFFF',
          tabBarBorder: '#F2F2F7',
          activeIcon: '#007AFF',
          inactiveIcon: '#8E8E93',
          activeLabel: '#007AFF',
          inactiveLabel: '#8E8E93',
        };
      case 'dark':
        return {
          background: '#000000',
          tabBar: '#000000',
          tabBarBorder: '#1C1C1E',
          activeIcon: '#0A84FF',
          inactiveIcon: '#8E8E93',
          activeLabel: '#0A84FF',
          inactiveLabel: '#8E8E93',
        };
      case 'reader':
        return {
          background: '#FAF4E6',
          tabBar: '#FAF4E6',
          tabBarBorder: '#D8CCAF',
          activeIcon: '#2E2C28',
          inactiveIcon: '#6C6A67',
          activeLabel: '#2E2C28',
          inactiveLabel: '#6C6A67',
        };
      default:
        return {
          background: '#FFFFFF',
          tabBar: '#FFFFFF',
          tabBarBorder: '#F2F2F7',
          activeIcon: '#007AFF',
          inactiveIcon: '#8E8E93',
          activeLabel: '#007AFF',
          inactiveLabel: '#8E8E93',
        };
    }
  };
  
  const colors = getColors();
  
  return (
    <AppThemeProvider>
      <SafeAreaProvider>
        <TabBarProvider>
          <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Slot />
          </View>
        </TabBarProvider>
      </SafeAreaProvider>
    </AppThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
