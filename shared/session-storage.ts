import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'fomio_auth_token';
const SESSION_COOKIE_KEY = 'fomio_session_cookie';
const CSRF_TOKEN_KEY = 'fomio_csrf_token';
const USER_DATA_KEY = 'fomio_user_data';

export interface StoredUserData {
  id: number;
  username: string;
  name?: string;
  avatar_template?: string;
  trust_level?: number;
}

export interface StoredSession {
  authToken: string;
  sessionCookie: string;
  csrfToken: string;
  userData: StoredUserData;
  timestamp: number;
}

export class SessionStorage {
  // Store session data securely
  static async storeSession(
    authToken: string,
    sessionCookie: string,
    csrfToken: string,
    userData: any
  ): Promise<void> {
    try {
      // Extract only essential user data to keep storage size small
      const essentialUserData = {
        id: userData.id,
        username: userData.username,
        name: userData.name,
        avatar_template: userData.avatar_template,
        trust_level: userData.trust_level,
      };

      const sessionData: StoredSession = {
        authToken,
        sessionCookie,
        csrfToken,
        userData: essentialUserData,
        timestamp: Date.now(),
      };

      console.log(
        '💾 Storing session data:',
        JSON.stringify(sessionData).length,
        'bytes'
      );

      // Store each token separately for better security
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, authToken);
      await SecureStore.setItemAsync(SESSION_COOKIE_KEY, sessionCookie);
      await SecureStore.setItemAsync(CSRF_TOKEN_KEY, csrfToken);
      await SecureStore.setItemAsync(
        USER_DATA_KEY,
        JSON.stringify(essentialUserData)
      );
    } catch (error) {
      console.error('Failed to store session:', error);
      throw new Error('Failed to store authentication session');
    }
  }

  // Retrieve stored session data
  static async getSession(): Promise<StoredSession | null> {
    try {
      const authToken = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
      const sessionCookie = await SecureStore.getItemAsync(SESSION_COOKIE_KEY);
      const csrfToken = await SecureStore.getItemAsync(CSRF_TOKEN_KEY);
      const userDataString = await SecureStore.getItemAsync(USER_DATA_KEY);

      if (!authToken || !sessionCookie || !csrfToken || !userDataString) {
        return null;
      }

      const userData = JSON.parse(userDataString) as StoredUserData;

      const sessionData: StoredSession = {
        authToken,
        sessionCookie,
        csrfToken,
        userData,
        timestamp: Date.now(), // Update timestamp on retrieval
      };

      // Check if session is expired (24 hours)
      const isExpired =
        Date.now() - sessionData.timestamp > 24 * 60 * 60 * 1000;
      if (isExpired) {
        await this.clearSession();
        return null;
      }

      return sessionData;
    } catch (error) {
      console.error('Failed to retrieve session:', error);
      await this.clearSession();
      return null;
    }
  }

  // Get just the authentication tokens
  static async getAuthTokens(): Promise<{
    authToken: string;
    sessionCookie: string;
    csrfToken: string;
  } | null> {
    try {
      const authToken = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
      const sessionCookie = await SecureStore.getItemAsync(SESSION_COOKIE_KEY);
      const csrfToken = await SecureStore.getItemAsync(CSRF_TOKEN_KEY);

      if (!authToken || !sessionCookie || !csrfToken) {
        return null;
      }

      return { authToken, sessionCookie, csrfToken };
    } catch (error) {
      console.error('Failed to retrieve auth tokens:', error);
      return null;
    }
  }

  // Update just the CSRF token (useful when refreshing tokens)
  static async updateCsrfToken(csrfToken: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(CSRF_TOKEN_KEY, csrfToken);
    } catch (error) {
      console.error('Failed to update CSRF token:', error);
      throw new Error('Failed to update CSRF token');
    }
  }

  // Clear stored session data
  static async clearSession(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(SESSION_COOKIE_KEY);
      await SecureStore.deleteItemAsync(CSRF_TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_DATA_KEY);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession();
    return !!session?.authToken;
  }

  // Get user data only
  static async getUserData(): Promise<StoredUserData | null> {
    try {
      const userDataString = await SecureStore.getItemAsync(USER_DATA_KEY);
      if (!userDataString) return null;

      return JSON.parse(userDataString) as StoredUserData;
    } catch (error) {
      console.error('Failed to retrieve user data:', error);
      return null;
    }
  }
}
