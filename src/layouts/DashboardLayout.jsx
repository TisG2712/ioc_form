import React, { memo, Suspense, lazy } from "react";

// Lazy load các Dashboard Charts
const MapView = lazy(() => import("../pages/Dashboard/DashboardCharts/MapView"));
const TrafficCharts = lazy(() => import("../pages/Dashboard/DashboardCharts/TrafficCharts"));
const HealthcareBar = lazy(() => import("../pages/Dashboard/DashboardCharts/HealthcareBar"));
const EducationHorizontalBar = lazy(() => import("../pages/Dashboard/DashboardCharts/EducationHorizontalBar"));
const SecurityTrafficBar = lazy(() => import("../pages/Dashboard/DashboardCharts/SecurityTrafficBar"));
const SummaryCards = lazy(() => import("../pages/Dashboard/DashboardCharts/SummaryCards"));
const DashboardLayout = memo(() => {
  return (
    <div className="flex flex-col h-full gap-4 p-4">
      {/* Phần trên */}
      <div className="flex flex-1 gap-4">
        {/* Trái: Map */}
        <div className="flex-1 bg-grey-100 rounded-sm shadow p-0 flex items-center justify-center">
          <Suspense fallback={<div className="loading">Loading MapView...</div>}>
            <MapView />
          </Suspense>
        </div>

        {/* Giữa: Biểu đồ */}
        <div className="flex-1 bg-grey-100 rounded-sm shadow p-0 flex items-center justify-center">
          <Suspense fallback={<div className="loading">Loading TrafficCharts...</div>}>
            <TrafficCharts />
          </Suspense>
        </div>

        {/* Phải: Card thống kê */}
        <div className="flex-1 bg-grey-100 rounded-sm shadow p-0 flex items-center justify-center">
          <Suspense fallback={<div className="loading">Loading SummaryCards...</div>}>
            <SummaryCards />
          </Suspense>
        </div>
      </div>

      {/* Phần dưới */}
      <div className="flex flex-1 gap-4">
        <div className="flex-1 bg-grey-100 rounded-sm shadow p-0 flex items-center justify-center">
          <Suspense fallback={<div className="loading">Loading HealthcareBar...</div>}>
            <HealthcareBar />
          </Suspense>
        </div>
        <div className="flex-1 bg-grey-100 rounded-sm shadow p-0 flex items-center justify-center">
          <Suspense fallback={<div className="loading">Loading EducationHorizontalBar...</div>}>
            <EducationHorizontalBar />
          </Suspense>
        </div>
        <div className="flex-1 bg-grey-100 rounded-sm shadow p-0 flex items-center justify-center">
          <Suspense fallback={<div className="loading">Loading SecurityTrafficBar...</div>}>
            <SecurityTrafficBar />
          </Suspense>
        </div>
      </div>
    </div>
  );
});

DashboardLayout.displayName = 'DashboardLayout';

export default DashboardLayout;
