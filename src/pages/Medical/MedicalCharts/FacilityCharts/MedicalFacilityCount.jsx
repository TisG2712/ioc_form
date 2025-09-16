import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { getCSKB } from '../../../../service/medicalService';

const MedicalFacilityCount = ({ filters }) => {
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
        console.log('Fetching facility count data with filters:', filters);
        const response = await getCSKB(filters);
        console.log('Facility count API response:', response);
        
        if (isMounted) {
          if (response && response.body) {
            setData(response.body);
          } else {
            setError('Không có dữ liệu');
          }
        }
      } catch (err) {
        console.error('Error fetching medical facility count:', err);
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

  // Tạo dữ liệu cho biểu đồ Bar - giới hạn 8 phường để hiển thị đẹp hơn
  const chartData = data?.content && data.content.length > 0 
    ? (() => {
        // Nếu filter theo phường cụ thể, hiển thị tổng số cơ sở của phường đó
        if (filters.maPhuong && filters.maPhuong !== '') {
          const totalFacilities = data.content.reduce((sum, item) => {
            return sum + (item.soLuongCoSoKhamChuaBenh || 0);
          }, 0);
          return [{
            name: data.content[0]?.tenPhuong || `Phường ${filters.maPhuong}`,
            "Số cơ sở": totalFacilities,
            value: totalFacilities
          }];
        } else {
          // Nếu hiển thị tất cả phường, giới hạn 5 kết quả
          return data.content.slice(0, 5).map((item, index) => ({
            name: item.tenPhuong && item.tenPhuong.length > 15 
              ? item.tenPhuong.substring(0, 15) + '...' 
              : item.tenPhuong || `Phường ${index + 1}`,
            "Số cơ sở": item.soLuongCoSoKhamChuaBenh || 0,
            // Thông tin chi tiết cho tooltip
            tenPhuong: item.tenPhuong || `Phường ${item.maPhuong || index + 1}`,
            maPhuong: item.maPhuong || 'N/A',
            fullName: item.tenPhuong || `Phường ${item.maPhuong || index + 1}`
          }));
        }
      })()
    : [];

  return (
    <div className="w-full">
      <h2 className="text-[10px] sm:text-xs font-medium mb-2 text-center px-1">
        {filters.maPhuong && filters.maPhuong !== '' 
          ? 'Tổng số cơ sở KCB' 
          : 'Số lượng cơ sở KCB theo phường'
        }
        {filters.maPhuong && filters.maPhuong !== '' && ` - ${data?.content?.[0]?.tenPhuong || `Phường ${filters.maPhuong}`}`}
      </h2>
      {filters.maPhuong && filters.maPhuong !== '' ? (
        // Hiển thị cho 1 phường cụ thể
        <div className="flex flex-col items-center justify-end h-full pb-8">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-orange-600 mb-2">
              {formatNumber(chartData[0]?.value || 0)}
            </div>
            <div className="text-sm sm:text-base text-gray-600 mb-1">Cơ sở KCB</div>
            <div className="text-xs text-gray-500">
              {data?.content?.[0]?.tenPhuong || `Phường ${filters.maPhuong}`}
            </div>
          </div>
          <div className="mt-4 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
      ) : (
        // Hiển thị cho tất cả phường
        <ResponsiveContainer width="100%" height={isMobile ? 200 : 220}>
          <BarChart 
            data={chartData}
            margin={{ 
              top: isMobile ? 15 : 20, 
              right: isMobile ? 8 : 12, 
              left: isMobile ? 8 : 12, 
              bottom: isMobile ? 35 : -15
              }}
          >
            <defs>
              <linearGradient id="colorFacility" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.3}/>
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
                value: 'Số cơ sở', 
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
                      <div style={{ color: '#374151' }}>{formatNumber(data["Số cơ sở"])} cơ sở KCB</div>
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
              dataKey="Số cơ sở" 
              fill="url(#colorFacility)"
              radius={[4, 4, 0, 0]}
              stroke="#f59e0b"
              strokeWidth={1}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MedicalFacilityCount;
