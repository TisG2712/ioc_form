import React, { useState, memo, Suspense, lazy } from "react";
import MedicalFilters from "../components/ui/MedicalFilters";

// Lazy load các Medical Charts
const TotalTransferCases = lazy(() => import("../pages/Medical/MedicalCharts/SummaryCharts/TotalTransferCases"));
const MedicalVisitsPer100People = lazy(() => import("../pages/Medical/MedicalCharts/SummaryCharts/MedicalVisitsPer100People"));
const TotalReexaminationCases = lazy(() => import("../pages/Medical/MedicalCharts/SummaryCharts/TotalReexaminationCases"));
const TotalTreatmentCases = lazy(() => import("../pages/Medical/MedicalCharts/SummaryCharts/TotalTreatmentCases"));
const TotalInsuranceCases = lazy(() => import("../pages/Medical/MedicalCharts/SummaryCharts/TotalInsuranceCases"));
const TotalNewCases = lazy(() => import("../pages/Medical/MedicalCharts/SummaryCharts/TotalNewCases"));

const TotalInsuranceCost = lazy(() => import("../pages/Medical/MedicalCharts/CostCharts/TotalInsuranceCost"));
const InsurancePaymentRate = lazy(() => import("../pages/Medical/MedicalCharts/CostCharts/InsurancePaymentRate"));
const CostByDiseaseGroup = lazy(() => import("../pages/Medical/MedicalCharts/CostCharts/CostByDiseaseGroup"));

const MedicalFacilityCount = lazy(() => import("../pages/Medical/MedicalCharts/FacilityCharts/MedicalFacilityCount"));
const InpatientCasesByFacility = lazy(() => import("../pages/Medical/MedicalCharts/FacilityCharts/InpatientCasesByFacility"));

const MedicalCasesByDistrict = lazy(() => import("../pages/Medical/MedicalCharts/DistrictCharts/MedicalCasesByDistrict"));

const MedicalLayout = memo(() => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    maPhuong: '' // Mặc định hiển thị tất cả phường
  });
  const [loading, setLoading] = useState(false);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setLoading(true);
    // Simulate loading time for better UX
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <div className="flex flex-col mt-4">
      {/* Filters */}
      <div className="px-4 mb-4">
        <MedicalFilters 
          onFiltersChange={handleFiltersChange} 
          loading={loading}
        />
      </div>

      {/* Row 1 - Summary Charts */}
      <div className="grid grid-cols-4 gap-3 px-4 mb-3">
        <div className="bg-white rounded-lg shadow-md p-4 max-h-[280px]">
          <Suspense fallback={<div className="loading">Loading TotalTransferCases...</div>}>
            <TotalTransferCases filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 max-h-[280px]">
          <Suspense fallback={<div className="loading">Loading MedicalVisitsPer100People...</div>}>
            <MedicalVisitsPer100People filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 max-h-[280px]">
          <Suspense fallback={<div className="loading">Loading TotalReexaminationCases...</div>}>
            <TotalReexaminationCases filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 max-h-[280px]">
          <Suspense fallback={<div className="loading">Loading TotalTreatmentCases...</div>}>
            <TotalTreatmentCases filters={filters} />
          </Suspense>
        </div>
      </div>

      {/* Row 2 - More Summary Charts */}
      <div className="grid grid-cols-4 gap-3 px-4 mb-3">
        <div className="bg-white rounded-lg shadow-md p-4 max-h-[280px]">
          <Suspense fallback={<div className="loading">Loading TotalInsuranceCases...</div>}>
            <TotalInsuranceCases filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 max-h-[280px]">
          <Suspense fallback={<div className="loading">Loading TotalNewCases...</div>}>
            <TotalNewCases filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 max-h-[280px]">
          <Suspense fallback={<div className="loading">Loading TotalInsuranceCost...</div>}>
            <TotalInsuranceCost filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 max-h-[280px]">
          <Suspense fallback={<div className="loading">Loading InsurancePaymentRate...</div>}>
            <InsurancePaymentRate filters={filters} />
          </Suspense>
        </div>
      </div>

      {/* Row 3 - Cost and Facility Charts */}
      <div className="grid grid-cols-4 gap-3 px-4 mb-3">
        <div className="bg-white rounded-lg shadow-md p-4 max-h-[280px]">
          <Suspense fallback={<div className="loading">Loading CostByDiseaseGroup...</div>}>
            <CostByDiseaseGroup filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 max-h-[280px]">
          <Suspense fallback={<div className="loading">Loading MedicalFacilityCount...</div>}>
            <MedicalFacilityCount filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 max-h-[280px]">
          <Suspense fallback={<div className="loading">Loading InpatientCasesByFacility...</div>}>
            <InpatientCasesByFacility filters={filters} />
          </Suspense>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 max-h-[280px]">
          <Suspense fallback={<div className="loading">Loading MedicalCasesByDistrict...</div>}>
            <MedicalCasesByDistrict filters={filters} />
          </Suspense>
        </div>
      </div>
    </div>
  );
});

MedicalLayout.displayName = 'MedicalLayout';

export default MedicalLayout;
