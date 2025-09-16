import api from './apiClient';

const postPopulation = async (url, payload) => {
  try {
    const response = await api.post(url, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API cho tình hình lao động
export const getTinhHinhLaoDongTheoQuy = async ({ madvhc, quarter, year }) => {
  return postPopulation('/api/populations/tinhhinhlaodong', { madvhc, quarter, year });
};

// API cho tình hình sức khỏe
export const getTinhHinhSucKhoeTheoQuy = async ({ madvhc, quarter, year }) => {
  return postPopulation('/api/populations/tinhhinhsuckhoe', { madvhc, quarter, year });
};

// API cho tình hình biến động dân cư
export const getTinhHinhBienDongDanCuTheoQuy = async ({ madvhc, quarter, year }) => {
  return postPopulation('/api/populations/tinhhinhbiendongdancu', { madvhc, quarter, year });
};

// API cho tiến độ cấp CCCD
export const getTienDoCapCCCDTheoQuy = async ({ madvhc, quarter, year }) => {
  return postPopulation('/api/populations/tiendocapcccd', { madvhc, quarter, year });
};

// API cho tình hình giáo dục
export const getTinhHinhGiaoDucTheoQuy = async ({ madvhc, quarter, year }) => {
  return postPopulation('/api/populations/tinhhinhgiaoduc', { madvhc, quarter, year });
};

// API phụ trợ
export const getKyDuLieu = async () => {
  try {
    const response = await api.get('/api/populations/kydulieu');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDonViHanhChinh = async () => {
  try {
    const response = await api.get('/api/populations/donvihanhchinh');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API lấy thông tin tổng hợp dân số mới nhất
export const getThongTinTongHopLatest = async () => {
  try {
    const response = await api.get('/api/populations/thongtintonghop-latest');
    return response.data;
  } catch (error) {
    throw error;
  }
};



