import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  BarChart,
  Bar,
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

function PopulationDensityChart({ filters }) {
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
              const response = await getTinhHinhBienDongDanCuTheoQuy({
                madvhc: filters.madvhc,
                quarter: quarter.toString(),
                year: filters.year
              });

              if (response.status === "OK" && response.body?.monthlyData) {
                // Tính trung bình mật độ dân cư của quý
                let totalDensity = 0;
                let totalPopulation = 0;
                let totalCCCD = 0;

                response.body.monthlyData.forEach((item) => {
                  const dienTich = parseFloat(item.dienTich) || 5; // Sử dụng dienTich từ API
                  const matDoDanCu = parseInt(item.matDoDanSo) || parseInt(item.nkTongNhanKhau) / dienTich;
                  totalDensity += matDoDanCu;
                  totalPopulation += parseInt(item.nkTongNhanKhau);
                });

                const avgDensity = Math.round(totalDensity / response.body.monthlyData.length);
                const avgPopulation = Math.round(totalPopulation / response.body.monthlyData.length);
                const avgCCCD = Math.round(totalCCCD / response.body.monthlyData.length);

                quarterlyData.push({
                  name: `Q${quarter}`,
                  "Mật độ dân cư (người/km²)": avgDensity
                });
              } else {
                // Nếu không có dữ liệu, thêm quý với giá trị 0
                quarterlyData.push({
                  name: `Q${quarter}`,
                  "Mật độ dân cư (người/km²)": 0
                });
              }
            } catch (err) {
              console.warn(`Error fetching data for Q${quarter}:`, err);
              // Nếu có lỗi, thêm quý với giá trị 0
              quarterlyData.push({
                name: `Q${quarter}`,
                "Mật độ dân cư (người/km²)": 0
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
              const dienTich = parseFloat(item.dienTich) || 5;
              const matDoDanCu = parseInt(item.matDoDanSo) || Math.round(parseInt(item.nkTongNhanKhau) / dienTich);
              
              return {
                name: getMonthName(item.thangCapNhat),
                "Mật độ dân cư (người/km²)": matDoDanCu
              };
            });

            if (isMounted) {
              setChartData(processedData);
            }
          } else {
            if (isMounted) {
              setError("Không có dữ liệu");
            }
          }
        }
      } catch (err) {
        console.error("Error fetching population density data:", err);
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

  return (
    <div className="w-full">
      <h2 className="text-[10px] sm:text-xs font-medium mb-2 sm:mb-3 text-center px-2">
        {filters.quarter === "ALL" 
          ? `Mật độ dân cư theo quý trong năm ${filters?.year}`
          : `Mật độ dân cư theo tháng trong quý ${filters?.quarter}`
        }
      </h2>
      <ResponsiveContainer width="100%" height={isMobile ? 170 : 190}>
        <BarChart 
          data={chartData}
          margin={{ 
            top: isMobile ? 10 : 15, 
            right: isMobile ? 5 : 10, 
            left: isMobile ? 5 : 0, 
            bottom: 15
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
              value: 'Người/km²', 
              angle: 0, 
              position: 'top', 
              fontSize: isMobile ? 8 : 10
            }}
            width={isMobile ? 40 : 50}
          />
          <Tooltip 
            contentStyle={{ 
              fontSize: isMobile ? "8px" : "10px",
              zIndex: 1000,
              position: "relative"
            }}
            wrapperStyle={{ zIndex: 1000 }}
            formatter={(value, name) => [
              `${value} người/km²`,
              name
            ]}
          />
          {/* <Legend wrapperStyle={{ fontSize: isMobile ? "8px" : "10px" }} /> */}
          <Bar 
            dataKey="Mật độ dân cư (người/km²)" 
            fill="#3b82f6" 
            name="Mật độ dân cư"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PopulationDensityChart;
