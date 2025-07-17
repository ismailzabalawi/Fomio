/**
 * Production-ready logging utility
 * Replaces console.log statements with proper error handling and logging
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: any;
}

class Logger {
  private isDevelopment = __DEV__;
  private minLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN;

  private formatMessage(level: LogLevel, message: string, context?: any): string {
    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    const contextStr = context ? ` | Context: ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${levelName}: ${message}${contextStr}`;
  }

  debug(message: string, context?: any): void {
    if (this.minLevel <= LogLevel.DEBUG) {
      console.log(this.formatMessage(LogLevel.DEBUG, message, context));
    }
  }

  info(message: string, context?: any): void {
    if (this.minLevel <= LogLevel.INFO) {
      console.info(this.formatMessage(LogLevel.INFO, message, context));
    }
  }

  warn(message: string, context?: any): void {
    if (this.minLevel <= LogLevel.WARN) {
      console.warn(this.formatMessage(LogLevel.WARN, message, context));
    }
  }

  error(message: string, error?: Error | any, context?: any): void {
    if (this.minLevel <= LogLevel.ERROR) {
      const errorInfo = error instanceof Error 
        ? { name: error.name, message: error.message, stack: error.stack }
        : error;
      
      console.error(this.formatMessage(LogLevel.ERROR, message, { error: errorInfo, ...context }));
    }
  }

  /**
   * Log authentication events
   */
  auth(action: string, success: boolean, details?: any): void {
    const message = `Auth ${action}: ${success ? 'SUCCESS' : 'FAILED'}`;
    if (success) {
      this.info(message, details);
    } else {
      this.warn(message, details);
    }
  }

  /**
   * Log API calls
   */
  api(method: string, url: string, status?: number, duration?: number): void {
    const message = `API ${method} ${url}`;
    const context = { status, duration };
    
    if (status && status >= 400) {
      this.error(message, undefined, context);
    } else {
      this.info(message, context);
    }
  }

  /**
   * Log user actions
   */
  userAction(action: string, details?: any): void {
    this.info(`User Action: ${action}`, details);
  }
}

export const logger = new Logger();

/**
 * Error boundary helper
 */
export function logError(error: Error, errorInfo?: any): void {
  logger.error('Unhandled Error', error, errorInfo);
}

/**
 * Async operation wrapper with logging
 */
export async function withLogging<T>(
  operation: () => Promise<T>,
  operationName: string,
  context?: any
): Promise<T> {
  const startTime = Date.now();
  logger.debug(`Starting ${operationName}`, context);
  
  try {
    const result = await operation();
    const duration = Date.now() - startTime;
    logger.info(`Completed ${operationName}`, { duration, ...context });
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`Failed ${operationName}`, error, { duration, ...context });
    throw error;
  }
}

