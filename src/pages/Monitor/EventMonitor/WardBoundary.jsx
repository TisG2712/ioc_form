import React, { useEffect, useRef } from "react";
import L from "leaflet";

const WardBoundary = ({ map, wardData, options = {} }) => {
  const polygonRef = useRef(null);

  useEffect(() => {
    if (!map || !wardData || !wardData.geom) {
      console.log("WardBoundary: Missing required data", { map: !!map, wardData: !!wardData, geom: !!wardData?.geom });
      return;
    }

    // Xóa polygon cũ nếu có
    if (polygonRef.current) {
      map.removeLayer(polygonRef.current);
    }

    try {
      // Xử lý dữ liệu geometry từ API
      const { type, coordinates } = wardData.geom;
      
      console.log("WardBoundary: Processing geometry", {
        ward_code: wardData.ward_code,
        ward_fname: wardData.ward_fname,
        geom_type: type,
        coordinates_length: coordinates?.length,
        first_coordinate: coordinates?.[0]?.[0]?.[0]
      });

      // Tạo polygon với style mặc định
      const defaultStyle = {
        color: "#3B82F6", // Blue color
        weight: 3,
        opacity: 0.8,
        fillColor: "#3B82F6",
        fillOpacity: 0.1,
        ...options,
      };

      if (type === "MultiPolygon") {
        // Xử lý MultiPolygon - tạo layer group chứa tất cả các polygon
        const polygonGroup = L.layerGroup();
        
        coordinates.forEach((polygonCoords, polygonIndex) => {
          const latLngs = polygonCoords[0].map((coord) => [coord[1], coord[0]]); // [lng, lat] -> [lat, lng]
          
          console.log(`WardBoundary: Processing polygon ${polygonIndex + 1} of MultiPolygon`, {
            latLngs_length: latLngs.length,
            first_latLng: latLngs[0],
            last_latLng: latLngs[latLngs.length - 1]
          });

          const polygon = L.polygon(latLngs, defaultStyle);
          polygonGroup.addLayer(polygon);
        });
        
        polygonRef.current = polygonGroup.addTo(map);
        
        console.log("WardBoundary: Created MultiPolygon with", coordinates.length, "polygons");
        
      } else if (type === "Polygon") {
        // Xử lý Polygon đơn giản
        const latLngs = coordinates[0].map((coord) => [coord[1], coord[0]]); // [lng, lat] -> [lat, lng]
        
        console.log("WardBoundary: Converted coordinates", {
          latLngs_length: latLngs.length,
          first_latLng: latLngs[0],
          last_latLng: latLngs[latLngs.length - 1]
        });

        polygonRef.current = L.polygon(latLngs, defaultStyle).addTo(map);
        
      } else {
        console.error("Unsupported geometry type:", type);
        return;
      }

      // Thêm popup với thông tin ward
      const popupContent = `
        <div class="p-3 min-w-[200px]">
          <h3 class="font-bold text-lg mb-2 text-blue-600">${
            wardData.ward_fname || wardData.prov_fname
          }</h3>
          <p class="text-sm text-gray-700 mb-1"><strong>Tên tiếng Anh:</strong> ${
            wardData.ward_fne || wardData.prov_fne
          }</p>
          <p class="text-sm text-gray-700 mb-1"><strong>Cấp:</strong> ${
            wardData.level
          }</p>
          <p class="text-sm text-gray-700 mb-1"><strong>Mã:</strong> ${
            wardData.ward_code || wardData.prov_code
          }</p>
          <p class="text-sm text-gray-700"><strong>Loại geometry:</strong> ${
            wardData.geom_level
          }</p>
        </div>
      `;

      // Thêm event listener để hiển thị popup ở giữa khu vực (nếu không bị tắt)
      if (options.showPopup !== false) {
        if (type === "MultiPolygon") {
          // Cho MultiPolygon, thêm event listener cho từng polygon trong group
          polygonRef.current.eachLayer((layer) => {
            layer.on("click", function (e) {
              // Lấy tọa độ trung tâm của toàn bộ group
              const group = polygonRef.current;
              const bounds = L.latLngBounds();
              group.eachLayer((groupLayer) => {
                bounds.extend(groupLayer.getBounds());
              });
              const center = bounds.getCenter();

              // Tạo popup ở vị trí trung tâm
              L.popup({
                offset: [0, -10],
                className: "custom-popup",
              })
                .setLatLng(center)
                .setContent(popupContent)
                .openOn(map);
            });
          });
        } else {
          // Cho Polygon đơn giản
          polygonRef.current.on("click", function (e) {
            // Lấy tọa độ trung tâm của polygon
            const center = polygonRef.current.getBounds().getCenter();

            // Tạo popup ở vị trí trung tâm
            L.popup({
              offset: [0, -10],
              className: "custom-popup",
            })
              .setLatLng(center)
              .setContent(popupContent)
              .openOn(map);
          });
        }
      }

      // Fit map view to polygon bounds
      if (options.fitBounds !== false) {
        if (type === "MultiPolygon") {
          // For layer group, get bounds from all layers
          const group = polygonRef.current;
          const bounds = L.latLngBounds();
          group.eachLayer((layer) => {
            bounds.extend(layer.getBounds());
          });
          map.fitBounds(bounds, {
            padding: [20, 20],
          });
        } else {
          // For single polygon
          map.fitBounds(polygonRef.current.getBounds(), {
            padding: [20, 20],
          });
        }
      }
    } catch (error) {
      console.error("Error creating ward boundary:", error);
    }

    // Cleanup function
    return () => {
      if (polygonRef.current) {
        map.removeLayer(polygonRef.current);
        polygonRef.current = null;
      }
    };
  }, [map, wardData, options]);

  // Component không render gì, chỉ quản lý polygon trên map
  return null;
};

export default WardBoundary;
