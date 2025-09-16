import { publicApi } from "./apiClient";

// ========== SCHOOL FACILITY APIs ==========

// Lấy tất cả cơ sở vật chất trường học
export const getAllSchoolFacilities = async () => {
  try {
    const response = await publicApi.get('/api/education/facilities/all');
    return response.data.body;
  } catch (error) {
    console.error('Lỗi khi lấy DANH SÁCH cơ sở vật chất:', error);
    throw error;
  }
};

// Lấy cơ sở vật chất theo mã năm học
export const getSchoolFacilityById = async (maNamHoc) => {
  try {
    const response = await publicApi.get(`/api/education/facilities/search/${maNamHoc}`);
    return response.data.body;
  } catch (error) {
    console.error('Lỗi khi lấy cơ sở vật chất theo mã năm học:', error);
    throw error;
  }
};

// Nhập dữ liệu cơ sở vật chất từ file CSV
export const importSchoolFacilitiesCsv = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await publicApi.post('/api/education/facilities/import', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error('Lỗi khi nhập file CSV cơ sở vật chất:', error);
    throw error;
  }
};

// ========== EDUCATION INFO APIs ==========

// Tìm kiếm thông tin giáo dục
export const searchEducationInfo = async (maNamHoc = null, maPhongGd = null, excludePercentage = false) => {
  try {
    const params = new URLSearchParams();
    if (maNamHoc) params.append('maNamHoc', maNamHoc);
    if (maPhongGd) params.append('maPhongGd', maPhongGd);
    params.append('excludePercentage', excludePercentage.toString());
    
    const response = await publicApi.get(`/api/education/info/all?${params.toString()}`);
    return response.data.body;
  } catch (error) {
    console.error('Lỗi khi tìm kiếm thông tin giáo dục:', error);
    throw error;
  }
};

// Lấy thông tin giáo dục cụ thể
export const getEducationInfo = async (maNamHoc, maPhongGd, excludePercentage = false) => {
  try {
    const response = await publicApi.get(`/api/education/info/${maNamHoc}/${maPhongGd}?excludePercentage=${excludePercentage}`);
    return response.data.body;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin giáo dục:', error);
    throw error;
  }
};

// Lấy tổng hợp tất cả tỷ lệ theo năm
export const getEducationYearStatistics = async (maNamHoc) => {
  try {
    const response = await publicApi.get(`/api/education/education-info-year/${maNamHoc}`);
    return response.data.body;
  } catch (error) {
    console.error('Lỗi khi lấy thống kê năm giáo dục:', error);
    throw error;
  }
};

// ========== SCHOOL STATISTICS APIs ==========

// Lấy tất cả thống kê trường học
export const getAllSchoolStatistics = async () => {
  try {
    const response = await publicApi.get('/api/education/school-statistics/all');
    return response.data.body;
  } catch (error) {
    console.error('Lỗi khi lấy tất cả thống kê trường học:', error);
    throw error;
  }
};

// Lấy thống kê trường học theo năm
export const getSchoolStatisticsByYear = async (maNamHoc) => {
  try {
    const response = await publicApi.get(`/api/education/school-statistics/year/${maNamHoc}`);
    return response.data.body;
  } catch (error) {
    console.error('Lỗi khi lấy thống kê trường học theo năm:', error);
    throw error;
  }
};

// Lấy thông tin trường theo năm
export const getSchoolInfoYear = async (maNamHoc) => {
  try {
    const response = await publicApi.get(`/api/education/school-info-year/${maNamHoc}`);
    return response.data.body;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin trường theo năm:', error);
    throw error;
  }
};

