import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getKcbHuyen } from '../../../../service/medicalService';

const MedicalVisitsPer100People = ({ filters }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getKcbHuyen({
          startDate: filters.startDate,
          endDate: filters.endDate,
          maPhuong: filters.maPhuong
        });
        
        console.log('MedicalVisitsPer100People API Response:', response);
        
        if (response && response.body && response.body.content) {
          setData(response);
        } else {
          setError('Không có dữ liệu');
        }
      } catch (err) {
        console.error('Error fetching medical visits per 100 people data:', err);
        setError('Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const formatNumber = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '0';
    
    if (numValue >= 1000000) {
      return (numValue / 1000000).toFixed(1) + 'M';
    } else if (numValue >= 1000) {
      return (numValue / 1000).toFixed(1) + 'K';
    }
    return numValue.toFixed(1);
  };

  const chartData = (() => {
    if (!data?.body?.content) return [];
    
    if (filters.maPhuong && filters.maPhuong !== '') {
      // Hiển thị cho 1 phường cụ thể
      const wardData = data.body.content.find(item => item.maPhuong === filters.maPhuong);
      if (wardData) {
        return [{
          name: wardData.tenPhuong || 'Phường',
          "Lượt/100 dân": wardData.luotKhamChuaBenh ? parseFloat(wardData.luotKhamChuaBenh) / 100 : 0,
          tenPhuong: wardData.tenPhuong,
          maPhuong: wardData.maPhuong,
          fullName: wardData.tenPhuong
        }];
      }
      return [];
    } else {
      // Hiển thị cho tất cả phường
      const filteredData = data.body.content
        .filter(item => item.tenPhuong && item.tenPhuong !== 'Unknown')
        .slice(0, 5);
      
      return filteredData.map((item, index) => ({
        name: item.tenPhuong && item.tenPhuong.length > 15 
          ? item.tenPhuong.substring(0, 15) + '...' 
          : item.tenPhuong || `Xã ${index + 1}`,
        "Lượt/100 dân": item.luotKhamChuaBenh ? parseFloat(item.luotKhamChuaBenh) / 100 : 0,
        tenPhuong: item.tenPhuong,
        maPhuong: item.maPhuong,
        fullName: item.tenPhuong
      }));
    }
  })();

  if (loading) {
    return (
      <div className="w-full">
        <h2 className="text-[10px] sm:text-xs font-medium mb-1 text-center px-1">
          Lượt khám chữa bệnh theo xã / 100 dân
          {filters.maPhuong && ` - Phường ${filters.maPhuong}`}
        </h2>
        <div className="flex items-center justify-center h-[200px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-xs text-gray-500">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <h2 className="text-[10px] sm:text-xs font-medium mb-1 text-center px-1">
          Lượt khám chữa bệnh theo xã / 100 dân
          {filters.maPhuong && ` - Phường ${filters.maPhuong}`}
        </h2>
        <div className="flex items-center justify-center h-[200px]">
          <div className="text-center text-red-500">
            <p className="text-xs">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.body?.content || data.body.content.length === 0) {
    return (
      <div className="w-full">
        <h2 className="text-[10px] sm:text-xs font-medium mb-1 text-center px-1">
          Lượt khám chữa bệnh theo xã / 100 dân
          {filters.maPhuong && ` - Phường ${filters.maPhuong}`}
        </h2>
        <div className="flex items-center justify-center h-[200px]">
          <div className="text-center text-gray-500">
            <p className="text-xs">Không có dữ liệu</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-[10px] sm:text-xs font-medium mb-2 text-center px-1">
        Lượt khám chữa bệnh theo xã / 100 dân
        {filters.year && ` - Năm ${filters.year}`}
        {filters.maPhuong && ` - Phường ${filters.maPhuong}`}
      </h2>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={isMobile ? 200 : 220}>
          <BarChart 
            data={chartData}
            margin={{ 
              top: isMobile ? 15 : 20, 
              right: isMobile ? 8 : 12, 
              left: isMobile ? 8 : 12, 
              bottom: isMobile ? 35 : -25
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
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
                value: 'Lượt/100 dân', 
                angle: -90, 
                position: 'insideLeft', 
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
                      <div style={{ color: '#374151' }}>{formatNumber(data["Lượt/100 dân"])} lượt/100 dân</div>
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
              dataKey="Lượt/100 dân" 
              fill="#10b981" 
              name="Lượt/100 dân"
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-48">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold text-green-600 mb-2">
              📊
            </div>
            <p className="text-xs text-gray-600 mb-1">Không có dữ liệu</p>
            <p className="text-[10px] text-gray-500">Lượt khám chữa bệnh theo xã / 100 dân</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalVisitsPer100People;
