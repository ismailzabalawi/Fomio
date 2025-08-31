// Discourse API Configuration
export const DISCOURSE_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_DISCOURSE_URL || 'https://meta.techrebels.info',
  apiKey: process.env.EXPO_PUBLIC_DISCOURSE_API_KEY,
  username: process.env.EXPO_PUBLIC_DISCOURSE_USERNAME,
};

// API Endpoints
export const DISCOURSE_ENDPOINTS = {
  latest: '/latest.json',
  topic: (id: number) => `/t/${id}.json`,
  categories: '/categories.json',
  session: '/session',
  posts: '/posts',
  user: (username: string) => `/u/${username}.json`,
  search: (query: string) => `/search.json?q=${encodeURIComponent(query)}`,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  VALIDATION_ERROR: 'Invalid data provided. Please check your input.',
} as const;
