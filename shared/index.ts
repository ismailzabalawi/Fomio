export { useAuth } from './useAuth';
export { useCreateByte } from './useCreateByte';
export { useFeed } from './useFeed';
export { logger, logError, withLogging } from './logger';

// Design System exports
export * from './design-system';

// Performance Optimization exports
export * from './performance-monitor';
export * from './memory-optimizer';
export * from './lazy-loading';

// Discourse integration exports
export { 
  discourseApi, 
  DiscourseApiService,
  type DiscourseConfig,
  type DiscourseUser,
  type UserSettings,
  type DiscourseApiResponse,
  type LoginResponse
} from './discourseApi';

export { 
  useDiscourseUser,
  type UseDiscourseUserReturn 
} from './useDiscourseUser';

