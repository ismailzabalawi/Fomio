import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../lib/theme/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: any;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, style }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const getBackgroundColor = () => {
    switch (theme) {
      case 'light':
        return '#FFFFFF';
      case 'dark':
        return '#000000';
      case 'reader':
        return '#FAF4E6';
      default:
        return '#FFFFFF';
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 