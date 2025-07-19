import { Stack } from 'expo-router';

// UI Spec: Feed Layout — Provides navigation structure for feed routes
// Configures headers and navigation behavior for byte detail screens
export default function FeedLayout(): JSX.Element {
  return (
    <Stack>
      <Stack.Screen
        name="[byteId]"
        options={{
          headerShown: false,
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
} 