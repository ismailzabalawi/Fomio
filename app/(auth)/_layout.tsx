import React from 'react';
import { Stack } from 'expo-router';
import { AuthGuard } from '../../components/shared/auth-guard';

export default function AuthLayout(): JSX.Element {
  return (
    <AuthGuard requireAuth={false}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="signin" />
        <Stack.Screen name="signup" />
      </Stack>
    </AuthGuard>
  );
}
