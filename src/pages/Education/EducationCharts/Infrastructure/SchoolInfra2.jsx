import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getSchoolInfoYear } from "../../../../service/educationService";

function SchoolInfra2({ filters }) {
  const [data, setData] = useState([
    { name: "Kiên cố", value: 0 },
    { name: "Chưa kiên cố", value: 0 },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!filters?.maNamHoc) {
        setData([
          { name: "Kiên cố", value: 0 },
          { name: "Chưa kiên cố", value: 0 },
        ]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getSchoolInfoYear(filters.maNamHoc);
        
        if (response) {
          const tyLePhongKienCo = parseFloat((response.tyLePhongKienCo || 0).toFixed(2));
          setData([
            { name: "Kiên cố", value: tyLePhongKienCo },
            { name: "Chưa kiên cố", value: parseFloat((100 - tyLePhongKienCo).toFixed(2)) },
          ]);
        } else {
          setError("Không có dữ liệu cho năm học đã chọn.");
        }
      } catch (error) {
        setError("Lỗi khi tải dữ liệu biểu đồ. Vui lòng thử lại sau.");
        console.error("Error fetching data for SchoolInfra2:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [filters?.maNamHoc]);

  const COLORS = ["#10b981", "#ef4444"];

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

  if (isLoading) {
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
        Tỷ lệ phòng học kiên cố
      </h2>
      <ResponsiveContainer width="100%" height={190}>
        <PieChart
          margin={{ 
            top: 15, 
            right: 10, 
            left: 0, 
          }}
        >
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
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

export default SchoolInfra2;
