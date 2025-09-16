import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getEducationYearStatistics } from "../../../../service/educationService";

function EducationStats1({ filters }) {
  const [data, setData] = useState([
    { name: "Đạt chuẩn", value: 0 },
    { name: "Chưa đạt", value: 0 },
  ]);
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
      if (!filters?.maNamHoc) {
        if (isMounted) {
          setData([
            { name: "Đạt chuẩn", value: 0 },
            { name: "Chưa đạt", value: 0 },
          ]);
        }
        return;
      }

      if (isMounted) {
        setLoading(true);
        setError(null);
      }

      try {
        const response = await getEducationYearStatistics(filters.maNamHoc);
        
        if (response && isMounted) {
          const tyLeGvDatChuan = parseFloat((response.tyLeGvDatChuan || 0).toFixed(2));
          setData([
            { name: "Đạt chuẩn", value: tyLeGvDatChuan },
            { name: "Chưa đạt", value: parseFloat((100 - tyLeGvDatChuan).toFixed(2)) },
          ]);
        } else if (isMounted) {
          setError("Không có dữ liệu cho năm học đã chọn.");
        }
      } catch (error) {
        console.error("Error fetching data for EducationStats1:", error);
        if (isMounted) {
          setError("Lỗi khi tải dữ liệu biểu đồ. Vui lòng thử lại sau.");
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
  }, [filters?.maNamHoc]);

  const COLORS = ["#10b981", "#ef4444"];

  // Memoize các giá trị được tính toán
  const chartTitle = useMemo(() => {
    return `Tỷ lệ giáo viên đạt chuẩn (${filters?.maNamHoc || 'Năm học'})`;
  }, [filters?.maNamHoc]);

  const chartHeight = useMemo(() => {
    return isMobile ? 170 : 190;
  }, [isMobile]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 rounded shadow-sm text-[8px] sm:text-[10px]">
          <p className="text-gray-700">{`${payload[0].name}: ${parseFloat(payload[0].value).toFixed(2)}%`}</p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="flex justify-center mt-2 text-[8px] sm:text-[10px]">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center mx-1 sm:mx-2">
            <div
              className="w-2 h-2 sm:w-3 sm:h-3 mr-1"
              style={{ backgroundColor: entry.color }}
            />
            {entry.value}
          </li>
        ))}
      </ul>
    );
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

  if (!filters?.maNamHoc) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-sm text-gray-500">Vui lòng chọn năm học để xem dữ liệu</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-[10px] sm:text-xs font-medium mb-2 sm:mb-3 text-center px-2">
        {chartTitle}
      </h2>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <PieChart
          margin={{ 
            top: isMobile ? 10 : 15, 
            right: isMobile ? 5 : 10, 
            left: isMobile ? 5 : 0, 
          }}
        >
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={isMobile ? 30 : 40}
            outerRadius={isMobile ? 50 : 70}
            paddingAngle={2}
            dataKey="value"
            label={false}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EducationStats1;
