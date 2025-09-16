import React, { useState, useEffect, useCallback } from 'react';
import {
  Treemap,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { getTongHop } from '../../../../service/medicalService';

const TotalTreatmentCases = ({ filters }) => {
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
        console.log('Fetching treatment cases data with filters:', filters);
         const response = await getTongHop(filters);
         console.log('Treatment cases API response:', response);
         
         if (isMounted) {
           if (response) {
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
              const totalTreatmentCases = selectedWardData ? (selectedWardData.luotDieuTri || 0) : 0;
              
              setData({
                luotDieuTri: totalTreatmentCases,
                content: content,
                showAllWards: false
              });
            }
          } else {
            setError('Không có dữ liệu');
          }
        }
      } catch (err) {
        console.error('Error fetching treatment cases:', err);
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

  // Remove the filter requirement check - allow API calls without filters

  // Tạo dữ liệu cho biểu đồ Treemap với màu sắc hiện đại
  const chartData = data ? (() => {
    if (data.showAllWards && data.content) {
      // Hiển thị tất cả các phường (giới hạn 5 phường đầu tiên cho Treemap)
      const modernColors = [
        '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#10b981' // 5 màu hiện đại và thu hút
      ];
      
      return data.content
        .filter(item => item.tenPhuong && item.tenPhuong !== 'Unknown')
        .slice(0, 5)
        .map((item, index) => ({
          name: item.tenPhuong,
          size: item.luotDieuTri || 0,
          value: item.luotDieuTri || 0,
          fill: modernColors[index % modernColors.length],
          stroke: '#ffffff',
          strokeWidth: 2,
          opacity: 0.9
        }));
    } else {
      // Hiển thị tổng
      return [
        {
          name: "Lượt điều trị",
          size: data.luotDieuTri || 0,
          value: data.luotDieuTri || 0,
          fill: '#f59e0b',
          stroke: '#ffffff',
          strokeWidth: 3,
          opacity: 0.9
        }
      ];
    }
  })() : [];

  // Show if chartData is empty
  if (chartData && chartData.length === 0) {
    console.log('⚠️ ChartData is empty!');
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
          <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <div className="text-sm font-medium text-gray-600 mb-1">Không có dữ liệu</div>
        <div className="text-xs text-gray-500">Vui lòng thử lại với bộ lọc khác</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-[10px] sm:text-xs font-medium mb-1 text-center px-1">
        {data?.showAllWards ? 'Lượt điều trị theo phường' : 'Tổng lượt điều trị'}
        {filters.maPhuong && ` - Phường ${filters.maPhuong}`}
      </h2>
      {data?.showAllWards ? (
        <div className="relative pb-8">
          <ResponsiveContainer width="100%" height={isMobile ? 200 : 220}>
            <Treemap
              data={chartData}
              dataKey="size"
              aspectRatio={16/9}
              stroke="#ffffff"
              strokeWidth={2}
              fill="#8884d8"
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            >
              <Tooltip 
                contentStyle={{ 
                  fontSize: isMobile ? "8px" : "10px",
                  zIndex: 1000,
                  position: "relative",
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: '#000000',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  backdropFilter: 'blur(8px)'
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
                        borderRadius: '8px',
                        color: '#000000',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        padding: '12px 16px',
                        backdropFilter: 'blur(8px)'
                      }}>
                        <div style={{ 
                          fontWeight: '600', 
                          marginBottom: '6px',
                          color: '#1f2937',
                          fontSize: isMobile ? "9px" : "11px"
                        }}>
                          {data.name}
                        </div>
                        <div style={{ 
                          color: '#6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: data.fill,
                            borderRadius: '50%',
                            display: 'inline-block'
                          }}></div>
                          {formatNumber(data.value)} lượt điều trị
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </Treemap>
          </ResponsiveContainer>
          
          {/* Gradient overlay for modern effect */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/20 to-transparent"></div>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={isMobile ? 200 : 220}>
          <ComposedChart 
            data={[{ name: 'Tổng lượt điều trị', value: chartData[0]?.value || 0 }]}
            margin={{ 
              top: isMobile ? 15 : 20, 
              right: isMobile ? 8 : 12, 
              left: isMobile ? 8 : 12, 
              bottom: isMobile ? 35 : 20
            }}
          >
          <defs>
            <linearGradient id="colorTreatmentSingle" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9}/>
              <stop offset="50%" stopColor="#fbbf24" stopOpacity={0.7}/>
              <stop offset="95%" stopColor="#fde68a" stopOpacity={0.3}/>
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
            fill="url(#colorTreatmentSingle)" 
            radius={[4, 4, 0, 0]}
            maxBarSize={80}
          />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TotalTreatmentCases;