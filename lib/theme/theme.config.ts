import { createConfig } from '@gluestack-ui/themed';

export const config = createConfig({
  aliases: {
    // Add aliases here
  },
  tokens: {
    colors: {
      // Base colors
      backgroundLight: '#FFFFFF',
      backgroundDark: '#000000',
      backgroundReader: '#FAF4E6',
      textLight: '#1C1C1E',
      textDark: '#F2F2F2',
      textReader: '#2E2C28',
      
      // UI elements
      cardBackgroundLight: '#F2F2F7',
      cardBackgroundDark: '#1C1C1E',
      cardBackgroundReader: '#F5ECD7',
      borderLight: '#E5E5EA',
      borderDark: '#2C2C2E',
      borderReader: '#D8CCAF',
      
      // Tab bar
      tabBarBackgroundLight: 'rgba(255, 255, 255, 0.8)',
      tabBarBackgroundDark: 'rgba(30, 30, 30, 0.8)',
      tabBarBackgroundReader: 'rgba(250, 244, 230, 0.8)',
      
      // Interactive elements
      primaryLight: '#007AFF',
      primaryDark: '#0A84FF',
      primaryReader: '#2E2C28',
      secondaryLight: '#5856D6',
      secondaryDark: '#5E5CE6',
      secondaryReader: '#6C6A67',
      successLight: '#34C759',
      successDark: '#30D158',
      warningLight: '#FF9500',
      warningDark: '#FF9F0A',
      errorLight: '#FF3B30',
      errorDark: '#FF453A',
    },
    space: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    typography: {
      title: {
        fontSize: 28,
        fontWeight: '700',
        lineHeight: 34,
      },
      subtitle: {
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 24,
      },
      body: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 20,
      },
    },
  },
});
