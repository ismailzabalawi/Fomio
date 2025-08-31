import { useMutation, useQueryClient } from '@tanstack/react-query';
import { discourseApi, CreatePostRequest } from '../api';

export function useCreatePost() {
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: (data: CreatePostRequest) => discourseApi.createPost(data),
    onSuccess: (response, variables) => {
      // Invalidate and refetch topic queries
      queryClient.invalidateQueries({ queryKey: ['topic', variables.topic_id] });
      
      // Optimistically update the topic's post count
      queryClient.setQueryData(['topic', variables.topic_id], (oldData: any) => {
        if (oldData?.post_stream?.posts) {
          return {
            ...oldData,
            post_stream: {
              ...oldData.post_stream,
              posts: [...oldData.post_stream.posts, response.post],
            },
          };
        }
        return oldData;
      });
    },
    onError: (error) => {
      console.error('Failed to create post:', error);
    },
  });

  return {
    createPost: createPostMutation.mutate,
    createPostAsync: createPostMutation.mutateAsync,
    isCreating: createPostMutation.isPending,
    createError: createPostMutation.error,
  };
}
