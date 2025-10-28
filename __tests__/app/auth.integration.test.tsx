/**
 * Integration tests for authentication flow
 */

import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  screen,
} from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BffAuthProvider } from '../../components/shared/bff-auth-provider';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

// Mock expo-auth-session
jest.mock('expo-auth-session', () => ({
  startAsync: jest.fn().mockResolvedValue({
    type: 'cancel',
    params: {},
  }),
  makeRedirectUri: jest.fn(() => 'fomio://auth'),
}));

// Mock the BFF API client
jest.mock('../../lib/apiClient', () => ({
  bffFetch: jest
    .fn()
    .mockResolvedValue({ authUrl: 'https://example.com/auth' }),
  setTokens: jest.fn(),
  clearTokens: jest.fn(),
  getAccess: jest.fn(() => null),
  getRefresh: jest.fn(() => null),
}));

// Mock theme provider
jest.mock('../../components/shared/theme-provider', () => ({
  useTheme: () => ({
    theme: 'light',
    colors: {
      primary: '#007AFF',
      background: '#FFFFFF',
      text: '#000000',
      surface: '#F2F2F7',
      error: '#FF3B30',
    },
  }),
}));

import { Text, TouchableOpacity, View } from 'react-native';
import { useBffAuth } from '../../components/shared/bff-auth-provider';

// Test component that uses auth context
const TestAuthComponent = () => {
  const { user, isLoading, isAuthenticated, startLogin, logout } = useBffAuth();

  return (
    <View>
      <Text testID="auth-status">
        {isLoading
          ? 'Loading'
          : isAuthenticated
            ? 'Authenticated'
            : 'Not Authenticated'}
      </Text>
      {user && (
        <Text testID="user-info">
          {user.username} - {user.email}
        </Text>
      )}
      <TouchableOpacity testID="sign-in-button" onPress={() => startLogin()}>
        <Text>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="sign-up-button" onPress={() => startLogin()}>
        <Text>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="sign-out-button" onPress={() => logout()}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
  });

  const renderWithAuth = (component: React.ReactElement) => {
    return render(<BffAuthProvider>{component}</BffAuthProvider>);
  };

  it('should initialize with unauthenticated state', async () => {
    renderWithAuth(<TestAuthComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent(
        'Not Authenticated'
      );
    });
  });

  it('should render auth buttons', async () => {
    renderWithAuth(<TestAuthComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('sign-in-button')).toBeTruthy();
      expect(screen.getByTestId('sign-up-button')).toBeTruthy();
      expect(screen.getByTestId('sign-out-button')).toBeTruthy();
    });
  });
});
