import React, { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
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

function ReligiousRateChart({ filters }) {
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
                // Tính trung bình tỷ lệ tôn giáo của quý
                let totalReligionRate = 0;

                response.body.monthlyData.forEach((item) => {
                  const totalPopulation = parseInt(item.nkTongNhanKhau);
                  const religionCount = parseInt(item.nkTonGiao || 0);
                  const religionRate = totalPopulation > 0 ? (religionCount / totalPopulation) * 100 : 0;
                  totalReligionRate += religionRate;
                });

                const avgReligionRate = Math.round((totalReligionRate / response.body.monthlyData.length) * 10) / 10;

                quarterlyData.push({
                  name: `Q${quarter}`,
                  "Tỷ lệ TG (%)": avgReligionRate,
                });
              } else {
                // Nếu không có dữ liệu, thêm quý với giá trị 0
                quarterlyData.push({
                  name: `Q${quarter}`,
                  "Tỷ lệ TG (%)": 0,
                });
              }
            } catch (err) {
              console.warn(`Error fetching religion data for Q${quarter}:`, err);
              // Nếu có lỗi, thêm quý với giá trị 0
              quarterlyData.push({
                name: `Q${quarter}`,
                "Tỷ lệ TG (%)": 0,
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
            const processedData = response.body.monthlyData.map((item) => {
              const totalPopulation = parseInt(item.nkTongNhanKhau);
              const religionCount = parseInt(item.nkTonGiao || 0);
              const religionRate = totalPopulation > 0 ? Math.round(((religionCount / totalPopulation) * 100) * 10) / 10 : 0;
              
              return {
                name: getMonthName(item.thangCapNhat),
                "Tỷ lệ TG (%)": religionRate,
              };
            });

            setChartData(processedData);
          } else {
            setError("Không có dữ liệu");
          }
        }
      } catch (err) {
        console.error("Error fetching religion rate data:", err);
        setError("Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.madvhc, filters.quarter, filters.year, filters.timeId]);

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

  return (
    <div>
      <h2 className="text-xs font-medium mb-3 text-center">
        {filters.quarter === "ALL" 
          ? `Tỷ lệ người dân theo tôn giáo theo quý trong năm ${filters?.year}`
          : `Tỷ lệ người dân theo tôn giáo theo tháng trong quý ${filters?.quarter}`
        }
      </h2>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart
          data={chartData}
          margin={{ top: isMobile ? 10 : 15, right: 10, left: -10, bottom: 5 }}
        >
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10 }} 
            angle={0}
            textAnchor="middle"
            height={30}
          />
          <YAxis 
            tick={{ fontSize: 10 }} 
            unit="%" 
            label={{ value: 'Tỷ lệ %', angle: 0, position: 'top', fontSize: 10 }}
          />
          <Tooltip 
            contentStyle={{ fontSize: "10px" }}
            formatter={(value) => [`${value}%`, 'Tỷ lệ TG']}
          />
          {/* <Legend wrapperStyle={{ fontSize: "10px" }} /> */}
          <Line
            type="monotone"
            dataKey="Tỷ lệ TG (%)"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ReligiousRateChart;
