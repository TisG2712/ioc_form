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
import { getTinhHinhBienDongDanCuTheoQuy, getTinhHinhSucKhoeTheoQuy } from "../../../service/populationApi";
import { useDebouncedFilters } from "../../../utils/useDebounce";

function InfantRateChart({ filters }) {
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
              const [populationResponse, healthResponse] = await Promise.all([
                getTinhHinhBienDongDanCuTheoQuy({
                  madvhc: filters.madvhc,
                  quarter: quarter.toString(),
                  year: filters.year
                }),
                getTinhHinhSucKhoeTheoQuy({
                  madvhc: filters.madvhc,
                  quarter: quarter.toString(),
                  year: filters.year
                })
              ]);

              if (populationResponse.status === "OK" && populationResponse.body?.monthlyData &&
                  healthResponse.status === "OK" && healthResponse.body?.monthlyData) {
                // Tính tổng số trẻ nhỏ và người khác từ tất cả các tháng trong quý
                let totalInfants = 0;
                let totalOthers = 0;

                populationResponse.body.monthlyData.forEach((popItem, index) => {
                  const healthItem = healthResponse.body.monthlyData[index];
                  const totalPopulation = parseInt(popItem.nkTongNhanKhau);
                  const infantRate = parseFloat(healthItem?.tileTEDuoi1Tuoi) || 0;
                  const infants = Math.round(totalPopulation * (infantRate / 100));
                  const others = totalPopulation - infants;
                  
                  totalInfants += infants;
                  totalOthers += others;
                });

                quarterlyData.push({
                  name: `Q${quarter}`,
                  "Trẻ <1 tuổi": totalInfants,
                  "Người khác": totalOthers,
                });
              } else {
                // Nếu không có dữ liệu, thêm quý với giá trị 0
                quarterlyData.push({
                  name: `Q${quarter}`,
                  "Trẻ <1 tuổi": 0,
                  "Người khác": 0,
                });
              }
            } catch (err) {
              console.warn(`Error fetching infant data for Q${quarter}:`, err);
              // Nếu có lỗi, thêm quý với giá trị 0
              quarterlyData.push({
                name: `Q${quarter}`,
                "Trẻ <1 tuổi": 0,
                "Người khác": 0,
              });
            }
          }

          setChartData(quarterlyData);
        } else {
          // Khi chọn quý cụ thể, lấy dữ liệu theo tháng trong quý
          const [populationResponse, healthResponse] = await Promise.all([
            getTinhHinhBienDongDanCuTheoQuy({
              madvhc: filters.madvhc,
              quarter: filters.quarter.replace('Q', ''),
              year: filters.year
            }),
            getTinhHinhSucKhoeTheoQuy({
              madvhc: filters.madvhc,
              quarter: filters.quarter.replace('Q', ''),
              year: filters.year
            })
          ]);

          if (populationResponse.status === "OK" && populationResponse.body?.monthlyData &&
              healthResponse.status === "OK" && healthResponse.body?.monthlyData) {
            // Tính tổng số trẻ nhỏ và người khác từ tất cả các tháng trong quý
            let totalInfants = 0;
            let totalOthers = 0;

            populationResponse.body.monthlyData.forEach((popItem, index) => {
              const healthItem = healthResponse.body.monthlyData[index];
              const totalPopulation = parseInt(popItem.nkTongNhanKhau);
              const infantRate = parseFloat(healthItem?.tileTEDuoi1Tuoi) || 0;
              const infants = Math.round(totalPopulation * (infantRate / 100));
              const others = totalPopulation - infants;
              
              totalInfants += infants;
              totalOthers += others;
            });

            const processedData = [
              { name: "Trẻ <1 tuổi", value: totalInfants },
              { name: "Người khác", value: totalOthers },
            ];

            setChartData(processedData);
          } else {
            setError("Không có dữ liệu");
          }
        }
      } catch (err) {
        console.error("Error fetching infant rate data:", err);
        setError("Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.madvhc, filters.quarter, filters.year, filters.timeId]);

  const COLORS = ["#ef4444", "#3b82f6"];

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

  if (!filters || !filters.madvhc || filters.madvhc === '' || filters.madvhc === 'ALL') {
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
          ? `Thống kê tỷ lệ trẻ nhỏ trên tổng nhân khẩu theo quý trong năm ${filters?.year}`
          : `Thống kê tỷ lệ trẻ nhỏ trên tổng nhân khẩu quý ${filters?.quarter}`
        }
      </h2>
      <ResponsiveContainer width="100%" height={180}>
        {filters.quarter === "ALL" ? (
          <BarChart 
            data={chartData}
            margin={{ 
              top: isMobile ? 5 : 15, 
              right: isMobile ? 5 : 10, 
              left: isMobile ? 5 : -5,
              bottom: -5
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
            <Bar dataKey="Trẻ <1 tuổi" fill={COLORS[0]} />
            <Bar dataKey="Người khác" fill={COLORS[1]} />
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
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

export default InfantRateChart;
