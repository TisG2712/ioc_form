import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getEducationYearStatistics } from "../../../../service/educationService";

function EducationStats2({ filters }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Hook để theo dõi kích thước màn hình
  const checkIsMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 640);
  }, []);

  useEffect(() => {
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [checkIsMobile]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!filters?.maNamHoc) {
        if (isMounted) {
          setData([]);
        }
        return;
      }

      if (isMounted) {
        setLoading(true);
        setError(null);
      }

      try {
        const response = await getEducationYearStatistics(filters.maNamHoc);
        
        if (response && isMounted) {
          const chartData = [
            { name: "Đại học", value: response.gvDaiHoc || 0 },
            { name: "Cao đẳng", value: response.gvCaoDang || 0 },
            { name: "Thạc sĩ", value: response.gvThacSi || 0 },
          ];
          setData(chartData);
        } else if (isMounted) {
          setError("Không có dữ liệu cho năm học đã chọn.");
        }
      } catch (error) {
        console.error("Error fetching data for EducationStats2:", error);
        if (isMounted) {
          setError("Lỗi khi tải dữ liệu biểu đồ. Vui lòng thử lại sau.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchData();

    return () => {
      isMounted = false;
    };
  }, [filters?.maNamHoc]);

  // Memoize các giá trị được tính toán
  const chartTitle = useMemo(() => {
    return `Phân bố giáo viên theo trình độ (${filters?.maNamHoc || 'Năm học'})`;
  }, [filters?.maNamHoc]);

  const chartHeight = useMemo(() => {
    return isMobile ? 170 : 190;
  }, [isMobile]);

  const chartMargin = useMemo(() => ({
    top: isMobile ? 5 : 15, 
    right: isMobile ? 5 : 10, 
    left: isMobile ? 5 : 5, 
    bottom: 15
  }), [isMobile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-sm text-gray-500">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-sm text-red-500">{error}</div>
      </div>
    );
  }

  if (!filters?.maNamHoc) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-sm text-gray-500">Vui lòng chọn năm học để xem dữ liệu</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-[10px] sm:text-xs font-medium mb-2 sm:mb-3 text-center px-2">
        {chartTitle}
      </h2>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart data={data} margin={chartMargin}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: isMobile ? 8 : 10 }} 
            angle={0}
            textAnchor="middle"
            height={isMobile ? 25 : 30}
            interval={isMobile ? "preserveStartEnd" : 0}
          />
          <YAxis 
            tick={{ fontSize: isMobile ? 8 : 10 }} 
            label={{ 
              value: 'Số lượng', 
              angle: 0, 
              position: 'top', 
              fontSize: isMobile ? 8 : 10 
            }}
            width={isMobile ? 30 : 40}
          />
          <Tooltip 
            contentStyle={{ 
              fontSize: isMobile ? "8px" : "10px",
              zIndex: 1000,
              position: "relative"
            }}
            wrapperStyle={{ zIndex: 1000 }}
            formatter={(value) => [
              `${value.toLocaleString()} người`,
              'Số lượng'
            ]}
          />
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EducationStats2;
