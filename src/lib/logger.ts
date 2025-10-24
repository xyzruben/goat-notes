/**
 * Centralized Logging Configuration using Pino
 *
 * Pino is a fast, low-overhead logger for Node.js applications.
 * It provides structured logging with minimal performance impact.
 *
 * Features:
 * - JSON structured logs for production
 * - Pretty-printed logs for development
 * - Request ID tracking
 * - Environment-based log levels
 * - Secure logging (no sensitive data)
 */

import pino from 'pino';

/**
 * Determine log level based on environment
 * - production: 'info' (default) - only log important information
 * - development: 'debug' - log detailed information for debugging
 * - test: 'silent' - suppress logs during testing
 */
const getLogLevel = (): string => {
  if (process.env.NODE_ENV === 'test') return 'silent';
  if (process.env.NODE_ENV === 'production') return process.env.LOG_LEVEL || 'info';
  return 'debug';
};

/**
 * Create base logger instance
 */
export const logger = pino({
  level: getLogLevel(),

  // Format timestamps in ISO 8601 format
  timestamp: pino.stdTimeFunctions.isoTime,

  // Pretty print in development, JSON in production
  transport: process.env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
      singleLine: false,
    },
  } : undefined,

  // Base fields included in all logs
  base: {
    env: process.env.NODE_ENV,
    revision: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
  },

  // Serialize errors properly
  serializers: {
    error: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },

  // Redact sensitive fields
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'password',
      'secret',
      'token',
      'apiKey',
      'api_key',
    ],
    censor: '[REDACTED]',
  },
});

/**
 * Create a child logger with additional context
 * Useful for adding request-specific information
 *
 * @example
 * const reqLogger = createLogger({ requestId: 'abc123', userId: 'user-456' });
 * reqLogger.info('User action performed');
 */
export function createLogger(context: Record<string, unknown>) {
  return logger.child(context);
}

/**
 * Log authentication events
 */
export const authLogger = logger.child({ module: 'auth' });

/**
 * Log database operations
 */
export const dbLogger = logger.child({ module: 'database' });

/**
 * Log API requests
 */
export const apiLogger = logger.child({ module: 'api' });

/**
 * Log AI/OpenAI operations
 */
export const aiLogger = logger.child({ module: 'ai' });

/**
 * Log security events
 */
export const securityLogger = logger.child({ module: 'security' });

/**
 * Helper function to log errors with context
 *
 * @example
 * try {
 *   // ... some operation
 * } catch (error) {
 *   logError('Operation failed', error, { userId: '123' });
 * }
 */
export function logError(
  message: string,
  error: unknown,
  context?: Record<string, unknown>
) {
  logger.error(
    {
      err: error,
      ...context,
    },
    message
  );
}

/**
 * Helper function to log with request ID
 * Extracts request ID from headers or generates one
 */
export function getRequestLogger(requestId?: string) {
  return logger.child({ requestId: requestId || generateRequestId() });
}

/**
 * Generate a unique request ID
 * Used for request correlation and tracing
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
