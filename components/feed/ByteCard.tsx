import React, { useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Pressable,
  Animated,
  useWindowDimensions,
  Dimensions,
  Alert,
} from 'react-native';
import { Avatar } from '../ui/avatar';
import {
  Heart,
  ChatCircle,
  BookmarkSimple,
  DotsThree,
  Share,
  ArrowUp,
  Clock,
  User,
  Sparkle,
} from 'phosphor-react-native';
import { useTheme } from '../../components/shared/theme-provider';
import {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  BORDER_RADIUS,
  SHADOWS,
} from '../../shared/theme-constants';
import {
  useBffLikePost,
  useBffBookmarkPost,
} from '../../hooks/useBffMutations';
import { useBffAuth } from '../shared/bff-auth-provider';

export interface ByteCardProps {
  id: string;
  title: string;
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
  onAuthorPress?: () => void;
  style?: ViewStyle;
}

// UI Spec: Redesigned ByteCard — Modern, engaging feed experience with enhanced visual hierarchy,
// smooth animations, and improved accessibility. Follows Fomio's design language for seamless UX.
export const ByteCard = memo<ByteCardProps>(
  ({
    id,
    title,
    content,
    teretName,
    author,
    likes,
    comments,
    timestamp,
    isLiked,
    isBookmarked = false,
    onPress,
    onLike,
    onComment,
    onBookmark,
    onTeretPress,
    onShare,
    onMore,
    onAuthorPress,
    style,
  }) => {
    const { isDark, isAmoled } = useTheme();
    const { width } = useWindowDimensions();
    const [pressed, setPressed] = useState<number | null>(null);

    // Enhanced animation states for delightful interactions
    const [likeAnimation] = useState(new Animated.Value(1));
    const [cardScale] = useState(new Animated.Value(1));
    const [teretBadgeScale] = useState(new Animated.Value(1));

    // Get theme colors from centralized system
    const colors = getThemeColors(isDark, isAmoled);

    // Use BFF interactions and authentication
    const { isAuthenticated, user } = useBffAuth();

    // Get mutation functions and states
    const likeMutation = useBffLikePost();
    const bookmarkMutation = useBffBookmarkPost();

    // Extract loading states from BFF mutations
    const isLiking = likeMutation.isPending;
    const isBookmarking = bookmarkMutation.isPending;

    // Enhanced like animation with bounce effect and real API call
    const handleLike = useCallback(() => {
      if (!isAuthenticated) {
        // Show authentication required message
        Alert.alert('Authentication Required', 'Please sign in to like posts');
        return;
      }

      // Call the original onLike for any local state updates
      onLike();

      // Animate the like button
      Animated.sequence([
        Animated.timing(likeAnimation, {
          toValue: 1.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(likeAnimation, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Call the BFF mutation with proper post ID
      try {
        likeMutation.mutate(parseInt(id));
      } catch (error) {
        console.error('Failed to toggle like:', error);
      }
    }, [onLike, likeAnimation, id, isAuthenticated, likeMutation]);

    // Card press animation for tactile feedback
    const handlePressIn = useCallback(() => {
      Animated.timing(cardScale, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }, [cardScale]);

    const handlePressOut = useCallback(() => {
      Animated.spring(cardScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, [cardScale]);

    // Teret badge press animation
    const handleTeretPressIn = useCallback(() => {
      Animated.timing(teretBadgeScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }, [teretBadgeScale]);

    const handleTeretPressOut = useCallback(() => {
      Animated.spring(teretBadgeScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, [teretBadgeScale]);

    // Memoized callbacks for performance with real API integration
    const handleComment = useCallback(() => {
      if (!isAuthenticated) {
        Alert.alert(
          'Authentication Required',
          'Please sign in to comment on posts'
        );
        return;
      }
      onComment();
    }, [onComment, isAuthenticated]);

    const handleBookmark = useCallback(() => {
      if (!isAuthenticated) {
        Alert.alert(
          'Authentication Required',
          'Please sign in to bookmark posts'
        );
        return;
      }

      // Call the original onBookmark for any local state updates
      onBookmark?.();

      // Call the Apollo GraphQL mutation
      try {
        bookmarkMutation.mutate({ postId: parseInt(id) });
      } catch (error) {
        console.error('Failed to toggle bookmark:', error);
      }
    }, [onBookmark, bookmarkMutation, id, isAuthenticated]);
    const handleShare = useCallback(() => onShare?.(), [onShare]);
    const handleMore = useCallback(() => onMore?.(), [onMore]);
    const handleTeretPress = useCallback(
      () => onTeretPress?.(),
      [onTeretPress]
    );
    const handleAuthorPress = useCallback(
      () => onAuthorPress?.(),
      [onAuthorPress]
    );

    // Format timestamp for better readability
    const formatTimestamp = (timestamp: string) => {
      // Simple timestamp formatting - in production, use a proper date library
      if (timestamp.includes('ago')) return timestamp;
      return `${timestamp} ago`;
    };

    // Dynamic styles based on screen size
    const dynamicStyles = StyleSheet.create({
      card: {
        maxWidth: width > 768 ? 600 : '100%',
        alignSelf: width > 768 ? 'center' : 'stretch',
      },
    });

    return (
      <Animated.View style={{ transform: [{ scale: cardScale }] }}>
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              shadowColor: colors.shadow,
            },
            dynamicStyles.card,
            style,
          ]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          accessible
          accessibilityRole="button"
          accessibilityLabel={`Post by ${author.name}: ${title}`}
        >
          {/* Modern Header with Title Prominence */}
          <View style={styles.header}>
            <View style={styles.titleSection}>
              <Text
                style={[styles.topicTitle, { color: colors.foreground }]}
                numberOfLines={0}
              >
                {title || 'No Title Available'}
              </Text>

              {/* Timestamp only */}
              <View style={styles.timestampContainer}>
                <Clock
                  size={12}
                  weight="regular"
                  color={colors.mutedForeground}
                />
                <Text
                  style={[styles.timestamp, { color: colors.mutedForeground }]}
                >
                  {formatTimestamp(timestamp)}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.moreButton}
              onPress={handleMore}
              accessible
              accessibilityRole="button"
              accessibilityLabel="More options"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <DotsThree
                size={20}
                weight="bold"
                color={colors.mutedForeground}
              />
            </TouchableOpacity>
          </View>

          {/* Content Section - Discourse excerpt or fallback */}
          {content && content !== 'No content available' && (
            <View style={styles.contentSection}>
              <Text
                style={[styles.content, { color: colors.secondary }]}
                numberOfLines={4}
              >
                {content}
              </Text>
            </View>
          )}

          {/* Enhanced Teret Badge with animation */}
          <Animated.View style={{ transform: [{ scale: teretBadgeScale }] }}>
            <TouchableOpacity
              style={[styles.teretBadge, { backgroundColor: colors.teretBg }]}
              onPress={handleTeretPress}
              onPressIn={handleTeretPressIn}
              onPressOut={handleTeretPressOut}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`View all bytes in ${teretName}`}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <View style={styles.teretBadgeContent}>
                <View
                  style={[
                    styles.teretIcon,
                    { backgroundColor: colors.teretIconBg },
                  ]}
                >
                  <Sparkle
                    size={12}
                    weight="bold"
                    color={colors.teretIconColor}
                  />
                </View>
                <Text style={[styles.teretText, { color: colors.teretText }]}>
                  {teretName}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Modern Action Bar with 4 Elements */}
          <View
            style={[
              styles.actionBar,
              {
                backgroundColor: colors.actionBarBg,
                borderTopColor: colors.border,
              },
            ]}
          >
            <Pressable
              onPress={handleLike}
              onPressIn={() => setPressed(0)}
              onPressOut={() => setPressed(null)}
              style={({ pressed: isPressed }) => [
                styles.actionButton,
                (pressed === 0 || isPressed) && {
                  backgroundColor: colors.pressed,
                },
              ]}
              accessible
              accessibilityRole="button"
              accessibilityLabel={isLiked ? 'Unlike' : 'Like'}
              accessibilityState={{ selected: isLiked }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Animated.View style={{ transform: [{ scale: likeAnimation }] }}>
                <Heart
                  size={22}
                  weight={isLiked ? 'fill' : 'regular'}
                  color={isLiked ? colors.like : colors.mutedForeground}
                />
              </Animated.View>
              {likes > 0 && (
                <Text
                  style={[
                    styles.actionCount,
                    { color: isLiked ? colors.like : colors.mutedForeground },
                  ]}
                >
                  {likes}
                </Text>
              )}
            </Pressable>

            <Pressable
              onPress={handleComment}
              onPressIn={() => setPressed(1)}
              onPressOut={() => setPressed(null)}
              style={({ pressed: isPressed }) => [
                styles.actionButton,
                (pressed === 1 || isPressed) && {
                  backgroundColor: colors.pressed,
                },
              ]}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Comment"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <ChatCircle
                size={22}
                weight="regular"
                color={colors.mutedForeground}
              />
              {comments > 0 && (
                <Text
                  style={[
                    styles.actionCount,
                    { color: colors.mutedForeground },
                  ]}
                >
                  {comments}
                </Text>
              )}
            </Pressable>

            <Pressable
              onPress={handleBookmark}
              onPressIn={() => setPressed(2)}
              onPressOut={() => setPressed(null)}
              style={({ pressed: isPressed }) => [
                styles.actionButton,
                (pressed === 2 || isPressed) && {
                  backgroundColor: colors.pressed,
                },
              ]}
              accessible
              accessibilityRole="button"
              accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
              accessibilityState={{ selected: isBookmarked }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <BookmarkSimple
                size={22}
                weight={isBookmarked ? 'fill' : 'regular'}
                color={isBookmarked ? colors.bookmark : colors.mutedForeground}
              />
            </Pressable>

            <TouchableOpacity
              style={styles.actionAvatarContainer}
              onPress={handleAuthorPress}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`View ${author.name}'s profile`}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <User size={22} weight="regular" color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

// Display name for debugging
ByteCard.displayName = 'ByteCard';

// Enhanced theme-aware color system
function getThemeColors(isDark: boolean, isAmoled: boolean) {
  if (isAmoled) {
    return {
      background: '#000000',
      card: '#000000',
      foreground: '#ffffff',
      secondary: '#a1a1aa',
      mutedForeground: '#71717a',
      border: '#18181b',
      shadow: '#000000',
      like: '#f87171',
      bookmark: '#fbbf24',
      teretBg: '#1e1b4b',
      teretText: '#a5b4fc',
      teretIconBg: '#312e81',
      teretIconColor: '#a5b4fc',
      actionBarBg: '#000000',
      pressed: '#1a1a1a',
      onlineIndicator: '#4ade80', // Added online indicator color
    };
  }

  if (isDark) {
    return {
      background: COLORS.dark.background,
      card: COLORS.dark.card,
      foreground: COLORS.dark.foreground,
      secondary: COLORS.dark.secondary,
      mutedForeground: COLORS.dark.mutedForeground,
      border: COLORS.dark.border,
      shadow: '#000000',
      like: COLORS.dark.like,
      bookmark: COLORS.dark.bookmark,
      teretBg: '#1e40af',
      teretText: '#93c5fd',
      teretIconBg: '#1e3a8a',
      teretIconColor: '#93c5fd',
      actionBarBg: '#1f2937',
      pressed: '#374151',
      onlineIndicator: '#4ade80', // Added online indicator color
    };
  }

  return {
    background: COLORS.light.background,
    card: COLORS.light.card,
    foreground: COLORS.light.foreground,
    secondary: COLORS.light.secondary,
    mutedForeground: COLORS.light.mutedForeground,
    border: COLORS.light.border,
    shadow: '#000000',
    like: COLORS.light.like,
    bookmark: COLORS.light.bookmark,
    teretBg: '#dbeafe',
    teretText: '#1e40af',
    teretIconBg: '#bfdbfe',
    teretIconColor: '#1e40af',
    actionBarBg: '#f8fafc',
    pressed: '#f1f5f9',
    onlineIndicator: '#4ade80', // Added online indicator color
  };
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.xl,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    borderWidth: 0,
    ...SHADOWS.lg,
    overflow: 'hidden',
  } as ViewStyle,

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
  } as ViewStyle,

  authorSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  } as ViewStyle,

  avatarContainer: {
    position: 'relative',
  } as ViewStyle,

  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  } as ViewStyle,

  titleContainer: {
    flex: 1,
    paddingTop: 2,
  } as ViewStyle,

  authorName: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  } as TextStyle,

  topicTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    lineHeight: TYPOGRAPHY.fontSize.lg * 1.3,
    letterSpacing: -0.3,
  } as TextStyle,

  timestamp: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.normal,
  } as TextStyle,

  moreButton: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginTop: 2,
  } as ViewStyle,

  contentSection: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    paddingTop: SPACING.sm,
  } as ViewStyle,

  content: {
    fontSize: TYPOGRAPHY.fontSize.base,
    lineHeight: TYPOGRAPHY.fontSize.base * 1.6,
    fontWeight: TYPOGRAPHY.fontWeight.normal,
    opacity: 0.85,
  } as TextStyle,

  teretBadge: {
    alignSelf: 'flex-start',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    ...SHADOWS.sm,
  } as ViewStyle,

  teretBadgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  } as ViewStyle,

  teretIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  teretText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  } as TextStyle,

  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderTopWidth: 1,
  } as ViewStyle,

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.xl,
    minWidth: 48,
    justifyContent: 'center',
    gap: 8,
  } as ViewStyle,

  actionCount: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  } as TextStyle,

  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  } as ViewStyle,

  authorInfoContainer: {
    flex: 1,
    marginLeft: SPACING.md,
  } as ViewStyle,

  authorMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  } as ViewStyle,

  titleSection: {
    flex: 1,
    marginRight: SPACING.md,
  } as ViewStyle,

  bottomAvatarContainer: {
    position: 'absolute',
    bottom: SPACING.lg,
    right: SPACING.lg,
    zIndex: 10,
  } as ViewStyle,

  actionAvatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  } as ViewStyle,
});
