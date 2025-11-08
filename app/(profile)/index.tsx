import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Gear,
  PencilSimple,
  Heart,
  ChatCircle,
  Bookmark,
  Share,
  Calendar,
  MapPin,
  Globe,
  User as UserIcon,
  Crown,
  Star,
  Trophy,
  Users,
  Hash,
  Eye,
  EyeSlash,
  Bell,
  BellSlash,
} from 'phosphor-react-native';
import { useTheme } from '../../components/shared/theme-provider';
import { HeaderBar } from '../../components/nav/HeaderBar';
import { router } from 'expo-router';
import { useAuth } from '../../lib/auth';
import { getSession, DiscourseSession } from '../../lib/discourse';
import { useEffect, useState } from 'react';

interface ProfileStats {
  posts: number;
  topics: number;
  likes: number;
  followers: number;
  following: number;
  trustLevel: number;
  badges: number;
  timeRead: number;
}

function ProfileSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { isDark, isAmoled } = useTheme();
  const colors = {
    text: isDark ? '#9ca3af' : '#6b7280',
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {children}
    </View>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
}) {
  const { isDark, isAmoled } = useTheme();
  const colors = {
    background: isAmoled ? '#000000' : isDark ? '#1f2937' : '#ffffff',
    text: isDark ? '#f9fafb' : '#111827',
    secondary: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#374151' : '#e5e7eb',
  };

  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        {icon}
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.secondary }]}>
        {label}
      </Text>
    </View>
  );
}

function ActionButton({
  icon,
  title,
  subtitle,
  onPress,
  color = '#3b82f6',
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  color?: string;
}) {
  const { isDark, isAmoled } = useTheme();
  const colors = {
    background: isAmoled ? '#000000' : isDark ? '#1f2937' : '#ffffff',
    text: isDark ? '#f9fafb' : '#111827',
    secondary: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#374151' : '#e5e7eb',
  };

  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
      accessible
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.actionLeft}>
        <View style={[styles.actionIcon, { backgroundColor: `${color}20` }]}>
          {icon}
        </View>
        <View style={styles.actionContent}>
          <Text style={[styles.actionTitle, { color: colors.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.actionSubtitle, { color: colors.secondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <Text style={[styles.actionChevron, { color: colors.secondary }]}>›</Text>
    </TouchableOpacity>
  );
}

export default function ProfileScreen(): JSX.Element {
  const { isDark, isAmoled } = useTheme();
  const { authed } = useAuth();
  const [session, setSession] = useState<DiscourseSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadProfile = async () => {
    if (!authed) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await getSession();
      setSession(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load profile'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) {
      loadProfile();
    }
  }, [authed]);

  const refresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  const user = session?.current_user;
  const apolloStats = {
    posts_count: 0,
    topics_count: 0,
    likes_received: 0,
    followers_count: 0,
    following_count: 0,
  };

  const colors = {
    background: isAmoled ? '#000000' : isDark ? '#18181b' : '#ffffff',
    card: isAmoled ? '#000000' : isDark ? '#1f2937' : '#ffffff',
    text: isDark ? '#f9fafb' : '#111827',
    secondary: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#374151' : '#e5e7eb',
    primary: isDark ? '#3b82f6' : '#0ea5e9',
    accent: isDark ? '#8b5cf6' : '#7c3aed',
    success: isDark ? '#10b981' : '#059669',
    warning: isDark ? '#f59e0b' : '#d97706',
    error: isDark ? '#ef4444' : '#dc2626',
  };

  // Transform Apollo stats to local format
  const stats: ProfileStats = {
    posts: apolloStats?.posts_count || 0,
    topics: apolloStats?.topics_count || 0,
    likes: apolloStats?.likes_received || 0,
    followers: apolloStats?.followers_count || 0,
    following: apolloStats?.following_count || 0,
    trustLevel: user?.trust_level || 0,
    badges: user?.badge_count || 0,
    timeRead: Math.floor((user?.time_read || 0) / 3600), // Convert to hours
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleEditProfile = () => {
    router.push('/(profile)/edit-profile' as any);
  };

  const handleSettings = () => {
    router.push('/(profile)/settings' as any);
  };

  const handleBack = () => {
    router.back();
  };

  const getTrustLevelDisplay = (level: number | undefined) => {
    if (level === undefined || level === null) return 'Unknown';
    switch (level) {
      case 0:
        return 'New User';
      case 1:
        return 'Basic User';
      case 2:
        return 'Regular User';
      case 3:
        return 'Leader';
      case 4:
        return 'Elder';
      default:
        return 'Unknown';
    }
  };

  const getTrustLevelColor = (level: number | undefined) => {
    if (level === undefined || level === null) return colors.secondary;
    switch (level) {
      case 0:
        return colors.secondary;
      case 1:
        return colors.primary;
      case 2:
        return colors.success;
      case 3:
        return colors.warning;
      case 4:
        return colors.error;
      default:
        return colors.secondary;
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
      <HeaderBar
        title="Profile"
        showBackButton={true}
        showProfileButton={false}
        onBack={handleBack}
      />
      {!authed ? (
        <View style={styles.notAuthedContainer}>
          <Text style={[styles.notAuthedText, { color: colors.text }]}>
            Please sign in to view your profile
          </Text>
          <TouchableOpacity
            style={[styles.signInButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(auth)/signin')}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading profile...
          </Text>
        </View>
      )}
      </SafeAreaView>
    );
  }

  if ((error || !user) && authed) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <HeaderBar
          title="Profile"
          showBackButton={true}
          showProfileButton={false}
          onBack={handleBack}
        />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            {error ? 'Failed to load profile' : 'No profile data available'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <Text style={[styles.retryText, { color: colors.primary }]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!authed || !user) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <HeaderBar
          title="Profile"
          showBackButton={true}
          showProfileButton={false}
          onBack={handleBack}
        />
        <View style={styles.notAuthedContainer}>
          <Text style={[styles.notAuthedText, { color: colors.text }]}>
            Please sign in to view your profile
          </Text>
          <TouchableOpacity
            style={[styles.signInButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(auth)/signin')}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <HeaderBar
        title="Profile"
        showBackButton={true}
        showProfileButton={false}
        onBack={handleBack}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: colors.card }]}>
          <Image
            source={{
              uri: user.avatar_template
                ? `https://meta.techrebels.info${user.avatar_template.replace('{size}', '150')}`
                : 'https://via.placeholder.com/150',
            }}
            style={styles.avatar}
            accessible
            accessibilityLabel={`${user.name || user.username}'s profile picture`}
          />

          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>
              {user.name || user.username}
            </Text>
            <Text style={[styles.profileUsername, { color: colors.secondary }]}>
              @{user.username}
            </Text>

            <View style={styles.profileMeta}>
              <View style={styles.metaItem}>
                <Calendar size={16} color={colors.secondary} weight="regular" />
                <Text style={[styles.metaText, { color: colors.secondary }]}>
                  Joined{' '}
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : 'Unknown'}
                </Text>
              </View>
            </View>

            <View style={styles.trustLevel}>
              <Crown
                size={16}
                color={getTrustLevelColor(user.trust_level)}
                weight="fill"
              />
              <Text
                style={[
                  styles.trustLevelText,
                  { color: getTrustLevelColor(user.trust_level) },
                ]}
              >
                {getTrustLevelDisplay(user.trust_level)}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <ProfileSection title="Activity">
          <View style={styles.statsGrid}>
            <StatCard
              icon={
                <ChatCircle size={20} color={colors.primary} weight="fill" />
              }
              value={stats.posts}
              label="Posts"
              color={colors.primary}
            />
            <StatCard
              icon={<Hash size={20} color={colors.accent} weight="fill" />}
              value={stats.topics}
              label="Topics"
              color={colors.accent}
            />
            <StatCard
              icon={<Heart size={20} color={colors.error} weight="fill" />}
              value={stats.likes}
              label="Likes"
              color={colors.error}
            />
            <StatCard
              icon={<Users size={20} color={colors.success} weight="fill" />}
              value={stats.followers}
              label="Followers"
              color={colors.success}
            />
            <StatCard
              icon={<Trophy size={20} color={colors.warning} weight="fill" />}
              value={stats.badges}
              label="Badges"
              color={colors.warning}
            />
            <StatCard
              icon={<Star size={20} color={colors.primary} weight="fill" />}
              value={`${stats.timeRead}h`}
              label="Time Read"
              color={colors.primary}
            />
          </View>
        </ProfileSection>

        {/* Actions */}
        <ProfileSection title="Account">
          <ActionButton
            icon={
              <PencilSimple size={24} color={colors.primary} weight="regular" />
            }
            title="Edit Profile"
            subtitle="Update your information and avatar"
            onPress={handleEditProfile}
            color={colors.primary}
          />

          <ActionButton
            icon={<Gear size={24} color={colors.accent} weight="regular" />}
            title="Settings"
            subtitle="Manage your preferences and privacy"
            onPress={handleSettings}
            color={colors.accent}
          />

          <ActionButton
            icon={<Bell size={24} color={colors.warning} weight="regular" />}
            title="Notification Preferences"
            subtitle="Control what you're notified about"
            onPress={() => console.log('Open notification preferences')}
            color={colors.warning}
          />

          <ActionButton
            icon={<Eye size={24} color={colors.success} weight="regular" />}
            title="Privacy Settings"
            subtitle="Manage your privacy and visibility"
            onPress={() => console.log('Open privacy settings')}
            color={colors.success}
          />
        </ProfileSection>

        {/* Account Info */}
        <ProfileSection title="Account Information">
          <View
            style={[
              styles.infoCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.secondary }]}>
                Email
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {user.email || 'Not available'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.secondary }]}>
                Trust Level
              </Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: getTrustLevelColor(user.trust_level) },
                ]}
              >
                {getTrustLevelDisplay(user.trust_level)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.secondary }]}>
                Member Since
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : 'Unknown'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.secondary }]}>
                Last Seen
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {user.last_seen_at
                  ? new Date(user.last_seen_at).toLocaleDateString()
                  : 'Unknown'}
              </Text>
            </View>
          </View>
        </ProfileSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  profileHeader: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  profileBio: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  profileMeta: {
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    fontWeight: '500',
  },
  trustLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustLevelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    marginHorizontal: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 16,
    gap: 12,
  },
  statCard: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  actionChevron: {
    fontSize: 18,
    fontWeight: '600',
  },
  infoCard: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  notAuthedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  notAuthedText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  signInButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
