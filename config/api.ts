import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { logger } from '@/shared/logger';

/**
 * Get the IP address from the Expo debug host
 * This works for both iOS and Android simulators/emulators
 */
function ipFromDebugHost(): string {
  try {
    // Try to get the host URI from expo config
    const host =
      Constants.expoConfig?.hostUri ??
      Constants.manifest2?.extra?.expoGo?.developer?.host;

    if (host) {
      const ip = host.split(':')[0];
      logger.info('Using Expo debug host IP', { ip, host });
      return ip;
    }

    logger.warn('No debug host found, using localhost');
    return 'localhost';
  } catch (error) {
    logger.error('Error getting debug host', error);
    return 'localhost';
  }
}

/**
 * Smart API base URL resolver
 * Detects the correct endpoint based on the runtime environment
 */
export const API_BASE_URL = (() => {
  // Get port from expo config extra or environment variable, default to 8080
  const port =
    Constants.expoConfig?.extra?.apiPort ||
    process.env.EXPO_PUBLIC_API_PORT ||
    '8080';

  // Android Emulator - use special hostname
  if (Platform.OS === 'android' && (globalThis as any)?.HermesInternal) {
    const url = `http://10.0.2.2:${port}`;
    logger.info('Android Emulator detected, using 10.0.2.2', { url, port });
    return url;
  }

  // iOS Simulator or physical device on LAN
  const ip = ipFromDebugHost();
  const url = `http://${ip}:${port}`;
  logger.info('Using device/simulator IP', { url, ip, port });
  return url;
})();

/**
 * GraphQL endpoint
 */
export const GRAPHQL_ENDPOINT = `${API_BASE_URL}/graphql`;

logger.info('API Configuration', {
  platform: Platform.OS,
  apiBaseUrl: API_BASE_URL,
  graphqlEndpoint: GRAPHQL_ENDPOINT,
});
