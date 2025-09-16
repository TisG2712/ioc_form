import { useCallback, useMemo, useRef } from 'react';
import { indexedDBService } from '../service/indexedDBService';

// Hook tối ưu hóa cho việc quản lý cache
export const useOptimizedCache = () => {
  const cacheRef = useRef(new Map());
  const loadingRef = useRef(new Set());

  // Memoized cache key generator
  const generateCacheKey = useCallback((category, params = {}) => {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    return `${category}${paramString ? `|${paramString}` : ''}`;
  }, []);

  // Check if data is cached
  const isCached = useCallback((key) => {
    return cacheRef.current.has(key);
  }, []);

  // Get cached data
  const getCached = useCallback((key) => {
    return cacheRef.current.get(key);
  }, []);

  // Set cached data
  const setCached = useCallback((key, data, ttl = 300000) => { // 5 minutes default TTL
    const cacheItem = {
      data,
      timestamp: Date.now(),
      ttl
    };
    cacheRef.current.set(key, cacheItem);
  }, []);

  // Check if cache item is expired
  const isExpired = useCallback((key) => {
    const item = cacheRef.current.get(key);
    if (!item) return true;
    
    const now = Date.now();
    return (now - item.timestamp) > item.ttl;
  }, []);

  // Get valid cached data (not expired)
  const getValidCached = useCallback((key) => {
    if (!isCached(key) || isExpired(key)) {
      cacheRef.current.delete(key);
      return null;
    }
    return getCached(key)?.data;
  }, [isCached, isExpired, getCached]);

  // Async cache with loading state
  const getOrFetch = useCallback(async (key, fetchFn, ttl) => {
    // Check if already loading
    if (loadingRef.current.has(key)) {
      return null;
    }

    // Check cache first
    const cached = getValidCached(key);
    if (cached) {
      return cached;
    }

    // Set loading state
    loadingRef.current.add(key);

    try {
      // Fetch data
      const data = await fetchFn();
      
      // Cache the data
      setCached(key, data, ttl);
      
      return data;
    } catch (error) {
      console.error(`Error fetching data for key ${key}:`, error);
      throw error;
    } finally {
      // Remove loading state
      loadingRef.current.delete(key);
    }
  }, [getValidCached, setCached]);

  // Clear specific cache
  const clearCache = useCallback((key) => {
    cacheRef.current.delete(key);
  }, []);

  // Clear all cache
  const clearAllCache = useCallback(() => {
    cacheRef.current.clear();
    loadingRef.current.clear();
  }, []);

  // Clear expired cache
  const clearExpiredCache = useCallback(() => {
    const now = Date.now();
    for (const [key, item] of cacheRef.current.entries()) {
      if ((now - item.timestamp) > item.ttl) {
        cacheRef.current.delete(key);
      }
    }
  }, []);

  // Get cache statistics
  const getCacheStats = useCallback(() => {
    const now = Date.now();
    let validCount = 0;
    let expiredCount = 0;
    let totalSize = 0;

    for (const [key, item] of cacheRef.current.entries()) {
      const size = JSON.stringify(item.data).length;
      totalSize += size;
      
      if ((now - item.timestamp) > item.ttl) {
        expiredCount++;
      } else {
        validCount++;
      }
    }

    return {
      totalItems: cacheRef.current.size,
      validItems: validCount,
      expiredItems: expiredCount,
      totalSize: Math.round(totalSize / 1024), // KB
      loadingItems: loadingRef.current.size
    };
  }, []);

  // Memoized return object
  return useMemo(() => ({
    isCached,
    getCached,
    setCached,
    isExpired,
    getValidCached,
    getOrFetch,
    clearCache,
    clearAllCache,
    clearExpiredCache,
    getCacheStats,
    generateCacheKey
  }), [
    isCached,
    getCached,
    setCached,
    isExpired,
    getValidCached,
    getOrFetch,
    clearCache,
    clearAllCache,
    clearExpiredCache,
    getCacheStats,
    generateCacheKey
  ]);
};

export default useOptimizedCache;
