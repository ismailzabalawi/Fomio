import { useApolloTopic } from './useApolloTopic';

// Re-export Apollo hook as main hook
export function useTopic(topicId: number) {
  return useApolloTopic(topicId);
}
