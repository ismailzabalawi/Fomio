import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../shared/theme-provider';

interface FieldErrorProps {
  message?: string;
  testID?: string;
}

export function FieldError({ message, testID }: FieldErrorProps) {
  const { isDark, isAmoled } = useTheme();

  if (!message) return null;

  const colors = {
    error: isAmoled ? '#ff6b6b' : (isDark ? '#ef4444' : '#dc2626'),
  };

  return (
    <Text
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[styles.error, { color: colors.error }]}
      testID={testID}
    >
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  error: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
  },
});
