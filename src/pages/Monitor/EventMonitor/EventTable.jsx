import React, { useState, memo, useMemo, useCallback } from "react";
import { iconMap } from "../../../utils/iconMap";
import MapSwitcher from "./MapSwitcher";

// Hàm format thời gian cho người Việt
const formatVietnameseDateTime = (timestamp) => {
  if (!timestamp) return "Không có thời gian";

  try {
    const date = new Date(timestamp);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch (error) {
    return "Thời gian không hợp lệ";
  }
};

// Hàm lấy icon cho loại sự kiện (giống popup)
const getEventTypeIcon = (type) => {
  const eventTypeIcons = {
    FIRE: "🔥",
    CAR_CRASH: "🚗",
    THEFT: "🛡️",
    MEDICAL: "🏥",
    EDUCATION: "🎓",
  };
  return eventTypeIcons[type] || "📋";
};

const EventTable = memo(({
  onSelectEvent,
  onOpenCreate,
  events,
  onMapTypeChange,
  currentMapType,
  isOpen = false,
  onClose,
}) => {
  const [search, setSearch] = useState("");

  // Memoize filtered events để tránh re-filter không cần thiết
  const filteredEvents = useMemo(() => 
    events.filter((e) =>
      e.name.toLowerCase().includes(search.toLowerCase())
    ), [events, search]
  );

  return (
    <div className="fixed top-[99px] left-[65px] bottom-[10px] w-96 z-50">
      <style>
        {`
          .custom-scroll {
            scrollbar-width: thin;
            scrollbar-color: #888 #f1f1f1;
          }
          .custom-scroll::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          .custom-scroll::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          .custom-scroll::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
          }
          .custom-scroll::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}
      </style>
      {isOpen && (
        <div className="bg-gradient-to-b from-white via-white to-gray-50 shadow-2xl border border-gray-200 overflow-y-auto rounded-2xl backdrop-blur-md bg-white/95 h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 relative shadow-sm">
            <h2 className="text-lg font-bold text-gray-800">
              Danh sách sự kiện
            </h2>
            {/* Animated gradient border */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5">
              <div className="h-full w-full animate-gradient-flow"></div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100">
              ✕
            </button>
          </div>
          
          <div className="p-4">

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Tìm kiếm sự kiện..."
              className="flex-1 p-2 border rounded-lg text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={onOpenCreate}
              className="bg-blue-500 text-white text-xs px-3 rounded-lg hover:bg-blue-600"
            >
              Tìm kiếm
            </button>
          </div>

          <div className="overflow-x-auto overflow-y-auto custom-scroll h-[calc(100%-80px)]">
            <table className="w-full text-xs text-center border-collapse">
              <thead className="sticky top-0 bg-gray-200 z-10">
                <tr className="border-b border-gray-300">
                  <th className="py-2 p-[5px] min-w-[10px]">STT</th>
                  <th className="py-2 min-w-[10px]">Sự kiện</th>
                  <th className="py-2 min-w-[50px]">Loại</th>
                  <th className="py-2 min-w-[140px]">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event, index) => (
                  <tr
                    key={event.id}
                    className="border-b border-gray-200 cursor-pointer hover:bg-white"
                    onClick={() => onSelectEvent(event)}
                  >
                    <td className="py-2 ">{index + 1}</td>
                    <td className="py-2 text-left">{event.name}</td>
                    <td className="py-2 text-center">
                      <span className="text-lg">{getEventTypeIcon(event.type)}</span>
                    </td>
                    <td className="py-2 text-xs truncate max-w-[140px]" title={formatVietnameseDateTime(event.timestamp)}>
                      {formatVietnameseDateTime(event.timestamp)}
                    </td>
                  </tr>
                ))}
                {filteredEvents.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-3 text-gray-500">
                      Không tìm thấy sự kiện
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default EventTable;
