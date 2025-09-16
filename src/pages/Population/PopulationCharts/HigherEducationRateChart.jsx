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
import { getTinhHinhGiaoDucTheoQuy } from "../../../service/populationApi";
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

function HigherEducationRateChart({ filters }) {
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
              const response = await getTinhHinhGiaoDucTheoQuy({
                madvhc: filters.madvhc,
                quarter: quarter.toString(),
                year: filters.year
              });

              if (response.status === "OK" && response.body?.monthlyData) {
                // Tính trung bình tỷ lệ đại học trở lên và dưới đại học của quý
                let totalDaiHocTroLen = 0;
                let totalDuoiDaiHoc = 0;

                response.body.monthlyData.forEach((item) => {
                  const daiHoc = parseFloat(item.trinhDoDaiHocTyLe) || 0;
                  const caoDang = parseFloat(item.trinhDoCaoDangTyLe) || 0;
                  const trungCap = parseFloat(item.trinhDoTrungCapTyLe) || 0;
                  const soCap = parseFloat(item.trinhDoSoCapTyLe) || 0;
                  const chuaXacDinh = parseFloat(item.trinhDoChuaXacDinhTyLe) || 0;
                  const ngoaiTruong = parseFloat(item.teNgoaiNhaTruongTyLe) || 0;

                  const daiHocTroLen = daiHoc + caoDang;
                  const duoiDaiHoc = trungCap + soCap + chuaXacDinh + ngoaiTruong;

                  totalDaiHocTroLen += daiHocTroLen;
                  totalDuoiDaiHoc += duoiDaiHoc;
                });

                const monthCount = response.body.monthlyData.length;

                quarterlyData.push({
                  name: `Q${quarter}`,
                  "Đại học trở lên": Math.round((totalDaiHocTroLen / monthCount) * 10) / 10,
                  "Dưới Đại học": Math.round((totalDuoiDaiHoc / monthCount) * 10) / 10,
                });
              } else {
                // Nếu không có dữ liệu, thêm quý với giá trị 0
                quarterlyData.push({
                  name: `Q${quarter}`,
                  "Đại học trở lên": 0,
                  "Dưới Đại học": 0,
                });
              }
            } catch (err) {
              console.warn(`Error fetching higher education data for Q${quarter}:`, err);
              // Nếu có lỗi, thêm quý với giá trị 0
              quarterlyData.push({
                name: `Q${quarter}`,
                "Đại học trở lên": 0,
                "Dưới Đại học": 0,
              });
            }
          }

          setChartData(quarterlyData);
        } else {
          // Khi chọn quý cụ thể, lấy dữ liệu theo tháng trong quý
          const response = await getTinhHinhGiaoDucTheoQuy({
            madvhc: filters.madvhc,
            quarter: filters.quarter.replace('Q', ''),
            year: filters.year
          });

          if (response.status === "OK" && response.body?.monthlyData) {
            // Tính tổng tỷ lệ đại học trở lên và dưới đại học từ tất cả các tháng trong quý
            let totalDaiHocTroLen = 0;
            let totalDuoiDaiHoc = 0;

            response.body.monthlyData.forEach((item) => {
              const daiHoc = parseFloat(item.trinhDoDaiHocTyLe) || 0;
              const caoDang = parseFloat(item.trinhDoCaoDangTyLe) || 0;
              const trungCap = parseFloat(item.trinhDoTrungCapTyLe) || 0;
              const soCap = parseFloat(item.trinhDoSoCapTyLe) || 0;
              const chuaXacDinh = parseFloat(item.trinhDoChuaXacDinhTyLe) || 0;
              const ngoaiTruong = parseFloat(item.teNgoaiNhaTruongTyLe) || 0;

              const daiHocTroLen = daiHoc + caoDang;
              const duoiDaiHoc = trungCap + soCap + chuaXacDinh + ngoaiTruong;

              totalDaiHocTroLen += daiHocTroLen;
              totalDuoiDaiHoc += duoiDaiHoc;
            });

            const processedData = [
              { name: "Đại học trở lên", value: Math.round(totalDaiHocTroLen * 10) / 10 },
              { name: "Dưới Đại học", value: Math.round(totalDuoiDaiHoc * 10) / 10 },
            ];

            setChartData(processedData);
          } else {
            setError("Không có dữ liệu");
          }
        }
      } catch (err) {
        console.error("Error fetching higher education data:", err);
        setError("Lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.madvhc, filters.quarter, filters.year, filters.timeId]);

  const COLORS = ["#10b981", "#f97316"];

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
          ? `Tỷ lệ dân cư có trình độ Đại học trở lên vs dưới Đại học theo quý trong năm ${filters?.year}`
          : `Tỷ lệ dân cư có trình độ Đại học trở lên vs dưới Đại học quý ${filters?.quarter}`
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
              bottom: 7 
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
              unit="%" 
              label={{ value: 'Tỷ lệ %', angle: 0, position: 'top', fontSize: isMobile ? 8 : 10 }}
            />
            <Tooltip 
              contentStyle={{ fontSize: isMobile ? "8px" : "10px" }}
              formatter={(value, name) => [
                `${value.toFixed(1)}%`,
                name
              ]}
            />
            <Legend wrapperStyle={{ fontSize: isMobile ? "8px" : "10px" }} />
            <Bar dataKey="Đại học trở lên" fill={COLORS[0]} />
            <Bar dataKey="Dưới Đại học" fill={COLORS[1]} />
          </BarChart>
        ) : (
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={isMobile ? 30 : 40}
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
                `${value.toFixed(1)}%`,
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

export default HigherEducationRateChart;
