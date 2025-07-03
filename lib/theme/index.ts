import { config } from './theme.config';
// Export the theme provider and hook
export {
  ThemeProvider,
  useTheme,
  type ThemeMode,
  type ColorMode,
  type ThemeContextType,
} from './theme';

// Re-export the default export as ThemeContext
export { default as ThemeContext } from './theme';

// Export theme configuration
export { config };

// Export theme-related types
export type ThemeColors = {
  light: typeof config.tokens.colors;
  dark: typeof config.tokens.colors;
  reader: typeof config.tokens.colors;
};

// Export theme utility types
export type TypographyStyles = typeof config.tokens.typography;
export type SpacingTokens = typeof config.tokens.space;
