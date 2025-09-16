// src/components/charts/MapStats.jsx
import React from "react";
import { FaAmbulance, FaCarCrash, FaHome, FaUsers, FaVirus, FaPeopleArrows, FaBriefcase, FaHandHoldingHeart } from "react-icons/fa";

const stats = [
  // {
  //   id: 1,
  //   value: 120,
  //   label: "Dịch bệnh",
  //   icon: <FaVirus className="text-yellow-500 text-xl" />,
  // },
  // {
  //   id: 2,
  //   value: 80,
  //   label: "Chuyển tuyến",
  //   icon: <FaAmbulance className="text-gray-500 text-xl" />,
  // },
  // {
  //   id: 3,
  //   value: 75,
  //   label: "Vụ tai nạn",
  //   icon: <FaCarCrash className="text-black-500 text-xl" />,
  // },
  // {
  //   id: 4,
  //   value: 57,
  //   label: "Vụ tụ tập",
  //   icon: <FaUsers className="text-orange-500 text-xl" />,
  // },
  // {
  //   id: 5,
  //   value: 30,
  //   label: "Hộ nghèo",
  //   icon: <FaHandHoldingHeart className="text-red-500 text-xl" />,
  // },
  // {
  //   id: 6,
  //   value: 90,
  //   label: "Có việc làm",
  //   icon: <FaBriefcase className="text-blue-500 text-xl" />,
  // },
];

function MapStats() {
  return (
    <div className="absolute top-4 right-4 grid grid-cols-2 gap-3 w-[260px]">
      {stats.map((item) => (
        <div
          key={item.id}
          className="bg-white/70 backdrop-blur-md rounded-xl p-3 flex flex-col items-center justify-center shadow-lg border border-white/20"
        >
          {/* Nếu là Hộ nghèo hoặc Có việc làm thì value + % nằm trên, % nhỏ nằm dưới */}
          {item.id === 5 || item.id === 6 ? (
            <div className="flex">
              <div className="text-3xl font-bold text-gray-900">
                {item.value}
              </div>
              <div className="text-2x mt-3 text-gray-600">%</div>
            </div>
          ) : (
            <div className="text-3xl font-bold text-gray-900 ">{item.value}</div>
          )}

          <div className="flex items-center gap-1 text-xs text-gray-700 mt-1 font-medium truncate">
            {item.icon}
            <span>{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MapStats;
