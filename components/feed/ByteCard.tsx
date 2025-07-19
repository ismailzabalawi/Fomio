import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, Pressable } from 'react-native';
import { Avatar } from '../ui/avatar';
import { Heart, ChatCircle, BookmarkSimple, DotsThree, Share } from 'phosphor-react-native';
import { useTheme } from '../../components/shared/theme-provider';

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
  onShare?: () => void;
  onMore?: () => void;
  style?: ViewStyle;
}

// UI Spec: Modern ByteCard — Clean, spacious design with subtle shadows, smooth interactions, and clear visual hierarchy. 
// Follows Fomio's design language of clarity and minimalism while maintaining rich functionality.
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
  onShare,
  onMore,
  style,
}: ByteCardProps) {
  const { isDark, isAmoled } = useTheme();
  const [pressed, setPressed] = useState<number | null>(null);
  
  const colors = {
    background: isAmoled ? '#000000' : (isDark ? '#1f2937' : '#ffffff'),
    card: isAmoled ? '#000000' : (isDark ? '#374151' : '#ffffff'),
    text: isDark ? '#f9fafb' : '#111827',
    secondary: isDark ? '#9ca3af' : '#6b7280',
    accent: isDark ? '#3b82f6' : '#0ea5e9',
    border: isAmoled ? '#000000' : (isDark ? '#4b5563' : '#e5e7eb'),
    teretBg: isDark ? '#1e40af' : '#dbeafe',
    teretText: isDark ? '#93c5fd' : '#1e40af',
    actionBg: isAmoled ? '#000000' : (isDark ? '#374151' : '#f9fafb'),
    pressed: isAmoled ? '#1a1a1a' : (isDark ? '#4b5563' : '#f3f4f6'),
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, style]} 
      onPress={onPress} 
      activeOpacity={0.95}
    >
      {/* Header with Author Info */}
      <View style={styles.header}>
        <View style={styles.authorSection}>
          <Avatar source={{ uri: author.avatar }} size="md" />
          <View style={styles.authorInfo}>
            <Text style={[styles.authorName, { color: colors.text }]}>{author.name}</Text>
            <Text style={[styles.timestamp, { color: colors.secondary }]}>{timestamp}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.moreButton} 
          onPress={onMore}
          accessible
          accessibilityRole="button"
          accessibilityLabel="More options"
        >
          <DotsThree size={20} weight="bold" color={colors.secondary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.contentSection}>
        <Text style={[styles.content, { color: colors.text }]} numberOfLines={6}>
          {content}
        </Text>
      </View>

      {/* Teret Badge */}
      <TouchableOpacity 
        style={[styles.teretBadge, { backgroundColor: colors.teretBg }]} 
        onPress={onTeretPress}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`View all bytes in ${teretName}`}
      >
        <Text style={[styles.teretText, { color: colors.teretText }]}>
          in {teretName}
        </Text>
      </TouchableOpacity>

      {/* Action Bar */}
      <View style={[styles.actionBar, { backgroundColor: colors.actionBg, borderTopColor: colors.border }]}>
        <Pressable
          onPress={onLike}
          onPressIn={() => setPressed(0)}
          onPressOut={() => setPressed(null)}
          style={({ pressed: isPressed }) => [
            styles.actionButton,
            (pressed === 0 || isPressed) && { backgroundColor: colors.pressed },
          ]}
          accessible
          accessibilityRole="button"
          accessibilityLabel={isLiked ? 'Unlike' : 'Like'}
        >
          <Heart 
            size={20} 
            weight={isLiked ? 'fill' : 'regular'} 
            color={isLiked ? colors.accent : colors.secondary} 
          />
          <Text style={[
            styles.actionCount, 
            { color: isLiked ? colors.accent : colors.secondary }
          ]}>
            {likes > 0 ? likes : ''}
          </Text>
        </Pressable>

        <Pressable
          onPress={onComment}
          onPressIn={() => setPressed(1)}
          onPressOut={() => setPressed(null)}
          style={({ pressed: isPressed }) => [
            styles.actionButton,
            (pressed === 1 || isPressed) && { backgroundColor: colors.pressed },
          ]}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Comment"
        >
          <ChatCircle size={20} weight="regular" color={colors.secondary} />
          <Text style={[styles.actionCount, { color: colors.secondary }]}>
            {comments > 0 ? comments : ''}
          </Text>
        </Pressable>

        <Pressable
          onPress={onShare}
          onPressIn={() => setPressed(2)}
          onPressOut={() => setPressed(null)}
          style={({ pressed: isPressed }) => [
            styles.actionButton,
            (pressed === 2 || isPressed) && { backgroundColor: colors.pressed },
          ]}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Share"
        >
          <Share size={20} weight="regular" color={colors.secondary} />
        </Pressable>

        <Pressable
          onPress={onBookmark}
          onPressIn={() => setPressed(3)}
          onPressOut={() => setPressed(null)}
          style={({ pressed: isPressed }) => [
            styles.actionButton,
            (pressed === 3 || isPressed) && { backgroundColor: colors.pressed },
          ]}
          accessible
          accessibilityRole="button"
          accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
        >
          <BookmarkSimple 
            size={20} 
            weight={isBookmarked ? 'fill' : 'regular'} 
            color={isBookmarked ? colors.accent : colors.secondary} 
          />
        </Pressable>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  } as ViewStyle,
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 12,
  } as ViewStyle,
  
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  } as ViewStyle,
  
  authorInfo: {
    marginLeft: 12,
    flex: 1,
  } as ViewStyle,
  
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  } as TextStyle,
  
  timestamp: {
    fontSize: 13,
    fontWeight: '400',
  } as TextStyle,
  
  moreButton: {
    padding: 8,
    borderRadius: 8,
  } as ViewStyle,
  
  contentSection: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  } as ViewStyle,
  
  content: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  } as TextStyle,
  
  teretBadge: {
    alignSelf: 'flex-start',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  } as ViewStyle,
  
  teretText: {
    fontSize: 13,
    fontWeight: '600',
  } as TextStyle,
  
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
  } as ViewStyle,
  
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 44,
    justifyContent: 'center',
  } as ViewStyle,
  
  actionCount: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  } as TextStyle,
}); 