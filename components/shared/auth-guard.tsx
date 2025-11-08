import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../lib/auth';
import { useTheme } from './theme-provider';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { authed, ready } = useAuth();
  const { isDark } = useTheme();

  useEffect(() => {
    if (ready && requireAuth && !authed) {
      // Redirect to signin if authentication is required but user is not authenticated
      router.replace('/(auth)/signin');
    } else if (ready && !requireAuth && authed) {
      // Redirect to main app if user is authenticated but trying to access auth pages
      router.replace('/(tabs)');
    }
  }, [authed, ready, requireAuth]);

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isDark ? '#18181b' : '#ffffff',
        }}
      >
        <ActivityIndicator
          size="large"
          color={isDark ? '#38bdf8' : '#0ea5e9'}
        />
      </View>
    );
  }

  // If authentication is not required or user is authenticated, render children
  if (!requireAuth || authed) {
    return <>{children}</>;
  }

  // This should not be reached due to the redirect above, but just in case
  return null;
}
