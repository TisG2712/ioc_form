import React, { memo, useMemo, useCallback, useEffect } from "react";
import toast from 'react-hot-toast';
import { useConfirmDialog } from '../../../hooks/useConfirmDialog.jsx';
import {
  FaHospital,
  FaSchool,
  FaShieldAlt,
  FaRoad,
  FaUsers,
  FaPlane,
  FaLeaf,
  FaBuilding,
  FaCoffee,
  FaBook,
  FaAmbulance,
  FaEnvelope,
  FaFlag,
  FaLandmark,
  FaTree,
  FaFire,
  FaUserTie,
  FaUserShield,
  FaMoneyBillWave,
  FaShippingFast,
  FaSync,
  FaSearch,
  FaCalendarAlt,
  FaWind,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useCache } from "../../../contexts/CacheContext";

const MonitorSidebar = memo(({
  isOpen,
  onClose,
  onSelectCategory,
  activeCategories = [],
  loadingCategories = new Set(),
  showPopulation = false,
  showAirQuality = false,
  preloadAllData,
}) => {
  const { clearCache, enableAutoLoadCache, getCacheInfo, debugCache } = useCache();
  const { confirm, ConfirmDialog } = useConfirmDialog();
  
  // Memoize sections để tránh re-render không cần thiết
  const sections = useMemo(() => [
    {
      title: "Lớp bản đồ cơ bản",
      buttons: [
        {
          id: "health",
          icon: <FaHospital />,
          color: "bg-red-500",
          label: "Y tế",
        },
        {
          id: "education",
          icon: <FaSchool />,
          color: "bg-purple-500",
          label: "Giáo dục",
        },
        {
          id: "security",
          icon: <FaUserShield />,
          color: "bg-blue-500",
          label: "An ninh",
        },
        {
          id: "traffic",
          icon: <FaUserShield />,
          color: "bg-green-500",
          label: "Giao thông",
        },
        // Giao thông & Vận tải
        {
          id: "airport",
          icon: <FaPlane />,
          color: "bg-blue-600",
          label: "Sân bay",
        },
        // Dịch vụ & Thương mại
        {
          id: "bank",
          icon: <FaMoneyBillWave />,
          color: "bg-yellow-500",
          label: "Ngân hàng",
        },
        {
          id: "cafe",
          icon: <FaCoffee />,
          color: "bg-amber-800",
          label: "Cà phê",
        },
        {
          id: "post_office",
          icon: <FaShippingFast />,
          color: "bg-blue-600",
          label: "Bưu điện",
        },
        // Công cộng & Giải trí
        {
          id: "park",
          icon: <FaTree />,
          color: "bg-green-400",
          label: "Công viên",
        },
        {
          id: "museum",
          icon: <FaLandmark />,
          color: "bg-gray-800",
          label: "Bảo tàng",
        },
        // Cơ quan & Dịch vụ
        {
          id: "fire_station",
          icon: <FaFire />,
          color: "bg-red-700",
          label: "Cứu hỏa",
        },
        {
          id: "government_office",
          icon: <FaBuilding />,
          color: "bg-blue-500",
          label: "Cơ quan nhà nước",
        },
      ],
    },
    {
      title: "Lớp nghiệp vụ",
      buttons: [
        {
          id: "population",
          icon: <FaUsers />,
          color: "bg-green-500",
          label: "Dân cư",
        },
        {
          id: "airQuality",
          icon: <FaWind />,
          color: "bg-cyan-500",
          label: "Chất lượng không khí",
        },
      ],
    },
  ], []); // Empty dependency array vì sections không thay đổi



  const handleCategoryClick = useCallback((categoryId) => {


    const isActive = activeCategories.includes(categoryId);
    onSelectCategory(categoryId, [], null, isActive);
    // Không tự động đóng sidebar, để người dùng tự đóng bằng nút X
  }, [activeCategories, onSelectCategory]);

  const handleClearCache = useCallback(async () => {
    confirm(
      "Xóa toàn bộ cache",
      "Bạn có chắc muốn xóa TOÀN BỘ cache và tải lại dữ liệu?\n\n" +
      "• Tất cả dữ liệu đã lưu sẽ bị xóa\n" +
      "• Ứng dụng sẽ tải lại dữ liệu mới từ API\n" +
      "• Thao tác này có thể mất vài phút\n\n" +
      "Bạn có muốn tiếp tục?",
      async () => {
      try {
        console.log('Starting complete cache clear...');
        
        // Await clearCache để đảm bảo cache được xóa hoàn toàn
        await clearCache();
        console.log('Cache cleared successfully');
        
        // Enable auto-load cache sau khi xóa
        enableAutoLoadCache();
        console.log('Auto-load cache enabled');
        
        // Gọi preloadAllData để tải lại dữ liệu
        if (preloadAllData) {
          console.log('Starting preload after cache clear...');
          try {
            // Chạy preload và đợi hoàn thành
            await preloadAllData();
            console.log('Preload completed successfully - no page reload needed');
            
            // Không reload trang khi preload thành công
            // Data đã được cache và UI sẽ tự động cập nhật
            
          } catch (preloadError) {
            console.error('Error during preload:', preloadError);
            // Nếu preload lỗi, reload trang để reset state
            setTimeout(() => {
              console.log('Reloading page after preload error...');
              const currentUrl = new URL(window.location.href);
              currentUrl.searchParams.set('t', Date.now().toString());
              window.location.href = currentUrl.toString();
            }, 1000);
          }
        } else {
          // Nếu không có preloadAllData, reload trang ngay
          setTimeout(() => {
            console.log('Reloading page after cache clear (no preload)...');
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('t', Date.now().toString());
            window.location.href = currentUrl.toString();
          }, 1000);
        }
        
      } catch (error) {
        console.error('Error during cache clear:', error);
        toast.error('Có lỗi khi xóa cache. Vui lòng thử lại.');
      }
      }
    );
  }, [clearCache, enableAutoLoadCache, preloadAllData, confirm]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* CSS for animated gradient */}
          <style>
            {`
              @keyframes google-gradient-flow {
                0% {
                  background: linear-gradient(90deg, #4285f4 0%, #34a853 25%, #fbbc05 50%, #ea4335 75%, #9aa0a6 100%);
                }
                20% {
                  background: linear-gradient(90deg, #34a853 0%, #fbbc05 25%, #ea4335 50%, #9aa0a6 75%, #4285f4 100%);
                }
                40% {
                  background: linear-gradient(90deg, #fbbc05 0%, #ea4335 25%, #9aa0a6 50%, #4285f4 75%, #34a853 100%);
                }
                60% {
                  background: linear-gradient(90deg, #ea4335 0%, #9aa0a6 25%, #4285f4 50%, #34a853 75%, #fbbc05 100%);
                }
                80% {
                  background: linear-gradient(90deg, #9aa0a6 0%, #4285f4 25%, #34a853 50%, #fbbc05 75%, #ea4335 100%);
                }
                100% {
                  background: linear-gradient(90deg, #4285f4 0%, #34a853 25%, #fbbc05 50%, #ea4335 75%, #9aa0a6 100%);
                }
              }
              .animate-gradient-flow {
                animation: google-gradient-flow 12s ease-in-out infinite;
              }
            `}
          </style>
          {/* Sidebar - slides from right with reduced height and rounded corners */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-[99px] right-[10px] bottom-[10px] w-80 bg-gradient-to-b from-white via-white to-gray-50 shadow-2xl z-6 border border-gray-200 overflow-y-auto rounded-2xl backdrop-blur-md bg-white/95"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 relative shadow-sm">
              <h2 className="text-lg font-bold text-gray-800">
                Tiện ích bản đồ
              </h2>
              {/* Animated gradient border */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5">
                <div className="h-full w-full animate-gradient-flow"></div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    debugCache();
                    toast.success('Thông tin cache đã được in ra Console (F12 để xem)');
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                  title="Kiểm tra thông tin cache (Debug)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button
                  onClick={handleClearCache}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                  title="Xóa cache và tải lại dữ liệu"
                >
                  <FaSync className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
                  title="Đóng menu"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 bg-gradient-to-b from-transparent to-gray-50/50">
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="space-y-3 ">
                  {/* Section Title */}
                  <h3 className="text-sm font-semibold text-gray-700">
                    {section.title}
                  </h3>

                  {/* Grid 3 columns for buttons */}
                  <div className="grid grid-cols-4 gap-1 border-b border-gray-500">
                    {section.buttons.map((btn, index) => {
                      const isActive =
                        btn.id === "population"
                          ? showPopulation
                          : btn.id === "airQuality"
                          ? showAirQuality
                          : activeCategories.includes(btn.id);
                      const isLoading = loadingCategories.has(btn.id);
                      return (
                        <motion.button
                          key={btn.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.2,
                            delay: (sectionIndex * 3 + index) * 0.1,
                          }}
                          onClick={() =>
                            !isLoading && handleCategoryClick(btn.id)
                          }
                          disabled={isLoading}
                          className={`group ${
                            btn.color
                          } w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg mb-4 transition-all duration-300 hover:shadow-xl ${
                            isActive
                              ? "scale-110 shadow-2xl ring-2 ring-white/50 hover:scale-125 hover:-translate-y-1 hover:shadow-3xl"
                              : "hover:scale-110 hover:-translate-y-1 hover:shadow-2xl"
                          } ${
                            isLoading ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                          title={`${btn.label} ${
                            isLoading
                              ? "(Đang tải...)"
                              : isActive
                              ? "(Đang hiển thị)"
                              : "(Nhấn để hiển thị)"
                          }`}
                        >
                          {isLoading ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          ) : (
                            <span className="text-xl transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5">
                              {btn.icon}
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                  
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
      <ConfirmDialog />
    </AnimatePresence>
  );
});

MonitorSidebar.displayName = 'MonitorSidebar';

export default MonitorSidebar;
