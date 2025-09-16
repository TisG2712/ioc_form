import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid
} from "recharts";
import { getChiPhiNhomBenh } from '../../../../service/medicalService';

const CostByDiseaseGroup = ({ filters }) => {
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
        console.log('Fetching disease group cost data with filters:', filters);
        const response = await getChiPhiNhomBenh(filters);
        console.log('Disease group cost API response:', response);
        
        if (isMounted) {
          if (response && response.body) {
            setData(response.body);
          } else {
            setError('Không có dữ liệu');
          }
        }
      } catch (err) {
        console.error('Error fetching cost by disease group:', err);
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
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numAmount);
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

  // Tạo dữ liệu cho biểu đồ composed - giới hạn 5 kết quả
  const chartData = data?.content && data.content.length > 0 
    ? data.content.slice(0, 5).map((item, index) => {
        const cost = typeof item.tongChiPhi === 'string' ? parseFloat(item.tongChiPhi) : item.tongChiPhi || 0;
        return {
          name: item.maNhomBenh || `Nhóm ${index + 1}`,
          "Chi phí": cost,
          "Trung bình": cost * 0.8, // Giả sử trung bình là 80% của chi phí
          // Thông tin chi tiết cho tooltip
          tenPhuong: item.tenPhuong || 'N/A',
          maPhuong: item.maPhuong || 'N/A',
          fullName: filters.maPhuong === '' 
            ? `${item.maNhomBenh || `Nhóm ${index + 1}`} - ${item.tenPhuong || 'N/A'}`
            : item.maNhomBenh || `Nhóm ${index + 1}`
        };
      })
    : [];

  // Remove the filter requirement check - allow API calls without filters

  return (
    <div className="w-full">
      <h2 className="text-[10px] sm:text-xs font-medium mb-1 text-center px-1">
        Chi phí thanh toán theo nhóm bệnh
      </h2>
      <ResponsiveContainer width="100%" height={isMobile ? 200 : 220}>
        <BarChart 
          data={chartData}
          margin={{ 
            top: isMobile ? 15 : 20, 
            right: isMobile ? 8 : 12, 
            left: isMobile ? 8 : 12, 
            bottom: isMobile ? 35 : -5
            }}
        >
          <defs>
            <linearGradient id="colorChiPhi" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3}/>
            </linearGradient>
            <linearGradient id="colorTrungBinh" x1="0" y1="0" x2="0" y2="1">
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
            height={isMobile ? 60 : 40}
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
                    padding: '12px 16px',
                    minWidth: '200px'
                  }}>
                    <div style={{ 
                      fontWeight: '600', 
                      marginBottom: '8px',
                      color: '#1f2937',
                      fontSize: isMobile ? "9px" : "11px"
                    }}>
                      {data.fullName}
                    </div>
                    
                    <div style={{ marginBottom: '6px' }}>
                      <div style={{ 
                        color: '#6b7280', 
                        fontSize: isMobile ? "7px" : "9px",
                        marginBottom: '2px'
                      }}>
                        Mã phường: {data.maPhuong}
                      </div>
                      <div style={{ 
                        color: '#6b7280', 
                        fontSize: isMobile ? "7px" : "9px"
                      }}>
                        Tên phường: {data.tenPhuong}
                      </div>
                    </div>
                    
                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '6px' }}>
                      {payload.map((entry, index) => (
                        <div key={entry.name || `entry-${index}`} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '4px'
                        }}>
                          <div style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: entry.color,
                              borderRadius: '2px',
                              display: 'inline-block'
                            }}></div>
                            <span style={{ color: '#374151' }}>{entry.name}:</span>
                          </div>
                          <span style={{ 
                            fontWeight: '500',
                            color: '#1f2937'
                          }}>
                            {formatCurrency(entry.value)}
                          </span>
                        </div>
                      ))}
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
            iconType="rect"
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
          />
          <Bar 
            dataKey="Chi phí" 
            fill="url(#colorChiPhi)"
            name="Chi phí"
            radius={[4, 4, 0, 0]}
            stroke="#3b82f6"
            strokeWidth={1}
            maxBarSize={60}
          />
          <Bar 
            dataKey="Trung bình" 
            fill="url(#colorTrungBinh)"
            name="Trung bình"
            radius={[4, 4, 0, 0]}
            stroke="#f59e0b"
            strokeWidth={1}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CostByDiseaseGroup;
