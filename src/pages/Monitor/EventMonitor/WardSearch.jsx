import React, { useState } from "react";
import { getWardBoundary } from "../../../service/wardApi";
import WardBoundary from "./WardBoundary";

const WardSearch = ({ map }) => {
  const [searchValue, setSearchValue] = useState("");
  const searchType = "codes"; // Chỉ tìm kiếm theo mã phường/xã
  const [wardData, setWardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hàm tìm kiếm ward boundary
  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setError("Vui lòng nhập mã phường/xã");
      return;
    }

    setLoading(true);
    setError(null);
    setWardData(null);

    try {
      // Tìm kiếm theo mã phường/xã
      const response = await getWardBoundary(searchValue.trim(), true);

      if (response.data && response.data.length > 0) {
        setWardData(response.data[0]);
        console.log("Ward boundary data loaded:", response.data[0]);
      } else {
        setError("Không tìm thấy dữ liệu phường/xã với mã này");
      }
    } catch (err) {
      setError(`Lỗi khi tải dữ liệu: ${err.message}`);
      console.error("Error loading ward boundary:", err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi nhấn Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Hàm xóa ward boundary
  const handleClear = () => {
    setWardData(null);
    setSearchValue("");
    setError(null);
  };

  return (
    <div className="bg-white absolute top-10 left-0 p-2 rounded-lg shadow-lg max-w-sm">
      <h3 className="text-lg font-semibold mb-3 text-red-600">Tìm kiếm</h3>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mã phường/xã:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập mã phường/xã (VD: 00175)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            disabled={loading}
          />
          <button
            onClick={handleSearch}
            disabled={loading || !searchValue.trim()}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-md transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Tìm...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span>Tìm</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm mb-2 bg-red-50 p-2 rounded border border-red-200">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        </div>
      )}

      {wardData && (
        <div className="text-sm text-gray-700 bg-green-50 p-3 rounded border border-green-200 mb-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-green-800">
              Thông tin tìm thấy:
            </h4>
            <button
              onClick={handleClear}
              className="text-red-500 hover:text-red-700 text-xs"
            >
              ✕ Xóa
            </button>
          </div>
          <p>
            <strong>Tên:</strong> {wardData.ward_fname}
          </p>
          <p>
            <strong>Tên tiếng Anh:</strong> {wardData.ward_fne}
          </p>
          <p>
            <strong>Mã:</strong> {wardData.ward_code}
          </p>
          <p>
            <strong>Cấp:</strong> {wardData.level}
          </p>
          <p>
            <strong>Mã tỉnh:</strong> {wardData.prov_code}
          </p>
        </div>
      )}

      <div className="text-xs text-gray-500">
        <p className="font-medium mb-1">Ví dụ mã phường/xã:</p>
        <div className="grid grid-cols-1 gap-1">
          <button
            onClick={() => setSearchValue("00175")}
            className="text-left hover:bg-gray-100 p-1 rounded text-blue-600 hover:text-blue-800"
          >
            • 00175 - Phường Yên Hòa
          </button>
          <button
            onClick={() => setSearchValue("00176")}
            className="text-left hover:bg-gray-100 p-1 rounded text-blue-600 hover:text-blue-800"
          >
            • 00176 - Phường Trung Hòa
          </button>
          <button
            onClick={() => setSearchValue("00177")}
            className="text-left hover:bg-gray-100 p-1 rounded text-blue-600 hover:text-blue-800"
          >
            • 00177 - Phường Cầu Giấy
          </button>
        </div>
      </div>

      {/* Ward Boundary Component */}
      {map && wardData && (
        <WardBoundary
          map={map}
          wardData={wardData}
          options={{
            color: "#EF4444", // Red color
            weight: 3,
            opacity: 0.8,
            fillColor: "#EF4444",
            fillOpacity: 0.1,
            fitBounds: true, // Auto fit bounds
          }}
        />
      )}
    </div>
  );
};

export default WardSearch;
