import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../components/shared/theme-provider';
import { HeaderBar } from '../../components/nav/HeaderBar';
import { router } from 'expo-router';

export default function ProfileSettingsScreen(): JSX.Element {
  const { isDark, isAmoled } = useTheme();
  
  const colors = {
    background: isAmoled ? '#000000' : (isDark ? '#18181b' : '#ffffff'),
    text: isDark ? '#f4f4f5' : '#1e293b',
    secondary: isDark ? '#a1a1aa' : '#64748b',
  };

  useEffect(() => {
    // Redirect to main settings page
    router.replace('/(tabs)/settings');
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar 
        title="Settings" 
        showBackButton={true}
        showProfileButton={false}
      />
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Redirecting...</Text>
        <Text style={[styles.subtitle, { color: colors.secondary }]}>
          Taking you to settings...
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 