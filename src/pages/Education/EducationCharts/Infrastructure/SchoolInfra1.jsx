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

function SchoolInfra1({ filters }) {
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
        
        // Chỉ cần gọi 1 API school-info-year
        const schoolInfoResponse = await getSchoolInfoYear(filters.maNamHoc);
        
        if (schoolInfoResponse) {
          // Từ school-info-year: tổng trường, tổng lớp, phòng học và phòng học kiên cố
          const totalSchools = schoolInfoResponse.tongTruong || 0;
          const totalClasses = schoolInfoResponse.tongLop || 0;
          const totalRooms = schoolInfoResponse.phongHoc || 0;
          const totalSolidRooms = schoolInfoResponse.phongKienCo || 0;
          
          const chartData = [
            { name: "Tổng trường", value: totalSchools },
            { name: "Tổng lớp", value: totalClasses },
            { name: "Phòng học", value: totalRooms },
            { name: "Phòng học kiên cố", value: totalSolidRooms },
          ];
          setData(chartData);
        } else {
          setError("Không có dữ liệu cho năm học đã chọn.");
        }
      } catch (error) {
        setError("Lỗi khi tải dữ liệu biểu đồ. Vui lòng thử lại sau.");
        console.error("Error fetching data for SchoolInfra1:", error);
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
        Tổng quan cơ sở hạ tầng
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
            formatter={(value, name) => {
              if (name === "Tổng trường") {
                return [value.toLocaleString(), "Trường"];
              } else if (name === "Tổng lớp") {
                return [value.toLocaleString(), "Lớp"];
              } else if (name === "Phòng học") {
                return [value.toLocaleString(), "Phòng"];
              } else if (name === "Phòng học kiên cố") {
                return [value.toLocaleString(), "Phòng kiên cố"];
              }
              return [value, name];
            }} 
          />
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SchoolInfra1;
