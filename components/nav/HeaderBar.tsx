import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../shared/theme-provider';
import { ArrowLeft, GearSix } from 'phosphor-react-native';
import { router } from 'expo-router';

export interface HeaderBarProps {
  title: string;
  onBack?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
  onLeftPress?: () => void;
  rightA11yLabel?: string;
  leftA11yLabel?: string;
  style?: ViewStyle;
}

// UI Spec: HeaderBar — Consistent navigation bar with title, left/right actions, and theming. Accessible and padded for touch.
export function HeaderBar({
  title,
  onBack,
  leftIcon,
  rightIcon,
  onRightPress,
  onLeftPress,
  rightA11yLabel,
  leftA11yLabel,
  style,
}: HeaderBarProps) {
  const { isDark } = useTheme();
  const colors = {
    background: isDark ? '#18181b' : '#fff',
    text: isDark ? '#f4f4f5' : '#1e293b',
    divider: isDark ? '#334155' : '#e2e8f0',
  };

  function handleLeftPress() {
    if (onBack) return onBack();
    if (onLeftPress) return onLeftPress();
    router.back();
  }

  return (
    <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.divider }, style]}>
      <View style={styles.side}>
        {(onBack || onLeftPress || leftIcon) && (
          <TouchableOpacity
            onPress={handleLeftPress}
            style={styles.iconButton}
            accessible
            accessibilityRole="button"
            accessibilityLabel={leftA11yLabel || 'Back'}
            accessibilityHint={onBack ? 'Go back to previous screen' : undefined}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            {leftIcon || <ArrowLeft size={28} color={colors.text} weight="bold" />}
          </TouchableOpacity>
        )}
      </View>
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={1} accessibilityRole="header">
        {title}
      </Text>
      <View style={styles.side}>
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightPress}
            style={styles.iconButton}
            accessible
            accessibilityRole="button"
            accessibilityLabel={rightA11yLabel || 'Action'}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  } as ViewStyle,
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  } as TextStyle,
  side: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  iconButton: {
    padding: 8,
    borderRadius: 8,
  } as ViewStyle,
  icon: {
    fontSize: 24,
  } as TextStyle,
}); 