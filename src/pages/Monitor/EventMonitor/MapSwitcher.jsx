import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapSwitcher = ({ onMapTypeChange, currentMapType = "basic", mainMapRef, isSidebarOpen = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const previewMapsRef = useRef({});

  const mapTypes = [
    {
      id: "basic",
      name: "Bản đồ Cơ bản",
      url: "https://maps.ots.vn/api/v1/tiles/basic/{z}/{x}/{y}/png?apikey=ndXs8opgf4onAzspo3kV3YFM3SgyHKp9&app-version=1.1"
    },
    {
      id: "streets",
      name: "Bản đồ Đường phố", 
      url: "https://maps.ots.vn/api/v1/tiles/streets/{z}/{x}/{y}/png?apikey=ndXs8opgf4onAzspo3kV3YFM3SgyHKp9&app-version=1.1"
    },
    {
      id: "satellite",
      name: "Bản đồ Vệ tinh",
      url: "https://maps.ots.vn/api/tiles/v1/satellite/{z}/{x}/{y}.png?apikey=ndXs8opgf4onAzspo3kV3YFM3SgyHKp9&app-version=1.1"
    },
    {
      id: "dark",
      name: "Bản đồ Tối",
      url: "https://maps.ots.vn/api/v1/tiles/dark/{z}/{x}/{y}/png?apikey=ndXs8opgf4onAzspo3kV3YFM3SgyHKp9&app-version=1.1"
    }
  ];

  const handleMapTypeSelect = (mapType) => {
    onMapTypeChange(mapType.id);
    setIsOpen(false);
  };

  // Tạo preview map cho mỗi loại bản đồ
  const createPreviewMap = (mapType, containerId) => {
    // Kiểm tra xem container có tồn tại không
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Container ${containerId} not found`);
      return;
    }

    // Xóa map cũ nếu có
    if (previewMapsRef.current[mapType.id]) {
      try {
        previewMapsRef.current[mapType.id].remove();
      } catch (error) {
        console.warn('Error removing old map:', error);
      }
      previewMapsRef.current[mapType.id] = null;
    }

    try {
      const map = L.map(containerId, {
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        scrollWheelZoom: false,
        boxZoom: false,
        keyboard: false
      }).setView([10.951275, 106.824159], 10);

      L.tileLayer(mapType.url, {
        attribution: "",
        maxZoom: 18,
      }).addTo(map);

      previewMapsRef.current[mapType.id] = map;
    } catch (error) {
      console.error('Error creating preview map:', error);
    }
  };

  // Tạo preview maps khi mở popup
  useEffect(() => {
    if (isOpen) {
      // Tạo tất cả preview maps ngay khi mở popup
      mapTypes.forEach((mapType) => {
        const containerId = `preview-map-${mapType.id}`;
        setTimeout(() => {
          createPreviewMap(mapType, containerId);
        }, 100);
      });
    }
  }, [isOpen]);

  // Cập nhật preview maps khi main map di chuyển
  useEffect(() => {
    if (isOpen && mainMapRef?.current) {
      const updatePreviewMaps = () => {
        const mainMap = mainMapRef.current;
        if (mainMap) {
          try {
            const center = mainMap.getCenter();
            const zoom = mainMap.getZoom();
            
            Object.values(previewMapsRef.current).forEach(map => {
              if (map && !map._destroyed) {
                try {
                  map.setView(center, Math.max(zoom - 2, 8)); // Zoom nhỏ hơn để xem tổng quan
                } catch (error) {
                  console.warn('Error updating preview map:', error);
                }
              }
            });
          } catch (error) {
            console.warn('Error getting main map info:', error);
          }
        }
      };

      // Cập nhật ngay lập tức
      updatePreviewMaps();

      // Lắng nghe sự kiện di chuyển của main map
      mainMapRef.current.on('moveend', updatePreviewMaps);
      mainMapRef.current.on('zoomend', updatePreviewMaps);

      return () => {
        if (mainMapRef?.current) {
          mainMapRef.current.off('moveend', updatePreviewMaps);
          mainMapRef.current.off('zoomend', updatePreviewMaps);
        }
      };
    }
  }, [isOpen, mainMapRef]);

  // Cleanup preview maps khi component unmount
  useEffect(() => {
    return () => {
      Object.values(previewMapsRef.current).forEach(map => {
        if (map && !map._destroyed) {
          try {
            map.remove();
          } catch (error) {
            console.warn('Error removing preview map:', error);
          }
        }
      });
      previewMapsRef.current = {};
    };
  }, []);

  // Cleanup khi popup đóng
  useEffect(() => {
    if (!isOpen) {
      Object.values(previewMapsRef.current).forEach(map => {
        if (map && !map._destroyed) {
          try {
            map.remove();
          } catch (error) {
            console.warn('Error removing preview map on close:', error);
          }
        }
      });
      previewMapsRef.current = {};
    }
  }, [isOpen]);

  return (
    <div 
      className={`absolute top-2 z-50 transition-all duration-300 ${
        isSidebarOpen ? 'right-[340px]' : 'right-2'
      }`}
    >
      {/* Icon button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-indigo-500 text-white text-xs font-bold shadow-lg hover:bg-indigo-600 transition flex items-center justify-center"
        title="Chuyển đổi loại bản đồ"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Click popup */}
      {isOpen && (
        <div className="absolute top-14 right-0 bg-white/95 backdrop-blur-sm shadow-2xl rounded-xl border border-gray-200 p-4 w-[400px] z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Các loại bản đồ</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {mapTypes.map((mapType) => {
              const isSelected = currentMapType === mapType.id;
              const containerId = `preview-map-${mapType.id}`;
              
              return (
                <button
                  key={mapType.id}
                  onClick={() => handleMapTypeSelect(mapType)}
                  className={`relative p-2 rounded-lg border-2 transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="aspect-video bg-gray-100 rounded mb-2 overflow-hidden">
                    <div 
                      id={containerId}
                      className="w-full h-full"
                      style={{ minHeight: '80px' }}
                    ></div>
                  </div>
                  <div className="text-sm font-medium text-gray-800 text-center">
                    {mapType.name}
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapSwitcher;
