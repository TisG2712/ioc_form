import React, { memo, Suspense, lazy } from "react";

// Lazy load các Education Charts
const EducationStats1 = lazy(() => import("../pages/Education/EducationCharts/Statistics/EducationStats1"));
const EducationStats2 = lazy(() => import("../pages/Education/EducationCharts/Statistics/EducationStats2"));
const EducationStats3 = lazy(() => import("../pages/Education/EducationCharts/Statistics/EducationStats3"));
const EducationStats4 = lazy(() => import("../pages/Education/EducationCharts/Statistics/EducationStats4"));

const SchoolDistrict1 = lazy(() => import("../pages/Education/EducationCharts/District/SchoolDistrict1"));
const SchoolDistrict2 = lazy(() => import("../pages/Education/EducationCharts/District/SchoolDistrict2"));
const SchoolDistrict3 = lazy(() => import("../pages/Education/EducationCharts/District/SchoolDistrict3"));
const SchoolDistrict4 = lazy(() => import("../pages/Education/EducationCharts/District/SchoolDistrict4"));

const SchoolInfra1 = lazy(() => import("../pages/Education/EducationCharts/Infrastructure/SchoolInfra1"));
const SchoolInfra2 = lazy(() => import("../pages/Education/EducationCharts/Infrastructure/SchoolInfra2"));
const SchoolInfra3 = lazy(() => import("../pages/Education/EducationCharts/Infrastructure/SchoolInfra3"));
const SchoolInfra4 = lazy(() => import("../pages/Education/EducationCharts/Infrastructure/SchoolInfra4"));

const EducationLayout = memo(({ filters }) => {
  return (
    <div className="flex flex-col space-y-4 p-4">
      {/* Row 1: Education Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-3 shadow rounded-lg border border-gray-200 min-h-[210px]">
          <Suspense fallback={<div className="loading">Loading EducationStats1...</div>}>
            <EducationStats1 filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white p-3 shadow rounded-lg border border-gray-200 min-h-[210px]">
          <Suspense fallback={<div className="loading">Loading EducationStats2...</div>}>
            <EducationStats2 filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white p-3 shadow rounded-lg border border-gray-200 min-h-[210px]">
          <Suspense fallback={<div className="loading">Loading EducationStats3...</div>}>
            <EducationStats3 filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white p-3 shadow rounded-lg border border-gray-200 min-h-[210px]">
          <Suspense fallback={<div className="loading">Loading EducationStats4...</div>}>
            <EducationStats4 filters={filters} />
          </Suspense>
        </div>
      </div>
      
      {/* Row 2: School District Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-3 shadow rounded-lg border border-gray-200 min-h-[210px]">
          <Suspense fallback={<div className="loading">Loading SchoolDistrict1...</div>}>
            <SchoolDistrict1 filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white p-3 shadow rounded-lg border border-gray-200 min-h-[210px]">
          <Suspense fallback={<div className="loading">Loading SchoolDistrict2...</div>}>
            <SchoolDistrict2 filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white p-3 shadow rounded-lg border border-gray-200 min-h-[210px]">
          <Suspense fallback={<div className="loading">Loading SchoolDistrict3...</div>}>
            <SchoolDistrict3 filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white p-3 shadow rounded-lg border border-gray-200 min-h-[210px]">
          <Suspense fallback={<div className="loading">Loading SchoolDistrict4...</div>}>
            <SchoolDistrict4 filters={filters} />
          </Suspense>
        </div>
      </div>
      
      {/* Row 3: School Infrastructure */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-3 shadow rounded-lg border border-gray-200 min-h-[210px]">
          <Suspense fallback={<div className="loading">Loading SchoolInfra1...</div>}>
            <SchoolInfra1 filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white p-3 shadow rounded-lg border border-gray-200 min-h-[210px]">
          <Suspense fallback={<div className="loading">Loading SchoolInfra2...</div>}>
            <SchoolInfra2 filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white p-3 shadow rounded-lg border border-gray-200 min-h-[210px]">
          <Suspense fallback={<div className="loading">Loading SchoolInfra3...</div>}>
            <SchoolInfra3 filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white p-3 shadow rounded-lg border border-gray-200 min-h-[210px]">
          <Suspense fallback={<div className="loading">Loading SchoolInfra4...</div>}>
            <SchoolInfra4 filters={filters} />
          </Suspense>
        </div>
      </div>
    </div>
  );
});

EducationLayout.displayName = 'EducationLayout';

export default EducationLayout;
