import React, { memo } from "react";
import { Link } from "react-router-dom";
import Bground from "../../assets/images/background.png";
import NationalEmblem from "../../assets/images/government.png";
import UserAccountDropdown from "./UserAccountDropdown";
import { useAuth } from "../../contexts/AuthContext";

const Header = memo(() => {
  const { username } = useAuth();

  return (
    <div id="app-header" className="relative w-full h-[64px] sm:h-[54px] z-10">
      <img
        src={Bground}
        alt="Background"
        className="w-full h-full object-cover absolute top-0 z-0"
      />
      <div className="relative flex items-center justify-between h-full sm:px-6 z-10">
        <div className="flex items-center min-w-0">
          <Link to="/dashboard" title="Home" className="shrink-0">
            <img
              src={NationalEmblem}
              alt="National Emblem"
              className="w-[40px] h-[40px] sm:w-[40px] sm:h-[40px] object-contain mr-3 sm:mr-4 cursor-pointer"
            />
          </Link>
          <div className="flex flex-col truncate">
            <h2 className="text-red-700 text-[28px] sm:text-[20px] font-semibold truncate">
              TRUNG TÂM ĐIỀU HÀNH THÔNG MINH IOC - TỈNH ĐỒNG NAI
            </h2>
            <h3 className="text-blue-950 text-sm sm:text-md mt-1 sm:mt-0 font-semibold drop-shadow truncate">
              HỆ THỐNG GIÁM SÁT
            </h3>
          </div>
        </div>

        {/* User Account Dropdown */}
        <div className="shrink-0">
          <UserAccountDropdown username={username} />
        </div>
      </div>
    </div>
  );
});

Header.displayName = 'Header';

export default Header;
