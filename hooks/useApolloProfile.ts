import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { logger } from '@/shared/logger';

// GraphQL query for fetching user profile
const PROFILE_QUERY = gql`
  query Profile {
    me {
      id
      username
      name
      avatar_template
      trust_level
      admin
      moderator
      title
      last_seen_at
      created_at
      email
      last_posted_at
      ignored
      muted
      can_ignore_user
      can_mute_user
      can_send_private_message_to_user
      badge_count
      time_read
      recent_time_read
      primary_group_id
      primary_group_name
      primary_group_flair_url
      primary_group_flair_bg_color
      primary_group_flair_color
      staged
      can_edit
      can_invite_to_forum
      can_invite_to_topic
      can_send_private_message
      stats {
        posts_count
        topics_count
        likes_received
        followers_count
        following_count
      }
    }
  }
`;

// TypeScript interfaces matching the GraphQL response
export interface UserStats {
  posts_count: number;
  topics_count: number;
  likes_received: number;
  followers_count: number;
  following_count: number;
}

export interface ProfileUser {
  id: number;
  username: string;
  name?: string;
  avatar_template?: string;
  trust_level: number;
  admin?: boolean;
  moderator?: boolean;
  title?: string;
  last_seen_at?: string;
  created_at?: string;
  email?: string;
  last_posted_at?: string;
  ignored?: boolean;
  muted?: boolean;
  can_ignore_user?: boolean;
  can_mute_user?: boolean;
  can_send_private_message_to_user?: boolean;
  badge_count?: number;
  time_read?: number;
  recent_time_read?: number;
  primary_group_id?: number | null;
  primary_group_name?: string | null;
  primary_group_flair_url?: string | null;
  primary_group_flair_bg_color?: string | null;
  primary_group_flair_color?: string | null;
  staged?: boolean;
  can_edit?: boolean;
  can_invite_to_forum?: boolean;
  can_invite_to_topic?: boolean;
  can_send_private_message?: boolean;
  stats?: UserStats;
}

export interface ProfileQueryResponse {
  me: ProfileUser;
}

export function useApolloProfile() {
  const { data, loading, error, refetch, networkStatus } =
    useQuery<ProfileQueryResponse>(PROFILE_QUERY, {
      notifyOnNetworkStatusChange: true,
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
    });

  // Helper function to refresh the profile
  const refresh = async () => {
    try {
      await refetch();
      logger.info('Profile refreshed successfully');
    } catch (error) {
      logger.error('Failed to refresh profile', error);
    }
  };

  return {
    data: data?.me,
    user: data?.me,
    stats: data?.me?.stats,
    loading,
    error,
    networkStatus,
    refresh,
    isEmpty: !loading && !data?.me,
  };
}
