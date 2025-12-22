import NodeCache from "node-cache"

/**
 * Cache Service using node-cache
 *
 * Provides in-memory caching with TTL support for:
 * - pNode data (30s TTL)
 * - Node stats (120s TTL)
 * - Analytics (60s TTL)
 * - Geo location (24h TTL)
 */

class CacheService {
  private cache: NodeCache

  constructor(defaultTtlSeconds: number) {
    this.cache = new NodeCache({
      stdTTL: defaultTtlSeconds,
      checkperiod: defaultTtlSeconds * 0.2,
      useClones: false, // Better performance, data should be immutable
    })
  }

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key)
  }

  set<T>(key: string, value: T, ttlSeconds?: number): boolean {
    if (ttlSeconds !== undefined) {
      return this.cache.set(key, value, ttlSeconds)
    }
    return this.cache.set(key, value)
  }

  delete(key: string): number {
    return this.cache.del(key)
  }

  flush(): void {
    this.cache.flushAll()
  }

  keys(): string[] {
    return this.cache.keys()
  }

  getStats() {
    return this.cache.getStats()
  }
}

// Create service instances with different TTLs
export const nodeCacheService = new CacheService(30) // 30 seconds for node data
export const statsCacheService = new CacheService(120) // 120 seconds for stats
export const analyticsCacheService = new CacheService(60) // 60 seconds for analytics
export const geoCacheService = new CacheService(86400) // 24 hours for geo data
