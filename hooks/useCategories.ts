import { useBffCategories } from './useBffCategories';

// Re-export BFF hook as main hook
export function useCategories() {
  return useBffCategories();
}
