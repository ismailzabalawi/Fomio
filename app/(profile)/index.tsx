import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '../../components/shared/theme-provider';
import { HeaderBar } from '../../components/nav';
import { GearSix } from 'phosphor-react-native';

const user = {
  name: 'John Doe',
  username: '@johndoe',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  bio: 'Software developer and coffee enthusiast. Building amazing things with code.',
  followers: 1234,
  following: 567,
  posts: 89,
};

const recentPosts = [
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
  const colors = {
    background: isDark ? '#18181b' : '#fff',
    card: isDark ? '#27272a' : '#f8fafc',
    text: isDark ? '#f4f4f5' : '#1e293b',
    secondary: isDark ? '#a1a1aa' : '#64748b',
    accent: isDark ? '#38bdf8' : '#0ea5e9',
    border: isDark ? '#334155' : '#0ea5e9',
    divider: isDark ? '#334155' : '#e2e8f0',
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
    // TODO: Navigate to settings
    console.log('Settings');
  };

  const handleEditProfile = () => {
    // TODO: Navigate to edit profile
    console.log('Edit Profile');
  };

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

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={styles.profileInfo}>
              <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
              <Text style={[styles.username, { color: colors.username }]}>{user.username}</Text>
            </View>
          </View>

          <Text style={[styles.bio, { color: colors.bio }]}>{user.bio}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.statNumber }]}>{user.posts}</Text>
              <Text style={[styles.statLabel, { color: colors.statLabel }]}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.statNumber }]}>{user.followers}</Text>
              <Text style={[styles.statLabel, { color: colors.statLabel }]}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.statNumber }]}>{user.following}</Text>
              <Text style={[styles.statLabel, { color: colors.statLabel }]}>Following</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.editButton, { borderColor: colors.accent, backgroundColor: colors.editButton }]}
            onPress={handleEditProfile}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Edit Profile"
            accessibilityHint="Edit your profile information"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={[styles.editButtonText, { color: colors.accent }]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.postsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Posts</Text>
          {recentPosts.map((post) => (
            <View key={post.id} style={[styles.postCard, { backgroundColor: colors.card }]}>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
  },
  headerButtonText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 16,
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
  editButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  postsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
});

