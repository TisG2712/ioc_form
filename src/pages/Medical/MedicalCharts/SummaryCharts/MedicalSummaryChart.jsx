import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getTongHop } from '../../../../service/medicalService';

const MedicalSummaryChart = ({ filters }) => {
  const [data, setData] = useState(null);
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
      if (isMounted) {
        setLoading(true);
        setError(null);
      }
      
      try {
        console.log('Fetching medical data with filters:', filters);
        const response = await getTongHop(filters);
        console.log('Medical API response:', response);
        
        if (isMounted) {
          if (response && response.body) {
            setData(response.body);
          } else {
            setError('Không có dữ liệu');
          }
        }
      } catch (err) {
        console.error('Error fetching medical summary data:', err);
        if (isMounted) {
          setError('Không thể tải dữ liệu');
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
  }, [filters]);

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return new Intl.NumberFormat('vi-VN').format(num);
  };

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

  // Tạo dữ liệu cho biểu đồ tổng hợp - hiển thị theo thời gian như Population
  const chartData = data ? [
    {
      name: "Ca chuyển tuyến",
      "Số lượng": data.soCaChuyenTuyen || 0,
      "Loại": "Chuyển tuyến"
    },
    {
      name: "Ca vượt tuyến", 
      "Số lượng": data.soCaVuotTuyen || 0,
      "Loại": "Vượt tuyến"
    },
    {
      name: "Lượt tái khám",
      "Số lượng": data.luotTaiKham || 0,
      "Loại": "Tái khám"
    },
    {
      name: "Lượt điều trị",
      "Số lượng": data.luotDieuTri || 0,
      "Loại": "Điều trị"
    },
    {
      name: "Lượt KCB BHYT",
      "Số lượng": data.luotKcbBhyt || 0,
      "Loại": "KCB BHYT"
    },
    {
      name: "Ca mắc mới",
      "Số lượng": data.soCaMacMoi || 0,
      "Loại": "Mắc mới"
    }
  ] : [];

  // Remove the filter requirement check - allow API calls without filters

  return (
    <div className="w-full">
      <h2 className="text-[10px] sm:text-xs font-medium mb-2 sm:mb-3 text-center px-2">
        Tổng hợp dữ liệu y tế
        {filters.maPhuong && ` - Phường ${filters.maPhuong}`}
      </h2>
      <ResponsiveContainer width="100%" height={isMobile ? 200 : 220}>
        <BarChart 
          data={chartData}
          margin={{ 
            top: isMobile ? 15 : 20, 
            right: isMobile ? 8 : 12, 
            left: isMobile ? 8 : 12, 
            bottom: isMobile ? 35 : -20
          }}
        >
          <XAxis 
            dataKey="name" 
            tick={{ 
              fontSize: isMobile ? 8 : 10,
              angle: -45,
              textAnchor: 'end'
            }} 
            height={isMobile ? 60 : 80}
            interval={0}
            tickFormatter={(value) => value && value.length > 10 ? value.substring(0, 10) + '...' : value}
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
            formatter={(value, name) => [
              `${formatNumber(value)} ${name.includes('Lượt') ? 'lượt' : 'ca'}`,
              "Số lượng"
            ]}
          />
          <Bar 
            dataKey="Số lượng" 
            fill="#3b82f6"
            name="Số lượng"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MedicalSummaryChart;
