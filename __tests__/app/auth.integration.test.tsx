/**
 * Integration tests for authentication flow
 */

import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../shared/useAuth';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

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

// Test component that uses useAuth hook
const TestAuthComponent = () => {
  const { authState, signIn, signUp, signOut, updateUser } = useAuth();

  return (
    <>
      <text testID="auth-status">
        {authState.isLoading ? 'Loading' : authState.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      </text>
      {authState.user && (
        <text testID="user-info">
          {authState.user.username} - {authState.user.email}
        </text>
      )}
      <button
        testID="sign-in-button"
        onPress={() => signIn('test@example.com', 'password')}
      >
        Sign In
      </button>
      <button
        testID="sign-up-button"
        onPress={() => signUp('test@example.com', 'password', 'testuser')}
      >
        Sign Up
      </button>
      <button
        testID="sign-out-button"
        onPress={() => signOut()}
      >
        Sign Out
      </button>
      <button
        testID="update-user-button"
        onPress={() => updateUser({ username: 'updateduser' })}
      >
        Update User
      </button>
    </>
  );
};

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
  });

  it('should initialize with unauthenticated state', async () => {
    render(<TestAuthComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });
  });

  it('should handle successful sign in', async () => {
    render(<TestAuthComponent />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });

    // Trigger sign in
    fireEvent.press(screen.getByTestId('sign-in-button'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-info')).toHaveTextContent('test@example.com - test@example.com');
    });

    // Verify AsyncStorage was called
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'auth_state',
      expect.stringContaining('test@example.com')
    );
  });

  it('should handle successful sign up', async () => {
    render(<TestAuthComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });

    fireEvent.press(screen.getByTestId('sign-up-button'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-info')).toHaveTextContent('testuser - test@example.com');
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'auth_state',
      expect.stringContaining('testuser')
    );
  });

  it('should handle sign out', async () => {
    // Start with authenticated state
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({
        user: { id: '1', email: 'test@example.com', username: 'testuser' },
        isAuthenticated: true,
      })
    );

    render(<TestAuthComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    fireEvent.press(screen.getByTestId('sign-out-button'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });

    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('auth_state');
  });

  it('should handle user update', async () => {
    // Start with authenticated state
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({
        user: { id: '1', email: 'test@example.com', username: 'testuser' },
        isAuthenticated: true,
      })
    );

    render(<TestAuthComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-info')).toHaveTextContent('testuser - test@example.com');
    });

    fireEvent.press(screen.getByTestId('update-user-button'));

    await waitFor(() => {
      expect(screen.getByTestId('user-info')).toHaveTextContent('updateduser - test@example.com');
    });

    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'auth_state',
      expect.stringContaining('updateduser')
    );
  });

  it('should restore authentication state from storage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({
        user: { id: '1', email: 'stored@example.com', username: 'storeduser' },
        isAuthenticated: true,
      })
    );

    render(<TestAuthComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user-info')).toHaveTextContent('storeduser - stored@example.com');
    });

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('auth_state');
  });

  it('should handle corrupted storage data gracefully', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid-json');

    render(<TestAuthComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });
  });

  it('should handle storage errors gracefully', async () => {
    (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

    render(<TestAuthComponent />);

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });
  });
});

