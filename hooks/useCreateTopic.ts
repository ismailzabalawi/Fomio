import { useBffCreateTopic } from './useBffMutations';

// Re-export BFF hook as main hook
export function useCreateTopic() {
  return useBffCreateTopic();
}
