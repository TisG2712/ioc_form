import {
  FaCarCrash,
  FaShieldAlt,
  FaAmbulance,
  FaSchool,
  FaCircle,
  FaHospital,
  FaGraduationCap,
  FaRoad,
  FaUserTie,
  FaPlane,
  FaTree,
  FaBuilding,
  FaCoffee,
  FaClinicMedical,
  FaLandmark,
  FaEnvelope,
  FaCar,
  FaBook,
  FaFire,
  FaUserShield,
  FaMoneyBillWave,
  FaShippingFast,
} from "react-icons/fa";

export const iconMap = {
  FIRE: (
    <div className="relative">
      <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-red-500">
        <FaAmbulance className="text-red-500 text-lg" />
      </div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-red-500"></div>
    </div>
  ),
  CAR_CRASH: (
    <div className="relative">
      <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-blue-500">
        <FaCarCrash className="text-blue-500 text-lg" />
      </div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-blue-500"></div>
    </div>
  ),
  THEFT: (
    <div className="relative">
      <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-black">
        <FaShieldAlt className="text-black text-lg" />
      </div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black"></div>
    </div>
  ),
  MEDICAL: (
    <div className="relative">
      <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-red-500">
        <FaHospital className="text-red-500 text-lg" />
      </div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-red-500"></div>
    </div>
  ),
  TRAFFIC: (
    <div className="relative">
      <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-green-500">
        <FaRoad className="text-green-500 text-lg" />
      </div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-green-500"></div>
    </div>
  ),
  // Giao thông & Vận tải
  AIRPORT: (
    <div className="relative">
      <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-blue-600">
        <FaPlane className="text-blue-600 text-lg" />
      </div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-blue-600"></div>
    </div>
  ),
  // Y tế & Sức khỏe
  // Giáo dục & Đào tạo
  COLLEGE: (
    <div className="relative">
      <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-purple-500">
        <FaSchool className="text-purple-500 text-lg" />
      </div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-purple-500"></div>
    </div>
  ),
  UNIVERSITY: (
    <div className="relative">
      <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-purple-600">
        <FaSchool className="text-purple-600 text-lg" />
      </div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-purple-600"></div>
    </div>
  ),
  // Y tế & Sức khỏe
  HOSPITAL: (
    <div className="relative">
      <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-red-500">
        <FaHospital className="text-red-500 text-lg" />
      </div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-red-500"></div>
    </div>
  ),
  CLINIC: (
    <div className="relative">
      <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-red-400">
        <FaClinicMedical className="text-red-400 text-lg" />
      </div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-red-400"></div>
    </div>
  ),
  MEDICAL_CENTER: (
    <div className="relative">
      <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-red-400">
        <FaAmbulance className="text-red-400 text-lg" />
      </div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-red-400"></div>
    </div>
  ),
  MEDICAL_STATION: (
    <div className="relative">
      <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-red-300">
        <FaClinicMedical className="text-red-300 text-lg" />
      </div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-red-300"></div>
    </div>
  ),
  // Dịch vụ & Thương mại
  BANK: (
    <div className="relative">
      <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-yellow-500">
        <FaMoneyBillWave className="text-yellow-500 text-lg" />
      </div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-yellow-500"></div>
    </div>
  ),
  CAFE: (
    <div className="relative">
      <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-amber-800">
        <FaCoffee className="text-amber-800 text-lg" />
      </div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-amber-800"></div>
    </div>
  ),
  POST_OFFICE: (
    <div className="relative">
      <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-blue-600">
        <FaShippingFast className="text-blue-600 text-lg" />
      </div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-blue-600"></div>
    </div>
  ),
  // Công cộng & Giải trí
  PARK: (
    <div className="relative">
      <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-green-400">
        <FaTree className="text-green-400 text-lg" />
      </div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-green-400"></div>
    </div>
  ),
  MUSEUM: (
    <div className="relative">
      <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-800">
        <FaLandmark className="text-gray-800 text-lg" />
      </div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
    </div>
  ),
  // Cơ quan & Dịch vụ
  POLICE: (
    <div className="relative">
      <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-blue-500">
        <FaUserShield className="text-blue-500 text-lg" />
      </div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-blue-500"></div>
    </div>
  ),
  TRAFFIC_POLICE: (
    <div className="relative">
      <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-green-500">
        <FaUserShield className="text-green-500 text-lg" />
      </div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-green-500"></div>
    </div>
  ),
  FIRE_STATION: (
    <div className="relative">
      <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-red-700">
        <FaFire className="text-red-700 text-lg" />
      </div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-red-700"></div>
    </div>
  ),
  GOVERNMENT_OFFICE: (
    <div className="relative">
      <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-blue-500">
        <FaBuilding className="text-blue-500 text-lg" />
      </div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-blue-500"></div>
    </div>
  ),
  default: (
    <div className="relative">
      <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-500">
        <FaCircle className="text-gray-500 text-lg" />
      </div>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-500"></div>
    </div>
  ),
};

export const getIcon = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes("cháy")) return "FIRE";
  if (lower.includes("tai nạn")) return "CAR_CRASH";
  if (lower.includes("trộm")) return "THEFT";
  if (
    name.toLowerCase().includes("bệnh viện") ||
    name.toLowerCase().includes("y tế")
  ) {
    return "MEDICAL";
  } else if (name.toLowerCase().includes("công an")) {
    return "POLICE";
  } else if (name.toLowerCase().includes("trường học")) {
    return "COLLEGE";
  } else if (name.toLowerCase().includes("giao thông")) {
    return "TRAFFIC";
  }
  return "default";
};
