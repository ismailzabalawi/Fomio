import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '@/shared/logger';

type Theme = 'light' | 'dark' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  toggleTheme: () => null,
  isDark: false,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'fomio-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const systemTheme = useColorScheme();

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(storageKey);
        if (storedTheme) {
          setTheme(storedTheme as Theme);
        }
      } catch (error) {
        logger.error('Failed to load theme from storage', error);
      }
    };

    loadTheme();
  }, [storageKey]);

  const isDark = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');

  const value = {
    theme,
    setTheme: async (theme: Theme) => {
      try {
        await AsyncStorage.setItem(storageKey, theme);
        setTheme(theme);
      } catch (error) {
        logger.error('Failed to save theme to storage', error);
        setTheme(theme);
      }
    },
    toggleTheme: async () => {
      const newTheme = isDark ? 'light' : 'dark';
      try {
        await AsyncStorage.setItem(storageKey, newTheme);
        setTheme(newTheme);
      } catch (error) {
        logger.error('Failed to save theme to storage', error);
        setTheme(newTheme);
      }
    },
    isDark,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};

