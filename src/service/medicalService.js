import api from './apiClient';

const getMedical = async (url, params = {}) => {
  try {
    console.log(`Medical API call: ${url}`, params);
    const response = await api.get(url, { params });
    console.log(`Medical API response: ${url}`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Medical API error: ${url}`, error);
    throw error;
  }
};

// Tổng hợp dữ liệu y tế
export const getTongHop = async (params = {}) => {
  const apiParams = {
    startDate: params.startDate,
    endDate: params.endDate
  };
  
  // Chỉ thêm maPhuong nếu có giá trị
  if (params.maPhuong && params.maPhuong !== '') {
    apiParams.maPhuong = params.maPhuong;
  }
  
  console.log('🔧 getTongHop API params:', apiParams);
  return getMedical('/api/med/tongHop', apiParams);
};

// Chi phí theo nhóm bệnh
export const getChiPhiNhomBenh = async (params = {}) => {
  const apiParams = {
    startDate: params.startDate,
    endDate: params.endDate,
    maPhuong: params.maPhuong,
    maNhomBenh: params.maNhomBenh
  };
  
  // Nếu chọn "Tất cả phường" thì không gửi maPhuong và tăng size
  if (params.maPhuong === '') {
    delete apiParams.maPhuong;
    apiParams.page = 0;
    apiParams.size = 100; // Tăng size để lấy nhiều dữ liệu hơn
  } else {
    apiParams.page = params.page || 0;
    apiParams.size = params.size || 10;
  }
  
  return getMedical('/api/med/chiPhiNhomBenh', apiParams);
};

// Chi phí tổng hợp
export const getChiPhiTongHop = async (params = {}) => {
  const apiParams = {
    startDate: params.startDate,
    endDate: params.endDate,
    maPhuong: params.maPhuong
  };
  
  // Nếu chọn "Tất cả phường" thì không gửi maPhuong và tăng size
  if (params.maPhuong === '') {
    delete apiParams.maPhuong;
    apiParams.page = 0;
    apiParams.size = 100; // Tăng size để lấy nhiều dữ liệu hơn
  } else {
    apiParams.page = params.page || 0;
    apiParams.size = params.size || 10;
  }
  
  return getMedical('/api/med/chiPhiTongHop', apiParams);
};

// Cơ sở khám chữa bệnh
export const getCSKB = async (params = {}) => {
  const apiParams = {
    startDate: params.startDate,
    endDate: params.endDate,
    maPhuong: params.maPhuong
  };
  
  // Nếu chọn "Tất cả phường" thì không gửi maPhuong và tăng size
  if (params.maPhuong === '') {
    delete apiParams.maPhuong;
    apiParams.page = 0;
    apiParams.size = 100; // Tăng size để lấy nhiều dữ liệu hơn
  } else {
    apiParams.page = params.page || 0;
    apiParams.size = params.size || 10;
  }
  
  return getMedical('/api/med/cskb', apiParams);
};

// Khám chữa bệnh huyện
export const getKcbHuyen = async (params = {}) => {
  const apiParams = {
    startDate: params.startDate,
    endDate: params.endDate,
    maPhuong: params.maPhuong
  };
  
  // Nếu chọn "Tất cả phường" thì không gửi maPhuong và tăng size
  if (params.maPhuong === '') {
    delete apiParams.maPhuong;
    apiParams.page = 0;
    apiParams.size = 100; // Tăng size để lấy nhiều dữ liệu hơn
  } else {
    apiParams.page = params.page || 0;
    apiParams.size = params.size || 10;
  }
  
  return getMedical('/api/med/kcbHuyen', apiParams);
};

// Lấy danh sách phường từ API kcbHuyen
export const getWardsFromKcbHuyen = async (params = {}) => {
  try {
    const apiParams = {
      startDate: params.startDate,
      endDate: params.endDate,
      page: 0,
      size: 1000 // Lấy tất cả dữ liệu để có đầy đủ phường
    };
    
    const response = await getMedical('/api/med/kcbHuyen', apiParams);
    
    // Trích xuất danh sách phường duy nhất từ response
    const wards = [];
    const wardMap = new Map();
    
    if (response.body && response.body.content) {
      response.body.content.forEach(item => {
        if (item.maPhuong && item.tenPhuong && !wardMap.has(item.maPhuong)) {
          wardMap.set(item.maPhuong, item.tenPhuong);
          wards.push({
            value: item.maPhuong,
            label: item.tenPhuong
          });
        }
      });
    }
    
    // Sắp xếp theo tên phường
    wards.sort((a, b) => a.label.localeCompare(b.label, 'vi'));
    
    // Thêm option "Tất cả phường" ở đầu
    wards.unshift({ value: '', label: 'Tất cả phường' });
    
    return wards;
  } catch (error) {
    console.error('Error fetching wards from kcbHuyen API:', error);
    // Trả về danh sách phường mặc định nếu có lỗi
    return [
      { value: '', label: 'Tất cả phường' },
      { value: '26095', label: 'Phường Suối Tre' },
      { value: '26452', label: 'Xã Suối Cát' }
    ];
  }
};