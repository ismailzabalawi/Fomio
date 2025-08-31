import { useMutation, useQueryClient } from '@tanstack/react-query';
import { discourseApi, CreateTopicRequest } from '../api';

export function useCreateTopic() {
  const queryClient = useQueryClient();

  const createTopicMutation = useMutation({
    mutationFn: (data: CreateTopicRequest) => discourseApi.createTopic(data),
    onSuccess: (response) => {
      // Invalidate and refetch feed queries
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      
      // Add the new topic to the feed cache optimistically
      queryClient.setQueryData(['feed', 'latest'], (oldData: any) => {
        if (oldData?.topic_list?.topics) {
          return {
            ...oldData,
            topic_list: {
              ...oldData.topic_list,
              topics: [response.topic, ...oldData.topic_list.topics],
            },
          };
        }
        return oldData;
      });
    },
    onError: (error) => {
      console.error('Failed to create topic:', error);
    },
  });

  return {
    createTopic: createTopicMutation.mutate,
    createTopicAsync: createTopicMutation.mutateAsync,
    isCreating: createTopicMutation.isPending,
    createError: createTopicMutation.error,
  };
}
