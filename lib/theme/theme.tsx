import * as React from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeWrapper } from './ThemeWrapper';

// Define theme types
export type ThemeMode = 'light' | 'dark' | 'reader';
export type ColorMode = 'light' | 'dark';

// Theme context interface
export interface ThemeContextType {
  theme: ThemeMode;
  colorMode: ColorMode;
  setTheme: (theme: ThemeMode | ((prev: ThemeMode) => ThemeMode)) => void;
  toggleTheme: () => void;
}

// Create the context with default values
const ThemeContext = React.createContext<ThemeContextType>({
  theme: 'light',
  colorMode: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
});

// Theme storage key
const THEME_STORAGE_KEY = 'fomio_theme_preference';

// Theme provider props
interface ThemeProviderProps {
  children: React.ReactNode;
}

// Helper function to determine color mode
const getColorMode = (theme: ThemeMode): ColorMode => {
  return theme === 'reader' ? 'light' : theme;
};

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const deviceColorScheme = useColorScheme();
  const [theme, setThemeState] = React.useState<ThemeMode>('light');
  const [isLoading, setIsLoading] = React.useState(true);

  // Derive color mode from theme
  const colorMode = getColorMode(theme);

  // Load saved theme from storage
  React.useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'reader')) {
          setThemeState(savedTheme as ThemeMode);
        } else if (deviceColorScheme) {
          setThemeState(deviceColorScheme === 'dark' ? 'dark' : 'light');
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
        if (deviceColorScheme) {
          setThemeState(deviceColorScheme === 'dark' ? 'dark' : 'light');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, [deviceColorScheme]);

  // Save theme preference when it changes
  const setTheme = React.useCallback(async (newTheme: ThemeMode | ((prev: ThemeMode) => ThemeMode)) => {
    const resolvedTheme = typeof newTheme === 'function' ? newTheme(theme) : newTheme;
    setThemeState(resolvedTheme);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, resolvedTheme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  }, [theme]);

  // Toggle between themes
  const toggleTheme = React.useCallback(() => {
    setTheme((currentTheme: ThemeMode) => {
      switch (currentTheme) {
        case 'light':
          return 'dark';
        case 'dark':
          return 'reader';
        case 'reader':
          return 'light';
        default:
          return 'light';
      }
    });
  }, [setTheme]);

  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, colorMode, setTheme, toggleTheme }}>
      <ThemeWrapper theme={theme}>{children}</ThemeWrapper>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export the context and types
export default ThemeContext;
