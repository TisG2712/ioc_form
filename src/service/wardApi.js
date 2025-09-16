const API_KEY = 'ndXs8opgf4onAzspo3kV3YFM3SgyHKp9';
const WARDS_BASE_URL = 'https://maps.ots.vn/api/admin-unit/wards';
const PROVINCES_BASE_URL = 'https://maps.ots.vn/api/admin-unit/provinces';

/**
 * Lấy thông tin và geometry của các phường/xã theo mã
 * @param {string|string[]} wardCodes - Mã phường/xã hoặc mảng các mã
 * @param {boolean} includeGeom - Có bao gồm dữ liệu geometry không (mặc định: true)
 * @returns {Promise<Object>} Dữ liệu trả về từ API với geom_level = 'ward'
 */
export const getWardBoundary = async (wardCodes, includeGeom = true) => {
  try {
    // Chuyển đổi wardCodes thành string nếu là array
    const codesParam = Array.isArray(wardCodes) ? wardCodes.join(',') : wardCodes;
    
    const params = new URLSearchParams({
      apikey: API_KEY,
      include_geom: includeGeom.toString(),
      codes: codesParam,
      geom_level: 'ward'
    });

    const response = await fetch(`${WARDS_BASE_URL}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'app-version': '1.1',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Thêm geom_level = 'ward' cho tất cả items
    if (data.data && Array.isArray(data.data)) {
      data.data = data.data.map(item => ({
        ...item,
        geom_level: 'ward'
      }));
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching ward boundary:', error);
    throw error;
  }
};

/**
 * Lấy thông tin phường/xã theo tọa độ (reverse geocoding)
 * @param {number} latitude - Vĩ độ
 * @param {number} longitude - Kinh độ
 * @param {boolean} includeGeom - Có bao gồm dữ liệu geometry không
 * @returns {Promise<Object>} Dữ liệu trả về từ API với geom_level = 'ward'
 */
export const getWardByCoordinates = async (latitude, longitude, includeGeom = true) => {
  try {
    const params = new URLSearchParams({
      apikey: API_KEY,
      include_geom: includeGeom.toString(),
      lat: latitude.toString(),
      lng: longitude.toString(),
      geom_level: 'ward'
    });

    const response = await fetch(`${WARDS_BASE_URL}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'app-version': '1.1',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Thêm geom_level = 'ward' cho tất cả items
    if (data.data && Array.isArray(data.data)) {
      data.data = data.data.map(item => ({
        ...item,
        geom_level: 'ward'
      }));
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching ward by coordinates:', error);
    throw error;
  }
};

/**
 * Lấy thông tin và geometry của tỉnh/thành phố theo mã
 * @param {string} provinceCode - Mã tỉnh/thành phố
 * @param {boolean} includeGeom - Có bao gồm dữ liệu geometry không (mặc định: true)
 * @returns {Promise<Object>} Dữ liệu trả về từ API với geom_level = 'province'
 */
// export const getProvinceBoundary = async (provinceCode, includeGeom = true) => {
//   try {
//     const params = new URLSearchParams({
//       apikey: API_KEY,
//       include_geom: includeGeom.toString(),
//       codes: provinceCode,
//       geom_level: 'province'
//     });

//     const response = await fetch(`${PROVINCES_BASE_URL}?${params}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'app-version': '1.1',
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
    
//     // Thêm geom_level = 'province' cho tất cả items
//     if (data.data && Array.isArray(data.data)) {
//       data.data = data.data.map(item => ({
//         ...item,
//         geom_level: 'province'
//       }));
//     }
    
//     return data;
//   } catch (error) {
//     console.error('Error fetching province boundary:', error);
//     throw error;
//   }
// };

/**
 * Lấy danh sách tất cả phường/xã trong một tỉnh/thành phố
 * @param {string} provinceCode - Mã tỉnh/thành phố
 * @param {boolean} includeGeom - Có bao gồm dữ liệu geometry không
 * @returns {Promise<Object>} Dữ liệu trả về từ API với geom_level = 'ward'
 */
export const getWardsByProvince = async (provinceCode, includeGeom = true) => {
  try {
    const params = new URLSearchParams({
      apikey: API_KEY,
      include_geom: includeGeom.toString(),
      prov_code: provinceCode,
      geom_level: 'ward'
    });

    const response = await fetch(`${WARDS_BASE_URL}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'app-version': '1.1',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Thêm geom_level = 'ward' cho tất cả items
    if (data.data && Array.isArray(data.data)) {
      data.data = data.data.map(item => ({
        ...item,
        geom_level: 'ward'
      }));
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching wards by province:', error);
    throw error;
  }
};

/**
 * Lấy danh sách tất cả phường/xã với pagination (không có geometry)
 * @param {number} page - Trang hiện tại (bắt đầu từ 1)
 * @param {number} size - Số lượng bản ghi mỗi trang (tối đa 50)
 * @returns {Promise<Object>} Dữ liệu trả về từ API
 */
export const getAllWards = async (page = 1, size = 50) => {
  try {
    // Đảm bảo size không vượt quá 50
    const validSize = Math.min(size, 50);
    
    const params = new URLSearchParams({
      apikey: API_KEY,
      include_geom: 'true', // Lấy geometry để tính tọa độ trung tâm
      prov_code: '75', // Mã tỉnh TP.HCM
      page: page.toString(),
      size: validSize.toString(),
      geom_level: 'ward'
    });

    const response = await fetch(`${WARDS_BASE_URL}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'app-version': '1.1',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Thêm geom_level = 'ward' cho tất cả items
    if (data.data && Array.isArray(data.data)) {
      data.data = data.data.map(item => ({
        ...item,
        geom_level: 'ward'
      }));
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching all wards:', error);
    throw error;
  }
};

/**
 * Tìm kiếm phường/xã theo tên
 * @param {string} wardName - Tên phường/xã cần tìm
 * @param {boolean} includeGeom - Có bao gồm dữ liệu geometry không
 * @returns {Promise<Object>} Dữ liệu trả về từ API với geom_level = 'ward'
 */
export const searchWardsByName = async (wardName, includeGeom = true) => {
  try {
    const params = new URLSearchParams({
      apikey: API_KEY,
      include_geom: includeGeom.toString(),
      name: wardName
    });

    const response = await fetch(`${WARDS_BASE_URL}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'app-version': '1.1',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Thêm geom_level = 'ward' cho tất cả items
    if (data.data && Array.isArray(data.data)) {
      data.data = data.data.map(item => ({
        ...item,
        geom_level: 'ward'
      }));
    }
    
    return data;
  } catch (error) {
    console.error('Error searching wards by name:', error);
    throw error;
  }
};

export default {
  getWardBoundary,
  getWardByCoordinates,
  // getProvinceBoundary,
  getWardsByProvince,
  getAllWards,
  searchWardsByName
};
