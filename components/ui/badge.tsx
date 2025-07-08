import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'solid' | 'outline';
  action?: 'error' | 'warning' | 'success' | 'info' | 'muted';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => void;
}

export function Badge({
  children,
  variant = 'solid',
  action = 'muted',
  size = 'md',
  style,
  textStyle,
  onPress,
}: BadgeProps) {
  const containerStyle: ViewStyle[] = [
    styles.base,
    styles[`${variant}${action.charAt(0).toUpperCase() + action.slice(1)}` as keyof typeof styles] as ViewStyle,
    styles[`${size}Badge` as keyof typeof styles] as ViewStyle,
  ];
  
  if (style) {
    containerStyle.push(style);
  }

  const textStyleCombined: TextStyle[] = [
    styles.baseText,
    styles[`${variant}${action.charAt(0).toUpperCase() + action.slice(1)}Text` as keyof typeof styles] as TextStyle,
    styles[`${size}Text` as keyof typeof styles] as TextStyle,
  ];
  
  if (textStyle) {
    textStyleCombined.push(textStyle);
  }

  if (onPress) {
    return (
      <TouchableOpacity style={containerStyle} onPress={onPress} activeOpacity={0.7}>
        <Text style={textStyleCombined}>{children}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={containerStyle}>
      <Text style={textStyleCombined}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Solid variants
  solidError: {
    backgroundColor: '#ef4444',
  },
  solidWarning: {
    backgroundColor: '#f59e0b',
  },
  solidSuccess: {
    backgroundColor: '#10b981',
  },
  solidInfo: {
    backgroundColor: '#3b82f6',
  },
  solidMuted: {
    backgroundColor: '#6b7280',
  },
  
  // Outline variants
  outlineError: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  outlineWarning: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  outlineSuccess: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#10b981',
  },
  outlineInfo: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  outlineMuted: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6b7280',
  },
  
  // Size styles
  smBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  mdBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lgBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  
  // Text styles
  baseText: {
    fontWeight: '500',
    textAlign: 'center',
  },
  
  // Solid text colors
  solidErrorText: {
    color: '#ffffff',
  },
  solidWarningText: {
    color: '#ffffff',
  },
  solidSuccessText: {
    color: '#ffffff',
  },
  solidInfoText: {
    color: '#ffffff',
  },
  solidMutedText: {
    color: '#ffffff',
  },
  
  // Outline text colors
  outlineErrorText: {
    color: '#ef4444',
  },
  outlineWarningText: {
    color: '#f59e0b',
  },
  outlineSuccessText: {
    color: '#10b981',
  },
  outlineInfoText: {
    color: '#3b82f6',
  },
  outlineMutedText: {
    color: '#6b7280',
  },
  
  // Size text styles
  smText: {
    fontSize: 12,
  },
  mdText: {
    fontSize: 14,
  },
  lgText: {
    fontSize: 16,
  },
});

