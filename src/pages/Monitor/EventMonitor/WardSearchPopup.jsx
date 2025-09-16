import React, { useState, useEffect, memo, useMemo, useCallback } from "react";
import { getAllWards, getWardBoundary } from "../../../service/wardApi";
import WardBoundary from "./WardBoundary";

const WardSearchPopup = memo(({ map, isOpen = false, onClose }) => {
  const [searchValue, setSearchValue] = useState("");
  const [wardData, setWardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allWards, setAllWards] = useState([]);
  const [filteredWards, setFilteredWards] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Load tất cả wards khi component mount
  useEffect(() => {
    const loadAllWards = async () => {
      setLoadingWards(true);
      try {
        // Load tất cả wards với pagination, size = 50
        const response = await getAllWards(1, 50);
        if (response.data && Array.isArray(response.data)) {
          setAllWards(response.data);
        }
      } catch (err) {
        console.error("Error loading all wards:", err);
      } finally {
        setLoadingWards(false);
      }
    };

    if (isOpen) {
      loadAllWards();
    }
  }, [isOpen]);

  // Filter wards khi searchValue thay đổi
  useEffect(() => {
    if (searchValue.trim() && allWards.length > 0) {
      const filtered = allWards.filter(
        (ward) =>
          ward.ward_fname &&
          ward.ward_fname.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredWards(filtered.slice(0, 10)); // Chỉ hiển thị 10 kết quả đầu tiên
      setShowSuggestions(true);
    } else {
      setFilteredWards([]);
      setShowSuggestions(false);
    }
  }, [searchValue, allWards]);

  // Hàm tìm kiếm ward boundary
  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setError("Vui lòng nhập tên xã");
      return;
    }

    setLoading(true);
    setError(null);
    setWardData(null);
    setShowSuggestions(false);

    try {
      // Tìm ward theo tên trong danh sách đã load
      const foundWard = allWards.find(
        (ward) =>
          ward.ward_fname &&
          ward.ward_fname.toLowerCase() === searchValue.toLowerCase()
      );

      if (foundWard) {
        // Sử dụng handleSearchWithWard để có logic giống như Enter
        await handleSearchWithWard(foundWard);
      } else {
        // Nếu không tìm thấy exact match, thử tìm partial match
        const partialMatch = allWards.find(
          (ward) =>
            ward.ward_fname &&
            ward.ward_fname.toLowerCase().includes(searchValue.toLowerCase())
        );

        if (partialMatch) {
          setSearchValue(partialMatch.ward_fname);
          await handleSearchWithWard(partialMatch);
        } else {
          setError("Không tìm thấy xã với tên này");
        }
      }
    } catch (err) {
      setError(`Lỗi khi tải dữ liệu: ${err.message}`);
      console.error("Error loading ward boundary:", err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm chọn ward từ suggestions
  const handleSelectWard = (ward) => {
    setSearchValue(ward.ward_fname);
    setShowSuggestions(false);

    // Tự động tìm kiếm sau khi chọn
    setTimeout(() => {
      handleSearchWithWard(ward);
    }, 100);
  };

  // Đóng dropdown khi click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSuggestions && !event.target.closest(".suggestions-container")) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSuggestions]);

  // Hàm xử lý khi nhấn Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // Nếu có suggestions và chưa chọn chính xác, chọn suggestion đầu tiên
      if (showSuggestions && filteredWards.length > 0) {
        const firstWard = filteredWards[0];
        setSearchValue(firstWard.ward_fname);
        setShowSuggestions(false);

        // Tự động tìm kiếm sau khi chọn
        setTimeout(() => {
          handleSearchWithWard(firstWard);
        }, 100);
      } else {
        // Tìm kiếm bình thường
        handleSearch();
      }
    }
  };

  // Hàm tìm kiếm với ward đã biết
  const handleSearchWithWard = async (ward) => {
    setLoading(true);
    setError(null);
    setWardData(null);
    setShowSuggestions(false);

    try {
      // Lấy mã ward và gọi API với geometry
      console.log(`Fetching boundary for ward: ${ward.ward_fname} (code: ${ward.ward_code})`);
      const response = await getWardBoundary(ward.ward_code, true);
      
      console.log("API Response:", response);
      console.log("Response data length:", response.data?.length);

      if (response.data && response.data.length > 0) {
        const wardData = response.data[0];
        console.log("Ward data details:", {
          ward_code: wardData.ward_code,
          ward_fname: wardData.ward_fname,
          has_geom: !!wardData.geom,
          geom_type: wardData.geom?.type,
          geom_coordinates_length: wardData.geom?.coordinates?.length
        });
        
        // Kiểm tra geometry data
        if (!wardData.geom) {
          console.error("No geometry data found for ward:", wardData);
          setError("Không có dữ liệu geometry cho phường/xã này");
          return;
        }
        
        if (!wardData.geom.coordinates || wardData.geom.coordinates.length === 0) {
          console.error("Empty coordinates for ward:", wardData);
          setError("Dữ liệu tọa độ trống cho phường/xã này");
          return;
        }
        
        setWardData(wardData);
        console.log("Ward boundary data loaded successfully:", wardData);
      } else {
        console.error("No data returned from API for ward code:", ward.ward_code);
        setError("Không tìm thấy dữ liệu geometry cho phường/xã này");
      }
    } catch (err) {
      setError(`Lỗi khi tải dữ liệu: ${err.message}`);
      console.error("Error loading ward boundary:", err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa ward boundary
  const handleClear = () => {
    setWardData(null);
    setSearchValue("");
    setError(null);
  };

  return (
    <div className="absolute top-2.5 left-16 z-[1000]">
      {isOpen && (
        <div className="bg-white shadow-xl rounded-xl p-4 w-[420px] max-h-[400px] z-[1000]">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-red-600">Tìm kiếm</h2>
            <button onClick={onClose} className="text-black hover:text-red-500">
              ✕
            </button>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên xã:
            </label>
            <div className="relative suggestions-container">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Nhập tên xã (VD: Biên Hòa)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                    disabled={loading || loadingWards}
                  />

                  {/* Loading indicator cho việc load wards */}
                  {loadingWards && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSearch}
                  disabled={loading || !searchValue.trim() || loadingWards}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-md transition-colors flex items-center gap-2 text-sm"
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

              {/* Dropdown suggestions */}
              {showSuggestions && filteredWards.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                  {filteredWards.map((ward, index) => (
                    <button
                      key={ward.ward_code || `ward-${index}`}
                      onClick={() => handleSelectWard(ward)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0 text-sm"
                    >
                      <div className="font-medium">{ward.ward_fname}</div>
                      <div className="text-xs text-gray-500">
                        Mã: {ward.ward_code}
                      </div>
                    </button>
                  ))}
                </div>
              )}
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
            <p className="font-medium mb-1">Ví dụ xã ở Đồng Nai:</p>
            <div className="grid grid-cols-1 gap-1">
              <button
                onClick={() => setSearchValue("Biên Hòa")}
                className="text-left hover:bg-gray-100 p-1 rounded text-blue-600 hover:text-blue-800"
              >
                • Biên Hòa
              </button>
              <button
                onClick={() => setSearchValue("Nhơn Trạch")}
                className="text-left hover:bg-gray-100 p-1 rounded text-blue-600 hover:text-blue-800"
              >
                • Nhơn Trạch
              </button>
              <button
                onClick={() => setSearchValue("Phước Bình")}
                className="text-left hover:bg-gray-100 p-1 rounded text-blue-600 hover:text-blue-800"
              >
                • Phước Bình
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
      )}
    </div>
  );
});

export default WardSearchPopup;
