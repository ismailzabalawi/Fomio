import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { SignOut } from 'phosphor-react-native';
import { useBffAuth } from './bff-auth-provider';
import { useTheme } from './theme-provider';

interface LogoutButtonProps {
  style?: any;
  textStyle?: any;
}

export function LogoutButton({ style, textStyle }: LogoutButtonProps) {
  const { logout, isLoggingOut } = useBffAuth();
  const { isDark } = useTheme();

  const colors = {
    background: isDark ? '#dc2626' : '#ef4444',
    text: '#ffffff',
    border: isDark ? '#991b1b' : '#dc2626',
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: colors.background, borderColor: colors.border },
        style,
      ]}
      onPress={handleLogout}
      disabled={isLoggingOut}
      accessible
      accessibilityRole="button"
      accessibilityLabel="Sign out"
      accessibilityHint="Sign out of your account"
    >
      <SignOut size={20} color={colors.text} weight="bold" />
      <Text style={[styles.text, { color: colors.text }, textStyle]}>
        {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
