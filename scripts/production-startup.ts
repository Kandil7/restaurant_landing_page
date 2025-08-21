#!/usr/bin/env node

/**
 * Production Startup Script
 * 
 * This script handles the production startup process including:
 * - Environment validation
 * - Database health checks
 * - Cache initialization
 * - Health monitoring
 * - Graceful shutdown handling
 */

import { db, checkDatabaseHealth, dataCache } from '../src/lib/db-optimized';
import { logger, HealthChecker, PerformanceMonitor } from '../src/lib/error-handler';
import { ensureDefaultData } from '../src/lib/seed';

class ProductionStartup {
  private isShuttingDown = false;
  private startupTime = Date.now();

  constructor() {
    // Register health checks
    this.registerHealthChecks();
    
    // Setup graceful shutdown
    this.setupGracefulShutdown();
  }

  private registerHealthChecks(): void {
    // Database health check
    HealthChecker.register('database', async () => {
      try {
        return await checkDatabaseHealth();
      } catch (error) {
        logger.error('Database health check failed', { error });
        return false;
      }
    });

    // Cache health check
    HealthChecker.register('cache', async () => {
      try {
        // Simple cache test
        dataCache.set('health-check', 'test', 5000);
        const result = dataCache.get('health-check');
        return result === 'test';
      } catch (error) {
        logger.error('Cache health check failed', { error });
        return false;
      }
    });

    // Memory health check
    HealthChecker.register('memory', async () => {
      try {
        const used = process.memoryUsage();
        const total = require('os').totalmem();
        const percentage = (used.heapUsed / total) * 100;
        return percentage < 90; // Alert if using more than 90% of memory
      } catch (error) {
        logger.error('Memory health check failed', { error });
        return false;
      }
    });
  }

  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string): Promise<void> => {
      if (this.isShuttingDown) {
        return;
      }

      this.isShuttingDown = true;
      logger.info(`Received ${signal}. Starting graceful shutdown...`);

      try {
        // Perform cleanup
        await this.cleanup();
        
        // Disconnect from database
        await db.$disconnect();
        
        logger.info('Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        logger.error('Error during graceful shutdown', { error });
        process.exit(1);
      }
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught exception', { error });
      shutdown('uncaughtException');
    });
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled promise rejection', { reason, promise });
      shutdown('unhandledRejection');
    });
  }

  private async cleanup(): Promise<void> {
    logger.info('Starting cleanup process...');
    
    // Clear cache
    dataCache.clear();
    
    // Close any open connections
    // Add any additional cleanup here
    
    logger.info('Cleanup completed');
  }

  private async validateEnvironment(): Promise<void> {
    logger.info('Validating environment...');
    
    const requiredEnvVars = [
      'NODE_ENV',
      'DATABASE_URL',
      'PORT',
      'NEXTAUTH_SECRET'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    // Validate Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 18) {
      throw new Error(`Node.js version 18 or higher is required. Current version: ${nodeVersion}`);
    }

    logger.info('Environment validation completed');
  }

  private async initializeDatabase(): Promise<void> {
    logger.info('Initializing database...');
    
    try {
      // Check database health
      const isHealthy = await checkDatabaseHealth();
      if (!isHealthy) {
        throw new Error('Database health check failed');
      }

      // Ensure default data exists
      await ensureDefaultData();
      
      logger.info('Database initialization completed');
    } catch (error) {
      logger.error('Database initialization failed', { error });
      throw error;
    }
  }

  private async initializeCache(): Promise<void> {
    logger.info('Initializing cache...');
    
    try {
      // Pre-warm cache with frequently accessed data
      const settings = await db.restaurantSettings.findFirst();
      if (settings) {
        dataCache.set('restaurant-settings', settings, 300000);
      }

      const categories = await db.category.findMany({
        where: { visible: true },
        orderBy: { order: 'asc' }
      });
      dataCache.set('categories-false', categories, 180000);
      
      logger.info('Cache initialization completed');
    } catch (error) {
      logger.error('Cache initialization failed', { error });
      throw error;
    }
  }

  private async performHealthChecks(): Promise<void> {
    logger.info('Performing initial health checks...');
    
    try {
      const results = await HealthChecker.runAll();
      const allHealthy = Object.values(results).every(result => result === true);
      
      if (!allHealthy) {
        const failedChecks = Object.entries(results)
          .filter(([_, result]) => !result)
          .map(([name]) => name);
        
        throw new Error(`Health checks failed: ${failedChecks.join(', ')}`);
      }
      
      logger.info('All health checks passed');
    } catch (error) {
      logger.error('Health checks failed', { error });
      throw error;
    }
  }

  private startHealthMonitoring(): void {
    logger.info('Starting health monitoring...');
    
    // Monitor health every 30 seconds
    setInterval(async () => {
      if (this.isShuttingDown) return;
      
      try {
        const results = await HealthChecker.runAll();
        const allHealthy = Object.values(results).every(result => result === true);
        
        if (!allHealthy) {
          const failedChecks = Object.entries(results)
            .filter(([_, result]) => !result)
            .map(([name]) => name);
          
          logger.warn('Health check failures detected', { failedChecks });
        }
      } catch (error) {
        logger.error('Health monitoring error', { error });
      }
    }, 30000); // 30 seconds
  }

  private logStartupInfo(): void {
    const startupDuration = Date.now() - this.startupTime;
    const memoryUsage = process.memoryUsage();
    
    logger.info('=== Production Startup Completed ===', {
      startupDuration: `${startupDuration}ms`,
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      memoryUsage: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
      },
      environment: process.env.NODE_ENV,
      port: process.env.PORT
    });
  }

  public async start(): Promise<void> {
    try {
      logger.info('Starting production application...');
      
      // Validate environment
      await PerformanceMonitor.measure('environment-validation', () => 
        this.validateEnvironment()
      );
      
      // Initialize database
      await PerformanceMonitor.measure('database-initialization', () => 
        this.initializeDatabase()
      );
      
      // Initialize cache
      await PerformanceMonitor.measure('cache-initialization', () => 
        this.initializeCache()
      );
      
      // Perform health checks
      await PerformanceMonitor.measure('health-checks', () => 
        this.performHealthChecks()
      );
      
      // Start health monitoring
      this.startHealthMonitoring();
      
      // Log startup information
      this.logStartupInfo();
      
      logger.info('Production application started successfully');
      
    } catch (error) {
      logger.error('Production startup failed', { error });
      process.exit(1);
    }
  }
}

// Start the production application
if (require.main === module) {
  const startup = new ProductionStartup();
  startup.start().catch((error) => {
    console.error('Failed to start production application:', error);
    process.exit(1);
  });
}

export { ProductionStartup };