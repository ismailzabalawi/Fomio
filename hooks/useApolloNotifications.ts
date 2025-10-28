import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { logger } from '@/shared/logger';

// GraphQL query for fetching notifications
const NOTIFICATIONS_QUERY = gql`
  query Notifications {
    notifications {
      id
      notification_type
      read
      created_at
      post_number
      topic_id
      slug
      data {
        topic_title
        original_post_id
        original_post_type
        original_username
        revision_number
        display_username
        badge_id
        badge_name
        badge_slug
        badge_title
        username
        name
        group_id
        group_name
        truncated_display_title
        message
        exact
        count
        current_user_id
        poster_username
        username2
        group_id2
        group_name2
        invited_by_username
        previous_notification_level
        notification_level
        can_see
        system_message
        acting_user_id
        acting_username
        acting_name
        target_user_id
        target_username
        target_name
        excluding_usernames
        action_code
        topic_id
        topic_title
        featured_link
        first_post_id
        second_post_id
        second_post_user_id
        second_post_user_username
        third_post_id
        third_post_user_id
        third_post_user_username
        title
        description
        created_at
        image_url
        key
        url
        original_user_id
        original_username2
        limit
        base62_id
        avatar_template
        icon
        content
        reviewable_id
        reviewable_score_count
        reviewable_score_pending_count
      }
    }
  }
`;

// TypeScript interfaces matching the GraphQL response
export interface NotificationData {
  topic_title?: string;
  original_post_id?: number;
  original_post_type?: number;
  original_username?: string;
  revision_number?: number;
  display_username?: string;
  badge_id?: number;
  badge_name?: string;
  badge_slug?: string;
  badge_title?: string;
  username?: string;
  name?: string;
  group_id?: number;
  group_name?: string;
  truncated_display_title?: string;
  message?: string;
  exact?: boolean;
  count?: number;
  current_user_id?: number;
  poster_username?: string;
  username2?: string;
  group_id2?: number;
  group_name2?: string;
  invited_by_username?: string;
  previous_notification_level?: number;
  notification_level?: number;
  can_see?: boolean;
  system_message?: string;
  acting_user_id?: number;
  acting_username?: string;
  acting_name?: string;
  target_user_id?: number;
  target_username?: string;
  target_name?: string;
  excluding_usernames?: string[];
  action_code?: string;
  topic_id?: number;
  featured_link?: string;
  first_post_id?: number;
  second_post_id?: number;
  second_post_user_id?: number;
  second_post_user_username?: string;
  third_post_id?: number;
  third_post_user_id?: number;
  third_post_user_username?: string;
  title?: string;
  description?: string;
  created_at?: string;
  image_url?: string;
  key?: string;
  url?: string;
  original_user_id?: number;
  original_username2?: string;
  limit?: number;
  base62_id?: string;
  avatar_template?: string;
  icon?: string;
  content?: string;
  reviewable_id?: number;
  reviewable_score_count?: number;
  reviewable_score_pending_count?: number;
}

export interface Notification {
  id: number;
  notification_type: number;
  read: boolean;
  created_at: string;
  post_number?: number;
  topic_id?: number;
  slug?: string;
  data?: NotificationData;
}

export interface NotificationsQueryResponse {
  notifications: Notification[];
}

export function useApolloNotifications() {
  const { data, loading, error, refetch, networkStatus } =
    useQuery<NotificationsQueryResponse>(NOTIFICATIONS_QUERY, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
      pollInterval: 30000, // Poll every 30 seconds for new notifications
    });

  // Helper function to refresh notifications
  const refresh = async () => {
    try {
      await refetch();
      logger.info('Notifications refreshed successfully');
    } catch (error) {
      logger.error('Failed to refresh notifications', error);
    }
  };

  const notifications = data?.notifications || [];
  const unreadCount = notifications.filter((n: any) => n && !n.read).length;

  return {
    data: notifications,
    notifications,
    unreadCount,
    loading,
    error,
    networkStatus,
    refresh,
    isEmpty: !loading && notifications.length === 0,
  };
}
