import React, { useEffect, useRef, useState, memo, useMemo, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { iconMap } from "../../utils/iconMap";
import { renderToStaticMarkup } from "react-dom/server";
import {
  FaHospital,
  FaShieldAlt,
  FaGraduationCap,
  FaRoad,
  FaCircle,
  FaUserTie,
  FaPlane,
  FaCarCrash,
  FaTree,
  FaLeaf,
  FaUniversity,
  FaBuilding,
  FaCoffee,
  FaBolt,
  FaChurch,
  FaClinicMedical,
  FaSchool,
  FaIndustry,
  FaCalendarAlt,
  FaDumbbell,
  FaGasPump,
  FaLandmark,
  FaHotel,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaAmbulance,
  FaEnvelope,
  FaUtensils,
  FaWrench,
  FaFutbol,
  FaStore,
  FaMoneyBillWave,
  FaVideo,
  FaCar,
  FaSearch,
  FaBook,
  FaFlag,
  FaMountain,
  FaFire,
  FaUserShield,
  FaShippingFast,
} from "react-icons/fa";
import DongNaiPopulationCircles from "./EventMonitor/DongNaiPopulationCircles";
import AirQualityMarkers from "./EventMonitor/AirQualityMarkers";
import MapToggleButtons from "../../components/ui/MapToggleButtons";
import MapEventPopup from "./EventMonitor/MapEventPopup";

const getPopupIcon = (iconType) => {
  const iconMap = {
    MEDICAL: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-red-500">
        <FaHospital className="text-red-500 text-sm" />
      </div>
    ),
    POLICE: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-blue-500">
        <FaUserShield className="text-blue-500 text-sm" />
      </div>
    ),
    COLLEGE: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-purple-500">
        <FaGraduationCap className="text-purple-500 text-sm" />
      </div>
    ),
    TRAFFIC: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-green-500">
        <FaUserShield className="text-green-500 text-sm" />
      </div>
    ),
    ACCIDENT_BLACKSPOT: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-red-600">
        <FaCarCrash className="text-red-600 text-sm" />
      </div>
    ),
    AIRPORT: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-blue-600">
        <FaPlane className="text-blue-600 text-sm" />
      </div>
    ),
    AMUSEMENT_PARK: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-pink-500">
        <FaTree className="text-pink-500 text-sm" />
      </div>
    ),
    BANK: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-yellow-500">
        <FaMoneyBillWave className="text-yellow-500 text-sm" />
      </div>
    ),
    CAFE: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-amber-800">
        <FaCoffee className="text-amber-800 text-sm" />
      </div>
    ),
    CHARGING_STATION: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-yellow-500">
        <FaBolt className="text-yellow-500 text-sm" />
      </div>
    ),
    CHURCH: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-purple-600">
        <FaChurch className="text-purple-600 text-sm" />
      </div>
    ),
    CLINIC: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-red-400">
        <FaClinicMedical className="text-red-400 text-sm" />
      </div>
    ),
    COLLEGE_NEW: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-purple-500">
        <FaSchool className="text-purple-500 text-sm" />
      </div>
    ),
    COMPANY: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-gray-600">
        <FaIndustry className="text-gray-600 text-sm" />
      </div>
    ),
    CONVENTION_CENTER: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-indigo-500">
        <FaCalendarAlt className="text-indigo-500 text-sm" />
      </div>
    ),
    EVENT_PLANNER: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-indigo-600">
        <FaCalendarAlt className="text-indigo-600 text-sm" />
      </div>
    ),
    FIRE_STATION: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-red-700">
        <FaFire className="text-red-700 text-sm" />
      </div>
    ),
    FITNESS: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-orange-500">
        <FaDumbbell className="text-orange-500 text-sm" />
      </div>
    ),
    GAS_STATION: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-yellow-600">
        <FaGasPump className="text-yellow-600 text-sm" />
      </div>
    ),
    GOVERNMENT_OFFICE: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-blue-500">
        <FaBuilding className="text-blue-500 text-sm" />
      </div>
    ),
    GYM: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-orange-600">
        <FaDumbbell className="text-orange-600 text-sm" />
      </div>
    ),
    HOSPITAL: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-red-500">
        <FaHospital className="text-red-500 text-sm" />
      </div>
    ),
    HOTEL: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-teal-500">
        <FaHotel className="text-teal-500 text-sm" />
      </div>
    ),
    INSURANCE_AGENCY: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-cyan-500">
        <FaShieldAlt className="text-cyan-500 text-sm" />
      </div>
    ),
    LANDMARK: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-amber-500">
        <FaMapMarkerAlt className="text-amber-500 text-sm" />
      </div>
    ),
    MARKET: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-green-500">
        <FaShoppingCart className="text-green-500 text-sm" />
      </div>
    ),
    MEDICAL_CENTER: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-red-400">
        <FaAmbulance className="text-red-400 text-sm" />
      </div>
    ),
    MEDICAL_STATION: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-red-300">
        <FaClinicMedical className="text-red-300 text-sm" />
      </div>
    ),
    MUSEUM: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-gray-800">
        <FaLandmark className="text-gray-800 text-sm" />
      </div>
    ),
    PARK: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-green-400">
        <FaTree className="text-green-400 text-sm" />
      </div>
    ),
    POLICE_NEW: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-blue-500">
        <FaUserTie className="text-blue-500 text-sm" />
      </div>
    ),
    POST_OFFICE: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-blue-600">
        <FaShippingFast className="text-blue-600 text-sm" />
      </div>
    ),
    RESTAURANT: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-orange-400">
        <FaUtensils className="text-orange-400 text-sm" />
      </div>
    ),
    ROADSIDE_ASSISTANCE: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-yellow-400">
        <FaWrench className="text-yellow-400 text-sm" />
      </div>
    ),
    SPORTS_FIELD: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-green-600">
        <FaFutbol className="text-green-600 text-sm" />
      </div>
    ),
    STORE: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-gray-500">
        <FaStore className="text-gray-500 text-sm" />
      </div>
    ),
    TOLL_BOOTH: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-yellow-500">
        <FaMoneyBillWave className="text-yellow-500 text-sm" />
      </div>
    ),
    TRAFFIC_CAMERA: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-gray-600">
        <FaVideo className="text-gray-600 text-sm" />
      </div>
    ),
    TRAFFIC_POLICE: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-green-500">
        <FaRoad className="text-green-500 text-sm" />
      </div>
    ),
    UNIVERSITY: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-purple-600">
        <FaUniversity className="text-purple-600 text-sm" />
      </div>
    ),
    VEHICLE_INSPECTION: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-gray-700">
        <FaCar className="text-gray-700 text-sm" />
      </div>
    ),
    default: (
      <div className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-gray-500">
        <FaCircle className="text-gray-500 text-sm" />
      </div>
    ),
  };
  return iconMap[iconType] || iconMap.default;
};

const MapMonitor = memo(({
  selectedEvent,
  selectedPlaces,
  showPlaces = true,
  showPopulation = true,
  showAirQuality = true,
  currentMapType = "basic",
  onMapTypeChange,
  mapRef: externalMapRef,
  onSearchToggle,
  onEventToggle,
  isSearchActive = false,
  isEventActive = false,
}) => {
  const internalMapRef = useRef(null);
  const mapRef = externalMapRef || internalMapRef;
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const placeMarkersRef = useRef([]);

  // Memoized createIcon function
  const createIcon = useCallback((type) => {
    const iconComponent = iconMap[type] || iconMap.default;
    const iconHtml = renderToStaticMarkup(iconComponent);
    return L.divIcon({
      html: iconHtml,
      className: "custom-marker-icon",
      iconSize: [32, 40], // Tăng chiều cao để chứa phần nhọn
      iconAnchor: [16, 40], // Điều chỉnh anchor để phần nhọn trỏ đúng vị trí
    });
  }, []);

  // Định nghĩa các tile layer
  const tileLayers = {
    basic: L.tileLayer(
      "https://maps.ots.vn/api/v1/tiles/basic/{z}/{x}/{y}/png?apikey=ndXs8opgf4onAzspo3kV3YFM3SgyHKp9&app-version=1.1",
      {
        attribution: "© OTS Maps",
        maxZoom: 18,
      }
    ),
    satellite: L.tileLayer(
      "https://maps.ots.vn/api/tiles/v1/satellite/{z}/{x}/{y}.png?apikey=ndXs8opgf4onAzspo3kV3YFM3SgyHKp9&app-version=1.1",
      {
        attribution: "© OTS Maps",
        maxZoom: 18,
      }
    ),
    streets: L.tileLayer(
      "https://maps.ots.vn/api/v1/tiles/streets/{z}/{x}/{y}/png?apikey=ndXs8opgf4onAzspo3kV3YFM3SgyHKp9&app-version=1.1",
      {
        attribution: "© OTS Maps",
        maxZoom: 18,
      }
    ),
    dark: L.tileLayer(
      "https://maps.ots.vn/api/v1/tiles/dark/{z}/{x}/{y}/png?apikey=ndXs8opgf4onAzspo3kV3YFM3SgyHKp9&app-version=1.1",
      {
        attribution: "© OTS Maps",
        maxZoom: 18,
      }
    ),
  };

  // Hàm chuyển đổi loại bản đồ
  const handleMapTypeChange = (mapType) => {
    if (mapRef.current && tileLayers[mapType]) {
      // Xóa layer cũ
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          mapRef.current.removeLayer(layer);
        }
      });

      // Thêm layer mới
      tileLayers[mapType].addTo(mapRef.current);
      onMapTypeChange && onMapTypeChange(mapType);
    }
  };

  // Theo dõi thay đổi currentMapType từ props
  useEffect(() => {
    if (mapRef.current && tileLayers[currentMapType]) {
      // Xóa layer cũ
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          mapRef.current.removeLayer(layer);
        }
      });

      // Thêm layer mới
      tileLayers[currentMapType].addTo(mapRef.current);
    }
  }, [currentMapType]);

  useEffect(() => {
    // Thêm CSS tùy chỉnh cho popup
    const style = document.createElement("style");
    style.textContent = `
      .custom-popup .leaflet-popup-content-wrapper {
        width: 480px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      .custom-popup .leaflet-popup-tip {
        background: white;
        border: none;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    `;
    document.head.appendChild(style);

    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        zoomControl: false, // Vẫn giữ zoomControl là false như yêu cầu ban đầu
        attributionControl: false,
      }).setView([10.951275, 106.824159], 14);

      // Thêm tile layer mặc định
      tileLayers[currentMapType].addTo(mapRef.current);

      // Bật zoomControl để người dùng có thể zoom thủ công
      // L.control.zoom({ position: "topright" }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      // Cleanup CSS
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedEvent && mapRef.current) {
      const lat = parseFloat(selectedEvent.latitude);
      const lng = parseFloat(selectedEvent.longitude.split(",")[0]);

      if (isNaN(lat) || isNaN(lng)) {
        console.error("Invalid event coordinates:", selectedEvent);
        return;
      }

      if (markerRef.current) {
        mapRef.current.removeLayer(markerRef.current);
      }
      if (circleRef.current) {
        mapRef.current.removeLayer(circleRef.current);
      }

      // Hàm định dạng thời gian cho người Việt
      const formatVietnameseDateTime = (timestamp) => {
        if (!timestamp) return "Chưa có thông tin";

        try {
          const date = new Date(timestamp);
          const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: "Asia/Ho_Chi_Minh",
          };
          return date.toLocaleString("vi-VN", options);
        } catch (error) {
          return timestamp; // Fallback to original if parsing fails
        }
      };

      // Hàm chuyển đổi status sang tiếng Việt
      const getVietnameseStatus = (status) => {
        const statusMap = {
          CHUA_XU_LY: "Chưa xử lý",
          DANG_XU_LY: "Đang xử lý",
          DA_XU_LY: "Đã xử lý",
          PENDING: "Chờ xử lý",
          IN_PROGRESS: "Đang thực hiện",
          COMPLETED: "Hoàn thành",
          CANCELLED: "Đã hủy",
        };
        return statusMap[status] || status || "Chưa xác định";
      };

      // Hàm lấy màu cho status
      const getStatusColor = (status) => {
        const statusColors = {
          CHUA_XU_LY: "text-red-500",
          DANG_XU_LY: "text-yellow-500",
          DA_XU_LY: "text-green-500",
          PENDING: "text-orange-500",
          IN_PROGRESS: "text-blue-500",
          COMPLETED: "text-green-600",
          CANCELLED: "text-gray-500",
        };
        return statusColors[status] || "text-gray-700";
      };

      // Hàm lấy icon cho loại sự kiện
      const getEventTypeIcon = (type) => {
        const eventTypeIcons = {
          FIRE: renderToStaticMarkup(
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <FaFire className="w-3 h-3 text-white" />
            </div>
          ),
          CAR_CRASH: renderToStaticMarkup(
            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
              <FaCarCrash className="w-3 h-3 text-white" />
            </div>
          ),
          THEFT: renderToStaticMarkup(
            <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
              <FaShieldAlt className="w-3 h-3 text-white" />
            </div>
          ),
          MEDICAL: renderToStaticMarkup(
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <FaHospital className="w-3 h-3 text-white" />
            </div>
          ),
        };
        return eventTypeIcons[type] || "";
      };


      // Sử dụng MapEventPopup component
      const eventPopupContent = MapEventPopup({ event: selectedEvent });

      // Thêm CSS cho popup hiện đại
      const style = document.createElement("style");
      style.textContent = `
        .modern-event-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          border-radius: 0 !important;
          padding: 0 !important;
        }
        .modern-event-popup .leaflet-popup-content {
          margin: 0 !important;
          padding: 0 !important;
        }
        .modern-event-popup .leaflet-popup-tip {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
          border: none !important;
          box-shadow: 0 3px 14px rgba(0,0,0,0.4) !important;
        }
      `;
      document.head.appendChild(style);

      // Tạo marker với popup bind sẵn
      markerRef.current = L.marker([lat, lng], {
        icon: createIcon(selectedEvent.type),
      })
        .addTo(mapRef.current)
        .bindPopup(eventPopupContent, {
          offset: [0, -20], // Offset để căn giữa popup (480px/2 = 240px) và hiển thị phía trên
          className: "modern-event-popup",
          closeButton: false,
          maxWidth: 500,
          autoPan: true,
        })
        .openPopup();

      circleRef.current = L.circle([lat, lng], {
        radius: 500,
        color: "red",
        fillColor: "red",
        fillOpacity: 0.2,
      }).addTo(mapRef.current);

      mapRef.current.setView([lat, lng], 15);
    }
  }, [selectedEvent]);

  useEffect(() => {
    console.log("Selected places in MapMonitor:", selectedPlaces);
    if (mapRef.current) {
      // Xóa các marker cũ
      placeMarkersRef.current.forEach((marker) =>
        mapRef.current.removeLayer(marker)
      );
      placeMarkersRef.current = [];

      if (showPlaces && selectedPlaces && selectedPlaces.length > 0) {
        const validPlaces = selectedPlaces.filter(
          (place) =>
            place.geometry &&
            place.geometry.coordinates &&
            place.geometry.coordinates.length === 2 &&
            !isNaN(place.geometry.coordinates[0]) &&
            !isNaN(place.geometry.coordinates[1]) &&
            place.properties &&
            place.properties.types
        );

        console.log("Valid places:", validPlaces);

        validPlaces.forEach((place) => {
          const lat = parseFloat(place.geometry.coordinates[1]);
          const lng = parseFloat(place.geometry.coordinates[0]);
          let iconType = "default";
          let popupColor = "bg-gray-500";

          // Xác định loại biểu tượng và màu sắc dựa trên types
          const types = place.properties.types;

          if (types.includes("hospital") || types.includes("medical_center")) {
            iconType = "HOSPITAL";
            popupColor = "bg-red-500";
          } else if (
            types.includes("medical_station") ||
            types.includes("clinic")
          ) {
            iconType = "MEDICAL_STATION";
            popupColor = "bg-red-400";
          } else if (types.includes("police")) {
            iconType = "POLICE";
            popupColor = "bg-blue-500";
          } else if (types.includes("traffic_police")) {
            iconType = "TRAFFIC_POLICE";
            popupColor = "bg-green-500";
          } else if (types.includes("college")) {
            iconType = "COLLEGE";
            popupColor = "bg-purple-500";
          } else if (types.includes("university")) {
            iconType = "UNIVERSITY";
            popupColor = "bg-purple-600";
          } else if (types.includes("airport")) {
            iconType = "AIRPORT";
            popupColor = "bg-blue-600";
          } else if (types.includes("bank")) {
            iconType = "BANK";
            popupColor = "bg-yellow-500";
          } else if (types.includes("cafe")) {
            iconType = "CAFE";
            popupColor = "bg-amber-800";
          } else if (types.includes("church")) {
            iconType = "CHURCH";
            popupColor = "bg-purple-600";
          } else if (types.includes("fire_station")) {
            iconType = "FIRE_STATION";
            popupColor = "bg-red-700";
          } else if (types.includes("government_office")) {
            iconType = "GOVERNMENT_OFFICE";
            popupColor = "bg-blue-500";
          } else if (types.includes("museum")) {
            iconType = "MUSEUM";
            popupColor = "bg-gray-800";
          } else if (types.includes("park")) {
            iconType = "PARK";
            popupColor = "bg-green-400";
          } else if (types.includes("post_office")) {
            iconType = "POST_OFFICE";
            popupColor = "bg-blue-600";
          }

          if (!isNaN(lat) && !isNaN(lng)) {
            const marker = L.marker([lat, lng], {
              icon: createIcon(iconType),
            })
              .addTo(mapRef.current)
              .bindPopup(
                `
                <div class="p-2 min-w-[400px]">
                  <div class="flex items-center gap-3 mb-1">
                    <div class="flex-shrink-0 flex items-center justify-center">
                      ${renderToStaticMarkup(getPopupIcon(iconType))}
                    </div>
                    <div class="flex-1 min-w-0">
                      <b class="text-md leading-tight break-words ">${
                        place.properties.name
                      }</b>
                    </div>
                  </div>
                  <p class="text-xs text-gray-700"><strong>Địa chỉ:</strong> ${
                    place.properties.address || "Không có thông tin"
                  }</p>
                  <p class="text-xs text-gray-700"><strong>Loại:</strong> ${
                    place.properties.types?.join(", ") || "Không xác định"
                  }</p>
                </div>
              `,
                {
                  offset: [0, -20], // Điều chỉnh popup hiển thị ở phía trên icon
                  className: "custom-popup",
                }
              );
            placeMarkersRef.current.push(marker);
          } else {
            console.error("Invalid coordinates for place:", place);
          }
        });

        // Không gọi fitBounds để giữ nguyên vị trí và zoom ban đầu
        console.log("Markers added without zooming");
      } else {
        console.warn("No places provided or empty array");
      }
    }
  }, [selectedPlaces, showPlaces]);

  return (
    <div
      id="map"
      style={{ width: "100%", height: "100%", position: "relative", zIndex: 1 }}
    >
      {/* Map Toggle Buttons */}
      <MapToggleButtons
        onSearchToggle={onSearchToggle}
        onEventToggle={onEventToggle}
        isSearchActive={isSearchActive}
        isEventActive={isEventActive}
      />

      {/* Dong Nai Population Circles Component */}
      {mapRef.current && (
        <DongNaiPopulationCircles
          map={mapRef.current}
          isVisible={showPopulation}
        />
      )}
      
      {showAirQuality && (
        <AirQualityMarkers
          map={mapRef.current}
          isVisible={showAirQuality}
        />
      )}
      
    </div>
  );
});

MapMonitor.displayName = 'MapMonitor';

// Export MapMonitor component
export default MapMonitor;
