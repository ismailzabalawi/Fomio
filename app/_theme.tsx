import React from 'react';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { ThemeProvider, useTheme } from '../lib/theme/theme';
import config from '../gluestack.config';

// Define props interface
interface AppThemeProviderProps {
  children: React.ReactNode;
}

// Component to apply the current theme to Gluestack UI
const GluestackThemeWrapper: React.FC<AppThemeProviderProps> = ({ children }) => {
  const { theme } = useTheme();
  
  // Map our theme mode to Gluestack's colorMode
  const colorMode = theme === 'reader' ? 'light' : theme;
  
  return (
    <GluestackUIProvider config={config} colorMode={colorMode}>
      {children}
    </GluestackUIProvider>
  );
};

// Main theme provider that combines our ThemeProvider with Gluestack
export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <GluestackThemeWrapper>
        {children}
      </GluestackThemeWrapper>
    </ThemeProvider>
  );
};

export default AppThemeProvider;
