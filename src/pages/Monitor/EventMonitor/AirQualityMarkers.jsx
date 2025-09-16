import React, { useEffect, useRef, useState, memo, useCallback } from "react";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { FaWind } from "react-icons/fa";
import { 
  getAQIDataHybrid, 
  getAQIDataFromCache,
  hasAQICache 
} from "../../../service/airQualityCacheService";
import { 
  getAQIColor, 
  getAQIDescription, 
  getAQIDetailedDescription,
  getAQIBorderColor 
} from "../../../service/airQualityService";

const AirQualityMarkers = memo(({ map, isVisible = false }) => {
  const markersRef = useRef([]);
  const [aqiData, setAqiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alertData, setAlertData] = useState(null);

  // Tạo icon cho AQI marker
  const createAQIIcon = useCallback((aqius) => {
    const color = getAQIColor(aqius);
    
    const iconHtml = renderToStaticMarkup(
      <div 
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '18px',
          fontFamily: 'Arial, Helvetica, sans-serif',
          textShadow: '1px 1px 0px #000000, -1px -1px 0px #000000, 1px -1px 0px #000000, -1px 1px 0px #000000',
          boxShadow: '0 3px 6px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.8)',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.2s ease'
        }}
      >
        {aqius}
      </div>
    );

    return L.divIcon({
      html: iconHtml,
      className: "air-quality-marker",
      iconSize: [50, 50],
      iconAnchor: [25, 25],
    });
  }, []);

  // Tạo popup cho AQI marker
  const createAQIPopup = useCallback((data) => {
    const { city, state, country, location, current } = data.data;
    const { pollution, weather } = current;
    const { aqius, mainus, aqicn, maincn } = pollution;
    const { ic, hu, pr, tp, wd, ws, heatIndex } = weather;
    
    const color = getAQIColor(aqius);
    const description = getAQIDescription(aqius);
    
    const popupContent = `
      <div style="
        width: 400px; 
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        border-radius: 12px; 
        box-shadow: 0 8px 20px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.8);
        overflow: hidden;
        backdrop-filter: blur(10px);
      ">
        <!-- Header with Gradient -->
        <div style="
          background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
          color: white; 
          padding: 12px 16px; 
          position: relative;
          overflow: hidden;
        ">
          <h3 style="
            margin: 0; 
            font-size: 14px; 
            font-weight: 700; 
            text-shadow: 1px 1px 0px #000000, -1px -1px 0px #000000, 1px -1px 0px #000000, -1px 1px 0px #000000;
          ">${city}, ${state}</h3>
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 6px;">
            <div style="
              // background: rgba(255,255,255,0.2);
              // border: 2px solid rgba(255,255,255,0.8);
              border-radius: 8px;
              padding: 4px 8px;
              font-size: 32px;
              font-weight: 800;
              text-shadow: 1px 1px 0px #000000, -1px -1px 0px #000000, 1px -1px 0px #000000, -1px 1px 0px #000000;
              backdrop-filter: blur(10px);
            ">${aqius}</div>
            <div style="
              // background: rgba(255,255,255,0.15);
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 24px;
              font-weight: 600;
              text-shadow: 1px 1px 0px #000000, -1px -1px 0px #000000, 1px -1px 0px #000000, -1px 1px 0px #000000;
              backdrop-filter: blur(10px);
            ">${description}</div>
          </div>
        </div>
        
        <!-- Content - Horizontal Layout -->
        <div style="padding: 12px;">
          <!-- Main Info Row -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 8px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 8px; border-left: 3px solid ${color};">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 10px; color: #6c757d; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">AQI:</span>
              <span style="font-size: 12px; color: #000000; font-weight: 700;">${aqius} (US) | ${aqicn} (CN)</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 10px; color: #6c757d; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Chất ô nhiễm:</span>
              <span style="background: #f0f0f0; color: #000000; padding: 2px 6px; border-radius: 4px; font-size: 16px; font-weight: 700; text-transform: uppercase;">${mainus}</span>
            </div>
          </div>
          
          <!-- Weather Info - Single Horizontal Row -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 8px; background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%); border-radius: 8px;">
            <div style="text-align: center; flex: 1;">
              <div style="font-size: 9px; color: #6c757d; font-weight: 600; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.5px;">🌡️ Nhiệt độ</div>
              <div style="font-size: 12px; font-weight: 700; color: #000000;">${tp}°C</div>
            </div>
            <div style="text-align: center; flex: 1;">
              <div style="font-size: 9px; color: #6c757d; font-weight: 600; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.5px;">💧 Độ ẩm</div>
              <div style="font-size: 12px; font-weight: 700; color: #000000;">${hu}%</div>
            </div>
            <div style="text-align: center; flex: 1;">
              <div style="font-size: 9px; color: #6c757d; font-weight: 600; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.5px;">📊 Áp suất</div>
              <div style="font-size: 12px; font-weight: 700; color: #000000;">${pr} hPa</div>
            </div>
            <div style="text-align: center; flex: 1;">
              <div style="font-size: 9px; color: #6c757d; font-weight: 600; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.5px;">💨 Gió</div>
              <div style="font-size: 12px; font-weight: 700; color: #000000;">${ws} m/s</div>
            </div>
          </div>
          
          <!-- Update Time -->
          <div style="
            text-align: center; 
            font-size: 9px; 
            color: #6c757d; 
            padding: 8px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 6px;
            border-top: 1px solid rgba(0,0,0,0.05);
            font-weight: 500;
          ">
            🕒 Cập nhật: ${new Date(pollution.ts).toLocaleString('vi-VN', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    `;
    
    return popupContent;
  }, []);

  // Load dữ liệu AQI
  const loadAQIData = useCallback(async () => {
    if (!isVisible) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let data;
      
      // Kiểm tra cache trước
      if (hasAQICache()) {
        console.log('Using cached AQI data for immediate display');
        data = getAQIDataFromCache();
      } else {
        console.log('No cached AQI data, fetching from API...');
        data = await getAQIDataHybrid();
      }
      
      setAqiData(data || []);
      console.log('AQI data loaded:', data?.length || 0, 'points');
      
      // Kiểm tra AQI để hiển thị cảnh báo
      if (data && data.length > 0) {
        const highAQIData = data.find(item => {
          const aqius = item.data.current.pollution.aqius;
          return aqius >= 101; // Cảnh báo từ mức 101 trở lên
        });
        
        if (highAQIData) {
          const aqius = highAQIData.data.current.pollution.aqius;
          const city = highAQIData.data.city;
          const state = highAQIData.data.state;
          const description = getAQIDescription(aqius);
          const color = getAQIColor(aqius);
          
          setAlertData({
            aqius,
            city,
            state,
            description,
            color,
            timestamp: new Date().toLocaleString('vi-VN')
          });
          
          // Tự động ẩn cảnh báo sau 10 giây
          setTimeout(() => {
            setAlertData(null);
          }, 10000);
        }
      }
    } catch (err) {
      console.error('Error loading AQI data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isVisible]);

  // Tạo markers trên map
  const createMarkers = useCallback(() => {
    if (!map || !isVisible || aqiData.length === 0) return;

    // Xóa markers cũ
    markersRef.current.forEach(marker => {
      map.removeLayer(marker);
    });
    markersRef.current = [];

    // Tạo markers mới
    aqiData.forEach((data, index) => {
      try {
        const { location } = data.data;
        if (!location || !location.coordinates) return;

        const [lon, lat] = location.coordinates;
        const { aqius } = data.data.current.pollution;
        
        // Tạo icon
        const icon = createAQIIcon(aqius);
        
        // Tạo marker
        const marker = L.marker([lat, lon], { icon })
          .addTo(map);
        
        // Tạo popup
        const popupContent = createAQIPopup(data);
        marker.bindPopup(popupContent, {
          maxWidth: 420,
          className: 'air-quality-popup',
          closeButton: true,
          autoClose: true,
          closeOnClick: true
        });
        
        // Thêm event listener
        marker.on('click', () => {
          console.log('AQI marker clicked:', data.data.city, 'AQI:', aqius);
          
          // Đóng tất cả popup khác khi mở popup mới
          markersRef.current.forEach(otherMarker => {
            if (otherMarker !== marker && otherMarker.isPopupOpen()) {
              otherMarker.closePopup();
            }
          });
        });
        
        markersRef.current.push(marker);
      } catch (err) {
        console.error('Error creating AQI marker:', err);
      }
    });

    console.log(`Created ${markersRef.current.length} AQI markers`);
  }, [map, isVisible, aqiData, createAQIIcon, createAQIPopup]);

  // Thêm CSS tùy chỉnh cho nút đóng popup AQI
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      /* CSS cho nút đóng popup AQI - không ảnh hưởng đến kích thước popup */
      .air-quality-popup .leaflet-popup-close-button,
      .leaflet-popup.air-quality-popup .leaflet-popup-close-button,
      .leaflet-popup-content-wrapper.air-quality-popup .leaflet-popup-close-button {
        position: absolute !important;
        top: 8px !important;
        right: 8px !important;
        width: 28px !important;
        height: 28px !important;
        background: rgba(255, 255, 255, 0.95) !important;
        border: 2px solid rgba(0, 0, 0, 0.2) !important;
        border-radius: 50% !important;
        color: #333 !important;
        font-size: 16px !important;
        font-weight: bold !important;
        line-height: 1 !important;
        text-align: center !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
        z-index: 1000 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
        backdrop-filter: blur(5px) !important;
        margin: 0 !important;
        padding: 0 !important;
        outline: none !important;
        text-decoration: none !important;
      }
      
      .air-quality-popup .leaflet-popup-close-button:hover,
      .leaflet-popup.air-quality-popup .leaflet-popup-close-button:hover,
      .leaflet-popup-content-wrapper.air-quality-popup .leaflet-popup-close-button:hover {
        background: rgba(255, 255, 255, 1) !important;
        border-color: #ef4444 !important;
        color: #ef4444 !important;
        transform: scale(1.1) !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
      }
      
      .air-quality-popup .leaflet-popup-close-button:active,
      .leaflet-popup.air-quality-popup .leaflet-popup-close-button:active,
      .leaflet-popup-content-wrapper.air-quality-popup .leaflet-popup-close-button:active {
        transform: scale(0.95) !important;
      }
      
      /* Đảm bảo nút đóng không bị che bởi nội dung - không thay đổi kích thước popup */
      .air-quality-popup .leaflet-popup-content {
        position: relative !important;
      }
      
      /* Cải thiện popup wrapper */
      .air-quality-popup .leaflet-popup-content-wrapper {
        border-radius: 12px !important;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15) !important;
        overflow: hidden !important;
      }
      
      .air-quality-popup .leaflet-popup-tip {
        background: white !important;
        border: none !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Cleanup CSS khi component unmount
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  // Load dữ liệu khi component mount hoặc isVisible thay đổi
  useEffect(() => {
    loadAQIData();
  }, [loadAQIData]);

  // Tạo markers khi có dữ liệu
  useEffect(() => {
    createMarkers();
  }, [createMarkers]);

  // Cleanup markers khi component unmount
  useEffect(() => {
    return () => {
      if (map) {
        markersRef.current.forEach(marker => {
          map.removeLayer(marker);
        });
        markersRef.current = [];
      }
    };
  }, [map]);

  // Không render gì nếu không visible
  if (!isVisible) return null;

  return (
    <div className="air-quality-markers">
      {loading && (
        <div className="absolute top-4 right-4 bg-white p-2 rounded shadow-lg text-sm">
          Đang tải dữ liệu chất lượng không khí...
        </div>
      )}
      {error && (
        <div className="absolute top-4 right-4 bg-red-100 p-2 rounded shadow-lg text-sm text-red-600">
          Lỗi: {error}
        </div>
      )}
      
      {/* AQI Alert */}
      {alertData && (
        <div 
          className="fixed bottom-4 left-4 z-[1000] animate-pulse"
          style={{
            background: `linear-gradient(135deg, ${alertData.color} 0%, ${alertData.color}dd 100%)`,
            color: 'white',
            padding: '16px 20px',
            borderRadius: '12px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            border: '2px solid rgba(255,255,255,0.3)',
            backdropFilter: 'blur(10px)',
            minWidth: '300px',
            maxWidth: '400px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              fontSize: '24px',
              textShadow: '1px 1px 0px #000000, -1px -1px 0px #000000, 1px -1px 0px #000000, -1px 1px 0px #000000'
            }}>
              ⚠️
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '700', 
                marginBottom: '4px',
                textShadow: '1px 1px 0px #000000, -1px -1px 0px #000000, 1px -1px 0px #000000, -1px 1px 0px #000000'
              }}>
                CẢNH BÁO CHẤT LƯỢNG KHÔNG KHÍ
              </div>
              <div style={{ 
                fontSize: '12px', 
                fontWeight: '600',
                textShadow: '1px 1px 0px #000000, -1px -1px 0px #000000, 1px -1px 0px #000000, -1px 1px 0px #000000'
              }}>
                {alertData.city}, {alertData.state}
              </div>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: '800', 
                marginTop: '4px',
                textShadow: '1px 1px 0px #000000, -1px -1px 0px #000000, 1px -1px 0px #000000, -1px 1px 0px #000000'
              }}>
                AQI: {alertData.aqius} - {alertData.description}
              </div>
              <div style={{ 
                fontSize: '10px', 
                opacity: '0.8', 
                marginTop: '4px',
                textShadow: '1px 1px 0px #000000, -1px -1px 0px #000000, 1px -1px 0px #000000, -1px 1px 0px #000000'
              }}>
                {alertData.timestamp}
              </div>
            </div>
            <button
              onClick={() => setAlertData(null)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
                textShadow: '1px 1px 0px #000000, -1px -1px 0px #000000, 1px -1px 0px #000000, -1px 1px 0px #000000'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

AirQualityMarkers.displayName = 'AirQualityMarkers';

export default AirQualityMarkers;
