import React, { useEffect, useRef, useState, memo, useMemo, useCallback } from "react";
import L from "leaflet";
import { getAllWards } from "../../../service/wardApi";
import { getThongTinTongHopLatest } from "../../../service/populationApi";
import { useCache } from "../../../contexts/CacheContext";
import WardBoundary from "./WardBoundary";
import { FaUsers } from "react-icons/fa";
import { renderToStaticMarkup } from "react-dom/server";

const DongNaiPopulationCircles = memo(({ map, isVisible = false }) => {
  const circlesRef = useRef([]);
  const [dongNaiWards, setDongNaiWards] = useState([]);
  const [populationData, setPopulationData] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [selectedWard, setSelectedWard] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(14);
  const { 
    hasCachedPopulationData, 
    getCachedPopulationData,
    hasCachedWardsData,
    getCachedWardsData
  } = useCache();

  // Hàm tính tọa độ trung tâm từ geometry
  const calculateCenter = (geometry, wardInfo = null) => {
    try {
      const { type, coordinates } = geometry;

      if (type === "MultiPolygon") {
        // Sử dụng Leaflet để tạo polygon group và tính centroid chính xác
        try {
          // Tạo layer group chứa tất cả polygons
          const polygonGroup = L.layerGroup();
          
          // Chuyển đổi coordinates và tạo polygons
          coordinates.forEach((polygonCoords) => {
            const latLngs = polygonCoords[0].map((coord) => [coord[1], coord[0]]); // [lng, lat] -> [lat, lng]
            const polygon = L.polygon(latLngs);
            polygonGroup.addLayer(polygon);
          });
          
          // Tính bounds thủ công từ các polygons trong group
          const bounds = L.latLngBounds();
          polygonGroup.eachLayer((layer) => {
            bounds.extend(layer.getBounds());
          });
          const center = bounds.getCenter();
          
          console.log(`MultiPolygon center calculated using Leaflet:`, {
            totalPolygons: coordinates.length,
            bounds: bounds,
            center: center
          });
          
          // Đặc biệt log cho xã Nhơn Trạch để debug
          if (wardInfo && (wardInfo.ward_code === '26485' || wardInfo.ward_fname?.includes('Nhơn Trạch'))) {
            console.log('=== NHƠN TRẠCH DEBUG (LEAFLET) ===');
            console.log('Coordinates structure:', coordinates);
            console.log('First polygon coords count:', coordinates[0][0].length);
            console.log('Second polygon coords count:', coordinates[1][0].length);
            console.log('Bounds:', bounds);
            console.log('Calculated center:', center);
            console.log('==================================');
          }
          
          return {
            lat: center.lat,
            lng: center.lng
          };
        } catch (error) {
          console.error('Error calculating MultiPolygon center with Leaflet:', error);
          
          // Fallback to manual calculation
          let allCoords = [];
          coordinates.forEach((polygon) => {
            allCoords = allCoords.concat(polygon[0]);
          });

          let sumLat = 0, sumLng = 0;
          allCoords.forEach((coord) => {
            sumLng += coord[0];
            sumLat += coord[1];
          });

          return {
            lat: sumLat / allCoords.length,
            lng: sumLng / allCoords.length,
          };
        }
      } else if (type === "Polygon") {
        const polygon = coordinates[0];
        let sumLat = 0,
          sumLng = 0;

        polygon.forEach((coord) => {
          sumLng += coord[0]; // longitude
          sumLat += coord[1]; // latitude
        });

        return {
          lat: sumLat / polygon.length,
          lng: sumLng / polygon.length,
        };
      }
    } catch (error) {
      console.error("Error calculating center:", error);
    }

    return null;
  };

  // Hàm lấy dữ liệu dân số từ API hoặc cache
  const fetchPopulationData = async () => {
    try {
      // Kiểm tra cache trước
      if (hasCachedPopulationData()) {
        const cachedData = getCachedPopulationData();
        setPopulationData(cachedData);
        console.log('Population data loaded from cache:', Object.keys(cachedData).length, 'wards');
        return;
      }

      // Nếu không có cache, load từ API
      const response = await getThongTinTongHopLatest();
      if (response && response.body) {
        const populationMap = {};
        response.body.forEach(item => {
          populationMap[item.madvhc] = parseInt(item.nkTongNhanKhau);
        });
        setPopulationData(populationMap);
        console.log('Population data loaded from API:', Object.keys(populationMap).length, 'wards');
      }
    } catch (error) {
      console.error('Error fetching population data:', error);
      // Fallback to random data if API fails
    }
  };

  // Hàm lấy dân số thực từ API hoặc fallback random
  const getPopulation = (wardCode) => {
    if (populationData[wardCode]) {
      return populationData[wardCode];
    }
    // Fallback to random if no data available
    return Math.floor(Math.random() * 4000) + 1000;
  };

  // Hàm quyết định hiển thị vòng tròn dựa trên zoom level
  const shouldShowCircle = (zoom) => {
    // Zoom level thresholds:
    // zoom <= 10: Chỉ hiển thị 20% vòng tròn (các vòng tròn có dân số cao nhất)
    // zoom 11-12: Hiển thị 50% vòng tròn
    // zoom 13-14: Hiển thị 80% vòng tròn
    // zoom >= 15: Hiển thị tất cả vòng tròn

    if (zoom <= 10) return 0.2;
    if (zoom <= 12) return 0.5;
    if (zoom <= 14) return 0.8;
    return 1.0;
  };

  // Theo dõi zoom level
  useEffect(() => {
    if (!map) return;

    const handleZoomEnd = () => {
      const zoom = map.getZoom();
      setCurrentZoom(zoom);
    };

    // Lắng nghe sự kiện zoom
    map.on("zoomend", handleZoomEnd);

    // Set zoom level ban đầu
    setCurrentZoom(map.getZoom());

    return () => {
      map.off("zoomend", handleZoomEnd);
    };
  }, [map]);

  // Load dữ liệu dân số chỉ khi có cache hoặc khi cần thiết
  useEffect(() => {
    // Chỉ load nếu có cache hoặc khi isVisible = true
    if (hasCachedPopulationData() || isVisible) {
      fetchPopulationData();
    }
  }, [isVisible, hasCachedPopulationData]);

  // Load dữ liệu wards chỉ khi có cache hoặc khi cần thiết
  useEffect(() => {
    const loadDongNaiWards = async () => {
      setLoading(true);
      try {
        let allWards = [];

        // Kiểm tra cache trước
        if (hasCachedWardsData()) {
          allWards = getCachedWardsData();
          console.log('Using cached wards data:', allWards.length, 'wards');
        } else if (isVisible) {
          // Chỉ load từ API khi isVisible = true và không có cache
          console.log('No cached wards data, loading from API...');
          const [response1, response2] = await Promise.all([
            getAllWards(1, 50), // Page 1: 50 wards
            getAllWards(2, 50), // Page 2: 50 wards
          ]);

          // Kết hợp dữ liệu từ cả 2 page
          if (response1.data && Array.isArray(response1.data)) {
            allWards.push(...response1.data);
          }
          if (response2.data && Array.isArray(response2.data)) {
            allWards.push(...response2.data);
          }
          console.log('Loaded wards from API:', allWards.length, 'wards');
        } else {
          // Không có cache và không visible, không load
          console.log('No cached wards data and not visible, skipping load');
          setLoading(false);
          return;
        }

        if (allWards.length > 0) {
          const processedWards = allWards
            .map((ward) => {
              const center = calculateCenter(ward.geom, ward);
              return {
                name: ward.ward_fname || ward.prov_fname,
                code: ward.ward_code || ward.prov_code,
                level: ward.level,
                population: getPopulation(ward.ward_code || ward.prov_code),
                lat: center ? center.lat : null,
                lng: center ? center.lng : null,
                originalData: ward,
              };
            })
            .filter((ward) => ward.lat && ward.lng); // Chỉ lấy những ward có tọa độ hợp lệ

          setDongNaiWards(processedWards);
          setDataReady(true);
          console.log(`Processed ${processedWards.length} wards for display - Data ready!`);
        }
      } catch (error) {
        console.error("Error loading Dong Nai wards:", error);
      } finally {
        setLoading(false);
      }
    };

    if (map && (hasCachedWardsData() || isVisible)) {
      loadDongNaiWards();
    }
  }, [map, populationData, isVisible, hasCachedWardsData, getCachedWardsData]);

  // Tạo markers khi có dữ liệu và isVisible = true
  useEffect(() => {
    if (!map || dongNaiWards.length === 0 || !dataReady) return;

    console.log('Creating population circles - isVisible:', isVisible, 'dataReady:', dataReady, 'wards:', dongNaiWards.length);

    // Xóa các circle cũ nếu có
    circlesRef.current.forEach((circle) => {
      map.removeLayer(circle);
    });
    circlesRef.current = [];

    // Nếu isVisible = false, không tạo vòng tròn
    if (!isVisible) return;

    // Sắp xếp wards theo dân số (cao nhất trước)
    const sortedWards = [...dongNaiWards].sort(
      (a, b) => b.population - a.population
    );

    // Tính số lượng vòng tròn cần hiển thị
    const showRatio = shouldShowCircle(currentZoom);
    const maxCircles = Math.ceil(sortedWards.length * showRatio);

    // Tạo các icon vòng tròn xanh lá cây cho mỗi phường/xã
    sortedWards.slice(0, maxCircles).forEach((ward) => {
      // Debug cho xã Nhơn Trạch
      if (ward.code === '26485' || ward.name?.includes('Nhơn Trạch')) {
        console.log('=== TẠO VÒNG TRÒN NHƠN TRẠCH ===');
        console.log('Ward data:', ward);
        console.log('Position:', { lat: ward.lat, lng: ward.lng });
        console.log('Population:', ward.population);
        console.log('================================');
      }
      // Tạo div icon với vòng tròn xanh đậm và số dân cư bên trong
      const populationIcon = L.divIcon({
        html: `
          <div class="population-circle">
            <div class="circle-background">
              <span class="population-number">${ward.population.toLocaleString()}</span>
            </div>
          </div>
        `,
        className: "population-circle-icon",
        iconSize: [70, 70],
        iconAnchor: [35, 35],
      });

      // Tạo marker với icon
      const marker = L.marker([ward.lat, ward.lng], {
        icon: populationIcon,
        zIndexOffset: 2000, // Tăng z-index để hiển thị trên boundary
        interactive: true, // Đảm bảo có thể tương tác
      }).addTo(map);

      // Thêm event click cho marker
      marker.on("click", function (e) {
        // Set ward được chọn để hiển thị boundary
        setSelectedWard(ward.originalData);

        // Zoom vào phường/xã được click với mức zoom cố định
        // Để điều chỉnh mức zoom, thay đổi số 14 ở đây (từ 10-18)
        map.setView([ward.lat, ward.lng], 13, {
          animate: true,
          duration: 1,
        });

        // Hiển thị popup thông tin với nút đóng
        const popupContent = `
          <div class="p-2 min-w-[350px]">
            <div class="flex items-center gap-3 mb-1">
              <div class="flex-shrink-0 flex items-center justify-center">${renderToStaticMarkup(
                <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-green-500">
                  <FaUsers className="w-4 h-4 text-green-500" />
                </div>
              )}</div>
              <div class="flex-1 min-w-0">
                <b class="text-md leading-tight break-words border-b border-gray-700 pb-1">${
                  ward.name
                }</b>
              </div>
            </div>
            <p class="text-xs text-gray-700"><strong>Dân số:</strong> ${ward.population.toLocaleString()} người</p>
           
          </div>
        `;

        const popup = L.popup({
          offset: [0, -10],
          className: "custom-popup",
          closeButton: false, // Tắt nút X mặc định của Leaflet
        })
          .setLatLng([ward.lat, ward.lng])
          .setContent(popupContent)
          .openOn(map);

        // Thêm event listener để đóng popup và ẩn boundary
        popup.on("remove", function () {
          setSelectedWard(null);
        });

        // Thêm function global để đóng popup từ nút X
        window.closeWardPopup = function () {
          map.closePopup();
          setSelectedWard(null);
        };
      });

      // Lưu reference
      circlesRef.current.push(marker);
    });

    // Thêm CSS cho vòng tròn xanh đậm với hiệu ứng ánh sáng
    const style = document.createElement("style");
    style.textContent = `
      .population-circle-icon {
        background: transparent !important;
        border: none !important;
        pointer-events: auto !important;
        cursor: pointer !important;
      }
      .population-circle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 70px;
        height: 70px;
      }
      .circle-background {
        width: 70px;
        height: 70px;
        background: #59A14F;
        border: 1px solid #6BB85A;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 
          0 0 0 2px rgba(89, 161, 79, 0.4),
          0 0 0 4px rgba(89, 161, 79, 0.3),
          0 0 0 6px rgba(89, 161, 79, 0.2),
          0 0 20px rgba(89, 161, 79, 0.5),
          0 3px 8px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
        position: relative;
        animation: glow 3s ease-in-out infinite alternate;
        cursor: pointer;
      }
      .circle-background:hover {
        transform: scale(1.1);
        box-shadow: 
          0 0 0 2px rgba(89, 161, 79, 0.6),
          0 0 0 4px rgba(89, 161, 79, 0.5),
          0 0 0 6px rgba(89, 161, 79, 0.4),
          0 0 30px rgba(89, 161, 79, 0.7),
          0 4px 12px rgba(0, 0, 0, 0.4);
      }
      .circle-background::before {
        content: '';
        position: absolute;
        top: -10px;
        left: -10px;
        right: -10px;
        bottom: -10px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(89, 161, 79, 0.8) 0%, rgba(89, 161, 79, 0.5) 30%, rgba(89, 161, 79, 0.3) 60%, transparent 80%);
        z-index: -1;
        animation: ripple 2.5s ease-in-out infinite;
      }
      .circle-background::after {
        content: '';
        position: absolute;
        top: -15px;
        left: -15px;
        right: -15px;
        bottom: -15px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(89, 161, 79, 0.6) 0%, rgba(89, 161, 79, 0.3) 40%, rgba(89, 161, 79, 0.1) 70%, transparent 90%);
        z-index: -2;
        animation: ripple 2.5s ease-in-out infinite 0.8s;
      }
      .population-number {
        color: white;
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        line-height: 1;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
        z-index: 1;
        letter-spacing: -0.5px;
        font-family: 'Arial', 'Helvetica', sans-serif;
      }
      .population-circle:hover .circle-background {
        background: #4A8B3F;
        border-color: #5BA04A;
        transform: scale(1.2);
        box-shadow: 
          0 0 0 2px rgba(89, 161, 79, 0.6),
          0 0 0 4px rgba(89, 161, 79, 0.4),
          0 0 0 6px rgba(89, 161, 79, 0.3),
          0 0 30px rgba(89, 161, 79, 0.7),
          0 4px 16px rgba(0, 0, 0, 0.4);
        animation: glow-intense 1.5s ease-in-out infinite alternate;
      }
      @keyframes glow {
        0% {
          box-shadow: 
            0 0 0 2px rgba(89, 161, 79, 0.4),
            0 0 0 4px rgba(89, 161, 79, 0.3),
            0 0 0 6px rgba(89, 161, 79, 0.2),
            0 0 20px rgba(89, 161, 79, 0.5),
            0 3px 8px rgba(0, 0, 0, 0.3);
        }
        100% {
          box-shadow: 
            0 0 0 3px rgba(89, 161, 79, 0.6),
            0 0 0 6px rgba(89, 161, 79, 0.4),
            0 0 0 9px rgba(89, 161, 79, 0.3),
            0 0 25px rgba(89, 161, 79, 0.7),
            0 3px 8px rgba(0, 0, 0, 0.3);
        }
      }
      @keyframes glow-intense {
        0% {
          box-shadow: 
            0 0 0 2px rgba(89, 161, 79, 0.6),
            0 0 0 4px rgba(89, 161, 79, 0.4),
            0 0 0 6px rgba(89, 161, 79, 0.3),
            0 0 30px rgba(89, 161, 79, 0.7),
            0 4px 16px rgba(0, 0, 0, 0.4);
        }
        100% {
          box-shadow: 
            0 0 0 3px rgba(89, 161, 79, 0.8),
            0 0 0 6px rgba(89, 161, 79, 0.6),
            0 0 0 9px rgba(89, 161, 79, 0.4),
            0 0 35px rgba(89, 161, 79, 0.9),
            0 4px 16px rgba(0, 0, 0, 0.4);
        }
      }
      @keyframes ripple {
        0% {
          transform: scale(0.8);
          opacity: 0.8;
        }
        50% {
          transform: scale(1.1);
          opacity: 0.4;
        }
        100% {
          transform: scale(1.3);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      circlesRef.current.forEach((marker) => {
        map.removeLayer(marker);
      });
      circlesRef.current = [];

      // Xóa style
      const existingStyle = document.querySelector("style");
      if (
        existingStyle &&
        existingStyle.textContent.includes("population-circle")
      ) {
        existingStyle.remove();
      }

      // Xóa global function
      if (window.closeWardPopup) {
        delete window.closeWardPopup;
      }
    };
  }, [map, dongNaiWards, currentZoom, isVisible, dataReady]);

  // Render WardBoundary nếu có ward được chọn
  return (
    <>
      {map && selectedWard && (
        <WardBoundary
          map={map}
          wardData={selectedWard}
          options={{
            color: "#EF4444", // Màu đỏ
            weight: 3,
            opacity: 0.8,
            fillColor: "#EF4444", // Nền đỏ
            fillOpacity: 0.1, // Đỏ rất nhạt
            dashArray: "10, 5", // Nét đứt
            fitBounds: false, // Tắt auto fit bounds để tránh conflict với map.setView
            showPopup: false, // Tắt popup khi click vào boundary
          }}
        />
      )}
    </>
  );
});

DongNaiPopulationCircles.displayName = 'DongNaiPopulationCircles';

export default DongNaiPopulationCircles;
