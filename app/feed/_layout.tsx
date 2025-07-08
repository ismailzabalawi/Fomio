import { Stack } from 'expo-router';

export default function FeedLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false,
          title: 'Feed'
        }} 
      />
      <Stack.Screen 
        name="[byteId]" 
        options={{ 
          headerShown: false,
          title: 'Byte Details'
        }} 
      />
    </Stack>
  );
}

