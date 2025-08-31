import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../shared/theme-provider';
import { Heart, ChatCircle, BookmarkSimple } from 'phosphor-react-native';
import { CommentItem, Comment } from './CommentItem';
import { NewCommentInput } from './NewCommentInput';
import { HeaderBar } from '../nav/HeaderBar';
import { useTopic } from '../../hooks';
import { useLocalSearchParams } from 'expo-router';

export interface ByteBlogPageProps {
  author: {
    name: string;
    avatar: string;
  };
  teretTitle: string;
  title: string;
  content: Array<{ type: 'heading' | 'paragraph'; text: string }>;
  coverImage?: string;
  likes: number;
  comments: number;
  isBookmarked?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  initialCommentsVisible?: boolean;
}

// UI Spec: ByteBlogPage — Blog-style Byte details page with author, title, content, cover image, and action bar. Themed and accessible.
export function ByteBlogPage({
  author,
  teretTitle,
  title,
  content,
  coverImage,
  likes,
  comments,
  isBookmarked,
  onLike,
  onComment,
  onShare,
  onBookmark,
  initialCommentsVisible = false,
}: ByteBlogPageProps) {
  const { isDark, isAmoled } = useTheme();
  const [isCommentsVisible, setIsCommentsVisible] = useState(initialCommentsVisible);
  const flatListRef = useRef<import('react-native').FlatList>(null);
  
  // Get topic ID from route params and fetch real data
  const { byteId } = useLocalSearchParams<{ byteId: string }>();
  const topicId = parseInt(byteId || '1', 10);
  const { data: topicData, isLoading, error } = useTopic(topicId);
  
  // Use real topic data if available, fallback to props
  const realTitle = topicData?.post_stream?.posts[0]?.topic_title || title;
  const realAuthor = topicData?.post_stream?.posts[0] ? {
    name: topicData.post_stream.posts[0].username,
    avatar: `https://meta.techrebels.info${topicData.post_stream.posts[0].avatar_template.replace('{size}', '150')}`,
  } : author;
  const realContent = topicData?.post_stream?.posts[0]?.cooked ? [
    { type: 'paragraph' as const, text: topicData.post_stream.posts[0].cooked.replace(/<[^>]*>/g, '') }
  ] : content;
  const realComments = topicData?.post_stream?.posts?.length ? topicData.post_stream.posts.length - 1 : comments;
  const colors = {
    background: isAmoled ? '#000000' : (isDark ? '#18181b' : '#fff'),
    card: isAmoled ? '#000000' : (isDark ? '#23232b' : '#f8fafc'),
    text: isDark ? '#f4f4f5' : '#17131B',
    secondary: isDark ? '#a1a1aa' : '#5C5D67',
    accent: isDark ? '#38bdf8' : '#0ea5e9',
    topic: isDark ? '#a1a1aa' : '#5C5D67',
    heading: isDark ? '#f4f4f5' : '#17131B',
    action: isDark ? '#a1a1aa' : '#17131B',
    divider: isDark ? '#23232b' : '#e2e8f0',
  };

  // Mock comments data for now
  const mockComments: Comment[] = [
    {
      id: '1',
      author: { name: 'Alice', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
      content: 'This is a great Byte! Really enjoyed reading it.',
      createdAt: '2h ago',
      likes: 3,
    },
    {
      id: '2',
      author: { name: 'Bob', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
      content: 'Thanks for sharing your thoughts.',
      createdAt: '1h ago',
      likes: 1,
      parentId: '1',
    },
    {
      id: '3',
      author: { name: 'Charlie', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
      content: 'I have a question about the second paragraph.',
      createdAt: '45m ago',
      likes: 0,
    },
  ];

  // Group comments: parents and their direct replies
  const parents = mockComments.filter(c => !c.parentId);
  const replies = mockComments.filter(c => c.parentId);
  function getReplies(parentId: string) {
    return replies.filter(r => r.parentId === parentId);
  }

  // Compose a flat list of items: parent, then its replies indented
  const commentList = parents.flatMap(parent => [
    { ...parent, isReply: false },
    ...getReplies(parent.id).map(reply => ({ ...reply, isReply: true })),
  ]);

  // Scroll to comments on mount if initialCommentsVisible is true
  useEffect(() => {
    if (initialCommentsVisible && flatListRef.current) {
      // Wait for the FlatList to render
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: 0, animated: true });
      }, 350);
    }
  }, [initialCommentsVisible]);

  // Show loading state
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <HeaderBar title="Loading..." showBackButton={true} showProfileButton={true} />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.secondary }]}>
            Loading topic...
          </Text>
        </View>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <HeaderBar title="Error" showBackButton={true} showProfileButton={true} />
        <View style={styles.errorContent}>
          <Text style={[styles.errorText, { color: '#ef4444' }]}>
            Failed to load topic
          </Text>
          <Text style={[styles.errorSubtext, { color: colors.secondary }]}>
            {error.message}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      ref={flatListRef}
      data={isCommentsVisible ? commentList : []}
      keyExtractor={item => item.id}
      ListHeaderComponent={
        <View style={[styles.headerContainer, { backgroundColor: colors.background }]}> 
          {/* HeaderBar */}
          <HeaderBar 
            title={realTitle} 
            showBackButton={true}
            showProfileButton={true}
          />
          
          {/* Author & Teret Title */}
          <View style={styles.authorRow}>
            <Image source={{ uri: realAuthor.avatar }} style={styles.avatar} accessibilityLabel={`${realAuthor.name}'s avatar`} />
            <View style={styles.authorInfo}>
              <Text style={[styles.authorName, { color: colors.text }]}>{realAuthor.name}</Text>
              <Text style={[styles.teret, { color: colors.topic }]}>{teretTitle}</Text>
            </View>
          </View>
          {/* Cover Image */}
          {coverImage && (
            <Image source={{ uri: coverImage }} style={styles.coverImage} resizeMode="cover" accessibilityLabel="Cover image" />
          )}
          {/* Title */}
          <Text style={[styles.title, { color: colors.heading }]}>{realTitle}</Text>
          {/* Content */}
          <View style={styles.contentBlock}>
            {realContent.map((block, idx) =>
              block.type === 'heading' ? (
                <Text key={idx} style={[styles.heading, { color: colors.heading }]}>{block.text}</Text>
              ) : (
                <Text key={idx} style={[styles.paragraph, { color: colors.secondary }]}>{block.text}</Text>
              )
            )}
          </View>
          {/* Action Bar */}
          <View style={[styles.actionBar, { borderTopColor: colors.divider }]}> 
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onLike}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Like"
            >
              <Heart size={24} weight={likes > 0 ? 'fill' : 'regular'} color={colors.action} />
              <Text style={[styles.actionText, { color: colors.action }]}>{likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setIsCommentsVisible(v => !v)}
              accessible
              accessibilityRole="button"
              accessibilityLabel={isCommentsVisible ? 'Hide comments' : 'Show comments'}
              accessibilityHint={isCommentsVisible ? 'Hides the comment section' : 'Shows the comment section'}
            >
              <ChatCircle size={24} weight={isCommentsVisible ? 'fill' : 'regular'} color={colors.action} />
              <Text style={[styles.actionText, { color: colors.action }]}>{realComments}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onBookmark}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Bookmark"
            >
              <BookmarkSimple size={24} weight={isBookmarked ? 'fill' : 'regular'} color={colors.action} />
            </TouchableOpacity>
          </View>
        </View>
      }
      renderItem={isCommentsVisible ? ({ item }) => (
        <CommentItem comment={item} isReply={item.isReply} />
      ) : undefined}
      ListFooterComponent={isCommentsVisible ? <NewCommentInput onSend={() => {}} /> : null}
      contentContainerStyle={{ paddingBottom: 32, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  topic: {
    fontSize: 14,
    fontWeight: '400',
  },
  teret: {
    fontSize: 13,
    fontWeight: '500',
  },
  coverImage: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  contentBlock: {
    marginBottom: 32,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 16,
  },
  paragraph: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 26,
    marginBottom: 12,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 16,
    marginTop: 8,
    paddingBottom: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 15,
    marginLeft: 6,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
  },
  errorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6b7280',
  },
}); 