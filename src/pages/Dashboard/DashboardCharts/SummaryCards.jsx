import React from "react";
import { FaAmbulance, FaBook, FaShieldAlt, FaCarCrash } from "react-icons/fa";

const cardsData = [
  {
    id: 1,
    value: 120,
    icon: <FaAmbulance className="text-red-500 text-sm" />,
    label: "Ca cấp cứu",
  },
  {
    id: 2,
    value: 350,
    icon: <FaBook className="text-blue-500 text-sm" />,
    label: "Học sinh mới",
  },
  {
    id: 3,
    value: 25,
    icon: <FaShieldAlt className="text-green-500 text-sm" />,
    label: "Vụ việc an ninh",
  },
  {
    id: 4,
    value: 40,
    icon: <FaCarCrash className="text-orange-500 text-sm" />,
    label: "Tai nạn ",
  },
  {
    id: 5,
    value: 18,
    icon: <FaAmbulance className="text-red-400 text-sm" />,
    label: "Ca phẫu thuật",
  },
  {
    id: 6,
    value: 70,
    icon: <FaBook className="text-blue-400 text-sm" />,
    label: "Giáo viên mới",
  },
  {
    id: 7,
    value: 15,
    icon: <FaShieldAlt className="text-green-400 text-sm" />,
    label: "Tội phạm bị bắt",
  },
  {
    id: 8,
    value: 22,
    icon: <FaCarCrash className="text-orange-400 text-sm" />,
    label: "Va chạm nhẹ",
  },
  {
    id: 9,
    value: 200,
    icon: <FaBook className="text-indigo-500 text-sm" />,
    label: "Thư viện mở",
  },
  {
    id: 10,
    value: 5,
    icon: <FaAmbulance className="text-pink-500 text-sm" />,
    label: "Dịch bệnh mới",
  },
  {
    id: 11,
    value: 12,
    icon: <FaShieldAlt className="text-teal-500 text-sm" />,
    label: "Sự cố an ninh",
  },
  {
    id: 12,
    value: 60,
    icon: <FaCarCrash className="text-yellow-500 text-sm" />,
    label: "Vụ va chạm",
  },
];

const SummaryCards = () => {
  return (
    <div className="grid grid-cols-4 grid-rows-3 gap-2 w-full h-full p-0">
      {cardsData.map((card) => (
        <div
          key={card.id}
          className="bg-white rounded-sm shadow flex flex-col items-center justify-center p-0 hover:shadow-lg transition"
        >
          {/* Số liệu to */}
          <h2 className="text-3xl font-bold text-gray-800">{card.value}</h2>
          {/* Icon + text */}
          <div className="flex items-center gap-2 mt-2 text-gray-600">
            {card.icon}
            <span className="text-xs">{card.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
