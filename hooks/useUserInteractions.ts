import { useMutation, useQueryClient } from '@tanstack/react-query';
import { discourseApi } from '../api';

export function useUserInteractions() {
  const queryClient = useQueryClient();

  // Like/Unlike a post
  const likeMutation = useMutation({
    mutationFn: (postId: number) => discourseApi.toggleLike(postId),
    onSuccess: (_, postId) => {
      // Invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['topic'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('Like action failed:', error);
    },
  });

  // Bookmark/Unbookmark a topic
  const bookmarkMutation = useMutation({
    mutationFn: (topicId: number) => discourseApi.toggleBookmark(topicId),
    onSuccess: (_, topicId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['topic', topicId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('Bookmark action failed:', error);
    },
  });

  return {
    // Like actions
    toggleLike: likeMutation.mutate,
    isLiking: likeMutation.isPending,
    likeError: likeMutation.error,

    // Bookmark actions
    toggleBookmark: bookmarkMutation.mutate,
    isBookmarking: bookmarkMutation.isPending,
    bookmarkError: bookmarkMutation.error,
  };
}
