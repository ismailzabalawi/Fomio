import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../lib/theme/theme';
import type { IconProps as PhosphorIconProps } from 'phosphor-react-native';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  variant = 'default',
  padding = 'medium',
}) => {
  const { theme } = useTheme();
  
  // Get colors based on theme
  const getColors = () => {
    switch (theme) {
      case 'light':
        return {
          background: '#FFFFFF',
          border: '#F2F2F7',
          title: '#1C1C1E',
          subtitle: '#8E8E93',
          shadow: 'rgba(0, 0, 0, 0.1)',
        };
      case 'dark':
        return {
          background: '#1C1C1E',
          border: '#38383A',
          title: '#F2F2F2',
          subtitle: '#8E8E93',
          shadow: 'rgba(0, 0, 0, 0.3)',
        };
      case 'reader':
        return {
          background: '#FAF4E6',
          border: '#2E2C28',
          title: '#2E2C28',
          subtitle: '#6C6A67',
          shadow: 'rgba(46, 44, 40, 0.1)',
        };
      default:
        return {
          background: '#FFFFFF',
          border: '#F2F2F7',
          title: '#1C1C1E',
          subtitle: '#8E8E93',
          shadow: 'rgba(0, 0, 0, 0.1)',
        };
    }
  };
  
  const colors = getColors();
  
  // Get padding based on size
  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'small':
        return 8;
      case 'large':
        return 20;
      default:
        return 16;
    }
  };
  
  // Get shadow based on variant
  const getShadowStyle = () => {
    if (variant === 'elevated') {
      return {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 4,
      };
    }
    return {};
  };
  
  // Get border based on variant
  const getBorderStyle = () => {
    if (variant === 'outlined') {
      return {
        borderWidth: 1,
        borderColor: colors.border,
      };
    }
    return {
      borderWidth: 0,
    };
  };
  
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.background,
          padding: getPadding(),
          ...getShadowStyle(),
          ...getBorderStyle(),
        },
      ]}
      accessibilityRole="none"
    >
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && (
            <Text
              style={[
                styles.title,
                {
                  color: colors.title,
                  fontFamily: theme === 'reader' ? 'Georgia' : 'System',
                },
              ]}
              accessibilityRole="header"
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  color: colors.subtitle,
                  fontFamily: theme === 'reader' ? 'Georgia' : 'System',
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  content: {},
});

export default Card;
