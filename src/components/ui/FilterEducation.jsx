import React, { useEffect, useState, memo, useCallback } from "react";
import { FiChevronDown } from "react-icons/fi";
import { getAllSchoolFacilities } from "../../service/educationService";

const FilterEducation = memo(({ filters, setFilters }) => {
  const [yearOptions, setYearOptions] = useState([]);

  useEffect(() => {
    const fetchYearOptions = async () => {
      try {
        const response = await getAllSchoolFacilities();
        const facilities = response?.data || response;
        
        if (Array.isArray(facilities) && facilities.length > 0) {
          // Lấy danh sách các mã năm học duy nhất
          const uniqueYears = [...new Set(facilities.map(item => 
            item.maNamHoc || item.year
          ))].filter(Boolean).sort((a, b) => b - a); // Sắp xếp giảm dần
          
          setYearOptions(uniqueYears);
          
          // Set default value nếu chưa có
          if (!filters.maNamHoc && uniqueYears.length > 0) {
            setFilters({ ...filters, maNamHoc: uniqueYears[0] });
          }
        }
      } catch (error) {
        console.error("Error fetching year options:", error);
        // Fallback options nếu API lỗi
        setYearOptions(["2024", "2023", "2022"]);
        if (!filters.maNamHoc) {
          setFilters({ ...filters, maNamHoc: "2024" });
        }
      }
    };
    
    fetchYearOptions();
  }, []);

  return (
    <div className="flex justify-end items-center gap-3 py-3 mr-8">
      {/* Dropdown Mã năm học */}
      <div className="relative">
        <select
          value={filters.maNamHoc || ''}
          onChange={useCallback((e) => setFilters({ ...filters, maNamHoc: e.target.value }), [filters, setFilters])}
          className="appearance-none border border-gray-300 rounded-lg px-4 py-1 text-xs pr-8 shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     bg-white hover:border-blue-400 transition w-40"
        >
          <option value="">Chọn năm học</option>
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
});

FilterEducation.displayName = 'FilterEducation';

export default FilterEducation;
