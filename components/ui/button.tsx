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

export interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  style?: ViewStyle;
  textStyle?: TextStyle;
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
}: ButtonProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'destructive': return styles.destructiveButton;
      case 'outline': return styles.outlineButton;
      case 'secondary': return styles.secondaryButton;
      case 'ghost': return styles.ghostButton;
      case 'link': return styles.linkButton;
      default: return styles.defaultButton;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm': return styles.smButton;
      case 'lg': return styles.lgButton;
      case 'icon': return styles.iconButton;
      default: return {};
    }
  };

  const getVariantTextStyle = () => {
    switch (variant) {
      case 'destructive': return styles.destructiveText;
      case 'outline': return styles.outlineText;
      case 'secondary': return styles.secondaryText;
      case 'ghost': return styles.ghostText;
      case 'link': return styles.linkText;
      default: return styles.defaultText;
    }
  };

  const getSizeTextStyle = () => {
    switch (size) {
      case 'sm': return styles.smText;
      case 'lg': return styles.lgText;
      case 'icon': return styles.iconText;
      default: return {};
    }
  };

  const buttonStyle: StyleProp<ViewStyle> = [
    styles.base,
    getVariantStyle(),
    getSizeStyle(),
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
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {loading && (
          <ActivityIndicator
            size="small"
            color={variant === 'default' ? '#ffffff' : '#0ea5e9'}
            style={styles.spinner}
          />
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
  
  // Variant styles
  defaultButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  destructiveButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  secondaryButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  ghostButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  linkButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
  },
  
  // Size styles
  smButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 36,
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
  
  // Text styles
  baseText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  defaultText: {
    color: '#ffffff',
  },
  destructiveText: {
    color: '#ffffff',
  },
  outlineText: {
    color: '#374151',
  },
  secondaryText: {
    color: '#374151',
  },
  ghostText: {
    color: '#374151',
  },
  linkText: {
    color: '#0ea5e9',
    textDecorationLine: 'underline',
  },
  
  // Size text styles
  smText: {
    fontSize: 14,
  },
  lgText: {
    fontSize: 18,
  },
  iconText: {
    fontSize: 16,
  },
  
  // Disabled styles
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
});

