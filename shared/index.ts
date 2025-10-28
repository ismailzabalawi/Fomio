export { useAuth } from './useAuth';
export { useCreateByte } from './useCreateByte';
export { useFeed } from './useFeed';
export { logger, logError, withLogging } from './logger';
export { SessionStorage } from './session-storage';

// Design System exports
export * from './design-system';

// Performance Optimization exports
export * from './performance-monitor';
export {
  memoryOptimizer,
  useMemoryOptimization,
  useTrackedTimeout,
  useTrackedInterval,
  useEffectWithCleanup,
} from './memory-optimizer';
export * from './lazy-loading';

// Error Handling & UX exports
export * from './error-handling';
export * from './offline-support';
export * from './form-validation';

// BFF integration exports (replacing old Discourse integration)
export {
  useDiscourseUser,
  type UseDiscourseUserReturn,
} from './useDiscourseUser';
