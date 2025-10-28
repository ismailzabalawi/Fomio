import { useQuery } from '@tanstack/react-query';
import { bffApiClient } from '../lib/apiClient';

export interface Post {
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
  posts: Post[];
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

export function useBffTopic(topicId: number) {
  return useQuery({
    queryKey: ['bff', 'topic', topicId],
    queryFn: () => bffApiClient.bffFetch<TopicResponse>(`/topics/${topicId}`),
    enabled: !!topicId,
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
