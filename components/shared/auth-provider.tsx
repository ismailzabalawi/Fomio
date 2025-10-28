import React, { createContext, useContext, useEffect, useState } from 'react';
import { SessionStorage, StoredUserData } from '../../shared/session-storage';
import { discourseApi, SignupResponse } from '../../api';
import { User } from '../../api';
import { logAuth, logError, logInfo, logWarn } from '../../shared/error-logger';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { login: string; password: string }) => Promise<void>;
  signup: (userData: {
    name: string;
    email: string;
    username: string;
    password: string;
  }) => Promise<SignupResponse>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  isLoggingOut: boolean;
  handleWebViewAuth: (cookies: {
    authToken: string;
    sessionCookie: string;
    csrfToken: string;
    userApiKey?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Convert stored user data to full User object
  const convertStoredUserToUser = (storedUser: StoredUserData): User => {
    return {
      id: storedUser.id,
      username: storedUser.username,
      name: storedUser.name || storedUser.username,
      avatar_template: storedUser.avatar_template || '',
      email: '', // Not stored for security
      last_posted_at: '',
      last_seen_at: '',
      created_at: '',
      ignored: false,
      muted: false,
      can_ignore_user: false,
      can_mute_user: false,
      can_send_private_message_to_user: false,
      trust_level: storedUser.trust_level || 0,
      moderator: false,
      admin: false,
      title: undefined,
      badge_count: 0,
      time_read: 0,
      recent_time_read: 0,
      primary_group_id: null,
      primary_group_name: null,
      primary_group_flair_url: null,
      primary_group_flair_bg_color: null,
      primary_group_flair_color: null,
      featured_topic: null,
      staged: false,
      can_edit: false,
      can_invite_to_forum: false,
      can_invite_to_topic: false,
      can_send_private_message: false,
    };
  };

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      logAuth('Checking auth status', { hasStoredSession: true });

      // Check if Discourse API has valid tokens
      if (discourseApi.isAuthenticated()) {
        try {
          const currentUser = await discourseApi.getCurrentUser();
          if (currentUser.user) {
            setUser(currentUser.user);
            logAuth('Session restored successfully', {
              username: (currentUser.user as any)?.username,
              userId: (currentUser.user as any)?.id,
            });
          } else {
            throw new Error('No user data in response');
          }
        } catch (apiError) {
          logWarn('AUTH', 'Stored session is invalid, clearing', {
            error: (apiError as Error).message,
          });
          // Session is invalid, clear it
          await discourseApi.clearAuthTokens();
          setUser(null);
        }
      } else {
        setUser(null);
        logAuth('No stored session found');
      }
    } catch (error) {
      logError('AUTH', error as Error, 'Auth status check failed');
      setUser(null);
      await discourseApi.clearAuthTokens();
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebViewAuth = async (cookies: {
    authToken: string;
    sessionCookie: string;
    csrfToken: string;
    userApiKey?: string;
  }) => {
    try {
      logAuth('Processing WebView authentication', {
        hasAuthToken: !!cookies.authToken,
        hasSessionCookie: !!cookies.sessionCookie,
        hasCsrfToken: !!cookies.csrfToken,
        hasUserApiKey: !!cookies.userApiKey,
      });

      const response = await discourseApi.handleWebViewAuth(cookies);

      if (response.success && response.user) {
        setUser(response.user);

        // Store session in SessionStorage for compatibility
        await SessionStorage.storeSession(
          cookies.authToken,
          cookies.sessionCookie,
          cookies.csrfToken,
          response.user
        );

        logAuth('WebView authentication successful', {
          username: (response.user as any)?.username,
          userId: (response.user as any)?.id,
        });
      } else {
        throw new Error('WebView authentication failed - invalid response');
      }
    } catch (error) {
      logError('AUTH', error as Error, 'WebView authentication failed');
      throw error;
    }
  };

  const login = async (credentials: { login: string; password: string }) => {
    try {
      logAuth('Attempting login', { login: credentials.login });

      // For now, this method is kept for compatibility but WebView auth is preferred
      throw new Error(
        'Direct login is not supported. Please use the WebView authentication flow.'
      );
    } catch (error) {
      logError('AUTH', error as Error, 'Login failed');
      throw error;
    }
  };

  const signup = async (userData: {
    name: string;
    email: string;
    username: string;
    password: string;
  }) => {
    try {
      logAuth('Attempting signup', {
        email: userData.email,
        username: userData.username,
      });

      // For now, this method is kept for compatibility but WebView auth is preferred
      throw new Error(
        'Direct signup is not supported. Please use the WebView authentication flow.'
      );
    } catch (error) {
      logError('AUTH', error as Error, 'Signup failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsLoggingOut(true);
      logAuth('Logging out user', {
        userId: user?.id,
        username: user?.username,
      });

      // Call Discourse logout endpoint
      await discourseApi.logout();

      // Clear local session
      await SessionStorage.clearSession();
      setUser(null);

      logAuth('User logged out successfully');
    } catch (error) {
      logError('AUTH', error as Error, 'Logout error');
      // Even if server logout fails, clear local data
      await SessionStorage.clearSession();
      setUser(null);
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    checkAuthStatus,
    isLoggingOut,
    handleWebViewAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
