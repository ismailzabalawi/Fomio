import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { bffApiClient } from './apiClient';
import { Tokens } from './secureStore';

// Configure WebBrowser for better UX
WebBrowser.maybeCompleteAuthSession();

export interface User {
  id: number;
  username: string;
  name?: string;
  avatar_template?: string;
  trust_level: number;
  admin?: boolean;
  moderator?: boolean;
  title?: string;
  last_seen_at?: string;
  created_at?: string;
  email?: string;
  last_posted_at?: string;
  ignored?: boolean;
  muted?: boolean;
  can_ignore_user?: boolean;
  can_mute_user?: boolean;
  can_send_private_message_to_user?: boolean;
  badge_count?: number;
  time_read?: number;
  recent_time_read?: number;
  primary_group_id?: number | null;
  primary_group_name?: string | null;
  primary_group_flair_url?: string | null;
  primary_group_flair_bg_color?: string | null;
  primary_group_flair_color?: string | null;
  featured_topic?: any;
  staged?: boolean;
  can_edit?: boolean;
  can_invite_to_forum?: boolean;
  can_invite_to_topic?: boolean;
  can_send_private_message?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingOut: boolean;
}

export class AuthService {
  private listeners: Set<(state: AuthState) => void> = new Set();
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isLoggingOut: false,
  };

  constructor() {
    this.hydrateFromStorage();
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  private setState(updates: Partial<AuthState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  async hydrateFromStorage(): Promise<void> {
    try {
      this.setState({ isLoading: true });

      if (bffApiClient.isAuthenticated()) {
        // Try to get current user to validate tokens
        try {
          const user = await bffApiClient.bffFetch<User>('/me');
          this.setState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to validate stored tokens:', error);
          // Tokens are invalid, clear them
          await bffApiClient.clearTokens();
          this.setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        this.setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Failed to hydrate auth state:', error);
      this.setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }

  async startLogin(): Promise<void> {
    try {
      this.setState({ isLoading: true });

      // Get auth URL from BFF
      const response = await bffApiClient.bffFetch<{ authUrl: string }>(
        '/auth/start',
        {
          method: 'POST',
          body: {
            returnUrl: 'fomio://auth',
          },
        }
      );

      if (!response.authUrl) {
        throw new Error('No auth URL received from server');
      }

      // Start auth session
      const result = await AuthSession.startAsync({
        authUrl: response.authUrl,
        returnUrl: 'fomio://auth',
      });

      if (result.type === 'success' && result.url) {
        await this.handleAuthCallback(result.url);
      } else if (result.type === 'error') {
        throw new Error(result.error?.message || 'Authentication failed');
      } else {
        throw new Error('Authentication was cancelled');
      }
    } catch (error) {
      console.error('Login failed:', error);
      this.setState({ isLoading: false });
      throw error;
    }
  }

  private async handleAuthCallback(url: string): Promise<void> {
    try {
      const urlObj = new URL(url);
      const accessToken = urlObj.searchParams.get('access');
      const refreshToken = urlObj.searchParams.get('refresh');

      if (!accessToken || !refreshToken) {
        throw new Error('Invalid auth callback - missing tokens');
      }

      // Set tokens in API client
      await bffApiClient.setTokens({
        access: accessToken,
        refresh: refreshToken,
      });

      // Get user info
      const user = await bffApiClient.bffFetch<User>('/me');

      this.setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      console.log('✅ Authentication successful');
    } catch (error) {
      console.error('Auth callback failed:', error);
      this.setState({ isLoading: false });
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      this.setState({ isLoggingOut: true });

      // Call BFF logout endpoint (best effort)
      try {
        await bffApiClient.bffFetch('/auth/logout', { method: 'POST' });
      } catch (error) {
        console.warn(
          'Server logout failed, continuing with local cleanup:',
          error
        );
      }

      // Clear local state
      await bffApiClient.clearTokens();
      this.setState({
        user: null,
        isAuthenticated: false,
        isLoggingOut: false,
      });

      console.log('✅ Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
      this.setState({ isLoggingOut: false });
      throw error;
    }
  }

  getState(): AuthState {
    return this.state;
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
