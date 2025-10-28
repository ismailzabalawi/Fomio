import { useApolloCreatePost } from './useApolloCreatePost';

// Re-export Apollo hook as main hook
export function useCreatePost() {
  return useApolloCreatePost();
}

// Re-export types for convenience
export type {
  CreatePostInput,
  CreatePostResponse,
} from './useApolloCreatePost';
