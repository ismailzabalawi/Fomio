import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, Pressable } from 'react-native';
import { useTheme } from '../shared/theme-provider';
import { ArrowLeft, UserCircle, House } from 'phosphor-react-native';
import { router } from 'expo-router';


export interface HeaderBarProps {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  showProfileButton?: boolean;
  onProfilePress?: () => void;
  showHomeButton?: boolean;
  onHomePress?: () => void;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'transparent';
}

// UI Spec: HeaderBar — Beautiful, accessible header with refined spacing, typography, and visual hierarchy.
// Follows Fomio's design language: clarity, consistency, and delightful interactions.
export function HeaderBar({
  title,
  showBackButton = true,
  onBack,
  showProfileButton = true,
  onProfilePress,
  showHomeButton = false,
  onHomePress,
  style,
  variant = 'default',
}: HeaderBarProps) {
  const { isDark, isAmoled } = useTheme();
  
  const colors = {
    background: isAmoled ? '#000000' : (isDark ? '#0f0f23' : '#ffffff'),
    backgroundSecondary: isAmoled ? '#0a0a0a' : (isDark ? '#1a1a2e' : '#f8fafc'),
    text: isDark ? '#f8fafc' : '#0f172a',
    textSecondary: isDark ? '#94a3b8' : '#475569',
    accent: isDark ? '#38bdf8' : '#0ea5e9',
    accentLight: isDark ? '#7dd3fc' : '#38bdf8',
    divider: isAmoled ? '#1a1a1a' : (isDark ? '#1e293b' : '#e2e8f0'),
    shadow: isAmoled ? '#000000' : (isDark ? '#000000' : '#000000'),
  };

  const getBackgroundStyle = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.background,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 8,
          elevation: 8,
        };
      case 'transparent':
        return {
          backgroundColor: 'transparent',
        };
      default:
        return {
          backgroundColor: colors.background,
          borderBottomColor: colors.divider,
          borderBottomWidth: 1,
        };
    }
  };

  function handleBackPress() {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  }

  function handleProfilePress() {
    if (onProfilePress) {
      onProfilePress();
    } else {
      router.push('/(profile)/' as any);
    }
  }

  function handleHomePress() {
    if (onHomePress) {
      onHomePress();
    } else {
      router.push('/(tabs)/' as any);
    }
  }

  return (
    <View style={[styles.header, getBackgroundStyle(), style]}>
      {/* Left Section - Navigation */}
      <View style={styles.side}>
        {showBackButton && (
          <Pressable
            onPress={handleBackPress}
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.iconButtonPressed
            ]}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Go back"
            accessibilityHint="Go back to previous screen"
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          >
            <View style={styles.iconContainer}>
              <ArrowLeft size={24} color={colors.text} weight="bold" />
            </View>
          </Pressable>
        )}
        {showHomeButton && (
          <Pressable
            onPress={handleHomePress}
            style={({ pressed }) => [
              styles.iconButton,
              styles.homeButton,
              pressed && styles.iconButtonPressed
            ]}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Go home"
            accessibilityHint="Go to home page"
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          >
            <View style={styles.iconContainer}>
              <House size={22} color={colors.accent} weight="bold" />
            </View>
          </Pressable>
        )}
      </View>

      {/* Center Section - Title */}
      <View style={styles.titleContainer}>
        <Text 
          style={[styles.title, { color: colors.text }]} 
          numberOfLines={1} 
          accessibilityRole="header"
        >
          {title}
        </Text>
        {variant === 'elevated' && (
          <View style={[styles.titleUnderline, { backgroundColor: colors.accent }]} />
        )}
      </View>

      {/* Right Section - Profile */}
      <View style={styles.side}>
        {showProfileButton && (
          <Pressable
            onPress={handleProfilePress}
            style={({ pressed }) => [
              styles.iconButton,
              styles.profileButton,
              pressed && styles.iconButtonPressed
            ]}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Profile"
            accessibilityHint="Open profile page"
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
          >
            <View style={[styles.iconContainer, styles.profileIconContainer]}>
              <UserCircle size={24} color={colors.accent} weight="bold" />
            </View>
          </Pressable>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 64,
  } as ViewStyle,
  side: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
    justifyContent: 'flex-start',
  } as ViewStyle,
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  } as ViewStyle,
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.3,
    lineHeight: 24,
  } as TextStyle,
  titleUnderline: {
    width: 32,
    height: 3,
    borderRadius: 2,
    marginTop: 4,
  } as ViewStyle,
  iconButton: {
    padding: 8,
    borderRadius: 12,
    marginHorizontal: 2,
  } as ViewStyle,
  iconButtonPressed: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    transform: [{ scale: 0.95 }],
  } as ViewStyle,
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  } as ViewStyle,
  homeButton: {
    marginLeft: 8,
  } as ViewStyle,
  profileButton: {
    marginLeft: 'auto',
  } as ViewStyle,
  profileIconContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  } as ViewStyle,
}); 