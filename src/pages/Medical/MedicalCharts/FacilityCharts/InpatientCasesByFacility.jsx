import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getCSKB } from '../../../../service/medicalService';

const InpatientCasesByFacility = ({ filters }) => {
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
        console.log('Fetching inpatient cases data with filters:', filters);
        const response = await getCSKB(filters);
        console.log('Inpatient cases API response:', response);
        
        if (isMounted) {
          if (response && response.body) {
            setData(response.body);
          } else {
            setError('Không có dữ liệu');
          }
        }
      } catch (err) {
        console.error('Error fetching inpatient cases by facility:', err);
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

  // Tạo dữ liệu cho biểu đồ - hiển thị theo tên cơ sở KCB, giới hạn 5 kết quả
  const chartData = data?.content && data.content.length > 0 
    ? data.content.slice(0, 5).map((item, index) => ({
        name: item.tenCoSoKhamChuaBenh && item.tenCoSoKhamChuaBenh.length > 15 
          ? item.tenCoSoKhamChuaBenh.substring(0, 15) + '...' 
          : item.tenCoSoKhamChuaBenh || `CSKB ${index + 1}`,
        "Số ca": item.soCaNoiTru || 0,
        // Thông tin chi tiết cho tooltip
        tenCoSo: item.tenCoSoKhamChuaBenh || `CSKB ${index + 1}`,
        maCoSo: item.maCoSoKhamChuaBenh || 'N/A',
        fullName: item.tenCoSoKhamChuaBenh || `CSKB ${index + 1}`
      }))
    : [];

  return (
    <div className="w-full">
      <h2 className="text-[10px] sm:text-xs font-medium mb-2 text-center px-1">
        Số ca nội trú theo cơ sở KCB
      </h2>
      <ResponsiveContainer width="100%" height={isMobile ? 200 : 220}>
        <BarChart 
          data={chartData}
          margin={{ 
            top: isMobile ? 15 : 20, 
            right: isMobile ? 8 : 12, 
            left: isMobile ? 8 : 12, 
            bottom: isMobile ? 35 : 0
          }}
        >
          <defs>
            <linearGradient id="colorInpatient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={1}/>
              <stop offset="50%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#6ee7b7" stopOpacity={0.4}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            tick={{ 
              fontSize: isMobile ? 8 : 10,
              angle: -45,
              textAnchor: 'end'
            }} 
            height={isMobile ? 60 : 65}
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
                      <div style={{ fontWeight: '500', marginBottom: '4px' }}>{data.tenCoSo}</div>
                      <div style={{ color: '#374151' }}>{formatNumber(data["Số ca"])} ca nội trú</div>
                      <div style={{ color: '#6b7280', fontSize: isMobile ? "7px" : "8px", marginTop: '2px' }}>
                        Mã cơ sở: {data.maCoSo}
                      </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="Số ca" 
            fill="url(#colorInpatient)" 
            name="Số ca"
            maxBarSize={60}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InpatientCasesByFacility;
