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
  Alert
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
  Clock
} from 'phosphor-react-native';
import { useTheme } from '../../components/shared/theme-provider';
import { HeaderBar } from '../../components/nav/HeaderBar';

interface Notification {
  id: string;
  type: 'like' | 'reply' | 'mention' | 'follow' | 'bookmark' | 'quote' | 'system';
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

interface NotificationSection {
  title: string;
  data: Notification[];
}

function NotificationItem({ 
  notification, 
  onPress, 
  onMarkRead, 
  onDelete 
}: { 
  notification: Notification; 
  onPress: () => void; 
  onMarkRead: () => void; 
  onDelete: () => void; 
}) {
  const { isDark, isAmoled } = useTheme();
  const colors = {
    background: isAmoled ? '#000000' : (isDark ? '#1f2937' : '#ffffff'),
    unreadBackground: isAmoled ? '#0a0a0a' : (isDark ? '#374151' : '#f8fafc'),
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
          backgroundColor: notification.isRead ? colors.background : colors.unreadBackground,
          borderColor: colors.border 
        }
      ]}
      onPress={onPress}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${notification.title} notification`}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationIcon}>
          {getNotificationIcon()}
        </View>
        <View style={styles.notificationContent}>
          <Text style={[styles.notificationTitle, { color: colors.text }]}>
            {notification.title}
          </Text>
          <Text style={[styles.notificationMessage, { color: colors.secondary }]} numberOfLines={2}>
            {notification.message}
          </Text>
          <View style={styles.notificationMeta}>
            <Text style={[styles.notificationTime, { color: colors.secondary }]}>
              {notification.timestamp}
            </Text>
            {notification.data?.hubName && (
              <Text style={[styles.notificationContext, { color: colors.accent }]}>
                in {notification.data.hubName}
              </Text>
            )}
          </View>
        </View>
        {!notification.isRead && (
          <View style={[styles.unreadIndicator, { backgroundColor: getNotificationColor() }]} />
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
            <Text style={[styles.actionText, { color: colors.success }]}>Mark Read</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { borderColor: colors.border }]}
            onPress={onDelete}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Delete notification"
          >
            <Trash size={16} color={colors.error} weight="regular" />
            <Text style={[styles.actionText, { color: colors.error }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

function NotificationSection({ title, children }: { title: string; children: React.ReactNode }) {
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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  
  const colors = {
    background: isAmoled ? '#000000' : (isDark ? '#18181b' : '#ffffff'),
    card: isAmoled ? '#000000' : (isDark ? '#1f2937' : '#ffffff'),
    text: isDark ? '#f9fafb' : '#111827',
    secondary: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#374151' : '#e5e7eb',
    primary: isDark ? '#3b82f6' : '#0ea5e9',
    error: isDark ? '#ef4444' : '#dc2626',
  };

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'like',
      title: 'Alex Chen liked your post',
      message: 'Alex Chen liked your post "Getting Started with React Native" in #react-native',
      timestamp: '2m ago',
      isRead: false,
      isActionable: true,
      data: {
        postId: '123',
        userId: 'alex-chen',
        username: 'Alex Chen',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        hubName: 'Technology',
        teretName: 'react-native',
      },
    },
    {
      id: '2',
      type: 'reply',
      title: 'Sarah Kim replied to your post',
      message: 'Sarah Kim replied to your post "UI/UX Design Tips" in #ui-design',
      timestamp: '15m ago',
      isRead: false,
      isActionable: true,
      data: {
        postId: '124',
        userId: 'sarah-kim',
        username: 'Sarah Kim',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        hubName: 'Design',
        teretName: 'ui-design',
      },
    },
    {
      id: '3',
      type: 'mention',
      title: 'You were mentioned in a post',
      message: 'Mike Johnson mentioned you in "Best practices for mobile development"',
      timestamp: '1h ago',
      isRead: true,
      isActionable: true,
      data: {
        postId: '125',
        userId: 'mike-johnson',
        username: 'Mike Johnson',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        hubName: 'Technology',
        teretName: 'mobile-dev',
      },
    },
    {
      id: '4',
      type: 'follow',
      title: 'New follower',
      message: 'Emma Wilson started following you',
      timestamp: '2h ago',
      isRead: true,
      isActionable: true,
      data: {
        userId: 'emma-wilson',
        username: 'Emma Wilson',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      },
    },
    {
      id: '5',
      type: 'bookmark',
      title: 'Your post was bookmarked',
      message: 'David Lee bookmarked your post "Advanced TypeScript Patterns"',
      timestamp: '3h ago',
      isRead: true,
      isActionable: true,
      data: {
        postId: '126',
        userId: 'david-lee',
        username: 'David Lee',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        hubName: 'Technology',
        teretName: 'typescript',
      },
    },
    {
      id: '6',
      type: 'system',
      title: 'Welcome to Fomio!',
      message: 'Your account has been successfully created. Start exploring hubs and terets!',
      timestamp: '1d ago',
      isRead: true,
      isActionable: false,
    },
  ];

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
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
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
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
            setNotifications(prev => 
              prev.filter(notification => notification.id !== notificationId)
            );
          }
        },
      ]
    );
  };

  const handleMarkAllRead = () => {
    Alert.alert(
      'Mark All as Read',
      'Mark all notifications as read?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Mark Read', 
          onPress: () => {
            setNotifications(prev => 
              prev.map(notification => ({ ...notification, isRead: true }))
            );
          }
        },
      ]
    );
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
            setNotifications([]);
          }
        },
      ]
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderFilterButton = (filterType: 'all' | 'unread' | 'read', label: string, count?: number) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        { 
          backgroundColor: filter === filterType ? colors.primary : 'transparent',
          borderColor: colors.border 
        }
      ]}
      onPress={() => setFilter(filterType)}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${label} filter`}
    >
      <Text style={[
        styles.filterButtonText,
        { color: filter === filterType ? '#ffffff' : colors.text }
      ]}>
        {label}
        {count !== undefined && count > 0 && (
          <Text style={[styles.filterCount, { color: filter === filterType ? '#ffffff' : colors.primary }]}>
            {' '}({count})
          </Text>
        )}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <BellSlash size={64} color={colors.secondary} weight="regular" />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        {filter === 'all' ? 'No notifications yet' : 
         filter === 'unread' ? 'No unread notifications' : 'No read notifications'}
      </Text>
      <Text style={[styles.emptyMessage, { color: colors.secondary }]}>
        {filter === 'all' ? 'When you receive notifications, they\'ll appear here' :
         filter === 'unread' ? 'All caught up! No unread notifications' : 'No read notifications to show'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar 
        title="Notifications" 
        showBackButton={false}
        showProfileButton={true}
      />
      
      {/* Header Actions */}
      {(unreadCount > 0 || notifications.length > 0) && (
        <View style={styles.headerActions}>
          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.headerAction}
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
              style={styles.headerAction}
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
      
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All', notifications.length)}
        {renderFilterButton('unread', 'Unread', unreadCount)}
        {renderFilterButton('read', 'Read', notifications.filter(n => n.isRead).length)}
      </View>

      {/* Notifications List */}
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
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
}); 