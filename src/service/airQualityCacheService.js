import { getAllAQIData } from './airQualityService';

const CACHE_KEY = 'airQualityData';
const CACHE_EXPIRY = 2 * 60 * 60 * 1000; // 2 tiếng

// Lấy dữ liệu AQI từ cache
export const getAQIDataFromCache = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    // Kiểm tra cache có hết hạn không
    if (now - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting AQI data from cache:', error);
    return null;
  }
};

// Lưu dữ liệu AQI vào cache
export const saveAQIDataToCache = (data) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    console.log('AQI data saved to cache');
  } catch (error) {
    console.error('Error saving AQI data to cache:', error);
  }
};

// Kiểm tra có cache AQI không
export const hasAQICache = () => {
  return getAQIDataFromCache() !== null;
};

// Lấy dữ liệu AQI với cache (ưu tiên cache, fallback API)
export const getAQIDataWithCache = async () => {
  try {
    // Kiểm tra cache trước
    const cachedData = getAQIDataFromCache();
    if (cachedData) {
      console.log('Using cached AQI data');
      return cachedData;
    }
    
    // Nếu không có cache, gọi API
    console.log('No cached AQI data, fetching from API...');
    const apiData = await getAllAQIData();
    saveAQIDataToCache(apiData);
    return apiData;
  } catch (error) {
    console.error('Error getting AQI data with cache:', error);
    throw error;
  }
};

// Lấy dữ liệu AQI hybrid (cache + API)
export const getAQIDataHybrid = async () => {
  try {
    // Trả về cache ngay lập tức nếu có
    const cachedData = getAQIDataFromCache();
    if (cachedData) {
      console.log('Returning cached AQI data immediately');
      
      // Gọi API trong background để cập nhật cache
      getAllAQIData()
        .then(apiData => {
          saveAQIDataToCache(apiData);
          console.log('AQI cache updated in background');
        })
        .catch(error => {
          console.error('Error updating AQI cache in background:', error);
        });
      
      return cachedData;
    }
    
    // Nếu không có cache, gọi API
    console.log('No cached AQI data, fetching from API...');
    const apiData = await getAllAQIData();
    saveAQIDataToCache(apiData);
    return apiData;
  } catch (error) {
    console.error('Error getting AQI data hybrid:', error);
    throw error;
  }
};

// Lấy dữ liệu AQI chỉ từ cache
export const getAQIDataCacheOnly = () => {
  return getAQIDataFromCache();
};

// Xóa cache AQI
export const clearAQICache = () => {
  try {
    localStorage.removeItem(CACHE_KEY);
    console.log('AQI cache cleared');
  } catch (error) {
    console.error('Error clearing AQI cache:', error);
  }
};

// Lấy thông tin cache AQI
export const getAQICacheInfo = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    const age = now - timestamp;
    const isExpired = age > CACHE_EXPIRY;
    
    return {
      hasData: true,
      dataCount: data ? data.length : 0,
      age: age,
      isExpired: isExpired,
      expiryTime: CACHE_EXPIRY - age
    };
  } catch (error) {
    console.error('Error getting AQI cache info:', error);
    return null;
  }
};

// Preload dữ liệu AQI
export const preloadAQIData = async () => {
  try {
    console.log('Preloading AQI data...');
    const data = await getAllAQIData();
    saveAQIDataToCache(data);
    console.log('AQI data preloaded successfully');
    return data;
  } catch (error) {
    console.error('Error preloading AQI data:', error);
    throw error;
  }
};
