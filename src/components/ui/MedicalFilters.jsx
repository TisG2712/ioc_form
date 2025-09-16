import React, { useState, useEffect, memo, useCallback } from 'react';
import { FiChevronDown } from "react-icons/fi";
import { getWardsFromKcbHuyen } from '../../service/medicalService';

const MedicalFilters = memo(({ onFiltersChange, loading = false }) => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    maPhuong: ''
  });

  const [wards, setWards] = useState([
    { value: '', label: 'Tất cả phường' }
  ]);
  const [wardsLoading, setWardsLoading] = useState(false);

  // Load wards from API
  useEffect(() => {
    const loadWards = async () => {
      setWardsLoading(true);
      try {
        const wardsData = await getWardsFromKcbHuyen({
          startDate: filters.startDate,
          endDate: filters.endDate
        });
        setWards(wardsData);
      } catch (error) {
        console.error('Error loading wards:', error);
        // Keep default wards if API fails
      } finally {
        setWardsLoading(false);
      }
    };

    loadWards();
  }, [filters.startDate, filters.endDate]);


  const handleFilterChange = useCallback((key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  }, [filters, onFiltersChange]);

  const clearFilters = useCallback(() => {
    const clearedFilters = {
      startDate: '',
      endDate: '',
      maPhuong: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  }, [onFiltersChange]);

  return (
    <div className="flex justify-end items-center gap-3 py-3 mr-8">
      {/* Date Range */}
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => handleFilterChange('startDate', e.target.value)}
          className="appearance-none border border-gray-300 rounded-lg px-3 py-1 text-xs shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     bg-white hover:border-blue-400 transition"
          disabled={loading}
          placeholder="Từ ngày"
        />
        <span className="text-xs text-gray-500">đến</span>
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => handleFilterChange('endDate', e.target.value)}
          className="appearance-none border border-gray-300 rounded-lg px-3 py-1 text-xs shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     bg-white hover:border-blue-400 transition"
          disabled={loading}
          placeholder="Đến ngày"
        />
      </div>


      {/* Ward */}
      <div className="relative">
        <select
          value={filters.maPhuong}
          onChange={(e) => handleFilterChange('maPhuong', e.target.value)}
          className="appearance-none border border-gray-300 rounded-lg px-4 py-1 text-xs pr-8 shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     bg-white hover:border-blue-400 transition w-56"
          disabled={loading || wardsLoading}
        >
          {wardsLoading ? (
            <option value="">Đang tải phường...</option>
          ) : (
            wards.map(ward => (
              <option key={ward.value} value={ward.value}>
                {ward.label}
              </option>
            ))
          )}
        </select>
        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        {wardsLoading && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="px-4 py-1 bg-gray-500 text-white rounded-lg text-xs hover:bg-gray-600 
                   focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition"
        disabled={loading}
      >
        Xóa bộ lọc
      </button>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-xs">Đang tải...</span>
        </div>
      )}
    </div>
  );
});

MedicalFilters.displayName = 'MedicalFilters';

export default MedicalFilters;
