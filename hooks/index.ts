// Export all hooks
export { useAuth } from './useAuth';
export { useCategories } from './useCategories';
export { useCreatePost } from './useCreatePost';
export { useCreateTopic } from './useCreateTopic';
export { useFeed } from './useFeed';
export { useNotifications } from './useNotifications';
export { useSearch } from './useSearch';
export { useTopic } from './useTopic';
export { useUserInteractions } from './useUserInteractions';

// Apollo GraphQL hooks
export { useApolloFeed } from './useApolloFeed';
export { useApolloCreatePost } from './useApolloCreatePost';
export { useApolloTopic } from './useApolloTopic';
export { useApolloProfile } from './useApolloProfile';
export { useApolloNotifications } from './useApolloNotifications';

// BFF hooks
export { useBffFeed } from './useBffFeed';
export { useBffCategories } from './useBffCategories';
export { useBffTopic } from './useBffTopic';
// Removed useDiscourse and useApolloDiscourse - replaced with BFF integration
