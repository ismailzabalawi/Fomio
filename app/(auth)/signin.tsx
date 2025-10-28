import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '../../components/shared/theme-provider';
import { useAuthContext } from '../../components/shared/auth-provider';
import { SignIn, ArrowLeft } from 'phosphor-react-native';
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  BORDER_RADIUS,
} from '../../shared/theme-constants';

export default function SignInScreen() {
  const { isDark, isAmoled } = useTheme();
  const { handleWebViewAuth } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const colors = {
    background: isAmoled
      ? '#000000'
      : isDark
        ? COLORS.dark.background
        : COLORS.light.background,
    foreground: isAmoled
      ? '#ffffff'
      : isDark
        ? COLORS.dark.foreground
        : COLORS.light.foreground,
    card: isAmoled ? '#000000' : isDark ? COLORS.dark.card : COLORS.light.card,
    mutedForeground: isAmoled
      ? '#71717a'
      : isDark
        ? COLORS.dark.mutedForeground
        : COLORS.light.mutedForeground,
    border: isAmoled
      ? '#18181b'
      : isDark
        ? COLORS.dark.border
        : COLORS.light.border,
    primary: isAmoled
      ? '#60a5fa'
      : isDark
        ? COLORS.dark.accent
        : COLORS.light.accent,
    surface: isAmoled
      ? '#0a0a0a'
      : isDark
        ? COLORS.dark.muted
        : COLORS.light.muted,
  };

  const handleSignIn = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      // For now, we'll simulate WebView auth with mock data
      // In a real implementation, this would open a WebView
      const mockCookies = {
        authToken: 'mock_auth_token',
        sessionCookie: 'mock_session_cookie',
        csrfToken: 'mock_csrf_token',
      };

      await handleWebViewAuth(mockCookies);
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Sign in failed:', error);
      setIsLoading(false);

      // Provide more helpful error messages
      let errorMessage = 'Failed to sign in. Please try again.';

      if (error?.status === 400) {
        errorMessage =
          'Invalid request. Please check your server configuration.';
      } else if (error?.status === 401) {
        errorMessage = 'Authentication failed. Please try again.';
      } else if (error?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Alert.alert('Sign In Error', errorMessage, [{ text: 'OK' }]);
    }
  };

  const handleSignUp = () => {
    router.push('/(auth)/signup');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            style={[styles.backButton, { backgroundColor: colors.surface }]}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color={colors.foreground} weight="bold" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Welcome Back
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Main Content */}
        <View
          style={[
            styles.contentCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.welcomeSection}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: colors.primary },
              ]}
            >
              <SignIn size={32} color={colors.foreground} weight="fill" />
            </View>
            <Text style={[styles.title, { color: colors.foreground }]}>
              Sign in to TechRebels
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Connect with tech enthusiasts, share ideas, and stay updated with
              the latest innovations.
            </Text>
          </View>

          {/* Primary Sign In Button */}
          <TouchableOpacity
            onPress={handleSignIn}
            disabled={isLoading}
            style={[
              styles.primaryButton,
              { backgroundColor: colors.primary },
              isLoading && styles.buttonDisabled,
            ]}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <View style={styles.buttonContent}>
                <View style={styles.buttonIcon}>
                  <SignIn size={20} color="#ffffff" weight="bold" />
                </View>
                <Text style={styles.primaryButtonText}>
                  Sign In to TechRebels
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View
              style={[styles.dividerLine, { backgroundColor: colors.border }]}
            />
            <Text
              style={[styles.dividerText, { color: colors.mutedForeground }]}
            >
              or
            </Text>
            <View
              style={[styles.dividerLine, { backgroundColor: colors.border }]}
            />
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={handleSignUp}
            style={[styles.secondaryButton, { borderColor: colors.border }]}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.secondaryButtonText, { color: colors.foreground }]}
            >
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  contentCard: {
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
  },
  primaryButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: SPACING.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    opacity: 0.3,
  },
  dividerText: {
    marginHorizontal: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.sm,
    opacity: 0.6,
  },
  secondaryButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  secondaryButtonText: {
    fontSize: TYPOGRAPHY.fontSize.base,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: SPACING.xl,
  },
  footerText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    textAlign: 'center',
    lineHeight: 16,
    maxWidth: 320,
    opacity: 0.7,
  },
});
