import React, { useState, useEffect, useCallback } from 'react';
import {
  AreaChart,
  Area,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { getTongHop } from '../../../../service/medicalService';

const TotalInsuranceCases = ({ filters }) => {
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
         const response = await getTongHop(filters);
         if (isMounted) {
           console.log('TotalInsuranceCases API response:', response);
           const content = response?.content || response?.body?.content || [];
          
          // If "Tất cả phường" is selected, show all records
          if (!filters.maPhuong || filters.maPhuong === '') {
            setData({
              content: content,
              showAllWards: true
            });
          } else {
            // If specific ward is selected, show total for that ward only
            const selectedWardData = content.find(item => item.maPhuong === filters.maPhuong);
            const totalInsuranceCases = selectedWardData ? (selectedWardData.luotKcbBhyt || 0) : 0;
            
            setData({
              luotKcbBhyt: totalInsuranceCases,
              content: content,
              showAllWards: false
            });
          }
        }
      } catch (err) {
        if (isMounted) {
          setError('Không thể tải dữ liệu');
        }
        console.error('Error fetching total insurance cases:', err);
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

  // Remove the filter requirement check - allow API calls without filters

  // Tạo dữ liệu cho biểu đồ Bar - giới hạn 8 phường để hiển thị đẹp hơn
  const chartData = data ? (() => {
    if (data.showAllWards && data.content) {
      // Hiển thị tất cả các phường (giới hạn 5 phường đầu tiên)
      return data.content
        .filter(item => item.tenPhuong && item.tenPhuong !== 'Unknown')
        .slice(0, 5)
        .map((item, index) => ({
          name: item.tenPhuong && item.tenPhuong.length > 15 
            ? item.tenPhuong.substring(0, 15) + '...' 
            : item.tenPhuong || `Phường ${index + 1}`,
          "Số lượt": item.luotKcbBhyt || 0,
          // Thông tin chi tiết cho tooltip
          tenPhuong: item.tenPhuong,
          maPhuong: item.maPhuong || 'N/A',
          fullName: item.tenPhuong
        }));
    } else {
      // Hiển thị tổng
      return [
        {
          name: "Lượt KCB BHYT",
          "Số lượt": data.luotKcbBhyt || 0,
          value: data.luotKcbBhyt || 0
        }
      ];
    }
  })() : [];

  // Show if chartData is empty
  if (chartData && chartData.length === 0) {
    console.log('⚠️ ChartData is empty!');
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-cyan-100 to-cyan-200 flex items-center justify-center">
          <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
        {data?.showAllWards ? 'Lượt KCB BHYT theo phường' : 'Tổng lượt KCB BHYT'}
        {filters.maPhuong && ` - Phường ${filters.maPhuong}`}
      </h2>
      {data?.showAllWards ? (
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
              <linearGradient id="colorInsurance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1}/>
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
                value: 'Số lượt', 
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
                      <div style={{ color: '#374151' }}>{formatNumber(data["Số lượt"])} lượt KCB BHYT</div>
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
              dataKey="Số lượt"
              stroke="#06b6d4"
              strokeWidth={2}
              fill="url(#colorInsurance)"
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={isMobile ? 200 : 220}>
          <ComposedChart 
            data={[{ name: 'Tổng lượt KCB BHYT', value: chartData[0]?.value || 0 }]}
            margin={{ 
              top: isMobile ? 15 : 20, 
              right: isMobile ? 8 : 12, 
              left: isMobile ? 8 : 12, 
              bottom: isMobile ? 35 : 20
            }}
          >
          <defs>
            <linearGradient id="colorInsuranceSingle" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0891b2" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#0891b2" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            tick={{ 
              fontSize: isMobile ? 8 : 10,
              textAnchor: 'middle'
            }} 
            height={isMobile ? 60 : 75}
          />
          <YAxis 
            tick={{ fontSize: isMobile ? 8 : 10 }} 
            label={{ 
              value: 'Số ca', 
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
            formatter={(value, name) => [formatNumber(value), 'Số ca']}
          />
          <Bar 
            dataKey="value" 
            fill="url(#colorInsuranceSingle)" 
            radius={[4, 4, 0, 0]}
            maxBarSize={80}
          />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TotalInsuranceCases;