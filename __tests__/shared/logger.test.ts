/**
 * Unit tests for logger utility
 */

import { logger, logError, withLogging } from '../../shared/logger';

// Mock console methods
const originalConsole = global.console;
beforeEach(() => {
  global.console = {
    ...originalConsole,
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  };
});

afterEach(() => {
  global.console = originalConsole;
});

describe('Logger Utility', () => {
  describe('logger.info', () => {
    it('should log info messages in development', () => {
      const originalDev = __DEV__;
      (global as any).__DEV__ = true;
      
      logger.info('Test info message');
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        'Test info message'
      );
      
      (global as any).__DEV__ = originalDev;
    });

    it('should not log info messages in production', () => {
      const originalDev = __DEV__;
      (global as any).__DEV__ = false;
      
      logger.info('Test info message');
      
      expect(console.log).not.toHaveBeenCalled();
      
      (global as any).__DEV__ = originalDev;
    });

    it('should handle multiple arguments', () => {
      const originalDev = __DEV__;
      (global as any).__DEV__ = true;
      
      logger.info('Test message', { data: 'test' }, 123);
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]'),
        'Test message',
        { data: 'test' },
        123
      );
      
      (global as any).__DEV__ = originalDev;
    });
  });

  describe('logger.warn', () => {
    it('should log warning messages', () => {
      logger.warn('Test warning');
      
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN]'),
        'Test warning'
      );
    });
  });

  describe('logger.error', () => {
    it('should log error messages', () => {
      logger.error('Test error');
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        'Test error'
      );
    });

    it('should handle Error objects', () => {
      const error = new Error('Test error object');
      logger.error('Error occurred:', error);
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        'Error occurred:',
        error
      );
    });
  });

  describe('logger.debug', () => {
    it('should log debug messages in development', () => {
      const originalDev = __DEV__;
      (global as any).__DEV__ = true;
      
      logger.debug('Debug message');
      
      expect(console.debug).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG]'),
        'Debug message'
      );
      
      (global as any).__DEV__ = originalDev;
    });

    it('should not log debug messages in production', () => {
      const originalDev = __DEV__;
      (global as any).__DEV__ = false;
      
      logger.debug('Debug message');
      
      expect(console.debug).not.toHaveBeenCalled();
      
      (global as any).__DEV__ = originalDev;
    });
  });

  describe('logger.auth', () => {
    it('should log authentication events', () => {
      logger.auth('sign-in', { userId: '123' });
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[AUTH]'),
        'sign-in',
        { userId: '123' }
      );
    });
  });

  describe('logError function', () => {
    it('should log errors with context', () => {
      const error = new Error('Test error');
      const context = { component: 'TestComponent' };
      
      logError(error, context);
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        'Error in TestComponent:',
        error,
        context
      );
    });

    it('should handle errors without context', () => {
      const error = new Error('Test error');
      
      logError(error);
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR]'),
        'Unhandled error:',
        error,
        {}
      );
    });
  });

  describe('withLogging HOC', () => {
    it('should wrap component with logging', () => {
      const TestComponent = () => null;
      const WrappedComponent = withLogging(TestComponent, 'TestComponent');
      
      expect(WrappedComponent.displayName).toBe('withLogging(TestComponent)');
    });

    it('should use component name if no name provided', () => {
      const TestComponent = () => null;
      TestComponent.displayName = 'TestComponent';
      
      const WrappedComponent = withLogging(TestComponent);
      
      expect(WrappedComponent.displayName).toBe('withLogging(TestComponent)');
    });
  });
});

