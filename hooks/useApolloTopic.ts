import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { logger } from '@/shared/logger';

// GraphQL query for fetching a single topic with posts
const TOPIC_QUERY = gql`
  query Topic($topicId: Int!) {
    topic(topicId: $topicId) {
      id
      title
      fancy_title
      slug
      posts {
        id
        topic_id
        post_number
        user_id
        username
        name
        avatar_template
        cooked
        raw
        created_at
        updated_at
        reply_to_post_number
        reply_count
        quote_count
        incoming_link_count
        reads
        score
        yours
        topic_slug
        topic_title
        category_id
        display_username
        version
        can_edit
        can_delete
        can_recover
        can_wiki
        read
        user_title
        actions_summary {
          id
          count
          hidden
          can_act
        }
        moderator
        admin
        staff
        hidden
        trust_level
        deleted_at
        user_deleted
        edit_reason
        can_view_edit_history
        wiki
        reviewable_id
        reviewable_score_count
        reviewable_score_pending_count
      }
      posts_count
      reply_count
      created_at
      last_posted_at
      bumped
      bumped_at
      excerpt
      image_url
      visible
      closed
      archived
      bookmarked
      liked
      views
      like_count
      category_id
      posters {
        user_id
        extras
        description
      }
      category {
        id
        name
        slug
        color
      }
    }
  }
`;

// TypeScript interfaces matching the GraphQL response
export interface TopicPost {
  id: number;
  topic_id: number;
  post_number: number;
  user_id: number;
  username: string;
  name?: string;
  avatar_template?: string;
  cooked: string;
  raw: string;
  created_at: string;
  updated_at: string;
  reply_to_post_number?: number;
  reply_count: number;
  quote_count: number;
  incoming_link_count: number;
  reads: number;
  score: number;
  yours: boolean;
  topic_slug: string;
  topic_title: string;
  category_id: number;
  display_username: string;
  version: number;
  can_edit: boolean;
  can_delete: boolean;
  can_recover: boolean;
  can_wiki: boolean;
  read: boolean;
  user_title?: string;
  actions_summary: Array<{
    id: number;
    count: number;
    hidden: boolean;
    can_act: boolean;
  }>;
  moderator: boolean;
  admin: boolean;
  staff: boolean;
  hidden: boolean;
  trust_level: number;
  deleted_at?: string;
  user_deleted: boolean;
  edit_reason?: string;
  can_view_edit_history: boolean;
  wiki: boolean;
  reviewable_id?: number;
  reviewable_score_count: number;
  reviewable_score_pending_count: number;
}

export interface TopicResponse {
  id: number;
  title: string;
  fancy_title: string;
  slug: string;
  posts: TopicPost[];
  posts_count: number;
  reply_count: number;
  created_at: string;
  last_posted_at: string;
  bumped: boolean;
  bumped_at: string;
  excerpt?: string;
  image_url?: string;
  visible: boolean;
  closed: boolean;
  archived: boolean;
  bookmarked?: boolean;
  liked?: boolean;
  views: number;
  like_count: number;
  category_id: number;
  posters: Array<{
    user_id: number;
    extras: string;
    description: string;
  }>;
  category: {
    id: number;
    name: string;
    slug: string;
    color: string;
  };
}

export interface TopicQueryResponse {
  topic: TopicResponse;
}

export interface TopicVariables {
  topicId: number;
}

export function useApolloTopic(topicId: number) {
  const { data, loading, error, refetch, networkStatus } = useQuery<
    TopicQueryResponse,
    TopicVariables
  >(TOPIC_QUERY, {
    variables: {
      topicId,
    },
    skip: !topicId || topicId <= 0,
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  });

  // Helper function to refresh the topic
  const refresh = async () => {
    try {
      await refetch();
      logger.info('Topic refreshed successfully');
    } catch (error) {
      logger.error('Failed to refresh topic', error);
    }
  };

  return {
    data: data?.topic,
    topic: data?.topic,
    posts: data?.topic?.posts || [],
    loading,
    error,
    networkStatus,
    refresh,
    isEmpty: !loading && !data?.topic,
  };
}
