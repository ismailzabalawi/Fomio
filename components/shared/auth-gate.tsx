import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useBffAuth } from './bff-auth-provider';
import { Button } from '../ui/button';

interface AuthGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGate({ children, fallback }: AuthGateProps) {
  const { isAuthenticated, isLoading, startLogin } = useBffAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <View style={styles.authRequiredContainer}>
        <Text style={styles.authRequiredTitle}>Authentication Required</Text>
        <Text style={styles.authRequiredText}>
          Please sign in to access this feature.
        </Text>
        <Button onPress={startLogin} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Sign In</Text>
        </Button>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  authRequiredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  authRequiredTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  authRequiredText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
