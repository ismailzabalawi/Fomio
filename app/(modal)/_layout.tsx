import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../lib/theme/theme';

export default function ModalLayout() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: Platform.OS === 'ios' ? 'formSheet' : 'modal',
        animation: 'slide_from_bottom',
        // These settings help with keyboard behavior
        contentStyle: { 
          backgroundColor: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)' 
        },
        gestureEnabled: Platform.OS === 'ios',
        // Add blur effect to the background
        headerBackground: () => (
          <BlurView
            tint={isDark ? 'dark' : 'light'}
            intensity={80}
            style={{ flex: 1 }}
          />
        ),
      }}
    />
  );
} 