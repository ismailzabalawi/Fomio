import { Stack } from 'expo-router';

export default function ComposeLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'New Byte',
          headerShown: false 
        }} 
      />
    </Stack>
  );
} 