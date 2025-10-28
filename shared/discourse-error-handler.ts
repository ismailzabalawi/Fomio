import { Alert } from 'react-native';

export interface DiscourseError {
  code: string;
  message: string;
  userMessage: string;
  retryable: boolean;
  requiresAuth: boolean;
}

export class DiscourseErrorHandler {
  private static readonly ERROR_CODES = {
    // Authentication errors
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    INVALID_TOKEN: 'INVALID_TOKEN',

    // Network errors
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT: 'TIMEOUT',

    // Server errors
    SERVER_ERROR: 'SERVER_ERROR',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',

    // Client errors
    BAD_REQUEST: 'BAD_REQUEST',
    NOT_FOUND: 'NOT_FOUND',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    RATE_LIMITED: 'RATE_LIMITED',

    // Discourse-specific errors
    TOPIC_NOT_FOUND: 'TOPIC_NOT_FOUND',
    POST_NOT_FOUND: 'POST_NOT_FOUND',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    CATEGORY_NOT_FOUND: 'CATEGORY_NOT_FOUND',
    INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  } as const;

  static categorizeError(error: any): DiscourseError {
    const errorMessage =
      error?.message || error?.toString() || 'Unknown error occurred';

    // Check for specific error patterns
    if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
      return {
        code: this.ERROR_CODES.UNAUTHORIZED,
        message: errorMessage,
        userMessage: 'You need to be logged in to perform this action.',
        retryable: false,
        requiresAuth: true,
      };
    }

    if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
      return {
        code: this.ERROR_CODES.FORBIDDEN,
        message: errorMessage,
        userMessage: "You don't have permission to perform this action.",
        retryable: false,
        requiresAuth: false,
      };
    }

    if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
      return {
        code: this.ERROR_CODES.NOT_FOUND,
        message: errorMessage,
        userMessage: 'The requested content was not found.',
        retryable: false,
        requiresAuth: false,
      };
    }

    if (errorMessage.includes('429') || errorMessage.includes('Rate Limited')) {
      return {
        code: this.ERROR_CODES.RATE_LIMITED,
        message: errorMessage,
        userMessage:
          "You're making too many requests. Please wait a moment and try again.",
        retryable: true,
        requiresAuth: false,
      };
    }

    if (errorMessage.includes('500') || errorMessage.includes('Server Error')) {
      return {
        code: this.ERROR_CODES.SERVER_ERROR,
        message: errorMessage,
        userMessage: 'The server encountered an error. Please try again later.',
        retryable: true,
        requiresAuth: false,
      };
    }

    if (errorMessage.includes('Network') || errorMessage.includes('fetch')) {
      return {
        code: this.ERROR_CODES.NETWORK_ERROR,
        message: errorMessage,
        userMessage:
          'Network error. Please check your connection and try again.',
        retryable: true,
        requiresAuth: false,
      };
    }

    if (
      errorMessage.includes('Validation') ||
      errorMessage.includes('Invalid')
    ) {
      return {
        code: this.ERROR_CODES.VALIDATION_ERROR,
        message: errorMessage,
        userMessage:
          'Invalid data provided. Please check your input and try again.',
        retryable: false,
        requiresAuth: false,
      };
    }

    // Default error
    return {
      code: 'UNKNOWN',
      message: errorMessage,
      userMessage: 'An unexpected error occurred. Please try again.',
      retryable: true,
      requiresAuth: false,
    };
  }

  static showErrorAlert(
    error: DiscourseError,
    onRetry?: () => void,
    onDismiss?: () => void
  ) {
    const buttons = [];

    if (error.retryable && onRetry) {
      buttons.push({
        text: 'Try Again',
        onPress: onRetry,
      });
    }

    buttons.push({
      text: 'OK',
      onPress: onDismiss,
    });

    Alert.alert('Error', error.userMessage, buttons, { cancelable: false });
  }

  static showNetworkError(onRetry?: () => void) {
    this.showErrorAlert(
      {
        code: this.ERROR_CODES.NETWORK_ERROR,
        message: 'Network error occurred',
        userMessage:
          'Unable to connect to the server. Please check your internet connection and try again.',
        retryable: true,
        requiresAuth: false,
      },
      onRetry
    );
  }

  static showAuthError(onLogin?: () => void) {
    this.showErrorAlert(
      {
        code: this.ERROR_CODES.UNAUTHORIZED,
        message: 'Authentication required',
        userMessage:
          'You need to be logged in to perform this action. Would you like to sign in now?',
        retryable: false,
        requiresAuth: true,
      },
      undefined,
      onLogin
    );
  }

  static showRateLimitError(onRetry?: () => void) {
    this.showErrorAlert(
      {
        code: this.ERROR_CODES.RATE_LIMITED,
        message: 'Rate limited',
        userMessage:
          "You're making too many requests. Please wait a moment and try again.",
        retryable: true,
        requiresAuth: false,
      },
      onRetry
    );
  }

  static showValidationError(message: string) {
    this.showErrorAlert({
      code: this.ERROR_CODES.VALIDATION_ERROR,
      message,
      userMessage: message,
      retryable: false,
      requiresAuth: false,
    });
  }

  static isRetryableError(error: DiscourseError): boolean {
    return error.retryable;
  }

  static requiresAuthentication(error: DiscourseError): boolean {
    return error.requiresAuth;
  }

  static getErrorMessage(error: any): string {
    const discourseError = this.categorizeError(error);
    return discourseError.userMessage;
  }

  static logError(error: any, context: string) {
    const discourseError = this.categorizeError(error);
    console.error(`Discourse Error [${context}]:`, {
      code: discourseError.code,
      message: discourseError.message,
      userMessage: discourseError.userMessage,
      retryable: discourseError.retryable,
      requiresAuth: discourseError.requiresAuth,
    });
  }
}

export default DiscourseErrorHandler;
