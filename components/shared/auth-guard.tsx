import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useBffAuth } from './bff-auth-provider';
import { useTheme } from './theme-provider';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useBffAuth();
  const { isDark } = useTheme();

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      // Redirect to signin if authentication is required but user is not authenticated
      router.replace('/(auth)/signin');
    } else if (!isLoading && !requireAuth && isAuthenticated) {
      // Redirect to main app if user is authenticated but trying to access auth pages
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, requireAuth]);

  if (isLoading) {
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
  if (!requireAuth || isAuthenticated) {
    return <>{children}</>;
  }

  // This should not be reached due to the redirect above, but just in case
  return null;
}
