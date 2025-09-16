import React from "react";
import { Activity, BedDouble, Ambulance } from "lucide-react";

const stats = [
  {
    id: 1,
    title: "Số ca cấp cứu trong ngày",
    value: "34",
    icon: <Activity className="w-5 h-5 text-red-500" />,
  },
  {
    id: 2,
    title: "Giường bệnh còn trống",
    value: "120",
    icon: <BedDouble className="w-5 h-5 text-green-500" />,
  },
  {
    id: 1,
    title: "Số ca cấp cứu trong ngày",
    value: "34",
    icon: <Activity className="w-5 h-5 text-red-500" />,
  },
  {
    id: 1,
    title: "Số ca cấp cứu trong ngày",
    value: "34",
    icon: <Activity className="w-5 h-5 text-red-500" />,
  },
  {
    id: 1,
    title: "Số ca cấp cứu trong ngày",
    value: "34",
    icon: <Activity className="w-5 h-5 text-red-500" />,
  },
];

const HealthcareStats = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 w-full mb-3">
      {stats.map((item) => (
        <div
          key={item.id}
          className="bg-white shadow rounded-xl border border-gray-200 flex flex-col items-center justify-center aspect-square"
        >
          <span className="text-4xl font-bold mb-2">{item.value}</span>
          <div className="flex items-center">
            {item.icon}
            <p className="text-gray-600 font-medium text-sm mt-1">
              {item.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HealthcareStats;
