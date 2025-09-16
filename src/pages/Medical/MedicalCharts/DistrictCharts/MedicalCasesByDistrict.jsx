import React, { useState, useEffect, useCallback } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { getKcbHuyen } from '../../../../service/medicalService';

const MedicalCasesByDistrict = ({ filters }) => {
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
        console.log('Fetching district medical data with filters:', filters);
        const response = await getKcbHuyen(filters);
        console.log('District medical API response:', response);
        
        if (isMounted) {
          if (response && response.body) {
            setData(response.body);
          } else {
            setError('Không có dữ liệu');
          }
        }
      } catch (err) {
        console.error('Error fetching medical cases by district:', err);
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

  // Tạo dữ liệu cho biểu đồ tròn - giới hạn 5 kết quả để hiển thị đẹp hơn
  const chartData = data?.content && data.content.length > 0 
    ? data.content.slice(0, 5).map((item, index) => ({
        name: `Xã ${index + 1}`,
        value: item.luotKhamChuaBenh || 0,
        fill: `hsl(${index * 60}, 70%, 60%)`,
        // Thông tin chi tiết cho tooltip
        tenPhuong: item.tenPhuong || `Xã ${index + 1}`,
        maPhuong: item.maPhuong || 'N/A',
        fullName: item.tenPhuong || `Xã ${index + 1}`
      }))
    : [];

  // 5 màu khác biệt hoàn toàn cho biểu đồ tròn
  const COLORS = [
    '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'
  ];

  // Remove the filter requirement check - allow API calls without filters

  return (
    <div className="w-full">
      <h2 className="text-[10px] sm:text-xs font-medium mb-1 text-center px-1">
        Lượt khám chữa bệnh theo xã
      </h2>
        <ResponsiveContainer width="100%" height={isMobile ? 200 : 220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={isMobile ? 30 : 40}
            outerRadius={isMobile ? 70 : 90}
            paddingAngle={2}
            dataKey="value"
            stroke="#ffffff"
            strokeWidth={2}
            startAngle={90}
            endAngle={450}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              fontSize: isMobile ? "8px" : "10px",
              zIndex: 1000,
              position: "relative",
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              color: '#000000',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            wrapperStyle={{ zIndex: 1000 }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div style={{
                    fontSize: isMobile ? "8px" : "10px",
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    color: '#000000',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    padding: '8px 12px'
                  }}>
                      <div style={{ fontWeight: '500', marginBottom: '4px' }}>{data.tenPhuong}</div>
                      <div style={{ color: '#374151' }}>{formatNumber(data.value)} lượt</div>
                      <div style={{ color: '#6b7280', fontSize: isMobile ? "7px" : "8px", marginTop: '2px' }}>
                        Mã phường: {data.maPhuong}
                      </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            wrapperStyle={{ 
              fontSize: isMobile ? "8px" : "10px",
              paddingTop: "5px",
              paddingBottom: "5px"
            }}
            iconType="circle"
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MedicalCasesByDistrict;
