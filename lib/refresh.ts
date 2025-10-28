import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/config/api';
import { logger } from '@/shared/logger';

/**
 * Attempts to refresh the access token using the refresh token
 * @returns The new access token or null if refresh failed
 */
export async function tryRefreshToken(): Promise<string | null> {
  try {
    const rt = await AsyncStorage.getItem('refresh_token');

    if (!rt) {
      logger.warn('No refresh token found');
      return null;
    }

    logger.info('Attempting to refresh access token');

    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: rt }),
    });

    if (!res.ok) {
      logger.error('Token refresh failed', { status: res.status });
      return null;
    }

    const data = await res.json();
    const { accessToken } = data;

    if (!accessToken) {
      logger.error('No access token in refresh response');
      return null;
    }

    await AsyncStorage.setItem('access_token', accessToken);
    logger.info('Token refreshed successfully');

    return accessToken;
  } catch (error) {
    logger.error('Error refreshing token', error);
    return null;
  }
}

/**
 * Clears all auth tokens from storage
 */
export async function clearAuthTokens(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
    logger.info('Auth tokens cleared');
  } catch (error) {
    logger.error('Error clearing auth tokens', error);
  }
}
