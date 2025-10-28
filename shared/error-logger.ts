import * as FileSystem from 'expo-file-system';

export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'API';
  category:
    | 'AUTH'
    | 'API'
    | 'UI'
    | 'NAVIGATION'
    | 'STORAGE'
    | 'CSRF'
    | 'GENERAL';
  message: string;
  details?: any;
  stack?: string;
  userId?: string;
  sessionId?: string;
}

export interface ErrorLog {
  error: Error;
  context: string;
  additionalData?: any;
  userId?: string;
  sessionId?: string;
}

class ErrorLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory
  private logFilePath: string;
  private isInitialized = false;

  constructor() {
    this.logFilePath = `${FileSystem.documentDirectory}error-logs.json`;
    this.initializeLogger();
  }

  private async initializeLogger() {
    try {
      // Check if log file exists
      const fileInfo = await FileSystem.getInfoAsync(this.logFilePath);
      if (fileInfo.exists) {
        // Load existing logs
        const existingLogs = await FileSystem.readAsStringAsync(
          this.logFilePath
        );
        this.logs = JSON.parse(existingLogs);
        console.log('📋 Loaded existing logs:', this.logs.length);
      }
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize logger:', error);
    }
  }

  private async saveLogs() {
    if (!this.isInitialized) return;

    try {
      await FileSystem.writeAsStringAsync(
        this.logFilePath,
        JSON.stringify(this.logs, null, 2)
      );
    } catch (error) {
      console.error('Failed to save logs:', error);
    }
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Save logs to file
    this.saveLogs();

    // Also log to console for immediate visibility
    const consoleMethod =
      entry.level === 'ERROR'
        ? 'error'
        : entry.level === 'WARN'
          ? 'warn'
          : entry.level === 'DEBUG'
            ? 'log'
            : 'log';

    const emoji = {
      INFO: 'ℹ️',
      WARN: '⚠️',
      ERROR: '❌',
      DEBUG: '🐛',
      API: '🌐',
    }[entry.level];

    console[consoleMethod](
      `${emoji} [${entry.category}] ${entry.message}`,
      entry.details ? entry.details : '',
      entry.stack ? `\nStack: ${entry.stack}` : ''
    );
  }

  // General logging methods
  info(
    category: LogEntry['category'],
    message: string,
    details?: any,
    userId?: string
  ) {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      category,
      message,
      details,
      userId,
    });
  }

  warn(
    category: LogEntry['category'],
    message: string,
    details?: any,
    userId?: string
  ) {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: 'WARN',
      category,
      message,
      details,
      userId,
    });
  }

  debug(
    category: LogEntry['category'],
    message: string,
    details?: any,
    userId?: string
  ) {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: 'DEBUG',
      category,
      message,
      details,
      userId,
    });
  }

  // API-specific logging
  apiCall(
    method: string,
    url: string,
    status?: number,
    responseTime?: number,
    details?: any
  ) {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: 'API',
      category: 'API',
      message: `${method} ${url}${status ? ` - ${status}` : ''}${responseTime ? ` (${responseTime}ms)` : ''}`,
      details,
    });
  }

  apiError(method: string, url: string, error: any, details?: any) {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      category: 'API',
      message: `API Error: ${method} ${url}`,
      details: {
        error: error.message || error,
        ...details,
      },
      stack: error.stack,
    });
  }

  // Error logging with context
  error(
    category: LogEntry['category'],
    error: Error | string,
    context?: string,
    additionalData?: any,
    userId?: string
  ) {
    const message = typeof error === 'string' ? error : error.message;
    const stack = typeof error === 'string' ? undefined : error.stack;

    this.addLog({
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      category,
      message: context ? `${context}: ${message}` : message,
      details: additionalData,
      stack,
      userId,
    });
  }

  // Authentication logging
  authEvent(event: string, details?: any, userId?: string) {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      category: 'AUTH',
      message: `Auth: ${event}`,
      details,
      userId,
    });
  }

  // CSRF token logging
  csrfEvent(event: string, details?: any, userId?: string) {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      category: 'CSRF',
      message: `CSRF: ${event}`,
      details,
      userId,
    });
  }

  // Navigation logging
  navigationEvent(from: string, to: string, details?: any) {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      category: 'NAVIGATION',
      message: `Navigation: ${from} → ${to}`,
      details,
    });
  }

  // Storage logging
  storageEvent(event: string, details?: any, userId?: string) {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      category: 'STORAGE',
      message: `Storage: ${event}`,
      details,
      userId,
    });
  }

  // Get all logs
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  // Get logs by category
  getLogsByCategory(category: LogEntry['category']): LogEntry[] {
    return this.logs.filter((log) => log.category === category);
  }

  // Get logs by level
  getLogsByLevel(level: LogEntry['level']): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  // Get recent logs
  getRecentLogs(count: number = 50): LogEntry[] {
    return this.logs.slice(-count);
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
    this.saveLogs();
  }

  // Export logs
  async exportLogs(): Promise<string> {
    try {
      const logs = this.getLogs();
      const exportData = {
        exportedAt: new Date().toISOString(),
        totalLogs: logs.length,
        logs,
      };

      const exportPath = `${FileSystem.documentDirectory}exported-logs-${Date.now()}.json`;
      await FileSystem.writeAsStringAsync(
        exportPath,
        JSON.stringify(exportData, null, 2)
      );

      this.info('GENERAL', 'Logs exported successfully', { exportPath });
      return exportPath;
    } catch (error) {
      this.error('GENERAL', error as Error, 'Failed to export logs');
      throw error;
    }
  }

  // Get log statistics
  getLogStats() {
    const total = this.logs.length;
    const byLevel = this.logs.reduce(
      (acc, log) => {
        acc[log.level] = (acc[log.level] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const byCategory = this.logs.reduce(
      (acc, log) => {
        acc[log.category] = (acc[log.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      total,
      byLevel,
      byCategory,
      oldestLog: this.logs[0]?.timestamp,
      newestLog: this.logs[this.logs.length - 1]?.timestamp,
    };
  }
}

// Create and export singleton instance
export const errorLogger = new ErrorLogger();

// Convenience functions
export const logInfo = (
  category: LogEntry['category'],
  message: string,
  details?: any,
  userId?: string
) => errorLogger.info(category, message, details, userId);

export const logWarn = (
  category: LogEntry['category'],
  message: string,
  details?: any,
  userId?: string
) => errorLogger.warn(category, message, details, userId);

export const logError = (
  category: LogEntry['category'],
  error: Error | string,
  context?: string,
  additionalData?: any,
  userId?: string
) => errorLogger.error(category, error, context, additionalData, userId);

export const logApiCall = (
  method: string,
  url: string,
  status?: number,
  responseTime?: number,
  details?: any
) => errorLogger.apiCall(method, url, status, responseTime, details);

export const logApiError = (
  method: string,
  url: string,
  error: any,
  details?: any
) => errorLogger.apiError(method, url, error, details);

export const logAuth = (event: string, details?: any, userId?: string) =>
  errorLogger.authEvent(event, details, userId);

export const logCsrf = (event: string, details?: any, userId?: string) =>
  errorLogger.csrfEvent(event, details, userId);

export const logNavigation = (from: string, to: string, details?: any) =>
  errorLogger.navigationEvent(from, to, details);

export const logStorage = (event: string, details?: any, userId?: string) =>
  errorLogger.storageEvent(event, details, userId);

export default errorLogger;
