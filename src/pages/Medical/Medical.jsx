import React, { memo } from "react";
import Header from "../../components/ui/Header";
import Navbar from "../../components/ui/Navbar";
import Footer from "../../components/ui/Footer";
import MedicalLayout from "../../layouts/MedicaLayout";

const Medical = memo(() => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header và Navbar cố định */}
      <Header />
      <Navbar />

      {/* Phần cuộn riêng */}
      <div className="flex-1 overflow-y-auto">
        <MedicalLayout />
      </div>
    </div>
  );
});

Medical.displayName = 'Medical';

export default Medical;
