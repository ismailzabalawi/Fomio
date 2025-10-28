import * as SecureStore from 'expo-secure-store';

export interface Tokens {
  access: string;
  refresh: string;
}

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'fomio_access_token',
  REFRESH_TOKEN: 'fomio_refresh_token',
} as const;

export async function saveTokens(tokens: Tokens): Promise<void> {
  try {
    await Promise.all([
      SecureStore.setItemAsync(TOKEN_KEYS.ACCESS_TOKEN, tokens.access),
      SecureStore.setItemAsync(TOKEN_KEYS.REFRESH_TOKEN, tokens.refresh),
    ]);
    console.log('🔐 Tokens saved securely');
  } catch (error) {
    console.error('Failed to save tokens:', error);
    throw new Error('Failed to save authentication tokens');
  }
}

export async function loadTokens(): Promise<Tokens | null> {
  try {
    const [access, refresh] = await Promise.all([
      SecureStore.getItemAsync(TOKEN_KEYS.ACCESS_TOKEN),
      SecureStore.getItemAsync(TOKEN_KEYS.REFRESH_TOKEN),
    ]);

    if (!access || !refresh) {
      return null;
    }

    return { access, refresh };
  } catch (error) {
    console.error('Failed to load tokens:', error);
    return null;
  }
}

export async function deleteTokens(): Promise<void> {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH_TOKEN),
    ]);
    console.log('🔐 Tokens deleted');
  } catch (error) {
    console.error('Failed to delete tokens:', error);
    throw new Error('Failed to delete authentication tokens');
  }
}

export async function getAccessToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error('Failed to get access token:', error);
    return null;
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Failed to get refresh token:', error);
    return null;
  }
}
