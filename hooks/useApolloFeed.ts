import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { logger } from '@/shared/logger';

// GraphQL query for fetching the feed
const FEED_QUERY = gql`
  query Feed($cursor: String, $limit: Int) {
    feed(cursor: $cursor, limit: $limit) {
      edges {
        id
        title
        fancy_title
        slug
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
        author {
          id
          username
          name
          avatar_template
        }
        category {
          id
          name
          slug
          color
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
      totalCount
    }
  }
`;

// TypeScript interfaces for the GraphQL response
export interface FeedTopic {
  id: number;
  title: string;
  fancy_title: string;
  slug: string;
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
  author: {
    id: number;
    username: string;
    name: string;
    avatar_template: string;
  };
  category: {
    id: number;
    name: string;
    slug: string;
    color: string;
  };
}

export interface FeedPageInfo {
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
}

export interface FeedResponse {
  feed: {
    edges: FeedTopic[];
    pageInfo: FeedPageInfo;
    totalCount: number;
  };
}

export interface FeedVariables {
  cursor?: string;
  limit?: number;
}

export function useApolloFeed(variables: FeedVariables = {}) {
  const { data, loading, error, fetchMore, refetch, networkStatus } = useQuery<
    FeedResponse,
    FeedVariables
  >(FEED_QUERY, {
    variables: {
      cursor: undefined,
      limit: 20,
      ...variables,
    },
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
  });

  // Helper function to load more topics (pagination)
  const loadMore = async () => {
    if (!data?.feed?.pageInfo?.hasNextPage) {
      logger.info('No more pages to load');
      return;
    }

    try {
      await fetchMore({
        variables: {
          cursor: data.feed.pageInfo.endCursor,
          limit: 20,
        },
      });
      logger.info('Loaded more feed topics');
    } catch (error) {
      logger.error('Failed to load more feed topics', error);
    }
  };

  // Helper function to refresh the feed
  const refresh = async () => {
    try {
      await refetch();
      logger.info('Feed refreshed successfully');
    } catch (error) {
      logger.error('Failed to refresh feed', error);
    }
  };

  return {
    data: data?.feed,
    topics: data?.feed?.edges || [],
    pageInfo: data?.feed?.pageInfo,
    totalCount: data?.feed?.totalCount || 0,
    loading,
    error,
    networkStatus,
    loadMore,
    refresh,
    hasNextPage: data?.feed?.pageInfo?.hasNextPage || false,
    isEmpty: !loading && (!data?.feed?.edges || data.feed.edges.length === 0),
  };
}
