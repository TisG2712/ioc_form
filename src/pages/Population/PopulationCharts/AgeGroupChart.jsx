import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
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

function AgeGroupChart({ filters }) {
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
      // Kiểm tra nghiêm ngặt - chỉ fetch khi có madvhc hợp lệ
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
                // Tính tổng dân số theo nhóm tuổi từ tất cả các tháng trong quý
                let total0_14 = 0;
                let total15_64 = 0;
                let total65 = 0;

                response.body.monthlyData.forEach((item) => {
                  total0_14 += parseInt(item.thongKeTuoi0Den14 || 0);
                  total15_64 += parseInt(item.thongKeTuoi5Den64 || 0);
                  total65 += parseInt(item.thongKeTuoi65 || 0);
                });

                quarterlyData.push({
                  name: `Q${quarter}`,
                  "0 - 14 tuổi": total0_14,
                  "15 - 64 tuổi": total15_64,
                  "≥ 65 tuổi": total65,
                });
              } else {
                // Nếu không có dữ liệu, thêm quý với giá trị 0
                quarterlyData.push({
                  name: `Q${quarter}`,
                  "0 - 14 tuổi": 0,
                  "15 - 64 tuổi": 0,
                  "≥ 65 tuổi": 0,
                });
              }
            } catch (err) {
              console.warn(`Error fetching age group data for Q${quarter}:`, err);
              // Nếu có lỗi, thêm quý với giá trị 0
              quarterlyData.push({
                name: `Q${quarter}`,
                "0 - 14 tuổi": 0,
                "15 - 64 tuổi": 0,
                "≥ 65 tuổi": 0,
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
            // Tính tổng dân số theo nhóm tuổi từ tất cả các tháng trong quý
            let total0_14 = 0;
            let total15_64 = 0;
            let total65 = 0;

            response.body.monthlyData.forEach((item) => {
              total0_14 += parseInt(item.thongKeTuoi0Den14 || 0);
              total15_64 += parseInt(item.thongKeTuoi5Den64 || 0);
              total65 += parseInt(item.thongKeTuoi65 || 0);
            });

            const processedData = [
              { name: "0 - 14 tuổi", value: total0_14 },
              { name: "15 - 64 tuổi", value: total15_64 },
              { name: "≥ 65 tuổi", value: total65 },
            ];

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
        console.error("Error fetching age group data:", err);
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

  // Memoize các giá trị được tính toán
  const chartTitle = useMemo(() => {
    return filters.quarter === "ALL" 
      ? "Số lượng dân số theo 3 nhóm tuổi (Cả năm)" 
      : `Số lượng dân số theo 3 nhóm tuổi (${filters.quarter})`;
  }, [filters.quarter]);

  const chartHeight = useMemo(() => {
    return isMobile ? 170 : 190;
  }, [isMobile]);

  const chartMargin = useMemo(() => ({
    top: isMobile ? 5 : 15, 
              right: isMobile ? 5 : 10, 
              left: isMobile ? 5 : 5, 
              bottom: 15
  }), [isMobile]);

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
        {chartTitle}
      </h2>
      <ResponsiveContainer width="100%" height={chartHeight}>
        {filters.quarter === "ALL" ? (
          <BarChart
            data={chartData}
            margin={chartMargin}
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
            <Bar dataKey="0 - 14 tuổi" fill="#3b82f6" />
            <Bar dataKey="15 - 64 tuổi" fill="#10b981" />
            <Bar dataKey="≥ 65 tuổi" fill="#f59e0b" />
          </BarChart>
        ) : (
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ 
              top: isMobile ? 25 : 30, 
              right: isMobile ? 5 : 10, 
              left: isMobile ? 5 : 10, 
              bottom: 5 
            }}
          >
            <XAxis 
              type="number" 
              tick={{ fontSize: isMobile ? 8 : 10 }} 
              label={{ 
                value: 'Số người', 
                angle: 0, 
                position: 'insideBottom', 
                fontSize: isMobile ? 8 : 10 
              }}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fontSize: isMobile ? 8 : 10 }} 
              width={isMobile ? 60 : 80}
            />
            <Tooltip 
              contentStyle={{ 
                fontSize: isMobile ? "8px" : "10px",
                zIndex: 1000,
                position: "relative"
              }}
              wrapperStyle={{ zIndex: 1000 }}
              formatter={(value) => [`${value.toLocaleString()} người`, 'Số người']}
            />
            <Bar dataKey="value" fill="#3b82f6" barSize={isMobile ? 12 : 15} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

export default AgeGroupChart;
