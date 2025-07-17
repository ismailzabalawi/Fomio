import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '../../components/shared/theme-provider';
import { useDiscourseUser } from '../../shared/useDiscourseUser';
import { HeaderBar } from '../../components/nav';
import { Avatar } from '../../components/ui/avatar';
import { GearSix, PencilSimple } from 'phosphor-react-native';

const mockRecentPosts = [
  {
    id: '1',
    content: 'Just finished a great coding session! 🚀',
    likes: 42,
    comments: 8,
    timestamp: '2h ago',
  },
  {
    id: '2',
    content: 'Beautiful sunset from my evening walk. Sometimes the simple moments are the most meaningful. 🌅',
    likes: 67,
    comments: 12,
    timestamp: '1d ago',
  },
];

export default function ProfileScreen() {
  const { isDark } = useTheme();
  const { 
    user, 
    loading, 
    error, 
    avatarUrl,
    isAuthenticated 
  } = useDiscourseUser();

  const colors = {
    background: isDark ? '#09090b' : '#f8fafc',
    cardBackground: isDark ? '#18181b' : '#fff',
    text: isDark ? '#f4f4f5' : '#1e293b',
    secondary: isDark ? '#a1a1aa' : '#64748b',
    accent: isDark ? '#38bdf8' : '#0ea5e9',
    border: isDark ? '#27272a' : '#e4e4e7',
    username: isDark ? '#a1a1aa' : '#64748b',
    bio: isDark ? '#a1a1aa' : '#475569',
    statLabel: isDark ? '#a1a1aa' : '#64748b',
    statNumber: isDark ? '#f4f4f5' : '#1e293b',
    timestamp: isDark ? '#a1a1aa' : '#94a3b8',
    editButton: isDark ? '#18181b' : 'transparent',
  };

  const handleBack = () => {
    router.back();
  };

  const handleSettings = () => {
    router.push('/(profile)/settings' as any);
  };

  const handleEditProfile = () => {
    router.push('/(profile)/edit-profile' as any);
  };

  // Show loading state
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <HeaderBar
          title="Profile"
          leftIcon={undefined}
          onLeftPress={handleBack}
          leftA11yLabel="Back"
          rightIcon={<GearSix size={28} weight="bold" />}
          onRightPress={handleSettings}
          rightA11yLabel="Settings"
          style={{ marginBottom: 4 }}
        />
        <View style={[styles.centered, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error || !isAuthenticated) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <HeaderBar
          title="Profile"
          leftIcon={undefined}
          onLeftPress={handleBack}
          leftA11yLabel="Back"
          rightIcon={<GearSix size={28} weight="bold" />}
          onRightPress={handleSettings}
          rightA11yLabel="Settings"
          style={{ marginBottom: 4 }}
        />
        <View style={[styles.centered, { backgroundColor: colors.background }]}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            {error || 'Please sign in to view your profile'}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.accent }]}
            onPress={() => router.replace('/(auth)/signin' as any)}
          >
            <Text style={styles.retryButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Show profile content
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar
        title="Profile"
        leftIcon={undefined}
        onLeftPress={handleBack}
        leftA11yLabel="Back"
        style={{ marginBottom: 4 }}
      />

      <ScrollView style={styles.content}>
        <View style={[styles.profileSection, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.profileHeader}>
            <Avatar
              source={avatarUrl ? { uri: avatarUrl } : undefined}
              fallback={user?.username?.charAt(0).toUpperCase() || 'U'}
              size="xl"
            />
            <View style={styles.profileInfo}>
              <Text style={[styles.name, { color: colors.text }]}>
                {user?.name || user?.username || 'Unknown User'}
              </Text>
              <Text style={[styles.username, { color: colors.username }]}>
                @{user?.username || 'unknown'}
              </Text>
              {user?.trust_level !== undefined && (
                <Text style={[styles.trustLevel, { color: colors.accent }]}>
                  Trust Level {user.trust_level}
                </Text>
              )}
            </View>
          </View>

          {user?.bio_raw && (
            <Text style={[styles.bio, { color: colors.bio }]}>{user.bio_raw}</Text>
          )}

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.statNumber }]}>
                {user?.post_count || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.statLabel }]}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.statNumber }]}>
                {user?.topic_count || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.statLabel }]}>Topics</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.statNumber }]}>
                {user?.likes_received || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.statLabel }]}>Likes</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.editButton, { borderColor: colors.accent, backgroundColor: colors.editButton }]}
              onPress={handleEditProfile}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Edit Profile"
              accessibilityHint="Edit your profile information"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <PencilSimple size={16} color={colors.accent} style={styles.buttonIcon} />
              <Text style={[styles.editButtonText, { color: colors.accent }]}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Additional User Info */}
          {(user?.location || user?.website) && (
            <View style={styles.additionalInfo}>
              {user.location && (
                <Text style={[styles.infoText, { color: colors.secondary }]}>
                  📍 {user.location}
                </Text>
              )}
              {user.website && (
                <Text style={[styles.infoText, { color: colors.accent }]}>
                  🌐 {user.website}
                </Text>
              )}
            </View>
          )}

          {/* Account Stats */}
          <View style={styles.accountStats}>
            <View style={styles.statRow}>
              <Text style={[styles.statRowLabel, { color: colors.secondary }]}>Likes Given:</Text>
              <Text style={[styles.statRowValue, { color: colors.text }]}>
                {user?.likes_given || 0}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={[styles.statRowLabel, { color: colors.secondary }]}>Days Visited:</Text>
              <Text style={[styles.statRowValue, { color: colors.text }]}>
                {user?.days_visited || 0}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={[styles.statRowLabel, { color: colors.secondary }]}>Member Since:</Text>
              <Text style={[styles.statRowValue, { color: colors.text }]}>
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
              </Text>
            </View>
          </View>
        </View>

        {/* Recent Posts Section (Mock data for now) */}
        <View style={[styles.postsSection, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.secondary }]}>
            Your recent posts and interactions will appear here
          </Text>
          
          {mockRecentPosts.map((post) => (
            <View key={post.id} style={[styles.postCard, { backgroundColor: colors.background }]}>
              <Text style={[styles.postContent, { color: colors.text }]}>{post.content}</Text>
              <View style={styles.postActions}>
                <View style={styles.actionItem}>
                  <Text style={[styles.actionText, { color: colors.secondary }]}>❤️ {post.likes}</Text>
                </View>
                <View style={styles.actionItem}>
                  <Text style={[styles.actionText, { color: colors.secondary }]}>💬 {post.comments}</Text>
                </View>
                <Text style={[styles.timestamp, { color: colors.timestamp }]}>{post.timestamp}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    padding: 24,
    marginBottom: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    marginBottom: 4,
  },
  trustLevel: {
    fontSize: 12,
    fontWeight: '600',
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  editButton: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  buttonIcon: {
    marginRight: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  additionalInfo: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
  },
  accountStats: {
    borderTopWidth: 1,
    borderTopColor: '#e4e4e7',
    paddingTop: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statRowLabel: {
    fontSize: 14,
  },
  statRowValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  postsSection: {
    padding: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  postCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionItem: {
    marginRight: 16,
  },
  actionText: {
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    marginLeft: 'auto',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

