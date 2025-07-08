import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
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
        console.error('Failed to load theme from storage:', error);
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
        console.error('Failed to save theme to storage:', error);
        setTheme(theme);
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

