import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getChiPhiTongHop } from '../../../../service/medicalService';

const InsurancePaymentRate = ({ filters }) => {
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
        console.log('Fetching insurance payment rate data with filters:', filters);
        const response = await getChiPhiTongHop(filters);
        console.log('Insurance payment rate API response:', response);
        
        if (isMounted) {
          console.log('🔍 InsurancePaymentRate - Full API response:', response);
          if (response && response.body) {
            console.log('🔍 InsurancePaymentRate - response.body:', response.body);
            setData(response.body);
          } else {
            setError('Không có dữ liệu');
          }
        }
      } catch (err) {
        console.error('Error fetching insurance payment rate:', err);
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

  const formatPercentage = (rate) => {
    if (rate === null || rate === undefined) return '0%';
    // Nếu rate đã là phần trăm (>= 1), hiển thị trực tiếp
    if (rate >= 1) {
      return `${rate.toFixed(1)}%`;
    }
    // Nếu rate là decimal (0-1), nhân với 100
    return `${(rate * 100).toFixed(1)}%`;
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

  // Remove the filter requirement check - allow API calls without filters

  // Tạo dữ liệu cho biểu đồ - giới hạn 5 kết quả
  const chartData = data?.content && data.content.length > 0 
    ? data.content.slice(0, 5).map((item, index) => {
        console.log('🔍 InsurancePaymentRate - Raw item:', item);
        console.log('🔍 InsurancePaymentRate - tyLeThuocBhyt value:', item.tyLeThuocBhyt);
        return {
          name: item.tenPhuong && item.tenPhuong.length > 15 
            ? item.tenPhuong.substring(0, 15) + '...' 
            : item.tenPhuong || `Phường ${index + 1}`,
          "Tỷ lệ BHYT": item.tyLeThuocBhyt || 0,
          // Thông tin chi tiết cho tooltip
          tenPhuong: item.tenPhuong || `Phường ${item.maPhuong}`,
          maPhuong: item.maPhuong || 'N/A',
          fullName: item.tenPhuong || `Phường ${item.maPhuong}`
        };
      })
    : [];

  console.log('🔍 InsurancePaymentRate - chartData:', chartData);

  // Show if chartData is empty
  if (!chartData || chartData.length === 0) {
    console.log('⚠️ InsurancePaymentRate ChartData is empty!');
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center">
          <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div className="text-sm font-medium text-gray-600 mb-1">Không có dữ liệu</div>
        <div className="text-xs text-gray-500">Vui lòng thử lại với bộ lọc khác</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-[10px] sm:text-xs font-medium mb-2 text-center px-1">
        Tỷ lệ BHYT thanh toán đơn thuốc
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
              value: '%', 
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
                    <div style={{ color: '#374151' }}>{formatPercentage(data["Tỷ lệ BHYT"])}</div>
                    <div style={{ color: '#6b7280', fontSize: isMobile ? "7px" : "8px", marginTop: '2px' }}>
                      Mã phường: {data.maPhuong}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="Tỷ lệ BHYT" 
            fill="#06b6d4" 
            name="Tỷ lệ BHYT"
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InsurancePaymentRate;
