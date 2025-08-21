import { PrismaClient } from '@prisma/client'

// Global singleton for Prisma client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create optimized Prisma client with connection pooling
export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'file:./db/custom.db'
    }
  }
})

// Connection pooling configuration
if (process.env.NODE_ENV === 'production') {
  // Configure connection limits for production
  db.$connect()
    .then(() => {
      console.log('Database connected successfully')
    })
    .catch((error) => {
      console.error('Database connection failed:', error)
      process.exit(1)
    })
}

// Cache utility for frequently accessed data
export class DataCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  
  private isExpired(entry: { timestamp: number; ttl: number }): boolean {
    return Date.now() - entry.timestamp > entry.ttl
  }
  
  set(key: string, data: any, ttl: number = 300000): void { // Default 5 minutes
    this.cache.set(key, { data, timestamp: Date.now(), ttl })
  }
  
  get(key: string): any | null {
    const entry = this.cache.get(key)
    if (!entry || this.isExpired(entry)) {
      this.cache.delete(key)
      return null
    }
    return entry.data
  }
  
  clear(): void {
    this.cache.clear()
  }
  
  delete(key: string): void {
    this.cache.delete(key)
  }
}

export const dataCache = new DataCache()

// Database health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await db.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
}

// Optimized query helpers
export const dbQueries = {
  // Get restaurant settings with caching
  async getSettings() {
    const cacheKey = 'restaurant-settings'
    const cached = dataCache.get(cacheKey)
    if (cached) return cached
    
    const settings = await db.restaurantSettings.findFirst()
    dataCache.set(cacheKey, settings, 300000) // Cache for 5 minutes
    return settings
  },
  
  // Get categories with optimized includes
  async getCategories(includeItems: boolean = false) {
    const cacheKey = `categories-${includeItems}`
    const cached = dataCache.get(cacheKey)
    if (cached) return cached
    
    const categories = await db.category.findMany({
      where: { visible: true },
      include: includeItems ? {
        items: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            categoryId: true
          }
        }
      } : undefined,
      orderBy: { order: 'asc' }
    })
    
    dataCache.set(cacheKey, categories, 180000) // Cache for 3 minutes
    return categories
  },
  
  // Get menu items by category with caching
  async getItemsByCategory(categoryId: string) {
    const cacheKey = `items-category-${categoryId}`
    const cached = dataCache.get(cacheKey)
    if (cached) return cached
    
    const items = await db.menuItem.findMany({
      where: { categoryId },
      orderBy: { createdAt: 'asc' }
    })
    
    dataCache.set(cacheKey, items, 120000) // Cache for 2 minutes
    return items
  },
  
  // Clear cache when data changes
  async clearCache(type: 'settings' | 'categories' | 'items' | 'all') {
    switch (type) {
      case 'settings':
        dataCache.delete('restaurant-settings')
        break
      case 'categories':
        dataCache.delete('categories-true')
        dataCache.delete('categories-false')
        break
      case 'items':
        // Clear all item-related cache
        dataCache.clear() // Simplified for now
        break
      case 'all':
        dataCache.clear()
        break
    }
  }
}

// Transaction helper for complex operations
export async function executeTransaction<T>(
  operation: (tx: any) => Promise<T>
): Promise<T> {
  try {
    return await db.$transaction(operation)
  } catch (error) {
    console.error('Transaction failed:', error)
    throw new Error('Database operation failed')
  }
}

// Graceful shutdown handler
if (process.env.NODE_ENV === 'production') {
  const shutdown = async (signal: string) => {
    console.log(`Received ${signal}. Shutting down gracefully...`)
    try {
      await db.$disconnect()
      console.log('Database disconnected')
      process.exit(0)
    } catch (error) {
      console.error('Error during shutdown:', error)
      process.exit(1)
    }
  }
  
  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

// Only assign to global in development to prevent hot-reload issues
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}