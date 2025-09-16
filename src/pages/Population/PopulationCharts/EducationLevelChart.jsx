import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
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

function EducationLevelChart({ filters }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const hasRequested = useRef(false); // Track xem đã request chưa
  
  // Sử dụng debounced filters để tránh request liên tục
  const debouncedFilters = useDebouncedFilters(filters, 100);
  
  // Sử dụng filters trực tiếp để đơn giản hóa

  // Hook để theo dõi kích thước màn hình
  const checkIsMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 640);
  }, []);

  useEffect(() => {
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [checkIsMobile]);

  // Định nghĩa thứ tự hiển thị mong muốn
  const educationOrder = [
    "Đại học",
    "Cao đẳng", 
    "Trung cấp",
    "Sơ cấp",
    "Ngoài trường",
    "Chưa xác định"
  ];

  const COLORS = [
    "#3b82f6",
    "#f97316",
    "#10b981",
    "#eab308",
    "#8b5cf6",
    "#ec4899",
  ];

  // Custom Legend
  const renderLegend = () => (
    <ul className="flex flex-wrap text-[8px] sm:text-[10px] gap-1 sm:gap-2 justify-center">
      {educationOrder.map((key, index) => (
        <li key={key} className="flex items-center">
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              backgroundColor: COLORS[index],
              marginRight: 3,
            }}
          />
          <span className="whitespace-nowrap" style={{ color: COLORS[index] }}>{key}</span>
        </li>
      ))}
    </ul>
  );

  // Custom Tooltip
  const renderTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;

    return (
      <div className="bg-white border p-2 text-[8px] sm:text-[10px] shadow-md rounded max-w-[200px] sm:max-w-none">
        <p className="font-medium mb-1">{label}</p>
        <div className="space-y-1">
          {educationOrder.map((key, index) => {
            const dataItem = payload.find((p) => p.dataKey === key);
            if (!dataItem) return null;
            return (
              <div key={key} className="flex items-center">
                <span
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 8,
                    backgroundColor: COLORS[index],
                    marginRight: 4,
                  }}
                />
                <span className="truncate">{key}: {dataItem.value}%</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Function để sắp xếp lại data theo thứ tự mong muốn (đảm bảo key có đủ)
  const sortDataByOrder = (data) => {
    return data.map(item => {
      const sortedItem = { name: item.name };
      educationOrder.forEach(key => {
        sortedItem[key] = item[key] ?? 0;
      });
      return sortedItem;
    });
  };

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
          // Lấy dữ liệu cả năm theo quý
          const quarterlyData = [];

          for (let quarter = 1; quarter <= 4; quarter++) {
            try {
              const response = await getTinhHinhGiaoDucTheoQuy({
                madvhc: filters.madvhc,
                quarter: quarter.toString(),
                year: filters.year
              });

              if (response.status === "OK" && response.body?.monthlyData) {
                let totalDaiHoc = 0, totalCaoDang = 0, totalTrungCap = 0;
                let totalSoCap = 0, totalChuaXacDinh = 0, totalNgoaiTruong = 0;

                response.body.monthlyData.forEach((item) => {
                  totalDaiHoc += parseFloat(item.trinhDoDaiHocTyLe) || 0;
                  totalCaoDang += parseFloat(item.trinhDoCaoDangTyLe) || 0;
                  totalTrungCap += parseFloat(item.trinhDoTrungCapTyLe) || 0;
                  totalSoCap += parseFloat(item.trinhDoSoCapTyLe) || 0;
                  totalChuaXacDinh += parseFloat(item.trinhDoChuaXacDinhTyLe) || 0;
                  totalNgoaiTruong += parseFloat(item.teNgoaiNhaTruongTyLe) || 0;
                });

                const monthCount = response.body.monthlyData.length;

                quarterlyData.push({
                  name: `Q${quarter}`,
                  "Đại học": Math.round((totalDaiHoc / monthCount) * 10) / 10,
                  "Cao đẳng": Math.round((totalCaoDang / monthCount) * 10) / 10,
                  "Trung cấp": Math.round((totalTrungCap / monthCount) * 10) / 10,
                  "Sơ cấp": Math.round((totalSoCap / monthCount) * 10) / 10,
                  "Ngoài trường": Math.round((totalNgoaiTruong / monthCount) * 10) / 10,
                  "Chưa xác định": Math.round((totalChuaXacDinh / monthCount) * 10) / 10,
                });
              } else {
                quarterlyData.push({
                  name: `Q${quarter}`,
                  "Đại học": 0,
                  "Cao đẳng": 0,
                  "Trung cấp": 0,
                  "Sơ cấp": 0,
                  "Ngoài trường": 0,
                  "Chưa xác định": 0,
                });
              }
            } catch {
              quarterlyData.push({
                name: `Q${quarter}`,
                "Đại học": 0,
                "Cao đẳng": 0,
                "Trung cấp": 0,
                "Sơ cấp": 0,
                "Ngoài trường": 0,
                "Chưa xác định": 0,
              });
            }
          }

          setChartData(sortDataByOrder(quarterlyData));
        } else {
          // Lấy dữ liệu theo tháng trong quý
          const response = await getTinhHinhGiaoDucTheoQuy({
            madvhc: filters.madvhc,
            quarter: filters.quarter.replace("Q", ""),
            year: filters.year
          });

          if (response.status === "OK" && response.body?.monthlyData) {
            const processedData = response.body.monthlyData.map((item) => ({
              name: getMonthName(item.thangCapNhat),
              "Đại học": parseFloat(item.trinhDoDaiHocTyLe) || 0,
              "Cao đẳng": parseFloat(item.trinhDoCaoDangTyLe) || 0,
              "Trung cấp": parseFloat(item.trinhDoTrungCapTyLe) || 0,
              "Sơ cấp": parseFloat(item.trinhDoSoCapTyLe) || 0,
              "Ngoài trường": parseFloat(item.teNgoaiNhaTruongTyLe) || 0,
              "Chưa xác định": parseFloat(item.trinhDoChuaXacDinhTyLe) || 0,
            }));

            setChartData(sortDataByOrder(processedData));
          } else {
            setError("Không có dữ liệu");
          }
        }
      } catch (err) {
        console.error("Error fetching education level data:", err);
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

  // Tạo key duy nhất cho request để tránh duplicate
  const requestKey = useMemo(() => {
    if (!filters.madvhc || filters.madvhc === null || filters.madvhc === '') {
      return null;
    }
    return `${filters.madvhc}-${filters.quarter}-${filters.year}`;
  }, [filters.madvhc, filters.quarter, filters.year]);

  // Memoize các giá trị được tính toán
  const chartTitle = useMemo(() => {
    return filters.quarter === "ALL" 
      ? "Tỷ lệ trình độ học vấn (Cả năm)" 
      : `Tỷ lệ trình độ học vấn (${filters.quarter})`;
  }, [filters.quarter]);

  const chartHeight = useMemo(() => {
    return isMobile ? 170 : 190;
  }, [isMobile]);

  const chartMargin = useMemo(() => ({
    top: isMobile ? 25 : 30,
    right: isMobile ? 5 : 10,
    left: isMobile ? 5 : 10,
    bottom: 5
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

  if (!filters || !filters.madvhc || filters.madvhc === '' || filters.madvhc === 'ALL') {
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
          ? `Tỷ lệ dân cư có trình độ học vấn theo quý trong năm ${filters?.year}`
          : `Tỷ lệ dân cư có trình độ học vấn theo tháng trong quý ${filters?.quarter}`}
      </h2>
      <ResponsiveContainer width="100%" height={isMobile ? 170 : 190}>
        <ComposedChart
          data={chartData}
          margin={{ 
            top: isMobile ? 10 : 20, 
            right: isMobile ? 5 : 10, 
            left: isMobile ? 5 : 0, 
            bottom: 5 
          }}
        >
          <XAxis
            dataKey="name"
            tick={{ fontSize: isMobile ? 8 : 10 }}
            height={isMobile ? 25 : 30}
            interval={isMobile ? "preserveStartEnd" : 0}
          />
          <YAxis
            tick={{ fontSize: isMobile ? 8 : 10 }}
            unit="%"
            label={{ 
              value: "Tỷ lệ %", 
              angle: 0, 
              position: 'top', 
              fontSize: isMobile ? 8 : 10 
            }}
            width={isMobile ? 30 : 40}
          />
          <Tooltip content={renderTooltip} />
          <Legend content={renderLegend} />
          {educationOrder.map((key, index) => (
            <Bar key={key} dataKey={key} fill={COLORS[index]} />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EducationLevelChart;
