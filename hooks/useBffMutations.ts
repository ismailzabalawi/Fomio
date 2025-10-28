import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bffApiClient } from '../lib/apiClient';

export interface CreateTopicRequest {
  title: string;
  raw: string;
  categoryId?: number;
  tags?: string[];
}

export interface CreatePostRequest {
  topicId: number;
  raw: string;
  replyToPostNumber?: number;
}

export interface BookmarkRequest {
  name?: string;
  reminderType?: string;
  reminderAt?: string;
}

export function useBffCreateTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTopicRequest) => {
      return bffApiClient.bffFetch('/topics', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch feed and categories
      queryClient.invalidateQueries({ queryKey: ['bff', 'feed'] });
      queryClient.invalidateQueries({ queryKey: ['bff', 'categories'] });
    },
    onError: (error: any) => {
      console.error('Create topic failed:', error);
    },
  });
}

export function useBffCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostRequest) => {
      return bffApiClient.bffFetch('/posts', {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch topic and feed
      queryClient.invalidateQueries({
        queryKey: ['bff', 'topic', variables.topicId],
      });
      queryClient.invalidateQueries({ queryKey: ['bff', 'feed'] });
    },
    onError: (error: any) => {
      console.error('Create post failed:', error);
    },
  });
}

export function useBffLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: number) => {
      return bffApiClient.bffFetch(`/posts/${postId}/like`, {
        method: 'POST',
      });
    },
    onSuccess: (_, postId) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['bff', 'feed'] });
      queryClient.invalidateQueries({ queryKey: ['bff', 'topic'] });
    },
    onError: (error: any) => {
      console.error('Like post failed:', error);
    },
  });
}

export function useBffBookmarkPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      ...data
    }: { postId: number } & BookmarkRequest) => {
      return bffApiClient.bffFetch(`/posts/${postId}/bookmark`, {
        method: 'POST',
        body: data,
      });
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['bff', 'feed'] });
      queryClient.invalidateQueries({ queryKey: ['bff', 'topic'] });
    },
    onError: (error: any) => {
      console.error('Bookmark post failed:', error);
    },
  });
}
