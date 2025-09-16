import React, { useState, useEffect, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { getTinhHinhBienDongDanCuTheoQuy } from "../../../service/populationApi";
import { useDebouncedFilters } from "../../../utils/useDebounce";

// Hàm lấy tên tháng từ thangCapNhat
const getMonthName = (thangCapNhat) => {
  const monthNames = {
    "01": "Tháng 1", "02": "Tháng 2", "03": "Tháng 3", "04": "Tháng 4",
    "05": "Tháng 5", "06": "Tháng 6", "07": "Tháng 7", "08": "Tháng 8",
    "09": "Tháng 9", "10": "Tháng 10", "11": "Tháng 11", "12": "Tháng 12"
  };
  return monthNames[thangCapNhat] || `Tháng ${thangCapNhat}`;
};

function UrbanRuralChart({ filters }) {
  // Sử dụng debounced filters để tránh request liên tục
  const debouncedFilters = useDebouncedFilters(filters, 100);
  
  // Sử dụng filters trực tiếp để đơn giản hóa
  const [chartData, setChartData] = useState([]);
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
    const fetchData = async () => {
      if (!filters || !filters.madvhc || filters.madvhc === null) {
        setChartData([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (filters.quarter === "ALL") {
          // Khi chọn "Tất cả" ở dropdown quý, lấy dữ liệu cả năm theo từng quý
          const quarterlyData = [];
          
          for (let quarter = 1; quarter <= 4; quarter++) {
            try {
              const response = await getTinhHinhBienDongDanCuTheoQuy({
                madvhc: filters.madvhc,
                quarter: quarter.toString(),
                year: filters.year
              });

              if (response.status === "OK" && response.body?.monthlyData) {
                // Tính tổng dân số thành thị và nông thôn từ tất cả các tháng trong quý
                let totalUrban = 0;
                let totalRural = 0;

                response.body.monthlyData.forEach((item) => {
                  totalUrban += parseInt(item.nkThanhThi || 0);
                  totalRural += parseInt(item.nkNongThon || 0);
                });

                quarterlyData.push({
                  name: `Q${quarter}`,
                  "Thành thị": totalUrban,
                  "Nông thôn": totalRural,
                });
              } else {
                // Nếu không có dữ liệu, thêm quý với giá trị 0
                quarterlyData.push({
                  name: `Q${quarter}`,
                  "Thành thị": 0,
                  "Nông thôn": 0,
                });
              }
            } catch (err) {
              console.warn(`Error fetching urban rural data for Q${quarter}:`, err);
              // Nếu có lỗi, thêm quý với giá trị 0
              quarterlyData.push({
                name: `Q${quarter}`,
                "Thành thị": 0,
                "Nông thôn": 0,
              });
            }
          }

          setChartData(quarterlyData);
        } else {
          // Khi chọn quý cụ thể, lấy dữ liệu theo tháng trong quý
          const response = await getTinhHinhBienDongDanCuTheoQuy({
            madvhc: filters.madvhc,
            quarter: filters.quarter.replace('Q', ''),
            year: filters.year
          });

          if (response.status === "OK" && response.body?.monthlyData) {
            // Tính tổng dân số thành thị và nông thôn từ tất cả các tháng trong quý
            let totalUrban = 0;
            let totalRural = 0;

            response.body.monthlyData.forEach((item) => {
              totalUrban += parseInt(item.nkThanhThi || 0);
              totalRural += parseInt(item.nkNongThon || 0);
            });

            const processedData = [
              { name: "Thành thị", value: totalUrban },
              { name: "Nông thôn", value: totalRural },
            ];

            setChartData(processedData);
          } else {
            setError("Không có dữ liệu");
          }
        }
      } catch (err) {
        console.error("Error fetching urban rural data:", err);
        setError("Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.madvhc, filters.quarter, filters.year, filters.timeId]);

  const COLORS = ["#3b82f6", "#10b981"]; // xanh dương - xanh lá

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

  if (!filters || filters.madvhc === "ALL") {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-sm text-gray-500">Vui lòng chọn đơn vị hành chính để xem dữ liệu</div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-sm text-gray-500">Không có dữ liệu để hiển thị</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xs font-medium mb-3 text-center">
        {filters.quarter === "ALL" 
          ? `Tỷ lệ dân số thành thị - nông thôn theo quý trong năm ${filters?.year}`
          : `Tỷ lệ dân số thành thị - nông thôn quý ${filters?.quarter}`
        }
      </h2>
      <ResponsiveContainer width="100%" height={180}>
        {filters.quarter === "ALL" ? (
          <BarChart 
            data={chartData}
            margin={{ 
              top: isMobile ? 10 : 15, 
              right: isMobile ? 5 : 10, 
              left: isMobile ? 5 : -10,
              bottom: -10
            }}
          >
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: isMobile ? 8 : 10 }} 
              angle={0}
              textAnchor="middle"
              height={30}
            />
            <YAxis 
              tick={{ fontSize: isMobile ? 8 : 10 }} 
              label={{ value: 'Số người', angle: 0, position: 'top', fontSize: isMobile ? 8 : 10 }}
            />
            <Tooltip 
              contentStyle={{ fontSize: isMobile ? "8px" : "10px" }}
              formatter={(value, name) => [
                `${value.toLocaleString()} người`,
                name
              ]}
            />
            <Legend wrapperStyle={{ fontSize: isMobile ? "8px" : "10px" }} />
            <Bar dataKey="Thành thị" fill={COLORS[0]} />
            <Bar dataKey="Nông thôn" fill={COLORS[1]} />
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={isMobile ? 50 : 60}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ fontSize: isMobile ? "8px" : "10px" }}
              formatter={(value, name) => [
                `${value.toLocaleString()} người`,
                name
              ]}
            />
            <Legend wrapperStyle={{ fontSize: isMobile ? "8px" : "10px" }} />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

export default UrbanRuralChart;
