import React, { useRef, useState, memo, useCallback } from "react";
import { FaRegFileAlt, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom"; // 👈 dùng Link thay vì navigate

const menuItems = [
  { name: "Quản lý biểu mẫu", icon: <FaRegFileAlt />, path: "/form" },
  // { name: "Trang chủ", icon: <FaHome />, path: "/home" },
  // { name: "Giám sát", icon: <FaEye />, path: "/monitor" },
  // { name: "Y tế", icon: <FaHospital />, path: "/medical" },
  // { name: "Giáo dục", icon: <FaBook />, path: "/education" },
  // { name: "Dữ liệu dân cư", icon: <FaUsers />, path: "/population" },
  // { name: "Giao thông", icon: <FaRoad /> },
  // { name: "An ninh - Trật tự", icon: <FaUserShield /> },
  // { name: "KT - XH", icon: <FaChartLine /> },
];

const Navbar = memo(() => {
  const navRef = useRef();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative">
      {/* Nút toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute right-0 top-[5px] bg-red-700 hover:bg-red-700 text-white p-1 rounded-sm transition z-20"
      >
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {/* Navbar */}
      <nav
        id="app-navbar"
        ref={navRef}
        className={`bg-red-700 overflow-hidden transition-all duration-500 relative z-5 ${
          isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-w-8xl ml-0 sm:ml-3">
          <ul className="flex flex-wrap gap-x-1 gap-y-1 sm:gap-y-0 h-auto sm:h-[35px] items-center text-xs px-2 sm:px-0 py-1 sm:py-0">
            {menuItems.map((item) => (
              <li key={item.name} className="list-none">
                <Link
                  to={item.path}
                  className="text-white px-2 py-2.5 hover:bg-red-600 transition flex items-center"
                >
                  <span className="mr-2">{item.icon}</span>
                  <span className="whitespace-nowrap">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
