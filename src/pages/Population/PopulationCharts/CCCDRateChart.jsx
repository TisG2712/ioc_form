import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { getTienDoCapCCCDTheoQuy } from "../../../service/populationApi";
import { useDebouncedFilters } from "../../../utils/useDebounce";

function CCCDRateChart({ filters }) {
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
    let isMounted = true; // Flag để kiểm tra component còn mount không

    const fetchData = async () => {
      if (!filters || !filters.madvhc || filters.madvhc === null) {
        if (isMounted) {
          setChartData([]);
        }
        return;
      }

      if (isMounted) {
        setLoading(true);
        setError(null);
      }

      try {
        if (filters.quarter === "ALL") {
          // Khi chọn "Tất cả" ở dropdown quý, lấy dữ liệu cả năm theo từng quý
          const quarterlyData = [];
          
          for (let quarter = 1; quarter <= 4; quarter++) {
            try {
              const response = await getTienDoCapCCCDTheoQuy({
                madvhc: filters.madvhc,
                quarter: quarter.toString(),
                year: filters.year
              });

              if (response.status === "OK" && response.body?.monthlyData) {
                // Tính tổng số CCCD đã cấp và chưa cấp từ tất cả các tháng trong quý
                let totalIssued = 0;
                let totalNotIssued = 0;

                response.body.monthlyData.forEach((item) => {
                  const totalPopulation = parseInt(item.nkTongNhanKhau);
                  const issued = parseInt(item.soTheCccdDaCap);
                  const notIssued = totalPopulation - issued;
                  
                  totalIssued += issued;
                  totalNotIssued += notIssued;
                });

                quarterlyData.push({
                  name: `Q${quarter}`,
                  "Đã cấp CCCD": totalIssued,
                  "Chưa cấp CCCD": totalNotIssued,
                });
              } else {
                // Nếu không có dữ liệu, thêm quý với giá trị 0
                quarterlyData.push({
                  name: `Q${quarter}`,
                  "Đã cấp CCCD": 0,
                  "Chưa cấp CCCD": 0,
                });
              }
            } catch (err) {
              console.warn(`Error fetching CCCD data for Q${quarter}:`, err);
              // Nếu có lỗi, thêm quý với giá trị 0
              quarterlyData.push({
                name: `Q${quarter}`,
                "Đã cấp CCCD": 0,
                "Chưa cấp CCCD": 0,
              });
            }
          }

          setChartData(quarterlyData);
        } else {
          // Khi chọn quý cụ thể, lấy dữ liệu theo tháng trong quý
          const response = await getTienDoCapCCCDTheoQuy({
            madvhc: filters.madvhc,
            quarter: filters.quarter.replace('Q', ''),
            year: filters.year
          });

          if (response.status === "OK" && response.body?.monthlyData) {
            // Tính tổng số CCCD đã cấp và chưa cấp từ tất cả các tháng trong quý
            let totalIssued = 0;
            let totalNotIssued = 0;

            response.body.monthlyData.forEach((item) => {
              const totalPopulation = parseInt(item.nkTongNhanKhau);
              const issued = parseInt(item.soTheCccdDaCap);
              const notIssued = totalPopulation - issued;
              
              totalIssued += issued;
              totalNotIssued += notIssued;
            });

            const processedData = [
              { name: "Đã cấp CCCD", value: totalIssued },
              { name: "Chưa cấp CCCD", value: totalNotIssued },
            ];

            setChartData(processedData);
          } else {
            setError("Không có dữ liệu");
          }
        }
      } catch (err) {
        console.error("Error fetching CCCD data:", err);
        if (isMounted) {
          setError("Lỗi khi tải dữ liệu");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [filters.madvhc, filters.quarter, filters.year, filters.timeId]);

  const COLORS = ["#3b82f6", "#f97316"];

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

  if (!filters || !filters.madvhc || filters.madvhc === null) {
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
    <div className="w-full">
      <h2 className="text-[10px] sm:text-xs font-medium mb-2 sm:mb-3 text-center px-2">
        {filters.quarter === "ALL" 
          ? `Tỷ lệ và số lượng người được cấp CCCD theo quý trong năm ${filters?.year}`
          : `Tỷ lệ và số lượng người được cấp CCCD quý ${filters?.quarter}`
        }
      </h2>
      <ResponsiveContainer width="100%" height={isMobile ? 170 : 190}>
        {filters.quarter === "ALL" ? (
          <BarChart 
            data={chartData}
            margin={{ 
              top: isMobile ?10 : 15, 
              right: isMobile ? 5 : 10, 
              left: isMobile ? 10 : 10, 
            }}
          >
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: isMobile ? 8 : 10 }} 
              angle={0}
              textAnchor="middle"
              height={isMobile ? 25 : 30}
              interval={isMobile ? "preserveStartEnd" : 0}
            />
            <YAxis 
              tick={{ fontSize: isMobile ? 8 : 10 }} 
              label={{ 
                value: 'Số người', 
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
                position: "relative"
              }}
              wrapperStyle={{ zIndex: 1000 }}
              formatter={(value, name) => [
                `${value.toLocaleString()} người`,
                name
              ]}
            />
            <Legend wrapperStyle={{ fontSize: isMobile ? "8px" : "10px" }} />
            <Bar dataKey="Đã cấp CCCD" fill={COLORS[0]} />
            <Bar dataKey="Chưa cấp CCCD" fill={COLORS[1]} />
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
              contentStyle={{ 
                fontSize: isMobile ? "8px" : "10px",
                zIndex: 1000,
                position: "relative"
              }}
              wrapperStyle={{ zIndex: 1000 }}
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

export default CCCDRateChart;
