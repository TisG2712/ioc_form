import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { indexedDBService } from '../service/indexedDBService';
import toast from 'react-hot-toast';

const CacheContext = createContext();

export const useCache = () => {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
};

export const CacheProvider = ({ children }) => {
  const [cachedData, setCachedData] = useState({});
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [lastPreloadTime, setLastPreloadTime] = useState(null);
  const [isIndexedDBReady, setIsIndexedDBReady] = useState(false);
  const [shouldAutoLoadCache, setShouldAutoLoadCache] = useState(false);

  // Initialize IndexedDB on mount
  useEffect(() => {
    const initIndexedDB = async () => {
      try {
        console.log('Initializing IndexedDB...');
        await indexedDBService.init();
        setIsIndexedDBReady(true);
        console.log('IndexedDB initialized successfully');
      } catch (error) {
        console.error('Failed to initialize IndexedDB:', error);
        // Fallback to memory-only cache
        setIsIndexedDBReady(false);
      }
    };

    initIndexedDB();
  }, []);

  // Load cache from IndexedDB when ready
  useEffect(() => {
    if (!isIndexedDBReady) {
      console.log('IndexedDB not ready yet, skipping cache load');
      return;
    }

    const loadCacheFromIndexedDB = async () => {
      try {
        console.log('Loading cache from IndexedDB...');
        const cacheInfo = await indexedDBService.getCacheInfo();
        console.log('Cache info from IndexedDB:', cacheInfo);
        
        // Load all cached data
        const [populationData, wardsData, mapData] = await Promise.all([
          indexedDBService.getPopulationData(),
          indexedDBService.getWardsData(),
          indexedDBService.getAllMapData()
        ]);

        const allCachedData = {};
        
        // Load population data
        if (populationData) {
          allCachedData.population = { data: populationData, loadedAt: Date.now() };
          console.log('Loaded population data from cache');
        }
        
        // Load wards data
        if (wardsData) {
          allCachedData.wards = { data: wardsData, loadedAt: Date.now() };
          console.log('Loaded wards data from cache');
        }
        
        // Load map data for all categories
        if (mapData && Object.keys(mapData).length > 0) {
          Object.entries(mapData).forEach(([category, data]) => {
            allCachedData[category] = data;
            console.log(`Loaded ${category} data from cache:`, data.features?.length || 0, 'features');
          });
        }

        setCachedData(allCachedData);
        setLastPreloadTime(Date.now());
        console.log('Loaded all cache from IndexedDB successfully:', Object.keys(allCachedData));
      } catch (error) {
        console.error('Error loading cache from IndexedDB:', error);
      }
    };

    loadCacheFromIndexedDB();
  }, [isIndexedDBReady]);

  // Memoized functions for better performance
  const updateCache = useCallback(async (category, data) => {
    if (!isIndexedDBReady) {
      // Fallback to memory cache
      setCachedData(prev => ({
        ...prev,
        [category]: {
          ...data,
          loadedAt: Date.now()
        }
      }));
      return;
    }

    try {
      // Compress data before saving
      const compressedData = {
        features: data.features?.map(feature => ({
          type: feature.type,
          geometry: feature.geometry,
          properties: {
            name: feature.properties?.name,
            types: feature.properties?.types,
          }
        })) || data.features,
        loadedAt: Date.now()
      };

      await indexedDBService.saveMapData(category, compressedData);
      
      // Update memory cache
      setCachedData(prev => ({
        ...prev,
        [category]: compressedData
      }));
      
      console.log(`Saved map data for ${category} to IndexedDB`);
    } catch (error) {
      console.error(`Error saving map data for ${category}:`, error);
      // Fallback to memory cache
      setCachedData(prev => ({
        ...prev,
        [category]: {
          ...data,
          loadedAt: Date.now()
        }
      }));
    }
  }, [isIndexedDBReady]);

  const updatePopulationCache = useCallback(async (data) => {
    if (!isIndexedDBReady) {
      setCachedData(prev => ({
        ...prev,
        population: {
          data: data,
          loadedAt: Date.now()
        }
      }));
      return;
    }

    try {
      await indexedDBService.savePopulationData(data);
      setCachedData(prev => ({
        ...prev,
        population: {
          data: data,
          loadedAt: Date.now()
        }
      }));
      console.log('Saved population data to IndexedDB');
    } catch (error) {
      console.error('Error saving population data:', error);
      // Fallback to memory cache
      setCachedData(prev => ({
        ...prev,
        population: {
          data: data,
          loadedAt: Date.now()
        }
      }));
    }
  }, [isIndexedDBReady]);

  const updateWardsCache = useCallback(async (data) => {
    if (!isIndexedDBReady) {
      setCachedData(prev => ({
        ...prev,
        wards: {
          data: data,
          loadedAt: Date.now()
        }
      }));
      return;
    }

    try {
      await indexedDBService.saveWardsData(data);
      setCachedData(prev => ({
        ...prev,
        wards: {
          data: data,
          loadedAt: Date.now()
        }
      }));
      console.log('Saved wards data to IndexedDB');
    } catch (error) {
      console.error('Error saving wards data:', error);
      // Fallback to memory cache
      setCachedData(prev => ({
        ...prev,
        wards: {
          data: data,
          loadedAt: Date.now()
        }
      }));
    }
  }, [isIndexedDBReady]);



  // Memoized getter functions
  const getCachedData = useCallback((category) => {
    const result = cachedData[category] || null;
    console.log(`getCachedData(${category}):`, result ? 'Found' : 'Not found', result);
    return result;
  }, [cachedData]);

  const getCachedPopulationData = useCallback(() => {
    return cachedData.population?.data || null;
  }, [cachedData]);

  const getCachedWardsData = useCallback(() => {
    return cachedData.wards?.data || null;
  }, [cachedData]);


  const hasCachedData = useCallback((category) => {
    return !!cachedData[category];
  }, [cachedData]);

  const hasCachedPopulationData = useCallback(() => {
    return !!cachedData.population?.data;
  }, [cachedData]);

  const hasCachedWardsData = useCallback(() => {
    return !!cachedData.wards?.data;
  }, [cachedData]);


  const clearCache = useCallback(async () => {
    try {
      console.log('Starting cache clear process...');
      
      // Xóa tất cả state
      setCachedData({});
      setLastPreloadTime(null);
      setIsPreloading(false);
      setPreloadProgress(0);
      setShouldAutoLoadCache(false); // Tắt auto-load cache
      
      console.log('State cleared, proceeding with storage cleanup...');
      
      // Xóa cache từ IndexedDB
      if (isIndexedDBReady) {
        try {
          await indexedDBService.clearAllCache();
          console.log('Cache cleared from IndexedDB');
        } catch (indexedDBError) {
          console.error('Error clearing IndexedDB cache:', indexedDBError);
        }
      }
      
      
      // Xóa localStorage fallback
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (
            key.includes('mapData') || 
            key.includes('cache') || 
            key.includes('Cache') ||
            key.includes('preload') ||
            key.includes('population') ||
            key.includes('wards') ||
            key.includes('airvisual') ||
            key.includes('air_quality')
          )) {
            keysToRemove.push(key);
          }
        }
        
        keysToRemove.forEach(key => {
          try {
            localStorage.removeItem(key);
            console.log(`Removed localStorage key: ${key}`);
          } catch (error) {
            console.error(`Error removing key ${key}:`, error);
          }
        });
        
        console.log('localStorage cache cleared:', keysToRemove.length, 'keys removed');
      } catch (localStorageError) {
        console.error('Error clearing localStorage:', localStorageError);
      }
      
      // Thông báo thành công
      setTimeout(() => {
        console.log('Cache clear completed successfully');
        console.log('About to show toast...');
        toast.success('✅ Cache đã được xóa hoàn toàn!\n\n' +
              '• Tất cả dữ liệu bản đồ đã được xóa\n' +
              '• Dữ liệu dân số đã được xóa\n' +
              '• IndexedDB và localStorage đã được xóa\n' +
              '• Đang tải lại dữ liệu mới...', {
          duration: 4000,
        });
        console.log('Toast should be shown now');
      }, 100);
      
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast.error('❌ Có lỗi khi xóa cache. Vui lòng:\n' +
            '1. Thử lại\n' +
            '2. Hoặc xóa cache thủ công từ Developer Tools', {
        duration: 5000,
      });
    }
  }, [isIndexedDBReady]);

  // Function để enable auto-load cache (chỉ khi user bấm nút tải lại cache)
  const enableAutoLoadCache = useCallback(() => {
    console.log('Enabling auto-load cache...');
    setShouldAutoLoadCache(true);
    console.log('Auto-load cache enabled, should trigger cache load');
  }, []);

  const isCacheValid = useCallback(() => {
    if (!lastPreloadTime) return false;
    const now = Date.now();
    const cacheAge = now - lastPreloadTime;
    return cacheAge < 3600000; // 1 hour
  }, [lastPreloadTime]);

  const getCacheInfo = useCallback(async () => {
    const basicInfo = {
      categoriesCount: Object.keys(cachedData).length,
      totalPlaces: Object.values(cachedData).reduce((sum, data) => sum + (data.features?.length || 0), 0),
      lastPreloadTime,
      isValid: isCacheValid(),
      isIndexedDBReady
    };

    if (isIndexedDBReady) {
      try {
        const indexedDBInfo = await indexedDBService.getCacheInfo();
        return {
          ...basicInfo,
          indexedDB: indexedDBInfo
        };
      } catch (error) {
        console.error('Error getting IndexedDB cache info:', error);
        return basicInfo;
      }
    }

    return basicInfo;
  }, [cachedData, lastPreloadTime, isCacheValid, isIndexedDBReady]);

  // Hàm debug để kiểm tra tất cả cache
  const debugCache = useCallback(async () => {
    console.log('=== CACHE DEBUG INFO ===');
    console.log('State cachedData keys:', Object.keys(cachedData));
    console.log('isIndexedDBReady:', isIndexedDBReady);
    
    if (isIndexedDBReady) {
      try {
        const indexedDBInfo = await indexedDBService.getCacheInfo();
        console.log('IndexedDB cache info:', indexedDBInfo);
      } catch (error) {
        console.error('Error getting IndexedDB info:', error);
      }
    }
    
    // Check localStorage fallback
    const allKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      allKeys.push(key);
    }
    
    const cacheKeys = allKeys.filter(key => 
      key && (
        key.includes('mapData') || 
        key.includes('cache') || 
        key.includes('Cache') ||
        key.includes('preload') ||
        key.includes('population') ||
        key.includes('wards') ||
        key.includes('airvisual') ||
        key.includes('air_quality')
      )
    );
    
    console.log('localStorage cache keys:', cacheKeys);
    
    cacheKeys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        const size = new Blob([value]).size;
        console.log(`localStorage Key: ${key}, Size: ${Math.round(size / 1024 * 100) / 100}KB`);
      } catch (error) {
        console.log(`localStorage Key: ${key}, Error reading:`, error);
      }
    });
    
    console.log('=== END CACHE DEBUG ===');
  }, [cachedData, isIndexedDBReady]);

  // Memoized value object to prevent unnecessary re-renders
  const value = useMemo(() => ({
    cachedData,
    setCachedData,
    updateCache,
    updatePopulationCache,
    updateWardsCache,
    getCachedData,
    getCachedPopulationData,
    getCachedWardsData,
    hasCachedData,
    hasCachedPopulationData,
    hasCachedWardsData,
    clearCache,
    enableAutoLoadCache,
    isPreloading,
    setIsPreloading,
    preloadProgress,
    setPreloadProgress,
    lastPreloadTime,
    setLastPreloadTime,
    isCacheValid,
    getCacheInfo,
    debugCache,
    isIndexedDBReady
  }), [
    cachedData,
    updateCache,
    updatePopulationCache,
    updateWardsCache,
    getCachedData,
    getCachedPopulationData,
    getCachedWardsData,
    hasCachedData,
    hasCachedPopulationData,
    hasCachedWardsData,
    clearCache,
    enableAutoLoadCache,
    isPreloading,
    preloadProgress,
    lastPreloadTime,
    isCacheValid,
    getCacheInfo,
    debugCache,
    isIndexedDBReady
  ]);

  return (
    <CacheContext.Provider value={value}>
      {children}
    </CacheContext.Provider>
  );
};
