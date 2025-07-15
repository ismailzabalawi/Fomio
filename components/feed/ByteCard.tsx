import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { useTheme } from '../shared/theme-provider';
import { Heart, ChatCircle, BookmarkSimple } from 'phosphor-react-native';

export interface ByteCardProps {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  tags: string[];
  timestamp: string;
  onPress?: (id: string) => void;
  onLike?: (id: string) => void;
  onComment?: (id: string) => void;
  onBookmark?: (id: string) => void;
  style?: ViewStyle;
  isBookmarked?: boolean;
}

// UI Spec: ByteCard — Renders a single Byte with author, content, tags, and actions. Touch targets are padded. Theming is respected. All actions are accessible.
export function ByteCard({
  id,
  content,
  author,
  likes: initialLikes,
  comments,
  tags,
  timestamp,
  onPress,
  onLike,
  onComment,
  onBookmark,
  style,
  isBookmarked,
}: ByteCardProps) {
  const { isDark } = useTheme();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const colors = {
    background: isDark ? '#18181b' : '#fff',
    text: isDark ? '#f4f4f5' : '#18181b',
    secondary: isDark ? '#a1a1aa' : '#64748b',
    cardShadow: isDark ? '#000' : '#000',
    tag: isDark ? '#27272a' : '#e0e7ef',
    accent: isDark ? '#38bdf8' : '#0ea5e9',
  };

  function handleLike() {
    setLiked((prev) => {
      const newLiked = !prev;
      setLikes((l) => l + (newLiked ? 1 : -1));
      onLike?.(id);
      return newLiked;
    });
  }

  return (
    <TouchableOpacity
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Open Byte by ${author.name}`}
      onPress={() => onPress?.(id)}
      style={[styles.card, { backgroundColor: colors.background, shadowColor: colors.cardShadow }, style]}
      activeOpacity={0.85}
    >
      <View style={{ flex: 1, justifyContent: 'space-between', minHeight: 160 }}>
        <View>
          <View style={styles.header}>
            <Image source={{ uri: author.avatar }} style={styles.avatar} accessibilityLabel={`${author.name}'s avatar`} />
            <View style={styles.authorInfo}>
              <Text style={[styles.authorName, { color: colors.text }]}>{author.name}</Text>
              <Text style={[styles.timestamp, { color: colors.secondary }]}>{timestamp}</Text>
            </View>
          </View>
          <Text style={[styles.content, { color: colors.text }]}>{content}</Text>
          <View style={styles.tagsContainer}>
            {tags.map((tag) => (
              <Text key={tag} style={[styles.tag, { backgroundColor: colors.tag, color: colors.secondary }]}>#{tag}</Text>
            ))}
          </View>
        </View>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLike}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Like Byte"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Heart size={20} weight={liked ? 'fill' : 'regular'} color={liked ? colors.accent || '#0ea5e9' : colors.secondary} />
            <Text style={[styles.actionText, { color: liked ? colors.accent || '#0ea5e9' : colors.secondary }]}>{likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onComment?.(id)}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Comment on Byte"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ChatCircle size={20} weight="regular" color={colors.secondary} />
            <Text style={[styles.actionText, { color: colors.secondary }]}>{comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onBookmark?.(id)}
            accessible
            accessibilityRole="button"
            accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Bookmark Byte'}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <BookmarkSimple size={20} weight={isBookmarked ? 'fill' : 'regular'} color={colors.secondary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'column',
    minHeight: 160,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  } as ViewStyle,
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  } as ImageStyle,
  authorInfo: {
    flexDirection: 'column',
  } as ViewStyle,
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
  } as TextStyle,
  timestamp: {
    fontSize: 12,
    marginTop: 2,
  } as TextStyle,
  content: {
    fontSize: 15,
    marginBottom: 8,
  } as TextStyle,
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  } as ViewStyle,
  tag: {
    fontSize: 12,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 4,
    overflow: 'hidden',
  } as TextStyle,
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  } as ViewStyle,
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 2,
  } as ViewStyle,
  actionText: {
    fontSize: 15,
    marginLeft: 6,
    fontWeight: '500',
  } as TextStyle,
}); 