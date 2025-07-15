import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../components/shared/theme-provider';
import { HeaderBar } from '../../components/nav';
import { ByteBlogPage } from '../../components/feed/ByteBlogPage';

const mockByte = {
  id: '1',
  content: 'Just discovered this amazing new feature! The possibilities are endless. #innovation #tech',
  author: {
    name: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face',
  },
  likes: 42,
  comments: 8,
  tags: ['innovation', 'tech'],
  timestamp: '2h ago',
  commentsList: [
    { id: 'c1', author: 'Jane', content: 'Awesome!', timestamp: '1h ago' },
    { id: 'c2', author: 'Sam', content: 'Congrats!', timestamp: '30m ago' },
  ],
};

export default function ByteDetailsScreen() {
  const { isDark } = useTheme();
  const colors = {
    background: isDark ? '#18181b' : '#fff',
    card: isDark ? '#27272a' : '#f1f5f9',
    text: isDark ? '#f4f4f5' : '#1e293b',
    secondary: isDark ? '#a1a1aa' : '#64748b',
    accent: isDark ? '#38bdf8' : '#0ea5e9',
    tagBg: isDark ? '#334155' : '#e0f2fe',
    tagText: isDark ? '#38bdf8' : '#0284c7',
    divider: isDark ? '#334155' : '#e2e8f0',
    commentAuthor: isDark ? '#38bdf8' : '#0ea5e9',
    commentCard: isDark ? '#18181b' : '#f1f5f9',
    timestamp: isDark ? '#a1a1aa' : '#94a3b8',
  };
  const { byteId, openComments } = useLocalSearchParams();
  // In a real app, fetch the byte by ID
  const byte = mockByte;

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar
        title="Byte"
        leftIcon={undefined}
        onLeftPress={handleBack}
        leftA11yLabel="Back"
        style={{ marginBottom: 4 }}
      />
      <ByteBlogPage
        author={byte.author}
        teretTitle={"UX"}
        title={"Why UX Design Is More Important Than UI Design."}
        content={[
          { type: 'paragraph', text: 'User experience (UX) design is the process design teams use to create products that provide meaningful and relevant experiences to users. This involves the design of the entire process of acquiring and integrating the product, including aspects of branding, design, usability and function.' },
          { type: 'heading', text: 'User Experiences Design!' },
          { type: 'paragraph', text: 'User experience design is the process designers use to build products that provide great experiences to their users. UX design refers to feelings and emotions users experience when interacting with a product.' },
        ]}
        coverImage={"https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800"}
        likes={byte.likes}
        comments={byte.comments}
        isBookmarked={false}
        onLike={() => {}}
        onComment={() => {}}
        onShare={() => {}}
        onBookmark={() => {}}
        initialCommentsVisible={openComments === 'true'}
      />
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
  headerPlaceholder: {
    width: 40,
  },
  content: {
    padding: 20,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
  },
  contentText: {
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 16,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statText: {
    fontSize: 16,
    marginRight: 24,
  },
  commentsSection: {
    marginTop: 20,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  commentCard: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentContent: {
    fontSize: 16,
    marginBottom: 4,
  },
  commentTimestamp: {
    fontSize: 12,
  },
});

