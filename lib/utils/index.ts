// Re-export utility functions
export { cn } from './cn';
export {
  getThemeColor,
  useThemeColors,
  getColorFromTheme,
} from './theme';

// Type exports
export type { ClassValue } from 'clsx';

/**
 * Utility type for component variants
 */
export type VariantProps<T extends (...args: any) => any> = Parameters<T>[0];

/**
 * Type-safe object keys utility
 */
export const objectKeys = <T extends object>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
};

/**
 * Safely access nested object properties
 */
export function get<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

/**
 * Delay utility for animations/transitions
 */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Type guard for non-nullable values
 */
export function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}
