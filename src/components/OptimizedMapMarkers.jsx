import React, { memo, useMemo, useCallback, useEffect, useRef } from 'react';
import L from 'leaflet';

// Component tối ưu hóa cho việc hiển thị markers trên bản đồ
const OptimizedMapMarkers = memo(({ 
  map, 
  data = [], 
  isVisible = false,
  createMarker,
  onMarkerClick,
  maxMarkers = 100,
  clusterThreshold = 10
}) => {
  const markersRef = useRef([]);
  const clustersRef = useRef({});

  // Memoized filtered data
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Nếu data quá nhiều, chỉ lấy maxMarkers đầu tiên
    if (data.length > maxMarkers) {
      console.warn(`Data too large (${data.length}), limiting to ${maxMarkers} markers`);
      return data.slice(0, maxMarkers);
    }
    
    return data;
  }, [data, maxMarkers]);

  // Memoized marker creation function
  const createOptimizedMarker = useCallback((item, index) => {
    if (!createMarker) return null;
    
    try {
      return createMarker(item, index);
    } catch (error) {
      console.error('Error creating marker:', error);
      return null;
    }
  }, [createMarker]);

  // Clear existing markers
  const clearMarkers = useCallback(() => {
    if (!map) return;
    
    markersRef.current.forEach(marker => {
      try {
        map.removeLayer(marker);
      } catch (error) {
        console.warn('Error removing marker:', error);
      }
    });
    markersRef.current = [];
    
    // Clear clusters
    Object.values(clustersRef.current).forEach(cluster => {
      try {
        map.removeLayer(cluster);
      } catch (error) {
        console.warn('Error removing cluster:', error);
      }
    });
    clustersRef.current = {};
  }, [map]);

  // Create markers
  const createMarkers = useCallback(() => {
    if (!map || !isVisible || filteredData.length === 0) return;
    
    clearMarkers();
    
    filteredData.forEach((item, index) => {
      try {
        const marker = createOptimizedMarker(item, index);
        if (marker) {
          marker.addTo(map);
          
          // Add click handler if provided
          if (onMarkerClick) {
            marker.on('click', (e) => {
              onMarkerClick(item, e);
            });
          }
          
          markersRef.current.push(marker);
        }
      } catch (error) {
        console.error(`Error adding marker ${index}:`, error);
      }
    });
    
    console.log(`Created ${markersRef.current.length} markers`);
  }, [map, isVisible, filteredData, createOptimizedMarker, onMarkerClick, clearMarkers]);

  // Effect để tạo markers
  useEffect(() => {
    createMarkers();
    
    // Cleanup function
    return () => {
      clearMarkers();
    };
  }, [createMarkers]);

  // Effect để clear markers khi isVisible thay đổi
  useEffect(() => {
    if (!isVisible) {
      clearMarkers();
    }
  }, [isVisible, clearMarkers]);

  // Component không render gì, chỉ quản lý markers
  return null;
});

OptimizedMapMarkers.displayName = 'OptimizedMapMarkers';

export default OptimizedMapMarkers;
