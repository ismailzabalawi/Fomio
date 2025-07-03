import { useColorMode } from '@gluestack-ui/themed';
import { useTheme } from '../theme';
import type { ThemeMode, ThemeColors } from '../theme';

/**
 * Get the appropriate color value based on the current theme mode
 * @param lightValue - Color value for light mode
 * @param darkValue - Color value for dark mode
 * @param readerValue - Optional color value for reader mode
 */
export function getThemeColor(
  lightValue: string,
  darkValue: string,
  readerValue?: string
) {
  const { theme } = useTheme();
  switch (theme) {
    case 'dark':
      return darkValue;
    case 'reader':
      return readerValue || lightValue;
    default:
      return lightValue;
  }
}

/**
 * Hook to get current theme colors with proper typing
 */
export function useThemeColors() {
  const { theme, colorMode } = useTheme();
  const gluestackColorMode = useColorMode();

  return {
    theme,
    colorMode,
    gluestackColorMode,
    isDark: theme === 'dark',
    isReader: theme === 'reader',
  };
}

/**
 * Get a specific color from the theme palette
 * @param colorKey - Key of the color in the palette
 * @param fallback - Fallback color if the key doesn't exist
 */
export function getColorFromTheme(
  colors: ThemeColors,
  theme: ThemeMode,
  colorKey: keyof typeof colors.light,
  fallback?: string
) {
  return colors[theme][colorKey] || fallback;
}
