// BFF API Configuration (Phase 2 will implement)
export const BFF_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_MCP_BASE_URL || 'https://bff.example.com',
  deepLinkScheme: process.env.EXPO_PUBLIC_DEEP_LINK_SCHEME || 'fomio',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  VALIDATION_ERROR: 'Invalid data provided. Please check your input.',
  BACKEND_UPGRADING: 'Backend is being upgraded. Please try again later.',
} as const;
