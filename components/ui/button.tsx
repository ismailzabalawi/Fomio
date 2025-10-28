import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
  StyleProp,
} from 'react-native';
import { useTheme } from '@/components/shared/theme-provider';

export interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'primary';
  size?: 'default' | 'sm' | 'md' | 'lg' | 'icon';
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ComponentType<any>;
  fullWidth?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function Button({
  children,
  onPress,
  disabled = false,
  loading = false,
  variant = 'default',
  size = 'default',
  style,
  textStyle,
  icon: IconComponent,
  fullWidth = false,
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) {
  const { isDark } = useTheme();

  const getVariantStyle = () => {
    const baseStyles = {
      default: {
        backgroundColor: '#0ea5e9',
        paddingVertical: 12,
        paddingHorizontal: 16,
        minHeight: 44,
      },
      primary: {
        backgroundColor: '#0ea5e9',
        paddingVertical: 12,
        paddingHorizontal: 16,
        minHeight: 44,
      },
      destructive: {
        backgroundColor: '#ef4444',
        paddingVertical: 12,
        paddingHorizontal: 16,
        minHeight: 44,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: isDark ? '#374151' : '#d1d5db',
        paddingVertical: 12,
        paddingHorizontal: 16,
        minHeight: 44,
      },
      secondary: {
        backgroundColor: isDark ? '#374151' : '#f1f5f9',
        paddingVertical: 12,
        paddingHorizontal: 16,
        minHeight: 44,
      },
      ghost: {
        backgroundColor: 'transparent',
        paddingVertical: 12,
        paddingHorizontal: 16,
        minHeight: 44,
      },
      link: {
        backgroundColor: 'transparent',
        paddingVertical: 12,
        paddingHorizontal: 16,
        minHeight: 44,
      },
    };
    return baseStyles[variant];
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.smButton;
      case 'md':
        return styles.mdButton;
      case 'lg':
        return styles.lgButton;
      case 'icon':
        return styles.iconButton;
      default:
        return {};
    }
  };

  const getVariantTextStyle = () => {
    const baseTextStyles = {
      default: { color: '#ffffff' },
      primary: { color: '#ffffff' },
      destructive: { color: '#ffffff' },
      outline: { color: isDark ? '#f9fafb' : '#374151' },
      secondary: { color: isDark ? '#f9fafb' : '#374151' },
      ghost: { color: isDark ? '#f9fafb' : '#374151' },
      link: { color: '#0ea5e9', textDecorationLine: 'underline' as const },
    };
    return baseTextStyles[variant];
  };

  const getSizeTextStyle = () => {
    switch (size) {
      case 'sm':
        return styles.smText;
      case 'md':
        return styles.mdText;
      case 'lg':
        return styles.lgText;
      case 'icon':
        return styles.iconText;
      default:
        return {};
    }
  };

  const buttonStyle: StyleProp<ViewStyle> = [
    styles.base,
    getVariantStyle(),
    getSizeStyle(),
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyleCombined: StyleProp<TextStyle> = [
    styles.baseText,
    getVariantTextStyle(),
    getSizeTextStyle(),
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      testID="button-touchable"
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      <View style={styles.content}>
        {loading && (
          <ActivityIndicator
            testID="button-loading-indicator"
            size="small"
            color={
              variant === 'default' || variant === 'primary'
                ? '#ffffff'
                : '#0ea5e9'
            }
            style={styles.spinner}
          />
        )}
        {IconComponent && !loading && (
          <IconComponent size={16} style={styles.icon} />
        )}
        <Text style={textStyleCombined}>{children}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginRight: 8,
  },

  // Size styles
  smButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 36,
  },
  mdButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    minHeight: 40,
  },
  lgButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 52,
  },
  iconButton: {
    width: 44,
    height: 44,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  fullWidth: {
    width: '100%',
  },

  // Text styles
  baseText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Size text styles
  smText: {
    fontSize: 14,
  },
  mdText: {
    fontSize: 15,
  },
  lgText: {
    fontSize: 18,
  },
  iconText: {
    fontSize: 16,
  },
  icon: {
    marginRight: 8,
  },

  // Disabled styles
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
});
