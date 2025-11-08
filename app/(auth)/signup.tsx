import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '../../components/shared/theme-provider';
import { Button } from '../../components/ui/button';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import {
  UserPlus,
  Globe,
  Shield,
  Coffee,
  ArrowRight,
  Sparkle,
} from 'phosphor-react-native';
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  BORDER_RADIUS,
  SHADOWS,
} from '../../shared/theme-constants';

const DISCOURSE_BASE_URL =
  Constants.expoConfig?.extra?.DISCOURSE_BASE_URL ||
  'https://meta.techrebels.info';

export default function SignUpScreen() {
  const { isDark, isAmoled } = useTheme();
  const { width } = Dimensions.get('window');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // Get theme colors from centralized system
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
    secondary: isAmoled
      ? '#a1a1aa'
      : isDark
        ? COLORS.dark.secondary
        : COLORS.light.secondary,
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
    accent: isAmoled ? '#8b5cf6' : isDark ? '#8b5cf6' : '#a855f7',
    gradient: isAmoled
      ? ['#000000', '#1a1a1a']
      : isDark
        ? ['#18181b', '#27272a']
        : ['#f8fafc', '#ffffff'],
  };

  // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSignUp = async () => {
    try {
      const signupUrl = `${DISCOURSE_BASE_URL}/signup`;
      await WebBrowser.openBrowserAsync(signupUrl);
      // After signup, user returns and presses Sign In to authorize
    } catch (error) {
      console.error('Sign up failed:', error);
      Alert.alert('Sign Up Error', 'Failed to open signup page. Please try again.', [
        { text: 'OK' },
      ]);
    }
  };

  const handleSignIn = () => {
    router.push('/(auth)/signin');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Background Gradient Effect */}
      <View
        style={[
          styles.backgroundGradient,
          {
            backgroundColor: colors.background,
            opacity: isDark ? 0.1 : 0.05,
          },
        ]}
      />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={handleBack}
          style={[styles.backButton, { backgroundColor: colors.surface }]}
        >
          <ArrowRight
            size={20}
            color={colors.foreground}
            weight="bold"
            style={{ transform: [{ rotate: '180deg' }] }}
          />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Join TechRebels
          </Text>
          <View
            style={[styles.headerAccent, { backgroundColor: colors.accent }]}
          />
        </View>
        <View style={styles.headerSpacer} />
      </Animated.View>

      {/* Main Content Card */}
      <Animated.View
        style={[
          styles.contentCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            shadowColor: colors.foreground,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View
            style={[styles.welcomeIcon, { backgroundColor: colors.accent }]}
          >
            <Sparkle size={32} color={colors.foreground} weight="fill" />
          </View>
          <Text style={[styles.welcomeTitle, { color: colors.foreground }]}>
            Create Your Account
          </Text>
          <Text
            style={[styles.welcomeSubtitle, { color: colors.mutedForeground }]}
          >
            Join thousands of tech enthusiasts, developers, and innovators in
            meaningful discussions.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <View
            style={[
              styles.featureItem,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.foreground,
              },
            ]}
          >
            <View
              style={[
                styles.featureIcon,
                {
                  backgroundColor: colors.primary,
                  shadowColor: colors.primary,
                },
              ]}
            >
              <Globe size={18} color={colors.foreground} weight="fill" />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.foreground }]}>
                Global Network
              </Text>
              <Text
                style={[styles.featureText, { color: colors.mutedForeground }]}
              >
                Connect with a worldwide tech community
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.featureItem,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.foreground,
              },
            ]}
          >
            <View
              style={[
                styles.featureIcon,
                {
                  backgroundColor: colors.accent,
                  shadowColor: colors.accent,
                },
              ]}
            >
              <Shield size={18} color={colors.foreground} weight="fill" />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.foreground }]}>
                Privacy Focused
              </Text>
              <Text
                style={[styles.featureText, { color: colors.mutedForeground }]}
              >
                No tracking, algorithms, or data mining
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.featureItem,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.foreground,
              },
            ]}
          >
            <View
              style={[
                styles.featureIcon,
                {
                  backgroundColor: colors.primary,
                  shadowColor: colors.primary,
                },
              ]}
            >
              <Coffee size={18} color={colors.foreground} weight="fill" />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.foreground }]}>
                Knowledge Sharing
              </Text>
              <Text
                style={[styles.featureText, { color: colors.mutedForeground }]}
              >
                Learn from experts and share your expertise
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <Button
            onPress={handleSignUp}
            variant="primary"
            size="lg"
            fullWidth
            icon={UserPlus}
            style={styles.primaryButton}
            accessibilityLabel="Create TechRebels account"
            accessibilityHint="Opens the TechRebels sign up page in a secure web view"
          >
            Create Account
          </Button>

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

          <Button
            onPress={handleSignIn}
            variant="outline"
            size="lg"
            fullWidth
            style={styles.secondaryButton}
            accessibilityLabel="Sign in to existing TechRebels account"
            accessibilityHint="Navigates to the sign in screen"
          >
            Sign In
          </Button>
        </View>
      </Animated.View>

      {/* Footer */}
      <Animated.View
        style={[
          styles.footer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
          By creating an account, you agree to our Terms of Service and Privacy
          Policy
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.lg,
    zIndex: 1,
  },
  backButton: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.sm,
  },
  headerTitleContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    letterSpacing: -0.3,
  },
  headerAccent: {
    width: 40,
    height: 3,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.xs,
  },
  headerSpacer: {
    width: 60,
  },
  contentCard: {
    flex: 1,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.lg,
    zIndex: 1,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  welcomeIcon: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  welcomeTitle: {
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    letterSpacing: -0.3,
    lineHeight: TYPOGRAPHY.fontSize['2xl'] * 1.2,
  },
  welcomeSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.fontSize.sm * TYPOGRAPHY.lineHeight.normal,
    maxWidth: 300,
    opacity: 0.7,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginBottom: SPACING.md,
  },
  featuresSection: {
    marginBottom: SPACING.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    ...SHADOWS.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginBottom: 3,
    letterSpacing: -0.1,
    lineHeight: TYPOGRAPHY.fontSize.sm * 1.1,
  },
  featureText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    lineHeight: TYPOGRAPHY.fontSize.xs * 1.3,
    opacity: 0.8,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  actionSection: {
    marginBottom: SPACING.sm,
  },
  primaryButton: {
    marginBottom: SPACING.md,
    ...SHADOWS.lg,
    borderRadius: BORDER_RADIUS.xl,
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
    marginHorizontal: SPACING.lg,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    opacity: 0.6,
  },
  secondaryButton: {
    borderWidth: 1.5,
    ...SHADOWS.sm,
    borderRadius: BORDER_RADIUS.xl,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: SPACING.lg,
    zIndex: 1,
  },
  footerText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.fontSize.xs * TYPOGRAPHY.lineHeight.relaxed,
    maxWidth: 320,
    opacity: 0.7,
  },
});
