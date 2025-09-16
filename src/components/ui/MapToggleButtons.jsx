import React, { memo, useCallback } from "react";
import { FaSearch, FaCalendarAlt } from "react-icons/fa";

const MapToggleButtons = memo(({ 
  onSearchToggle, 
  onEventToggle, 
  isSearchActive = false, 
  isEventActive = false 
}) => {
  const handleSearchClick = useCallback(() => {
    if (isSearchActive) {
      onSearchToggle(false);
    } else {
      onSearchToggle(true);
      onEventToggle(false); // Tắt event khi bật search
    }
  }, [isSearchActive, onSearchToggle, onEventToggle]);

  const handleEventClick = useCallback(() => {
    if (isEventActive) {
      onEventToggle(false);
    } else {
      onEventToggle(true);
      onSearchToggle(false); // Tắt search khi bật event
    }
  }, [isEventActive, onEventToggle, onSearchToggle]);

  return (
    <div 
      className="absolute top-2 left-2 z-[9999] flex flex-col gap-2"
      style={{ 
        pointerEvents: 'auto',
        position: 'fixed',
        top: '100px',
        left: '8px'
      }}
    >
      {/* Event Button */}
      <button
        onClick={handleEventClick}
        className={`w-12 h-12 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center ${
          isEventActive
            ? 'bg-green-500 text-white transform scale-105'
            : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600'
        }`}
        title="Danh sách sự kiện"
        style={{ 
          pointerEvents: 'auto',
          position: 'relative',
          zIndex: 10000
        }}
      >
        <FaCalendarAlt className="w-5 h-5" />
      </button>

      {/* Search Button */}
      <button
        onClick={handleSearchClick}
        className={`w-12 h-12 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center ${
          isSearchActive
            ? 'bg-blue-500 text-white transform scale-105'
            : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
        }`}
        title="Tìm kiếm phường/xã"
        style={{ 
          pointerEvents: 'auto',
          position: 'relative',
          zIndex: 10000
        }}
      >
        <FaSearch className="w-5 h-5" />
      </button>
    </div>
  );
});

export default MapToggleButtons;
