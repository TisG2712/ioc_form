import React, { useState, memo } from "react";
import Header from "../../components/ui/Header";
import Navbar from "../../components/ui/Navbar";
import PopulationLayout from "../../layouts/PopulationLayout";
import Filter from "../../components/ui/FilterPopulation";

const Population = memo(() => {
  const [filters, setFilters] = useState({
    year: "2024",
    quarter: "Q1",
    madvhc: null, // null để tránh request không cần thiết
  });
  return (
    <div className="flex flex-col h-screen">
      {/* Header và Navbar cố định */}
      <Header />
      <Navbar />
      {/* Bộ lọc Dropdown */}
      <Filter filters={filters} setFilters={setFilters} />

      {/* Phần cuộn riêng */}
      <div className="flex-1 overflow-y-auto">
        <PopulationLayout filters={filters} />
      </div>
    </div>
  );
});

Population.displayName = 'Population';

export default Population;
