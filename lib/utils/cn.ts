import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges multiple class names or conditional classes using clsx and tailwind-merge.
 * Handles Tailwind class conflicts and conditional rendering.
 * 
 * @param inputs - Array of class names, objects, or conditional classes
 * @returns Merged and sanitized class string
 * 
 * @example
 * cn('px-2 py-1', condition && 'bg-blue-500', { 'text-white': isActive })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
