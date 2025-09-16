import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapView = () => {
  return (
    <MapContainer
      center={[10.9596696,106.8462781,1]} // Tọa độ Đồng Nai
      zoom={14}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://maps.ots.vn/api/v1/tiles/basic/{z}/{x}/{y}/png?apikey=ndXs8opgf4onAzspo3kV3YFM3SgyHKp9&app-version=1.1"
        attribution="&copy; OTS Maps"
      />
    </MapContainer>
  );
};

export default MapView;
