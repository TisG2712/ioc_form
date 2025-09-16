import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import MapMonitor from "../pages/Monitor/MapMonitor";

// Lazy load các components lớn
const EventTable = lazy(() => import("../pages/Monitor/EventMonitor/EventTable"));
const MapSwitcher = lazy(() => import("../pages/Monitor/EventMonitor/MapSwitcher"));
const WardSearchPopup = lazy(() => import("../pages/Monitor/EventMonitor/WardSearchPopup"));
const SummaryButton = lazy(() => import("../pages/Monitor/SidebarMenu/SummaryButton"));
const MapStats = lazy(() => import("../pages/Monitor/CardMonitor/MapStats"));
const DongNaiPopulationCircles = lazy(() => import("../pages/Monitor/EventMonitor/DongNaiPopulationCircles"));
const AirQualityMarkers = lazy(() => import("../pages/Monitor/EventMonitor/AirQualityMarkers"));
import { createEvent, getAllEvents } from "../service/eventApi";
import { searchPlaces, getSupportedCategories } from "../service/mapApi";
import { getThongTinTongHopLatest } from "../service/populationApi";
import { getAllWards } from "../service/wardApi";
import { preloadAQIData } from "../service/airQualityCacheService";
import { useCache } from "../contexts/CacheContext";

function MonitorLayout() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  const [categoryTokens, setCategoryTokens] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(new Set());
  const [noMoreData, setNoMoreData] = useState({});

  const [showPopulation, setShowPopulation] = useState(true);
  const [showAirQuality, setShowAirQuality] = useState(true);
  const [showWardSearch, setShowWardSearch] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [currentMapType, setCurrentMapType] = useState("basic");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State cho toggle buttons
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isEventActive, setIsEventActive] = useState(false);
  const mapRef = useRef(null);

  // Cache system from context
  const {
    cachedData,
    updateCache,
    updatePopulationCache,
    updateWardsCache,
    getCachedData,
    getCachedPopulationData,
    getCachedWardsData,
    hasCachedData,
    hasCachedPopulationData,
    hasCachedWardsData,
    isPreloading,
    setIsPreloading,
    preloadProgress,
    setPreloadProgress,
    isCacheValid,
    getCacheInfo,
  } = useCache();

  const defaultCategories = [
    "health",
    "education",
    "security",
    "traffic",
    "fire_station",
  ];

  // Lấy danh sách categories được hỗ trợ từ mapApi
  const supportedCategories = getSupportedCategories();
  
  // Tất cả categories cần preload (chỉ lấy những categories được hỗ trợ)
  const allCategories = supportedCategories.filter(category => 
    !["church", "fire"].includes(category) // Loại bỏ categories không cần thiết
  );

  // Hàm preload tất cả dữ liệu
  const preloadAllData = async () => {
    try {
      console.log('Starting preloadAllData...');
      setIsPreloading(true);
      setPreloadProgress(0);

      const totalCategories = allCategories.length + 3; // +3 for population, AQI and wards data
      console.log(`Total categories to preload: ${totalCategories}`);

      let completed = 0;

    for (const category of allCategories) {
      try {
        console.log(`Preloading ${category}...`);

        // Kiểm tra xem category có được hỗ trợ không
        if (!supportedCategories.includes(category)) {
          console.warn(`Category ${category} is not supported, skipping...`);
          completed++;
          setPreloadProgress(Math.round((completed / totalCategories) * 100));
          continue;
        }

        // Load tất cả dữ liệu cho category này
        let allFeatures = [];
        let tokensByRegion = {};
        let hasMoreData = true;

        // Load batch đầu tiên
        const firstResult = await searchPlaces(category, ["70", "75"]);
        allFeatures = [...firstResult.features];
        tokensByRegion = firstResult.tokensByRegion || {};

        // Load tất cả các batch còn lại
        while (
          hasMoreData &&
          tokensByRegion &&
          Object.keys(tokensByRegion).length > 0
        ) {
          const regionCodesWithTokens = Object.keys(tokensByRegion);
          const nextPageTokens = regionCodesWithTokens.map(
            (regionCode) => tokensByRegion[regionCode]
          );

          const result = await searchPlaces(
            category,
            regionCodesWithTokens,
            40,
            nextPageTokens
          );

          allFeatures = [...allFeatures, ...result.features];

          if (
            result.tokensByRegion &&
            Object.keys(result.tokensByRegion).length > 0
          ) {
            tokensByRegion = result.tokensByRegion;
          } else {
            hasMoreData = false;
          }

          // Delay nhỏ để không overload server
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Cache tất cả dữ liệu đã load
        updateCache(category, {
          features: allFeatures,
          tokensByRegion: {},
          loadedAt: Date.now(),
        });

        console.log(`Preloaded ${allFeatures.length} places for ${category}`);

        completed++;
        setPreloadProgress(Math.round((completed / totalCategories) * 100));

        // Delay nhỏ giữa các categories
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Lỗi khi preload ${category}:`, error);
        
        // Nếu là lỗi Invalid category, bỏ qua category này
        if (error.message.includes('Invalid category')) {
          console.warn(`Skipping unsupported category: ${category}`);
        }
        
        completed++;
        setPreloadProgress(Math.round((completed / totalCategories) * 100));
      }
    }

    // Preload population data
    try {
      console.log("Preloading population data...");
      const populationData = await getThongTinTongHopLatest();
      if (populationData && populationData.body) {
        const populationMap = {};
        populationData.body.forEach((item) => {
          populationMap[item.madvhc] = parseInt(item.nkTongNhanKhau);
        });
        updatePopulationCache(populationMap);
        console.log(
          "Population data cached:",
          Object.keys(populationMap).length,
          "wards"
        );
      }
      completed++;
      setPreloadProgress(Math.round((completed / totalCategories) * 100));
    } catch (error) {
      console.error("Lỗi khi preload population data:", error);
      completed++;
      setPreloadProgress(Math.round((completed / totalCategories) * 100));
    }

    // Preload AQI data
    try {
      console.log("Preloading AQI data...");
      await preloadAQIData();
      console.log("AQI data cached successfully");
      completed++;
      setPreloadProgress(Math.round((completed / totalCategories) * 100));
    } catch (error) {
      console.error("Lỗi khi preload AQI data:", error);
      completed++;
      setPreloadProgress(Math.round((completed / totalCategories) * 100));
    }

    // Preload wards data
    try {
      console.log("Preloading wards data...");
      const [response1, response2] = await Promise.all([
        getAllWards(1, 50), // Page 1: 50 wards
        getAllWards(2, 50), // Page 2: 50 wards
      ]);

      // Kết hợp dữ liệu từ cả 2 page
      const allWards = [];
      if (response1.data && Array.isArray(response1.data)) {
        allWards.push(...response1.data);
      }
      if (response2.data && Array.isArray(response2.data)) {
        allWards.push(...response2.data);
      }

      if (allWards.length > 0) {
        updateWardsCache(allWards);
        console.log("Wards data cached:", allWards.length, "wards");
      }
      completed++;
      setPreloadProgress(Math.round((completed / totalCategories) * 100));
    } catch (error) {
      console.error("Lỗi khi preload wards data:", error);
      completed++;
      setPreloadProgress(Math.round((completed / totalCategories) * 100));
    }


    setIsPreloading(false);
    setPreloadProgress(100);
    console.log("Preload completed! All data cached.");
    } catch (error) {
      console.error("Error in preloadAllData:", error);
      setIsPreloading(false);
      setPreloadProgress(0);
      throw error; // Re-throw để handleClearCache có thể catch
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const eventData = await getAllEvents(0, 100);
        setEvents(eventData || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách sự kiện:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();

    // Không tự động preload dữ liệu khi mount
    // Chỉ load khi user chủ động bấm nút tải lại cache
    console.log("MonitorLayout mounted - no automatic preload");
  }, []);

  const handleSelectEvent = (event) => {
    console.log("Selected event:", event);
    setSelectedEvent(event);
  };

  const handleMapTypeChange = (mapType) => {
    setCurrentMapType(mapType);
  };

  const handleOpenCreate = () => {
    setShowAddPopup(true);
  };

  const handleCloseAddPopup = () => {
    setShowAddPopup(false);
  };

  // const handleSaveEvent = async (newEvent) => {
  //   try {
  //     const createdEvent = await createEvent(newEvent);
  //     setEvents((prev) => [...prev, createdEvent]);
  //   } catch (error) {
  //     console.error("Lỗi khi tạo sự kiện:", error);
  //     alert("Lỗi khi tạo sự kiện");
  //   }
  // };

  const handleUpdate = async () => {
    setSelectedEvent(null);
  };

  // Hàm xử lý khi bật/tắt Ward Search
  const handleWardSearchToggle = (isOpen) => {
    setShowWardSearch(isOpen);
    // Tắt Events khi bật Ward Search
    if (isOpen) {
      setShowEvents(false);
    }
  };

  // Hàm xử lý khi bật/tắt Events
  const handleEventsToggle = (isOpen) => {
    setShowEvents(isOpen);
    // Tắt Ward Search khi bật Events
    if (isOpen) {
      setShowWardSearch(false);
    }
  };


  // Hàm xử lý toggle cho search button
  const handleSearchToggle = (isActive) => {
    setIsSearchActive(isActive);
    if (isActive) {
      setShowWardSearch(true);
      setIsEventActive(false);
      setShowEvents(false);
    } else {
      setShowWardSearch(false);
    }
  };

  // Hàm xử lý toggle cho event button
  const handleEventToggle = (isActive) => {
    setIsEventActive(isActive);
    if (isActive) {
      setShowEvents(true);
      setIsSearchActive(false);
      setShowWardSearch(false);
    } else {
      setShowEvents(false);
    }
  };

  const handleSelectCategory = async (
    category,
    places,
    tokensByRegion,
    isToggleOff = false
  ) => {
    console.log(
      "Category selected:",
      category,
      "Places:",
      places,
      "Tokens:",
      tokensByRegion,
      "Toggle off:",
      isToggleOff
    );

    if (isToggleOff) {
      // Tắt category này
      setActiveCategories((prev) => prev.filter((cat) => cat !== category));
      setSelectedPlaces((prev) =>
        prev.filter((place) => {
          const placeTypes = place.properties?.types || [];
          switch (category) {
            case "health":
              return !(
                placeTypes.includes("hospital") ||
                placeTypes.includes("clinic") ||
                placeTypes.includes("medical_station") ||
                placeTypes.includes("medical_center")
              );
            case "security":
              return !(
                placeTypes.includes("police") ||
                placeTypes.includes("traffic_police")
              );
            case "education":
              return !(
                placeTypes.includes("college") ||
                placeTypes.includes("university")
              );
            case "traffic":
              return !placeTypes.includes("traffic_police");
            case "fire":
              return !placeTypes.includes("fire_station");
            case "bank":
              return !placeTypes.includes("bank");
            case "cafe":
              return !placeTypes.includes("cafe");
            case "post_office":
              return !placeTypes.includes("post_office");
            case "park":
              return !placeTypes.includes("park");
            case "museum":
              return !placeTypes.includes("museum");
            case "fire_station":
              return !placeTypes.includes("fire_station");
            case "government_office":
              return !placeTypes.includes("government_office");
            case "airport":
              return !placeTypes.includes("airport");
            default:
              return true;
          }
        })
      );
      setCategoryTokens((prev) => {
        const newTokens = { ...prev };
        delete newTokens[category];
        return newTokens;
      });
      setNoMoreData((prev) => {
        const newNoMore = { ...prev };
        delete newNoMore[category];
        return newNoMore;
      });
    } else {
      // Kiểm tra cache trước
      if (hasCachedData(category)) {
        const cachedCategoryData = getCachedData(category);
        console.log(
          `Using cached data for ${category} - ${cachedCategoryData.features.length} places`
        );

        // Thêm category vào danh sách active (multi-select)
        setActiveCategories((prev) => {
          if (prev.includes(category)) return prev; // Đã có rồi
          return [...prev, category];
        });

        // Thêm places từ category này vào danh sách hiện tại
        setSelectedPlaces((prev) => {
          // Lọc bỏ places cũ của category này trước
          const filteredPrev = prev.filter((place) => {
            const placeTypes = place.properties?.types || [];
            switch (category) {
              case "health":
                return !(
                  placeTypes.includes("hospital") ||
                  placeTypes.includes("clinic") ||
                  placeTypes.includes("medical_station") ||
                  placeTypes.includes("medical_center")
                );
              case "security":
                return !(
                  placeTypes.includes("police") ||
                  placeTypes.includes("traffic_police")
                );
              case "education":
                return !(
                  placeTypes.includes("college") ||
                  placeTypes.includes("university")
                );
              case "traffic":
                return !placeTypes.includes("traffic_police");
              case "fire":
                return !placeTypes.includes("fire_station");
              case "bank":
                return !placeTypes.includes("bank");
              case "cafe":
                return !placeTypes.includes("cafe");
              case "post_office":
                return !placeTypes.includes("post_office");
              case "park":
                return !placeTypes.includes("park");
              case "museum":
                return !placeTypes.includes("museum");
              case "fire_station":
                return !placeTypes.includes("fire_station");
              case "government_office":
                return !placeTypes.includes("government_office");
              case "airport":
                return !placeTypes.includes("airport");
              default:
                return true;
            }
          });
          // Thêm places mới từ category này
          return [...filteredPrev, ...cachedCategoryData.features];
        });

        setCategoryTokens((prev) => ({ ...prev, [category]: {} }));
        setNoMoreData((prev) => ({ ...prev, [category]: true }));

        console.log(
          `Added ${cachedCategoryData.features.length} places for ${category} to existing places`
        );
      } else {
        // Fallback: load từ API nếu chưa có cache
        console.log(`No cache for ${category}, loading from API...`);

        // Thêm category vào danh sách active (multi-select)
        setActiveCategories((prev) => {
          if (prev.includes(category)) return prev; // Đã có rồi
          return [...prev, category];
        });

        // Thêm places từ API vào danh sách hiện tại
        setSelectedPlaces((prev) => {
          // Lọc bỏ places cũ của category này trước
          const filteredPrev = prev.filter((place) => {
            const placeTypes = place.properties?.types || [];
            switch (category) {
              case "health":
                return !(
                  placeTypes.includes("hospital") ||
                  placeTypes.includes("clinic") ||
                  placeTypes.includes("medical_station") ||
                  placeTypes.includes("medical_center")
                );
              case "security":
                return !(
                  placeTypes.includes("police") ||
                  placeTypes.includes("traffic_police")
                );
              case "education":
                return !(
                  placeTypes.includes("college") ||
                  placeTypes.includes("university")
                );
              case "traffic":
                return !placeTypes.includes("traffic_police");
              case "fire":
                return !placeTypes.includes("fire_station");
              case "bank":
                return !placeTypes.includes("bank");
              case "cafe":
                return !placeTypes.includes("cafe");
              case "post_office":
                return !placeTypes.includes("post_office");
              case "park":
                return !placeTypes.includes("park");
              case "museum":
                return !placeTypes.includes("museum");
              case "fire_station":
                return !placeTypes.includes("fire_station");
              case "government_office":
                return !placeTypes.includes("government_office");
              case "airport":
                return !placeTypes.includes("airport");
              default:
                return true;
            }
          });
          // Thêm places mới từ API
          return [...filteredPrev, ...places];
        });

        setLoadingCategories(new Set([category]));

        if (tokensByRegion && Object.keys(tokensByRegion).length > 0) {
          setCategoryTokens((prev) => ({
            ...prev,
            [category]: tokensByRegion,
          }));
        } else {
          setCategoryTokens((prev) => ({ ...prev, [category]: {} }));
        }
        setNoMoreData((prev) => ({ ...prev, [category]: false }));

        // Load batch đầu tiên nhanh, sau đó load thêm trong background
        if (tokensByRegion && Object.keys(tokensByRegion).length > 0) {
          try {
            const regionCodesWithTokens = Object.keys(tokensByRegion);
            const nextPageTokens = regionCodesWithTokens.map(
              (regionCode) => tokensByRegion[regionCode]
            );

            // Load batch đầu tiên ngay lập tức
            const result = await searchPlaces(
              category,
              regionCodesWithTokens,
              40,
              nextPageTokens
            );

            setSelectedPlaces((prev) => [...prev, ...result.features]);

            if (
              result.tokensByRegion &&
              Object.keys(result.tokensByRegion).length > 0
            ) {
              setCategoryTokens((prev) => ({
                ...prev,
                [category]: result.tokensByRegion,
              }));

              // Load thêm dữ liệu trong background (không block UI)
              setTimeout(async () => {
                await loadMoreDataInBackground(category, result.tokensByRegion);
              }, 500);
            } else {
              setNoMoreData((prev) => ({ ...prev, [category]: true }));
            }
          } catch (error) {
            console.error(`Lỗi khi tải dữ liệu cho ${category}:`, error);
            setNoMoreData((prev) => ({ ...prev, [category]: true }));
          } finally {
            setLoadingCategories((prev) => {
              const newSet = new Set(prev);
              newSet.delete(category);
              return newSet;
            });
          }
        } else {
          setLoadingCategories((prev) => {
            const newSet = new Set(prev);
            newSet.delete(category);
            return newSet;
          });
        }
      }
    }
  };

  // Hàm load thêm dữ liệu trong background
  const loadMoreDataInBackground = async (category, tokensByRegion) => {
    try {
      let result = { hasMoreData: true, tokensByRegion };
      let totalLoaded = 0;

      while (
        result.hasMoreData &&
        result.tokensByRegion &&
        Object.keys(result.tokensByRegion).length > 0
      ) {
        const regionCodesWithTokens = Object.keys(result.tokensByRegion);
        const nextPageTokens = regionCodesWithTokens.map(
          (regionCode) => result.tokensByRegion[regionCode]
        );

        result = await searchPlaces(
          category,
          regionCodesWithTokens,
          40,
          nextPageTokens
        );

        setSelectedPlaces((prev) => [...prev, ...result.features]);
        totalLoaded += result.features.length;

        if (
          result.tokensByRegion &&
          Object.keys(result.tokensByRegion).length > 0
        ) {
          setCategoryTokens((prev) => ({
            ...prev,
            [category]: result.tokensByRegion,
          }));
        } else {
          setNoMoreData((prev) => ({ ...prev, [category]: true }));
          break;
        }

        // Delay lớn hơn để không ảnh hưởng UI
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      console.log(
        `Background loaded total ${totalLoaded} more places for ${category}`
      );
    } catch (error) {
      console.error(`Lỗi khi load background cho ${category}:`, error);
      setNoMoreData((prev) => ({ ...prev, [category]: true }));
    }
  };

  const handleLoadMore = async (category) => {
    const tokens = categoryTokens[category];
    if (!tokens || noMoreData[category] || loadingCategories.has(category))
      return;

    setLoadingCategories((prev) => new Set(prev).add(category));

    try {
      const regionCodesWithTokens = Object.keys(tokens);
      const nextPageTokens = regionCodesWithTokens.map(
        (regionCode) => tokens[regionCode]
      );

      const result = await searchPlaces(
        category,
        regionCodesWithTokens,
        20,
        nextPageTokens
      );

      setSelectedPlaces((prev) => [...prev, ...result.features]);

      if (
        result.tokensByRegion &&
        Object.keys(result.tokensByRegion).length > 0
      ) {
        setCategoryTokens((prev) => ({
          ...prev,
          [category]: result.tokensByRegion,
        }));
      } else {
        setNoMoreData((prev) => ({ ...prev, [category]: true }));
      }
    } catch (error) {
      console.error(`Lỗi khi tải thêm dữ liệu cho ${category}:`, error);
      setNoMoreData((prev) => ({ ...prev, [category]: true }));
    } finally {
      setLoadingCategories((prev) => {
        const newSet = new Set(prev);
        newSet.delete(category);
        return newSet;
      });
    }
  };

  // Hiển thị tất cả sự kiện, không filter theo categories
  const filteredEvents = events;

  const hasLoadMoreCategories = activeCategories.some((category) => {
    const tokens = categoryTokens[category];
    const noMore = noMoreData[category];
    return tokens && Object.keys(tokens).length > 0 && !noMore;
  });

  return (
    <div className="relative h-full w-full">
      {/* Preload Progress */}
      {isPreloading && (
        <div className="fixed bottom-4 left-4 z-50 bg-white rounded-lg shadow-lg p-4 min-w-[300px]">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">
                Đang tải dữ liệu...
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${preloadProgress}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {preloadProgress}% hoàn thành
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex h-full w-full">
        <div className="flex-1 relative">
          <MapMonitor
            selectedEvent={selectedEvent}
            selectedPlaces={selectedPlaces}
            showPlaces={activeCategories.length > 0}
            showPopulation={showPopulation}
            showAirQuality={showAirQuality}
            currentMapType={currentMapType}
            onMapTypeChange={handleMapTypeChange}
            mapRef={mapRef}
            onSearchToggle={handleSearchToggle}
            onEventToggle={handleEventToggle}
            isSearchActive={isSearchActive}
            isEventActive={isEventActive}
          />
          <Suspense fallback={<div className="loading">Loading EventTable...</div>}>
            <EventTable
              onSelectEvent={handleSelectEvent}
              onOpenCreate={handleOpenCreate}
              events={filteredEvents}
              onMapTypeChange={handleMapTypeChange}
              currentMapType={currentMapType}
              isOpen={showEvents}
              onClose={() => handleEventToggle(false)}
            />
          </Suspense>
          <Suspense fallback={<div className="loading">Loading MapSwitcher...</div>}>
            <MapSwitcher
              onMapTypeChange={handleMapTypeChange}
              currentMapType={currentMapType}
              mainMapRef={mapRef}
              isSidebarOpen={isSidebarOpen}
            />
          </Suspense>
          <Suspense fallback={<div className="loading">Loading WardSearchPopup...</div>}>
            <WardSearchPopup
              map={mapRef.current}
              isOpen={showWardSearch}
              onClose={() => handleSearchToggle(false)}
            />
          </Suspense>
          <div className="absolute top-[260px] left-2 flex flex-col w-[420px]">
            {/* <HealthcareChart />
            <TrafficAreaChart /> */}
          </div>

          {hasLoadMoreCategories && (
            <div className="absolute bottom-4 right-20 z-[1000]">
              <button
                onClick={() => {
                  const categoryToLoad = activeCategories.find((category) => {
                    const tokens = categoryTokens[category];
                    const noMore = noMoreData[category];
                    return tokens && Object.keys(tokens).length > 0 && !noMore;
                  });
                  if (categoryToLoad) {
                    handleLoadMore(categoryToLoad);
                  }
                }}
                disabled={isLoading}
                className={`w-14 h-14 me-4 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 ${
                  !isLoading
                    ? "bg-blue-500 hover:bg-blue-600 hover:shadow-2xl hover:scale-110"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                title={isLoading ? "Đang tải..." : "Tải thêm dữ liệu"}
              >
                {isLoading ? (
                  <span className="text-xl">⏳</span>
                ) : (
                  <span className="text-xl">📄</span>
                )}
              </button>
            </div>
          )}

          <Suspense fallback={<div className="loading">Loading SummaryButton...</div>}>
            <SummaryButton
              onSelectCategory={handleSelectCategory}
              activeCategories={activeCategories}
              loadingCategories={loadingCategories}
              showPopulation={showPopulation}
              setShowPopulation={setShowPopulation}
              showAirQuality={showAirQuality}
              setShowAirQuality={setShowAirQuality}
              onLoadMore={handleLoadMore}
              noMoreData={noMoreData}
              onSidebarToggle={setIsSidebarOpen}
              preloadAllData={preloadAllData}
            />
          </Suspense>
          <Suspense fallback={<div className="loading">Loading MapStats...</div>}>
            <MapStats />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default MonitorLayout;
