import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Hàm lấy gradient background cho header theo loại sự kiện
const getEventTypeHeaderGradient = (type) => {
  const eventTypeGradients = {
    FIRE: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", // red-500 to red-600
    CAR_CRASH: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)", // orange-500 to orange-600
    THEFT: "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)", // purple-500 to purple-600
    MEDICAL: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)", // green-500 to green-600
    EDUCATION: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", // blue-500 to blue-600
  };
  return eventTypeGradients[type] || "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)"; // gray-500 to gray-600
};

// Hàm lấy icon cho loại sự kiện
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

// Hàm lấy màu chữ cho loại sự kiện
const getEventTypeColor = (type) => {
  const eventTypeColors = {
    FIRE: "color: #ef4444;",
    CAR_CRASH: "color: #f97316;",
    THEFT: "color: #a855f7;",
    MEDICAL: "color: #22c55e;",
    EDUCATION: "color: #3b82f6;",
  };
  return eventTypeColors[type] || "color: #6b7280;";
};

// Hàm lấy tên tiếng Việt cho loại sự kiện
const getVietnameseEventType = (type) => {
  const eventTypeMap = {
    FIRE: "Hỏa hoạn",
    CAR_CRASH: "Tai nạn giao thông",
    THEFT: "Trộm cắp",
    MEDICAL: "Y tế",
    EDUCATION: "Giáo dục",
  };
  return eventTypeMap[type] || type;
};

// Hàm lấy màu cho trạng thái
const getStatusColor = (status) => {
  const statusColors = {
    CHUA_XU_LY: "background: #fef2f2; color: #dc2626;",
    DANG_XU_LY: "background: #fffbeb; color: #d97706;",
    DA_XU_LY: "background: #f0fdf4; color: #16a34a;",
  };
  return statusColors[status] || "background: #f3f4f6; color: #6b7280;";
};

// Hàm lấy màu border và background cho trạng thái theo loại sự kiện
const getStatusBorderColor = (eventType) => {
  const eventTypeColors = {
    FIRE: "border: 1px solid #fecaca; background-color: #fef2f2;",
    CAR_CRASH: "border: 1px solid #fed7aa; background-color: #fff7ed;",
    THEFT: "border: 1px solid #e9d5ff; background-color: #faf5ff;",
    MEDICAL: "border: 1px solid #bbf7d0; background-color: #f0fdf4;",
    EDUCATION: "border: 1px solid #bfdbfe; background-color: #eff6ff;",
  };
  return eventTypeColors[eventType] || "border: 1px solid #e5e7eb; background-color: #f9fafb;";
};

// Hàm lấy tên tiếng Việt cho trạng thái
const getVietnameseStatus = (status) => {
  const statusMap = {
    CHUA_XU_LY: "Chưa xử lý",
    DANG_XU_LY: "Đang xử lý",
    DA_XU_LY: "Đã xử lý",
  };
  return statusMap[status] || status;
};

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

// Component MapEventPopup
const MapEventPopup = ({ event }) => {
  if (!event) return null;

  const popupContent = `
    <div style="
      min-width: 480px; 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: white;
      border-radius: 12px;
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
      overflow: hidden;
      border: 1px solid #e5e7eb;
    ">
      <!-- Header compact -->
      <div style="
        background: ${getEventTypeHeaderGradient(event.type)};
        padding: 14px 18px;
        color: white;
        position: relative;
      ">
         <div style="display: flex; align-items: center; gap: 8px;">
           <div style="
             width: 6px;
             height: 6px;
             background: rgba(255,255,255,0.8);
             border-radius: 50%;
           "></div>
           <h2 style="
             font-size: 17px;
             font-weight: 700;
             margin: 0;
             line-height: 1.3;
             flex: 1;
             overflow: hidden;
             text-overflow: ellipsis;
             white-space: nowrap;
           ">${event.name}</h2>
         </div>
         <!-- Close button -->
         <button onclick="this.closest('.leaflet-popup').remove()" style="
           position: absolute;
           top: 8px;
           right: 8px;
           background: rgba(255,255,255,0.2);
           border: none;
           color: white;
           width: 24px;
           height: 24px;
           border-radius: 50%;
           cursor: pointer;
           display: flex;
           align-items: center;
           justify-content: center;
           font-size: 14px;
           font-weight: bold;
           transition: background-color 0.2s;
         " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">×</button>
      </div>

      <!-- Content compact -->
      <div style="padding: 18px;">
        <!-- Event Type -->
        <div style="margin-bottom: 14px;">
            <div style="display: flex; align-items: center; gap: 8px; justify-content: center; border-radius: 12px;
                padding: 4px 8px;
                ${getStatusBorderColor(event.type)}
                ">
            
            <span style="font-size: 20px;">${getEventTypeIcon(event.type)}</span>
            <span style="
              ${getEventTypeColor(event.type)}
              font-weight: bold;
              font-size: 24px;
              
            ">${getVietnameseEventType(event.type)}</span>
          </div>
        </div>

        <!-- Grid Layout for other fields -->
        <div style="display: grid; grid-template-columns: 24px 0.5fr 2fr; gap: 10px 2px; align-items: center;">
          <!-- Time -->
          <svg width="24" height="24" fill="#10b981" viewBox="0 0 24 24">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span style="font-weight: 800; color: #4a5568; font-size: 13px;">Thời gian:</span>
          <span style="color: #2d3748; font-size: 13px;">${formatVietnameseDateTime(event.timestamp)}</span>

          <!-- Location -->
          <svg width="24" height="24" fill="#3b82f6" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <span style="font-weight: 800; color: #4a5568; font-size: 13px;">Địa điểm:</span>
          <span style="color: #2d3748; font-size: 13px;">${event.location}</span>

          <!-- Status -->
          <svg width="24" height="24" fill="#6b7280" viewBox="0 0 24 24">
            <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
          </svg>
          <span style="font-weight: 800; color: #4a5568; font-size: 13px;">Trạng thái:</span>
          <span style="
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            
            ${getStatusColor(event.status)}
          ">${getVietnameseStatus(event.status)}</span>

          <!-- Description -->
          <svg width="24" height="24" fill="#8b5cf6" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
          <span style="font-weight: 800; color: #4a5568; font-size: 13px;">Mô tả:</span>
          <span style="color: #2d3748; font-size: 13px;">${event.description || "Không có mô tả"}</span>
        </div>
      </div>
    </div>
  `;

  return popupContent;
};

export default MapEventPopup;
