import React, { memo, Suspense, lazy } from "react";

// Lazy load các Population Charts
const GenderChart = lazy(() => import("../pages/Population/PopulationCharts/GenderChart"));
const PopulationDensityChart = lazy(() => import("../pages/Population/PopulationCharts/PopulationDensityChart"));
const UrbanRuralChart = lazy(() => import("../pages/Population/PopulationCharts/UrbanRuralChart"));
const AgeGroupChart = lazy(() => import("../pages/Population/PopulationCharts/AgeGroupChart"));
const MinorityRateChart = lazy(() => import("../pages/Population/PopulationCharts/MinorityRateChart"));
const ReligiousRateChart = lazy(() => import("../pages/Population/PopulationCharts/ReligiousRateChart"));
const CCCDRateChart = lazy(() => import("../pages/Population/PopulationCharts/CCCDRateChart"));
const LifeExpectancyChart = lazy(() => import("../pages/Population/PopulationCharts/LifeExpectancyChart"));
const InfantRateChart = lazy(() => import("../pages/Population/PopulationCharts/InfantRateChart"));
const EducationLevelChart = lazy(() => import("../pages/Population/PopulationCharts/EducationLevelChart"));
const HigherEducationRateChart = lazy(() => import("../pages/Population/PopulationCharts/HigherEducationRateChart"));
const UnemploymentBySkillChart = lazy(() => import("../pages/Population/PopulationCharts/UnemploymentBySkillChart"));
const PopulationLayout = memo(({ filters }) => {
  return (
    <div className="flex flex-col space-y-4 p-4">
      {/* Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-3 shadow rounded-lg border border-gray-200 min-h-[210px]">
          <Suspense fallback={<div className="loading">Loading GenderChart...</div>}>
            <GenderChart filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white p-3 shadow rounded-lg border border-gray-200 min-h-[210px]">
          <Suspense fallback={<div className="loading">Loading PopulationDensityChart...</div>}>
            <PopulationDensityChart filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white p-3 shadow rounded-lg border border-gray-200 min-h-[210px]">
          <Suspense fallback={<div className="loading">Loading UrbanRuralChart...</div>}>
            <UrbanRuralChart filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white p-3 shadow rounded-lg border border-gray-200 min-h-[210px]">
          <Suspense fallback={<div className="loading">Loading AgeGroupChart...</div>}>
            <AgeGroupChart filters={filters} />
          </Suspense>
        </div>
      </div>
      
      {/* Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-3 shadow rounded-lg border border-gray-200 min-h-[210px]">
          <Suspense fallback={<div className="loading">Loading MinorityRateChart...</div>}>
            <MinorityRateChart filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white p-3 shadow rounded-lg border border-gray-200 min-h-[210px]">
          <Suspense fallback={<div className="loading">Loading ReligiousRateChart...</div>}>
            <ReligiousRateChart filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white p-3 shadow rounded-lg border border-gray-200 min-h-[210px]">
          <Suspense fallback={<div className="loading">Loading CCCDRateChart...</div>}>
            <CCCDRateChart filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white p-3 shadow rounded-lg border border-gray-200 min-h-[210px]">
          <Suspense fallback={<div className="loading">Loading LifeExpectancyChart...</div>}>
            <LifeExpectancyChart filters={filters} />
          </Suspense>
        </div>
      </div>
      
      {/* Row 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-3 shadow rounded-lg border border-gray-200 min-h-[210px]">
          <Suspense fallback={<div className="loading">Loading InfantRateChart...</div>}>
            <InfantRateChart filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white p-3 shadow rounded-lg border border-gray-200 min-h-[210px]">
          <Suspense fallback={<div className="loading">Loading EducationLevelChart...</div>}>
            <EducationLevelChart filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white p-3 shadow rounded-lg border border-gray-200 min-h-[210px]">
          <Suspense fallback={<div className="loading">Loading HigherEducationRateChart...</div>}>
            <HigherEducationRateChart filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white p-3 shadow rounded-lg border border-gray-200 min-h-[210px]">
          <Suspense fallback={<div className="loading">Loading UnemploymentBySkillChart...</div>}>
            <UnemploymentBySkillChart filters={filters} />
          </Suspense>
        </div>
      </div>
    </div>
  );
});

PopulationLayout.displayName = 'PopulationLayout';

export default PopulationLayout;
