import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bell,
  BellSlash,
  Check,
  Trash,
  Heart,
  ChatCircle,
  Share,
  UserPlus,
  At,
  Star,
  Bookmark,
  ArrowRight,
  Clock,
} from 'phosphor-react-native';
import { useTheme } from '../../components/shared/theme-provider';
import { HeaderBar } from '../../components/nav/HeaderBar';
import { useAuth } from '../../lib/auth';
import { getNotifications, DiscourseNotificationsResponse } from '../../lib/discourse';
import { useEffect, useState } from 'react';

interface Notification {
  id: string;
  type:
    | 'like'
    | 'reply'
    | 'mention'
    | 'follow'
    | 'bookmark'
    | 'quote'
    | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isActionable: boolean;
  data?: {
    postId?: string;
    topicId?: string;
    userId?: string;
    username?: string;
    avatar?: string;
    hubName?: string;
    teretName?: string;
  };
}

// Helper function to convert Apollo notification type to UI type
function getNotificationType(
  notificationType: number
): 'like' | 'reply' | 'mention' | 'follow' | 'bookmark' | 'quote' | 'system' {
  // Discourse notification types: 1=mentioned, 2=replied, 3=quoted, 4=edited, 5=liked, 6=private_message, etc.
  switch (notificationType) {
    case 1:
      return 'mention';
    case 2:
      return 'reply';
    case 3:
      return 'quote';
    case 5:
      return 'like';
    case 6:
      return 'bookmark';
    default:
      return 'system';
  }
}

// Helper function to format notification title and message
function formatNotification(
  apolloNotification: import('../../hooks/useApolloNotifications').Notification
): Notification {
  const type = getNotificationType(apolloNotification.notification_type);
  const data = apolloNotification.data;

  let title = 'New notification';
  let message = '';

  switch (type) {
    case 'like':
      title = `${data?.display_username || data?.username || 'Someone'} liked your post`;
      message = data?.topic_title || 'Your post received a like';
      break;
    case 'reply':
      title = `${data?.display_username || data?.username || 'Someone'} replied to your post`;
      message = data?.topic_title || 'Your post received a reply';
      break;
    case 'mention':
      title = `You were mentioned`;
      message = data?.topic_title || 'You were mentioned in a post';
      break;
    case 'quote':
      title = `${data?.display_username || data?.username || 'Someone'} quoted your post`;
      message = data?.topic_title || 'Your post was quoted';
      break;
    case 'bookmark':
      title = `Your post was bookmarked`;
      message = data?.topic_title || 'Your post was bookmarked';
      break;
    default:
      title = 'New notification';
      message = data?.message || 'You have a new notification';
  }

  return {
    id: apolloNotification.id.toString(),
    type,
    title,
    message,
    timestamp: formatTimestamp(apolloNotification.created_at),
    isRead: apolloNotification.read,
    isActionable: true,
    data: {
      postId: apolloNotification.post_number?.toString(),
      topicId: apolloNotification.topic_id?.toString(),
      username: data?.display_username || data?.username,
      avatar: data?.avatar_template
        ? `https://meta.techrebels.info${data.avatar_template.replace('{size}', '150')}`
        : undefined,
    },
  };
}

// Helper function to format timestamp
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

interface NotificationSection {
  title: string;
  data: Notification[];
}

function NotificationItem({
  notification,
  onPress,
  onMarkRead,
  onDelete,
}: {
  notification: Notification;
  onPress: () => void;
  onMarkRead: () => void;
  onDelete: () => void;
}) {
  const { isDark, isAmoled } = useTheme();
  const colors = {
    background: isAmoled ? '#000000' : isDark ? '#1f2937' : '#ffffff',
    unreadBackground: isAmoled ? '#0a0a0a' : isDark ? '#374151' : '#f8fafc',
    text: isDark ? '#f9fafb' : '#111827',
    secondary: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#374151' : '#e5e7eb',
    accent: isDark ? '#3b82f6' : '#0ea5e9',
    success: isDark ? '#10b981' : '#059669',
    warning: isDark ? '#f59e0b' : '#d97706',
    error: isDark ? '#ef4444' : '#dc2626',
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'like':
        return <Heart size={20} color={colors.error} weight="fill" />;
      case 'reply':
        return <ChatCircle size={20} color={colors.accent} weight="fill" />;
      case 'mention':
        return <At size={20} color={colors.warning} weight="fill" />;
      case 'follow':
        return <UserPlus size={20} color={colors.success} weight="fill" />;
      case 'bookmark':
        return <Bookmark size={20} color={colors.accent} weight="fill" />;
      case 'quote':
        return <Share size={20} color={colors.warning} weight="fill" />;
      case 'system':
        return <Bell size={20} color={colors.secondary} weight="fill" />;
      default:
        return <Bell size={20} color={colors.secondary} weight="regular" />;
    }
  };

  const getNotificationColor = () => {
    switch (notification.type) {
      case 'like':
        return colors.error;
      case 'reply':
        return colors.accent;
      case 'mention':
        return colors.warning;
      case 'follow':
        return colors.success;
      case 'bookmark':
        return colors.accent;
      case 'quote':
        return colors.warning;
      case 'system':
        return colors.secondary;
      default:
        return colors.secondary;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        {
          backgroundColor: notification.isRead
            ? colors.background
            : colors.unreadBackground,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${notification.title} notification`}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationIcon}>{getNotificationIcon()}</View>
        <View style={styles.notificationContent}>
          <Text style={[styles.notificationTitle, { color: colors.text }]}>
            {notification.title}
          </Text>
          <Text
            style={[styles.notificationMessage, { color: colors.secondary }]}
            numberOfLines={2}
          >
            {notification.message}
          </Text>
          <View style={styles.notificationMeta}>
            <Text
              style={[styles.notificationTime, { color: colors.secondary }]}
            >
              {notification.timestamp}
            </Text>
            {notification.data?.hubName && (
              <Text
                style={[styles.notificationContext, { color: colors.accent }]}
              >
                in {notification.data.hubName}
              </Text>
            )}
          </View>
        </View>
        {!notification.isRead && (
          <View
            style={[
              styles.unreadIndicator,
              { backgroundColor: getNotificationColor() },
            ]}
          />
        )}
      </View>

      {notification.isActionable && (
        <View style={styles.notificationActions}>
          <TouchableOpacity
            style={[styles.actionButton, { borderColor: colors.border }]}
            onPress={onMarkRead}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Mark as read"
          >
            <Check size={16} color={colors.success} weight="regular" />
            <Text style={[styles.actionText, { color: colors.success }]}>
              Mark Read
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { borderColor: colors.border }]}
            onPress={onDelete}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Delete notification"
          >
            <Trash size={16} color={colors.error} weight="regular" />
            <Text style={[styles.actionText, { color: colors.error }]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

function NotificationSection({
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

export default function NotificationsScreen(): JSX.Element {
  const { isDark, isAmoled } = useTheme();
  const { authed } = useAuth();
  const [notificationsData, setNotificationsData] = useState<DiscourseNotificationsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const loadNotifications = async () => {
    if (!authed) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await getNotifications();
      setNotificationsData(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load notifications'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) {
      loadNotifications();
    }
  }, [authed]);

  const refresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const apolloNotifications = notificationsData?.notifications || [];
  const unreadCount = apolloNotifications.filter(n => !n.read).length;

  const colors = {
    background: isAmoled ? '#000000' : isDark ? '#18181b' : '#ffffff',
    card: isAmoled ? '#000000' : isDark ? '#1f2937' : '#ffffff',
    text: isDark ? '#f9fafb' : '#111827',
    secondary: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#374151' : '#e5e7eb',
    backdrop: isAmoled ? '#0a0a0a' : isDark ? '#374151' : '#f8fafc',
    primary: isDark ? '#3b82f6' : '#0ea5e9',
    error: isDark ? '#ef4444' : '#dc2626',
  };

  // Transform Discourse notifications to UI format
  const notifications: Notification[] =
    apolloNotifications.filter(Boolean).map(formatNotification);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleNotificationPress = (notification: Notification) => {
    console.log('Notification pressed:', notification.id);
    // Navigate to the relevant content
    if (notification.data?.postId) {
      // Navigate to post
      console.log('Navigate to post:', notification.data.postId);
    } else if (notification.data?.userId) {
      // Navigate to user profile
      console.log('Navigate to user:', notification.data.userId);
    }
  };

  const handleMarkRead = (notificationId: string) => {
    // TODO: Implement mark as read mutation when available
    console.log('Mark as read:', notificationId);
  };

  const handleDelete = (notificationId: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement delete mutation when available
            console.log('Delete notification:', notificationId);
          },
        },
      ]
    );
  };

  const handleMarkAllRead = () => {
    Alert.alert('Mark All as Read', 'Mark all notifications as read?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Mark Read',
        onPress: () => {
          // TODO: Implement mark all as read mutation when available
          console.log('Mark all as read');
        },
      },
    ]);
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement clear all mutation when available
            console.log('Clear all notifications');
          },
        },
      ]
    );
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

  const renderFilterButton = (
    filterType: 'all' | 'unread' | 'read',
    label: string,
    count?: number
  ) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor:
            filter === filterType ? colors.primary : 'transparent',
          borderColor: colors.border,
        },
      ]}
      onPress={() => setFilter(filterType)}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${label} filter`}
    >
      <Text
        style={[
          styles.filterButtonText,
          { color: filter === filterType ? '#ffffff' : colors.text },
        ]}
      >
        {label}
        {count !== undefined && count > 0 && (
          <Text
            style={[
              styles.filterCount,
              { color: filter === filterType ? '#ffffff' : colors.primary },
            ]}
          >
            {' '}
            ({count})
          </Text>
        )}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <BellSlash size={64} color={colors.secondary} weight="regular" />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {filter === 'all'
          ? 'No notifications yet'
          : filter === 'unread'
            ? 'No unread notifications'
            : 'No read notifications'}
      </Text>
      <Text style={[styles.emptyMessage, { color: colors.secondary }]}>
        {filter === 'all'
          ? "When you receive notifications, they'll appear here"
          : filter === 'unread'
            ? 'All caught up! No unread notifications'
            : 'No read notifications to show'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <HeaderBar
        title="Notifications"
        showBackButton={false}
        showProfileButton={true}
      />

      {!authed && (
        <View style={styles.notAuthedContainer}>
          <Text style={[styles.notAuthedText, { color: colors.text }]}>
            Please sign in to view notifications
          </Text>
          <TouchableOpacity
            style={[styles.signInButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(auth)/signin')}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Header Actions */}
      {(unreadCount > 0 || notifications.length > 0) && (
        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <TouchableOpacity
              style={[
                styles.headerAction,
                { backgroundColor: colors.backdrop },
              ]}
              onPress={handleMarkAllRead}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Mark all as read"
            >
              <Check size={20} color={colors.primary} weight="regular" />
            </TouchableOpacity>
          )}
          {notifications.length > 0 && (
            <TouchableOpacity
              style={[
                styles.headerAction,
                { backgroundColor: colors.backdrop },
              ]}
              onPress={handleClearAll}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Clear all notifications"
            >
              <Trash size={20} color={colors.error} weight="regular" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Loading State */}
      {loading && !refreshing && (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading notifications...
          </Text>
        </View>
      )}

      {/* Error State */}
      {error && !loading && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Failed to load notifications
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={refresh}>
            <Text style={[styles.retryText, { color: colors.primary }]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All', notifications.length)}
        {renderFilterButton('unread', 'Unread', unreadCount)}
        {renderFilterButton(
          'read',
          'Read',
          notifications.filter((n) => n.isRead).length
        )}
      </View>

      {/* Notifications List */}
      {!loading && !error && (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem
              notification={item}
              onPress={() => handleNotificationPress(item)}
              onMarkRead={() => handleMarkRead(item.id)}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          contentContainerStyle={styles.notificationsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={renderEmptyState}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 16,
  },
  headerAction: {
    padding: 8,
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
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
    color: '#3b82f6',
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 16,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  notificationsList: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  separator: {
    height: 8,
  },
  notificationItem: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationTime: {
    fontSize: 12,
    fontWeight: '500',
  },
  notificationContext: {
    fontSize: 12,
    fontWeight: '500',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  notificationActions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
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
