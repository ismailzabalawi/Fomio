import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, Pressable } from 'react-native';
import { Avatar } from '../ui/avatar';
import { Heart, ChatCircle, BookmarkSimple } from 'phosphor-react-native';

export interface ByteCardProps {
  id: string;
  content: string;
  teretName: string;
  author: {
    name: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  timestamp: string;
  isLiked: boolean;
  isBookmarked?: boolean;
  onPress: () => void;
  onLike: () => void;
  onComment: () => void;
  onBookmark?: () => void;
  onTeretPress?: () => void;
  style?: any;
}

// UI Spec: ByteCard — Renders a single Byte with author, content, tags, and actions. Touch targets are padded. Theming is respected. All actions are accessible.
export function ByteCard({
  id,
  content,
  teretName,
  author,
  likes,
  comments,
  timestamp,
  isLiked,
  isBookmarked,
  onPress,
  onLike,
  onComment,
  onBookmark,
  onTeretPress,
  style,
}: ByteCardProps) {
  const [pressed, setPressed] = useState<number | null>(null);
  // 0: like, 1: comment, 2: bookmark
  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.93}>
      {/* Author info */}
      <View style={styles.authorRow}>
        <Avatar source={{ uri: author.avatar }} size="sm" />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{author.name}</Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
      </View>
      {/* Content */}
      <Text style={styles.content}>{content}</Text>
      {/* Teret badge (instead of hashtags) */}
      <TouchableOpacity style={styles.teretBadge} onPress={onTeretPress} accessible accessibilityRole="button" accessibilityLabel={`View all bytes in ${teretName}`}>
        <Text style={styles.teretText}>in {teretName}</Text>
      </TouchableOpacity>
      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        <Pressable
          onPress={onLike}
          onPressIn={() => setPressed(0)}
          onPressOut={() => setPressed(null)}
          android_ripple={{ color: '#e0e7ef', borderless: false }}
          style={({ pressed: isPressed }) => [
            styles.actionButton,
            (pressed === 0 || isPressed) && styles.actionButtonPressed,
          ]}
          accessible accessibilityRole="button" accessibilityLabel={isLiked ? 'Unlike' : 'Like'}
        >
          <Heart size={22} weight={isLiked ? 'fill' : 'regular'} color={pressed === 0 ? '#0ea5e9' : isLiked ? '#0ea5e9' : '#64748b'} />
          <Text style={[styles.actionCount, pressed === 0 && { color: '#0ea5e9' }]}>{likes}</Text>
        </Pressable>
        <Pressable
          onPress={onComment}
          onPressIn={() => setPressed(1)}
          onPressOut={() => setPressed(null)}
          android_ripple={{ color: '#e0e7ef', borderless: false }}
          style={({ pressed: isPressed }) => [
            styles.actionButton,
            (pressed === 1 || isPressed) && styles.actionButtonPressed,
          ]}
          accessible accessibilityRole="button" accessibilityLabel="Comment"
        >
          <ChatCircle size={22} weight="regular" color={pressed === 1 ? '#0ea5e9' : '#64748b'} />
          <Text style={[styles.actionCount, pressed === 1 && { color: '#0ea5e9' }]}>{comments}</Text>
        </Pressable>
        <Pressable
          onPress={onBookmark}
          onPressIn={() => setPressed(2)}
          onPressOut={() => setPressed(null)}
          android_ripple={{ color: '#e0e7ef', borderless: false }}
          style={({ pressed: isPressed }) => [
            styles.actionButton,
            (pressed === 2 || isPressed) && styles.actionButtonPressed,
          ]}
          accessible accessibilityRole="button" accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
        >
          <BookmarkSimple size={22} weight={isBookmarked ? 'fill' : 'regular'} color={pressed === 2 ? '#0ea5e9' : isBookmarked ? '#0ea5e9' : '#64748b'} />
        </Pressable>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
    minHeight: 180,
  } as ViewStyle,
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  } as ViewStyle,
  authorInfo: {
    marginLeft: 12,
  } as ViewStyle,
  authorName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#18181b',
  } as TextStyle,
  timestamp: {
    fontSize: 12,
    color: '#64748b',
  } as TextStyle,
  content: {
    fontSize: 16,
    color: '#18181b',
    marginBottom: 8,
  } as TextStyle,
  teretBadge: {
    backgroundColor: '#e0e7ef',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  } as ViewStyle,
  teretText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#18181b',
  } as TextStyle,
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 10,
    marginTop: 16,
    marginHorizontal: -16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  } as ViewStyle,
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  } as ViewStyle,
  actionButtonPressed: {
    backgroundColor: '#e0e7ef',
  } as ViewStyle,
  actionCount: {
    fontSize: 15,
    marginLeft: 6,
    fontWeight: '500',
    color: '#18181b',
  } as TextStyle,
}); 