import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="onboarding" 
        options={{ 
          headerShown: false,
          title: 'Welcome'
        }} 
      />
      <Stack.Screen 
        name="signin" 
        options={{ 
          headerShown: false,
          title: 'Sign In'
        }} 
      />
      <Stack.Screen 
        name="signup" 
        options={{ 
          headerShown: false,
          title: 'Sign Up'
        }} 
      />
    </Stack>
  );
}

