import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from './logger';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  followers: number;
  following: number;
  bytes: number;
  joinedDate: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AUTH_STORAGE_KEY = 'fomio_auth';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      const storedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (storedAuth) {
        const user = JSON.parse(storedAuth);
        setAuthState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      logger.error('Failed to load auth state', error);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // TODO: Implement actual API call
      // For now, simulate a successful login
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        username: '@johndoe',
        email,
        avatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        bio: 'Coffee enthusiast ☕️ | Tech lover 💻 | Always exploring new places 🌍',
        followers: 1234,
        following: 567,
        bytes: 89,
        joinedDate: 'Joined March 2024',
      };

      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
      setAuthState({
        user: mockUser,
        isLoading: false,
        isAuthenticated: true,
      });

      logger.auth('sign-in', true, { email, userId: mockUser.id });
      return { success: true };
    } catch (error) {
      logger.auth('sign-in', false, { email, error });
      return { success: false, error: 'Failed to sign in' };
    }
  };

  const signUp = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // TODO: Implement actual API call
      // For now, simulate a successful signup
      const mockUser: User = {
        id: Date.now().toString(),
        name,
        username: `@${name.toLowerCase().replace(/\s+/g, '')}`,
        email,
        bio: '',
        followers: 0,
        following: 0,
        bytes: 0,
        joinedDate: `Joined ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
      };

      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
      setAuthState({
        user: mockUser,
        isLoading: false,
        isAuthenticated: true,
      });

      logger.auth('sign-up', true, { email, userId: mockUser.id });
      return { success: true };
    } catch (error) {
      logger.auth('sign-up', false, { email, error });
      return { success: false, error: 'Failed to create account' };
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      logger.auth('sign-out', true);
    } catch (error) {
      logger.error('Sign out error', error);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!authState.user) return;

    try {
      const updatedUser = { ...authState.user, ...updates };
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      setAuthState((prev) => ({
        ...prev,
        user: updatedUser,
      }));
      logger.userAction('update-profile', {
        userId: updatedUser.id,
        updates: Object.keys(updates),
      });
    } catch (error) {
      logger.error('Update user error', error);
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    updateUser,
  };
}
