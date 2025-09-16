import React, { useState, useEffect, useCallback } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { getChiPhiTongHop } from '../../../../service/medicalService';

const TotalInsuranceCost = ({ filters }) => {
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
        console.log('Fetching cost data with filters:', filters);
        const response = await getChiPhiTongHop(filters);
        console.log('Cost API response:', response);
        
        if (isMounted) {
          if (response && response.body) {
            setData(response.body);
          } else {
            setError('Không có dữ liệu');
          }
        }
      } catch (err) {
        console.error('Error fetching total insurance cost:', err);
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

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '0';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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

  // Tạo dữ liệu cho biểu đồ - giới hạn 5 kết quả
  const chartData = data?.content && data.content.length > 0 
    ? data.content
        .filter(item => item.tenPhuong && item.tenPhuong !== 'Unknown')
        .slice(0, 5)
        .map((item, index) => ({
          name: item.tenPhuong && item.tenPhuong.length > 15 
            ? item.tenPhuong.substring(0, 15) + '...' 
            : item.tenPhuong || `Phường ${index + 1}`,
          "Chi phí BHYT": item.tongChiPhiBaoHiem || 0,
          // Thông tin chi tiết cho tooltip
          tenPhuong: item.tenPhuong,
          maPhuong: item.maPhuong || 'N/A',
          fullName: item.tenPhuong
        }))
    : [];

  // Remove the filter requirement check - allow API calls without filters

  return (
    <div className="w-full">
      <h2 className="text-[10px] sm:text-xs font-medium mb-2 text-center px-1">
        Tổng chi phí BHYT thanh toán
      </h2>
      <ResponsiveContainer width="100%" height={isMobile ? 200 : 220}>
        <AreaChart 
          data={chartData}
          margin={{ 
            top: isMobile ? 15 : 20, 
            right: isMobile ? 8 : 12, 
            left: isMobile ? 8 : 12, 
            bottom: isMobile ? 35 : -20
          }}
        >
          <defs>
            <linearGradient id="colorInsuranceCost" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
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
              value: 'VNĐ', 
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
                position: "relative",
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                color: '#000000',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
              wrapperStyle={{ zIndex: 1000 }}
              content={({ active, payload, label }) => {
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
                      <div style={{ color: '#374151' }}>{formatCurrency(data["Chi phí BHYT"])} VNĐ</div>
                      <div style={{ color: '#6b7280', fontSize: isMobile ? "7px" : "8px", marginTop: '2px' }}>
                        Mã phường: {data.maPhuong}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          <Area
            type="monotone"
            dataKey="Chi phí BHYT"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#colorInsuranceCost)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TotalInsuranceCost;
