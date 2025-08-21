// Error handling and logging utilities for production

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  userId?: string;
  requestId?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  statusCode: number;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly context?: Record<string, any>;

  constructor(
    code: string,
    message: string,
    statusCode: number = 500,
    context?: Record<string, any>
  ) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode
    this.context = context
    Error.captureStackTrace(this, AppError)
  }
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;

  constructor() {
    this.logLevel = this.getLogLevelFromEnv()
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private getLogLevelFromEnv(): LogLevel {
    const envLevel = process.env.LOG_LEVEL?.toUpperCase()
    switch (envLevel) {
      case 'DEBUG': return LogLevel.DEBUG
      case 'INFO': return LogLevel.INFO
      case 'WARN': return LogLevel.WARN
      case 'ERROR': return LogLevel.ERROR
      default: return LogLevel.INFO
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel
  }

  private formatMessage(level: LogLevel, message: string, context?: Record<string, any>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      requestId: this.generateRequestId()
    }
  }

  private generateRequestId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  private writeLog(entry: LogEntry): void {
    // Keep logs in memory for debugging
    this.logs.push(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Write to console in production
    if (process.env.NODE_ENV === 'production') {
      const levelName = LogLevel[entry.level]
      const message = `[${entry.timestamp}] [${levelName}] ${entry.message}`
      
      if (entry.context) {
        console.log(message, entry.context)
      } else {
        console.log(message)
      }
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const entry = this.formatMessage(LogLevel.DEBUG, message, context)
      this.writeLog(entry)
    }
  }

  info(message: string, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const entry = this.formatMessage(LogLevel.INFO, message, context)
      this.writeLog(entry)
    }
  }

  warn(message: string, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.WARN)) {
      const entry = this.formatMessage(LogLevel.WARN, message, context)
      this.writeLog(entry)
    }
  }

  error(message: string, context?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const entry = this.formatMessage(LogLevel.ERROR, message, context)
      this.writeLog(entry)
    }
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level >= level)
    }
    return [...this.logs]
  }

  clearLogs(): void {
    this.logs = []
  }
}

// Error handling utilities
export const ErrorHandler = {
  // Handle API errors consistently
  handleApiError: (error: unknown, context?: Record<string, any>): ApiError => {
    const logger = Logger.getInstance()
    
    if (error instanceof AppError) {
      logger.error(error.message, { ...context, code: error.code })
      return {
        code: error.code,
        message: error.message,
        details: error.context,
        statusCode: error.statusCode
      }
    }

    if (error instanceof Error) {
      logger.error(error.message, context)
      return {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        details: { originalError: error.message, ...context },
        statusCode: 500
      }
    }

    logger.error('Unknown error occurred', { error, ...context })
    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
      statusCode: 500
    }
  },

  // Wrap async functions with error handling
  asyncHandler: <T extends (...args: any[]) => any>(
    fn: T
  ): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
    return async (...args: Parameters<T>) => {
      try {
        return await fn(...args)
      } catch (error) {
        const logger = Logger.getInstance()
        const apiError = ErrorHandler.handleApiError(error)
        logger.error('Async handler failed', { 
          functionName: fn.name, 
          args: args.map(arg => typeof arg),
          error: apiError 
        })
        throw error
      }
    }
  },

  // Database error handler
  handleDatabaseError: (error: unknown, operation: string): never => {
    const logger = Logger.getInstance()
    
    if (error instanceof Error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        const apiError = {
          code: 'DUPLICATE_ENTRY',
          message: 'A record with this information already exists',
          statusCode: 409
        }
        logger.error(`Database operation failed: ${operation}`, { error: error.message, operation })
        throw new AppError(apiError.code, apiError.message, apiError.statusCode, { operation })
      }

      if (error.message.includes('FOREIGN KEY constraint failed')) {
        const apiError = {
          code: 'FOREIGN_KEY_VIOLATION',
          message: 'Referenced record does not exist',
          statusCode: 400
        }
        logger.error(`Database operation failed: ${operation}`, { error: error.message, operation })
        throw new AppError(apiError.code, apiError.message, apiError.statusCode, { operation })
      }
    }

    const apiError = {
      code: 'DATABASE_ERROR',
      message: 'Database operation failed',
      statusCode: 500
    }
    logger.error(`Database operation failed: ${operation}`, { error, operation })
    throw new AppError(apiError.code, apiError.message, apiError.statusCode, { operation })
  },

  // Authentication error handler
  handleAuthError: (message: string = 'Authentication failed'): never => {
    const logger = Logger.getInstance()
    const apiError = {
      code: 'AUTHENTICATION_ERROR',
      message,
      statusCode: 401
    }
    logger.error('Authentication failed', { message })
    throw new AppError(apiError.code, apiError.message, apiError.statusCode)
  },

  // Authorization error handler
  handleAuthzError: (message: string = 'Authorization failed'): never => {
    const logger = Logger.getInstance()
    const apiError = {
      code: 'AUTHORIZATION_ERROR',
      message,
      statusCode: 403
    }
    logger.error('Authorization failed', { message })
    throw new AppError(apiError.code, apiError.message, apiError.statusCode)
  },

  // Validation error handler
  handleValidationError: (message: string, details?: Record<string, any>): never => {
    const logger = Logger.getInstance()
    const apiError = {
      code: 'VALIDATION_ERROR',
      message,
      statusCode: 400
    }
    logger.error('Validation failed', { message, details })
    throw new AppError(apiError.code, apiError.message, apiError.statusCode, { details })
  },

  // Not found error handler
  handleNotFoundError: (resource: string, id?: string): never => {
    const logger = Logger.getInstance()
    const message = id ? `${resource} with id ${id} not found` : `${resource} not found`
    const apiError = {
      code: 'NOT_FOUND',
      message,
      statusCode: 404
    }
    logger.error('Resource not found', { resource, id })
    throw new AppError(apiError.code, apiError.message, apiError.statusCode, { resource, id })
  }
}

// Request/response logging middleware
export const RequestLogger = {
  logRequest: (req: Request, res: Response, duration: number): void => {
    const logger = Logger.getInstance()
    const logData = {
      method: req.method,
      url: req.url,
      userAgent: req.headers.get('user-agent'),
      statusCode: res.status,
      duration,
      timestamp: new Date().toISOString()
    }
    
    if (res.status >= 400) {
      logger.error('HTTP request failed', logData)
    } else {
      logger.info('HTTP request completed', logData)
    }
  }
}

// Performance monitoring
export const PerformanceMonitor = {
  measure: async <T>(
    operation: string,
    fn: () => Promise<T>,
    threshold: number = 1000
  ): Promise<T> => {
    const start = performance.now()
    try {
      const result = await fn()
      const duration = performance.now() - start
      
      if (duration > threshold) {
        const logger = Logger.getInstance()
        logger.warn(`Slow operation detected`, { operation, duration, threshold })
      }
      
      return result
    } catch (error) {
      const duration = performance.now() - start
      const logger = Logger.getInstance()
      logger.error(`Operation failed`, { operation, duration, error })
      throw error
    }
  }
}

// Health check utilities
export const HealthChecker = {
  checks: new Map<string, () => Promise<boolean>>(),
  
  register: (name: string, check: () => Promise<boolean>): void => {
    HealthChecker.checks.set(name, check)
  },
  
  runAll: async (): Promise<Record<string, boolean>> => {
    const results: Record<string, boolean> = {}
    const logger = Logger.getInstance()
    
    for (const [name, check] of HealthChecker.checks) {
      try {
        results[name] = await check()
      } catch (error) {
        logger.error(`Health check failed for ${name}`, { error })
        results[name] = false
      }
    }
    
    return results
  },
  
  isHealthy: async (): Promise<boolean> => {
    const results = await HealthChecker.runAll()
    return Object.values(results).every(result => result === true)
  }
}

// Export singleton instance
export const logger = Logger.getInstance()