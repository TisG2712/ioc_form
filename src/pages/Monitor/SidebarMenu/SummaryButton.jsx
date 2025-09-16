import React, { useState, memo, useCallback, useMemo } from "react";
import { FaTh } from "react-icons/fa";
import { motion } from "framer-motion";
import { searchPlaces } from "../../../service/mapApi";
import { useCache } from "../../../contexts/CacheContext";
import toast from 'react-hot-toast';
import MonitorSidebar from "./MonitorSidebar";

const SummaryButton = memo(({
  onSelectCategory,
  activeCategories = [],
  loadingCategories = new Set(),
  showPopulation,
  setShowPopulation,
  showAirQuality,
  setShowAirQuality,
  showWardSearch,
  setShowWardSearch,
  showEvents,
  setShowEvents,
  onLoadMore,
  noMoreData = {},
  onSidebarToggle,
  preloadAllData,
}) => {
  const [open, setOpen] = useState(false);
  const { 
    hasCachedPopulationData, 
    getCachedPopulationData,
    getCachedData,
    updateCache
  } = useCache();

  const handleCategoryClick = useCallback(async (
    categoryId,
    places,
    tokensByRegion,
    isToggleOff
  ) => {
    console.log("Category clicked:", categoryId);

    // Xử lý riêng cho nút Dân cư - sử dụng cached data ngay lập tức
    if (categoryId === "population") {
      if (hasCachedPopulationData()) {
        console.log('Using cached population data for instant display');
        const cachedData = getCachedPopulationData();
        console.log('Cached population data:', Object.keys(cachedData).length, 'wards');
      } else {
        console.log('No cached population data available - will load from API');
      }
      setShowPopulation(!showPopulation);
      return;
    }

    // Xử lý riêng cho nút Chất lượng không khí
    if (categoryId === "airQuality") {
      setShowAirQuality(!showAirQuality);
      return;
    }

    const isActive = activeCategories.includes(categoryId);

    if (isToggleOff) {
      onSelectCategory(categoryId, [], null, true);
      return;
    }

    // Nếu đã active thì không cần load lại từ API
    if (isActive) {
      console.log(
        `Category ${categoryId} is already active, skipping API call`
      );
      return;
    }

    try {
      // Kiểm tra cache trước
      const cachedData = getCachedData(categoryId);
      console.log(`Cache check for ${categoryId}:`, cachedData ? 'Found' : 'Not found');
      
      if (cachedData && cachedData.features && cachedData.features.length > 0) {
        console.log(`✅ Using cached data for ${categoryId}:`, cachedData.features.length, 'features');
        onSelectCategory(
          categoryId,
          cachedData.features,
          cachedData.tokensByRegion || {},
          false
        );
        return;
      }

      // Nếu không có cache, gọi API
      console.log(`❌ No cached data for ${categoryId}, fetching from API...`);
      const result = await searchPlaces(categoryId, ["70", "75"]);
      console.log("Result from API with multiple regions:", result);

      // Lưu vào cache
      await updateCache(categoryId, {
        features: result.features,
        tokensByRegion: result.tokensByRegion,
        loadedAt: Date.now()
      });

      onSelectCategory(
        categoryId,
        result.features,
        result.tokensByRegion,
        false
      ); // false = toggle on
    } catch (error) {
      console.error("Error fetching places:", error);
      toast.error(
        `Không thể tải danh sách ${
          categoryId === "health"
            ? "bệnh viện"
            : categoryId === "security"
            ? "công an"
            : categoryId === "education"
            ? "trường học"
            : "giao thông"
        }. Vui lòng thử lại.`
      );
    }
  }, [hasCachedPopulationData, getCachedPopulationData, setShowPopulation, showPopulation, activeCategories, onSelectCategory, getCachedData, updateCache]);

  const handleCloseSidebar = useCallback(() => {
    setOpen(false);
    onSidebarToggle && onSidebarToggle(false);
  }, [onSidebarToggle]);

  const handleToggleSidebar = useCallback(() => {
    setOpen(!open);
    onSidebarToggle && onSidebarToggle(!open);
  }, [open, onSidebarToggle]);

  return (
    <div className="relative">
      {/* Main Button - 9 dots grid icon - Ẩn khi sidebar mở */}
      {!open && (
        <div className="absolute bottom-4 right-4 z-50">
          <button
            onClick={handleToggleSidebar}
            className="bg-white w-12 h-12 rounded-full flex items-center justify-center text-gray-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border border-gray-200"
            title="Tiện ích bản đồ"
          >
            <FaTh className="text-lg transform transition-transform duration-300" />
          </button>
        </div>
      )}

      {/* Monitor Sidebar */}
      <MonitorSidebar
        isOpen={open}
        onClose={handleCloseSidebar}
        onSelectCategory={handleCategoryClick}
        activeCategories={activeCategories}
        loadingCategories={loadingCategories}
        showPopulation={showPopulation}
        showAirQuality={showAirQuality}
        preloadAllData={preloadAllData}
      />
    </div>
  );
});

SummaryButton.displayName = 'SummaryButton';

export default SummaryButton;
