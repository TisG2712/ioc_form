import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getSchoolInfoYear } from "../../../../service/educationService";

function SchoolInfra3({ filters }) {
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
        const response = await getSchoolInfoYear(filters.maNamHoc);
        
        if (response) {
          const chartData = [
            { name: "BQ Lớp/Trường", value: parseFloat((response.binhQuanLopTruong || 0).toFixed(1)) },
            { name: "BQ Phòng/Trường", value: parseFloat((response.binhQuanPhongHocTruong || 0).toFixed(1)) },
          ];
          setData(chartData);
        } else {
          setError("Không có dữ liệu cho năm học đã chọn.");
        }
      } catch (error) {
        setError("Lỗi khi tải dữ liệu biểu đồ. Vui lòng thử lại sau.");
        console.error("Error fetching data for SchoolInfra3:", error);
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
        Bình quân lớp và phòng học/trường
      </h2>
      <ResponsiveContainer width="100%" height={190}>
        <BarChart 
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
            angle={0}
            textAnchor="middle"
            height={30}
          />
          <YAxis 
            tick={{ fontSize: "10px" }} 
            label={{ 
              value: 'Số lượng', 
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
            formatter={(value) => [value, 'Số lượng']} 
          />
          <Bar dataKey="value" fill="#8b5cf6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SchoolInfra3;
