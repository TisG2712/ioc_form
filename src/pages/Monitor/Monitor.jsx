import React from "react";
import Header from "../../components/ui/Header";
import Navbar from "../../components/ui/Navbar";
import MonitorLayout from "../../layouts/MonitorLayout";

function Monitor() {
  return (
    <div className="flex flex-col h-[calc(100vh-0px)] overflow-hidden">
      <Header />
      <Navbar />
      <div className="flex-1 overflow-hidden">
        <MonitorLayout />
      </div>
    </div>
  );
}

export default Monitor;