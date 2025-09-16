import React, { memo, useMemo, useCallback, useState, useEffect } from 'react';

// Component để lazy load dữ liệu lớn
const LazyDataLoader = memo(({ 
  children, 
  data, 
  threshold = 100, 
  onLoadMore, 
  hasMore = false,
  loading = false 
}) => {
  const [visibleItems, setVisibleItems] = useState(threshold);
  const [isIntersecting, setIsIntersecting] = useState(false);

  // Memoized visible data
  const visibleData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.slice(0, visibleItems);
  }, [data, visibleItems]);

  // Intersection Observer để detect khi scroll đến cuối
  const observerRef = useCallback((node) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setIsIntersecting(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore]);

  // Load more data khi intersect
  useEffect(() => {
    if (isIntersecting && hasMore && onLoadMore) {
      onLoadMore();
      setIsIntersecting(false);
    }
  }, [isIntersecting, hasMore, onLoadMore]);

  // Load more function
  const handleLoadMore = useCallback(() => {
    if (hasMore && onLoadMore) {
      onLoadMore();
    } else {
      setVisibleItems(prev => Math.min(prev + threshold, data?.length || 0));
    }
  }, [hasMore, onLoadMore, threshold, data?.length]);

  // Reset visible items khi data thay đổi
  useEffect(() => {
    setVisibleItems(threshold);
  }, [data, threshold]);

  return (
    <div className="lazy-data-loader">
      {children(visibleData)}
      
      {/* Load more button hoặc infinite scroll trigger */}
      {data && data.length > visibleItems && (
        <div className="mt-4 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang tải...' : `Tải thêm (${data.length - visibleItems} mục còn lại)`}
          </button>
        </div>
      )}
      
      {/* Intersection observer target */}
      <div ref={observerRef} className="h-4" />
    </div>
  );
});

LazyDataLoader.displayName = 'LazyDataLoader';

export default LazyDataLoader;
