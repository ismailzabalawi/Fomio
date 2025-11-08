import { useState, useEffect, useCallback } from 'react';
import { loadUserApiKey, clearAll } from './store';
import { authorizeWithDiscourse, revokeKey, getSession, DiscourseSession } from './discourse';
import { router } from 'expo-router';

export interface AuthState {
  authed: boolean;
  ready: boolean;
  user: DiscourseSession['current_user'] | null;
}

/**
 * Hook for managing Discourse User API Key authentication
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    authed: false,
    ready: false,
    user: null,
  });

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const apiKey = await loadUserApiKey();
      if (apiKey) {
        // Try to get session to validate the key
        try {
          const session = await getSession();
          setState({
            authed: true,
            ready: true,
            user: session.current_user,
          });
        } catch (error) {
          // API key is invalid, clear it
          console.warn('API key validation failed:', error);
          await clearAll();
          setState({
            authed: false,
            ready: true,
            user: null,
          });
        }
      } else {
        setState({
          authed: false,
          ready: true,
          user: null,
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setState({
        authed: false,
        ready: true,
        user: null,
      });
    }
  }, []);

  const connect = useCallback(async () => {
    try {
      await authorizeWithDiscourse();
      // Refresh session after successful auth
      const session = await getSession();
      setState({
        authed: true,
        ready: true,
        user: session.current_user,
      });
      // Navigate to home
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Connection failed:', error);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await revokeKey();
      await clearAll();
      setState({
        authed: false,
        ready: true,
        user: null,
      });
      router.replace('/(auth)/signin');
    } catch (error) {
      console.error('Sign out failed:', error);
      // Clear local storage even if revocation fails
      await clearAll();
      setState({
        authed: false,
        ready: true,
        user: null,
      });
      router.replace('/(auth)/signin');
    }
  }, []);

  return {
    authed: state.authed,
    ready: state.ready,
    user: state.user,
    connect,
    signOut,
    checkAuth,
  };
}
