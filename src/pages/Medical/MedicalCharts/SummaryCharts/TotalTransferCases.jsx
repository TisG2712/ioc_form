import React, { useState, useEffect, useCallback } from 'react';
import {
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { getTongHop } from '../../../../service/medicalService';

const TotalTransferCases = ({ filters }) => {
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
      console.log('🚀 TotalTransferCases useEffect - filters:', filters);
      
      if (isMounted) {
        setLoading(true);
        setError(null);
      }
      
      try {
        console.log('📡 Calling getTongHop API...');
        const response = await getTongHop(filters);
        console.log('✅ API Response:', response);
        
        if (isMounted) {
          const content = response.body?.content || [];
          console.log('📦 Content from API:', content);
          console.log('🔍 Content length:', content.length);
          
          // If "Tất cả phường" is selected, show all records
          if (!filters.maPhuong || filters.maPhuong === '') {
            console.log('🌍 Setting showAllWards: true');
            setData({
              content: content,
              showAllWards: true
            });
          } else {
            console.log('🏢 Setting showAllWards: false for ward:', filters.maPhuong);
            // If specific ward is selected, show total
            const totalTransferCases = content.reduce((sum, item) => {
              return sum + (item.soCaChuyenTuyen || 0);
            }, 0);
            
            setData({
              soCaChuyenTuyen: totalTransferCases,
              content: content,
              showAllWards: false
            });
          }
        }
      } catch (err) {
        console.error('❌ Error fetching total transfer cases:', err);
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

  console.log('🎨 TotalTransferCases render - state:', {
    loading,
    error,
    data,
    filters
  });

  if (loading) {
    console.log('⏳ Showing loading state');
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-sm text-gray-500">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    console.log('❌ Showing error state:', error);
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-sm text-red-500">{error}</div>
      </div>
    );
  }

  // Remove the filter requirement check - allow API calls without filters

  // Tạo dữ liệu cho biểu đồ
  const chartData = data ? (() => {
    console.log('🔍 Creating chartData with data:', data);
    
    if (data.showAllWards && data.content) {
      console.log('🌍 Creating chart data for all wards');
      const chartData = data.content
        .filter(item => item.tenPhuong && item.tenPhuong !== 'Unknown')
        .slice(0, 5)
        .map((item, index) => ({
          name: item.tenPhuong && item.tenPhuong.length > 15 
            ? item.tenPhuong.substring(0, 15) + '...' 
            : item.tenPhuong || `Phường ${index + 1}`,
          "Số ca": item.soCaChuyenTuyen || 0,
          // Thông tin chi tiết cho tooltip
          tenPhuong: item.tenPhuong,
          maPhuong: item.maPhuong || 'N/A',
          fullName: item.tenPhuong
        }));
      console.log('📊 Chart data for all wards:', chartData);
      return chartData;
    } else {
      console.log('🏢 Creating chart data for specific ward');
      const totalData = [
        {
          name: "Ca chuyển tuyến",
          "Số ca": data.soCaChuyenTuyen || 0,
          value: data.soCaChuyenTuyen || 0
        }
      ];
      console.log('📊 Chart data for specific ward:', totalData);
      return totalData;
    }
  })() : [];

  console.log('🎯 Final chartData:', chartData);
  console.log('📏 ChartData length:', chartData.length);

  // Show if chartData is empty
  if (chartData && chartData.length === 0) {
    console.log('⚠️ ChartData is empty!');
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        {data?.showAllWards ? 'Số ca chuyển tuyến theo phường' : 'Tổng số ca chuyển tuyến'}
        {filters.maPhuong && ` - Phường ${filters.maPhuong}`}
      </h2>
      <ResponsiveContainer width="100%" height={isMobile ? 200 : 220}>
        {data?.showAllWards ? (
          <ComposedChart 
            data={chartData}
            margin={{ 
              top: isMobile ? 15 : 20, 
              right: isMobile ? 8 : 12, 
              left: isMobile ? 8 : 12, 
              bottom: isMobile ? 35 : -20
            }}
          >
            <defs>
              <linearGradient id="colorTransfer" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
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
              height={isMobile ? 60 : 75}
              interval={0}
              tickFormatter={(value) => value && value.length > 10 ? value.substring(0, 10) + '...' : value}
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
              wrapperStyle={{ zIndex: 1000 }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  // Chỉ lấy dữ liệu từ Bar element (element đầu tiên có dataKey "Số ca")
                  const barData = payload.find(p => p.dataKey === "Số ca");
                  if (barData) {
                    const data = barData.payload;
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
                        <div style={{ color: '#374151' }}>{formatNumber(barData.value)} ca</div>
                        <div style={{ color: '#6b7280', fontSize: isMobile ? "7px" : "8px", marginTop: '2px' }}>
                          Mã phường: {data.maPhuong}
                        </div>
                      </div>
                    );
                  }
                }
                return null;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="Số ca" 
              stroke="#3b82f6" 
              fillOpacity={0.3} 
              fill="url(#colorTransfer)"
              strokeWidth={3}
              dot={false}
              activeDot={false}
              name=""
            />
            <Bar 
              dataKey="Số ca" 
              fill="#3b82f6" 
              opacity={0.7}
              radius={[2, 2, 0, 0]}
              maxBarSize={60}
            />
            <Line 
              type="monotone" 
              dataKey="Số ca" 
              stroke="#1d4ed8" 
              strokeWidth={2}
              dot={false}
              activeDot={false}
              name=""
            />
          </ComposedChart>
        ) : (
          <ComposedChart 
            data={[{ name: 'Tổng số ca chuyển tuyến', value: chartData[0]?.value || 0 }]}
            margin={{ 
              top: isMobile ? 15 : 20, 
              right: isMobile ? 8 : 12, 
              left: isMobile ? 8 : 12, 
              bottom: isMobile ? 35 : 20
            }}
          >
            <defs>
              <linearGradient id="colorTransferSingle" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
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
              fill="url(#colorTransferSingle)" 
              radius={[4, 4, 0, 0]}
              maxBarSize={80}
            />
          </ComposedChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default TotalTransferCases;
