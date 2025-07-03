import React from 'react';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from './theme.config';

interface ThemeWrapperProps {
  children: React.ReactNode;
  theme: 'light' | 'dark' | 'reader';
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children, theme }) => {
  // Map our theme mode to Gluestack's colorMode
  const colorMode = theme === 'reader' ? 'light' : theme;
  
  // Apply theme-specific styles through Gluestack's theme system
  const themeConfig = React.useMemo(() => {
    const baseConfig = {
      ...config,
      tokens: {
        ...config.tokens,
        colors: {
          ...config.tokens.colors,
        },
      },
    };

    if (theme === 'reader') {
      return {
        ...baseConfig,
        tokens: {
          ...baseConfig.tokens,
          colors: {
            ...baseConfig.tokens.colors,
            backgroundLight: baseConfig.tokens.colors.backgroundReader,
            textLight: baseConfig.tokens.colors.textReader,
            cardBackgroundLight: baseConfig.tokens.colors.cardBackgroundReader,
            borderLight: baseConfig.tokens.colors.borderReader,
            primaryLight: baseConfig.tokens.colors.primaryReader,
            secondaryLight: baseConfig.tokens.colors.secondaryReader,
          },
          typography: {
            ...baseConfig.tokens.typography,
            body: {
              fontSize: 18,
              fontWeight: '400',
              lineHeight: 28,
              letterSpacing: 0.5,
            },
            title: {
              fontSize: 32,
              fontWeight: '600',
              lineHeight: 40,
              letterSpacing: 0.3,
            },
            subtitle: {
              fontSize: 24,
              fontWeight: '500',
              lineHeight: 32,
              letterSpacing: 0.3,
            },
          },
        },
      };
    }

    return baseConfig;
  }, [theme]);

  return (
    <GluestackUIProvider config={themeConfig} colorMode={colorMode}>
      {children}
    </GluestackUIProvider>
  );
};
