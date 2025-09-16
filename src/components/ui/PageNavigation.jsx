import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function PageNavigation({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems,
}) {
  const startIdx = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="w-full flex items-center justify-between h-10 mt-2 bg-gray-100 rounded shadow px-4 text-xs">
      {/* Nhóm nút và select bên trái */}
      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Trang trước"
        >
          <FaChevronLeft />
        </button>
        <span className="font-semibold mb-0.5">
          Trang {currentPage} / {totalPages || 1}
        </span>
        <button
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          title="Trang sau"
        >
          <FaChevronRight />
        </button>
        <select
          className="border rounded px-0 py-1 ml-2"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          <option value={10}>10 dòng/trang</option>
          <option value={20}>20 dòng/trang</option>
          <option value={50}>50 dòng/trang</option>
        </select>
      </div>
      {/* Hiển thị tổng số dòng bên phải */}
      <span className="text-gray-600 min-w-[100px] text-right">
        {startIdx}-{endIdx} trên {totalItems} dòng
      </span>
    </div>
  );
}

export default PageNavigation;
