import { saveTokens, loadTokens, deleteTokens, Tokens } from './secureStore';
import { API_BASE_URL } from '@/config/api';

const MCP_BASE_URL = API_BASE_URL;

export interface ApiError {
  code: string;
  message: string;
  status?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

class BffApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    this.loadTokensFromStorage();
  }

  private async loadTokensFromStorage(): Promise<void> {
    try {
      const tokens = await loadTokens();
      if (tokens) {
        this.accessToken = tokens.access;
        this.refreshToken = tokens.refresh;
        console.log('🔐 Tokens loaded from storage');
      }
    } catch (error) {
      console.error('Failed to load tokens from storage:', error);
    }
  }

  async setTokens(tokens: Tokens): Promise<void> {
    this.accessToken = tokens.access;
    this.refreshToken = tokens.refresh;
    await saveTokens(tokens);
  }

  async clearTokens(): Promise<void> {
    this.accessToken = null;
    this.refreshToken = null;
    await deleteTokens();
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  isAuthenticated(): boolean {
    return !!(this.accessToken && this.refreshToken);
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
      console.log('🔄 Refreshing access token...');

      const response = await fetch(`${MCP_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: this.refreshToken,
        }),
      });

      if (!response.ok) {
        console.error('Token refresh failed:', response.status);
        return false;
      }

      const data = await response.json();

      if (data.access_token) {
        this.accessToken = data.access_token;
        if (data.refresh_token) {
          this.refreshToken = data.refresh_token;
        }

        await saveTokens({
          access: this.accessToken,
          refresh: this.refreshToken || '',
        });

        console.log('✅ Access token refreshed');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  async bffFetch<T>(
    path: string,
    options: {
      method?: string;
      headers?: Record<string, string>;
      body?: any;
    } = {}
  ): Promise<T> {
    const url = `${MCP_BASE_URL}${path}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    };

    // Add authorization header if we have an access token
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const requestOptions: RequestInit = {
      method: options.method || 'GET',
      headers,
    };

    if (options.body) {
      requestOptions.body =
        typeof options.body === 'string'
          ? options.body
          : JSON.stringify(options.body);
    }

    try {
      console.log(`🌐 BFF Request: ${requestOptions.method} ${path}`, {
        url,
        baseUrl: MCP_BASE_URL,
      });

      let response = await fetch(url, requestOptions);

      // Handle 401 - try to refresh token and retry
      if (response.status === 401 && this.refreshToken) {
        console.log('🔄 401 received, attempting token refresh...');

        const refreshSuccess = await this.refreshAccessToken();

        if (refreshSuccess) {
          // Retry the original request with new token
          headers['Authorization'] = `Bearer ${this.accessToken}`;
          response = await fetch(url, { ...requestOptions, headers });
        } else {
          // Refresh failed, clear tokens
          await this.clearTokens();
          throw new Error('Authentication expired and refresh failed');
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        const error: ApiError = {
          code: errorData.code || `HTTP_${response.status}`,
          message:
            errorData.message ||
            `Request failed with status ${response.status}`,
          status: response.status,
        };

        // Handle specific error cases
        if (response.status === 401) {
          error.code = 'UNAUTHORIZED';
          error.message = 'Authentication required';
        } else if (response.status === 403) {
          error.code = 'FORBIDDEN';
          error.message = 'Access denied';
        } else if (response.status === 429) {
          error.code = 'RATE_LIMITED';
          error.message = 'Too many requests, please try again later';
        } else if (response.status >= 500) {
          error.code = 'UPSTREAM_ERROR';
          error.message = 'Server error, please try again later';
        }

        throw error;
      }

      const data = await response.json();
      console.log(`✅ BFF Response: ${path}`, { success: true });
      return data;
    } catch (error) {
      console.error(`❌ BFF Request failed: ${path}`, error);

      if (
        error instanceof Error &&
        error.message.includes('Authentication expired')
      ) {
        throw { code: 'UNAUTHORIZED', message: 'Please log in again' };
      }

      throw error;
    }
  }
}

// Export singleton instance
export const bffApiClient = new BffApiClient();
export const bffFetch = bffApiClient.bffFetch.bind(bffApiClient);
export default bffApiClient;
