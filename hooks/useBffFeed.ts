import { useQuery } from '@tanstack/react-query';
import { bffApiClient } from '../lib/apiClient';

export interface Topic {
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
}

export interface FeedResponse {
  topics: Topic[];
  total: number;
  page: number;
  per_page: number;
}

export function useBffFeed() {
  return useQuery({
    queryKey: ['bff', 'feed', 'latest'],
    queryFn: () => bffApiClient.bffFetch<FeedResponse>('/feed/latest'),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors
      if (error?.code === 'UNAUTHORIZED') {
        return false;
      }
      return failureCount < 3;
    },
  });
}
