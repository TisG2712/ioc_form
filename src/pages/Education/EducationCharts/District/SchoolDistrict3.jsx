import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getSchoolStatisticsByYear } from "../../../../service/educationService";

function SchoolDistrict3({ filters }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!filters?.maNamHoc) {
        setData([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getSchoolStatisticsByYear(filters.maNamHoc);
        
        if (Array.isArray(response) && response.length > 0) {
          const filteredData = response
            .filter(item => item.tenPhongGd && item.tenPhongGd !== "")
            .slice(0, 8)
            .map(item => ({
              name: item.tenPhongGd,
              value: parseFloat((item.tyLeGvHs || 0).toFixed(2))
            }));
          setData(filteredData);
        } else {
          setError("Không có dữ liệu cho năm học đã chọn.");
        }
      } catch (error) {
        setError("Lỗi khi tải dữ liệu biểu đồ. Vui lòng thử lại sau.");
        console.error("Error fetching data for SchoolDistrict3:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [filters?.maNamHoc]);

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
        Tỷ lệ GV/HS theo quận/huyện
      </h2>
      <ResponsiveContainer width="100%" height={190}>
        <AreaChart 
          data={data} 
          margin={{ 
            top: 15, 
            right: 10, 
            left: 0, 
            bottom: 5 
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: "10px" }} 
            angle={-45}
            textAnchor="end"
            height={50}
          />
          <YAxis 
            tick={{ fontSize: "10px" }} 
            label={{ 
              value: 'Tỷ lệ (%)', 
              angle: 0, 
              position: 'top', 
              fontSize: 10 
            }}
            width={40}
          />
          <Tooltip 
            contentStyle={{ 
              fontSize: "10px",
              zIndex: 1000,
              position: "relative"
            }}
            wrapperStyle={{ zIndex: 1000 }}
            formatter={(value) => [`${value}%`, 'Tỷ lệ']} 
          />
          <Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SchoolDistrict3;
