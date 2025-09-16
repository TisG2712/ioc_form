import React, { useState, memo } from "react";
import Header from "../../components/ui/Header";
import Navbar from "../../components/ui/Navbar";
import EducationLayout from "../../layouts/EducationLayout";
import FilterEducation from "../../components/ui/FilterEducation";

const Education = memo(() => {
  const [filters, setFilters] = useState({
    maNamHoc: null, // null để tránh request không cần thiết
  });

  return (
    <div className="flex flex-col h-screen">
      {/* Header và Navbar cố định */}
      <Header />
      <Navbar />
      
      {/* Bộ lọc Dropdown */}
      <FilterEducation filters={filters} setFilters={setFilters} />

      {/* Phần cuộn riêng */}
      <div className="flex-1 overflow-y-auto">
        <EducationLayout filters={filters} />
      </div>
    </div>
  );
});

Education.displayName = 'Education';

export default Education;
