import { useState, useEffect, useCallback } from 'react';
import { useData } from '../data/provider';
import { FeedItem, FeedParams } from '../data/client';
import { logger } from '@/shared/logger';

export function useFeed(params: FeedParams = {}) {
  const data = useData();
  const [topics, setTopics] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const loadFeed = useCallback(
    async (page: number = 0, append: boolean = false) => {
      try {
        if (page === 0) {
          setLoading(true);
        }
        setError(null);

        const feedParams = {
          ...params,
          page,
          limit: params.limit || 20,
        };

        logger.info('Loading feed', { page, append, params: feedParams });

        const newTopics = await data.getFeed(feedParams);

        if (append) {
          setTopics((prev) => [...prev, ...newTopics]);
        } else {
          setTopics(newTopics);
        }

        setCurrentPage(page);
        setHasNextPage(newTopics.length === (feedParams.limit || 20));

        logger.info('Feed loaded successfully', {
          page,
          topicCount: newTopics.length,
          totalTopics: append
            ? topics.length + newTopics.length
            : newTopics.length,
        });
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to load feed');
        logger.error('Failed to load feed', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [data, params]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasNextPage) {
      loadFeed(currentPage + 1, true);
    }
  }, [loading, hasNextPage, currentPage, loadFeed]);

  const refresh = useCallback(() => {
    loadFeed(0, false);
  }, [loadFeed]);

  useEffect(() => {
    loadFeed(0, false);
  }, [loadFeed]);

  return {
    topics,
    loading,
    error,
    hasNextPage,
    isEmpty: !loading && topics.length === 0,
    loadMore,
    refresh,
  };
}

// Re-export types for convenience
export type { FeedItem, FeedParams } from '../data/client';
