import React, { memo, useState, useEffect, useCallback } from 'react';
import { useCache } from '../contexts/CacheContext';
import useOptimizedCache from '../hooks/useOptimizedCache';

const CachePerformanceMonitor = memo(({ isVisible = false }) => {
  const { getCacheInfo, isIndexedDBReady } = useCache();
  const { getCacheStats } = useOptimizedCache();
  const [cacheInfo, setCacheInfo] = useState(null);
  const [memoryStats, setMemoryStats] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Update cache info
  const updateCacheInfo = useCallback(async () => {
    try {
      const info = await getCacheInfo();
      setCacheInfo(info);
      
      const stats = getCacheStats();
      setMemoryStats(stats);
    } catch (error) {
      console.error('Error getting cache info:', error);
    }
  }, [getCacheInfo, getCacheStats]);

  // Update info periodically
  useEffect(() => {
    if (!isVisible) return;

    updateCacheInfo();
    const interval = setInterval(updateCacheInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isVisible, updateCacheInfo]);

  // Early return after all hooks
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-lg border border-gray-200 max-w-sm">
      <div 
        className="p-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">
              Cache Monitor
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {isExpanded ? '▼' : '▶'}
          </div>
        </div>
        
        {!isExpanded && (
          <div className="mt-1 text-xs text-gray-600">
            {cacheInfo?.categoriesCount || 0} categories, {memoryStats?.totalItems || 0} items
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="px-3 pb-3 border-t border-gray-200">
          <div className="mt-2 space-y-2 text-xs">
            {/* IndexedDB Status */}
            <div className="flex justify-between">
              <span className="text-gray-600">IndexedDB:</span>
              <span className={`font-medium ${isIndexedDBReady ? 'text-green-600' : 'text-red-600'}`}>
                {isIndexedDBReady ? 'Ready' : 'Not Ready'}
              </span>
            </div>

            {/* Cache Categories */}
            {cacheInfo && (
              <div className="flex justify-between">
                <span className="text-gray-600">Categories:</span>
                <span className="font-medium">{cacheInfo.categoriesCount}</span>
              </div>
            )}

            {/* Total Places */}
            {cacheInfo && (
              <div className="flex justify-between">
                <span className="text-gray-600">Total Places:</span>
                <span className="font-medium">{cacheInfo.totalPlaces?.toLocaleString()}</span>
              </div>
            )}

            {/* Memory Cache Stats */}
            {memoryStats && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Memory Items:</span>
                  <span className="font-medium">{memoryStats.totalItems}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Valid Items:</span>
                  <span className="font-medium text-green-600">{memoryStats.validItems}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Expired Items:</span>
                  <span className="font-medium text-red-600">{memoryStats.expiredItems}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Cache Size:</span>
                  <span className="font-medium">{memoryStats.totalSize}KB</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Loading:</span>
                  <span className="font-medium text-blue-600">{memoryStats.loadingItems}</span>
                </div>
              </>
            )}

            {/* IndexedDB Stats */}
            {cacheInfo?.indexedDB && (
              <>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="text-gray-600 font-medium mb-1">IndexedDB Storage:</div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Map Data:</span>
                    <span className="font-medium">{cacheInfo.indexedDB.mapDataCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Population:</span>
                    <span className="font-medium">{Math.round(cacheInfo.indexedDB.populationDataSize / 1024)}KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wards:</span>
                    <span className="font-medium">{Math.round(cacheInfo.indexedDB.wardsDataSize / 1024)}KB</span>
                  </div>
                  <div className="flex justify-between">
                  </div>
                </div>
              </>
            )}

            {/* Performance Tips */}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="text-gray-600 font-medium mb-1">Performance Tips:</div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>• Cache được tối ưu với IndexedDB</div>
                <div>• Dữ liệu được nén trước khi lưu</div>
                <div>• React components được memoized</div>
                <div>• Lazy loading cho dữ liệu lớn</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

CachePerformanceMonitor.displayName = 'CachePerformanceMonitor';

export default CachePerformanceMonitor;
