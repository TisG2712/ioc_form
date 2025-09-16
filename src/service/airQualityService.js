import { publicApi } from './apiClient';
import axios from 'axios';

// Tạo axios instance riêng cho air quality API với timeout dài
const airQualityApi = axios.create({
  baseURL: 'http://localhost:8082',
  timeout: 120000, // 2 phút timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Danh sách các thành phố cần lấy dữ liệu AQI
const CITIES = [
  { state: 'Tinh Binh Phuoc', city: 'Chon Thanh' },
  { state: 'Tinh Dong Nai', city: 'Bien Hoa' },
  { state: 'Tinh Dong Nai', city: 'Long Khanh' }
];

// Danh sách tọa độ cần lấy dữ liệu AQI
const COORDINATES = [
  { lat: 11.343990, lon: 106.962538 },
  { lat: 11.485149, lon: 107.235312 },
  { lat: 11.5184431, lon: 106.8021612 }
];

// Lấy dữ liệu AQI từ city qua backend
const getCityAQI = async (city, state) => {
  try {
    const response = await airQualityApi.get('/api/airvisual/city', {
      params: {
        city: city,
        state: state
      }
    });
    
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching AQI for ${city}, ${state}: ${error.message}`);
  }
};

// Lấy dữ liệu AQI từ coordinates qua backend
const getNearestCityAQI = async (lat, lon) => {
  try {
    const response = await airQualityApi.get('/api/airvisual/nearest_city', {
      params: {
        lat: lat,
        lon: lon
      }
    });
    
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching AQI for coordinates ${lat}, ${lon}: ${error.message}`);
  }
};

// Lấy tất cả dữ liệu AQI
export const getAllAQIData = async () => {
  const allData = [];
  
  try {
    // Lấy dữ liệu từ cities
    for (const { city, state } of CITIES) {
      try {
        console.log(`Fetching AQI for ${city}, ${state}...`);
        const data = await getCityAQI(city, state);
        allData.push(data);
        
        // Delay giữa các requests
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error fetching AQI for ${city}, ${state}:`, error);
      }
    }
    
    // Lấy dữ liệu từ coordinates
    for (const { lat, lon } of COORDINATES) {
      try {
        console.log(`Fetching AQI for coordinates ${lat}, ${lon}...`);
        const data = await getNearestCityAQI(lat, lon);
        allData.push(data);
        
        // Delay giữa các requests
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error fetching AQI for coordinates ${lat}, ${lon}:`, error);
      }
    }
    
    console.log(`Successfully fetched ${allData.length} AQI data points`);
    return allData;
  } catch (error) {
    console.error('Error fetching AQI data:', error);
    throw error;
  }
};

// Hàm lấy màu sắc theo chỉ số AQI (tiêu chuẩn US EPA)
export const getAQIColor = (aqius) => {
  if (aqius <= 50) return '#00e400'; // Good - Green
  if (aqius <= 100) return '#ffff00'; // Moderate - Yellow
  if (aqius <= 150) return '#ff7e00'; // Unhealthy for Sensitive - Orange
  if (aqius <= 200) return '#ff0000'; // Unhealthy - Red
  if (aqius <= 300) return '#8f3f97'; // Very Unhealthy - Purple
  return '#7e0023'; // Hazardous - Maroon
};

// Hàm lấy mô tả theo chỉ số AQI
export const getAQIDescription = (aqius) => {
  if (aqius <= 50) return 'Tốt';
  if (aqius <= 100) return 'Trung bình';
  if (aqius <= 150) return 'Không tốt cho nhóm nhạy cảm';
  if (aqius <= 200) return 'Không tốt';
  if (aqius <= 300) return 'Rất không tốt';
  return 'Nguy hiểm';
};

// Hàm lấy mô tả chi tiết theo chỉ số AQI
export const getAQIDetailedDescription = (aqius) => {
  if (aqius <= 50) return 'Chất lượng không khí tốt, không có rủi ro sức khỏe';
  if (aqius <= 100) return 'Chất lượng không khí chấp nhận được, có thể có rủi ro nhỏ cho những người nhạy cảm';
  if (aqius <= 150) return 'Những người nhạy cảm có thể gặp vấn đề sức khỏe';
  if (aqius <= 200) return 'Mọi người có thể bắt đầu gặp vấn đề sức khỏe';
  if (aqius <= 300) return 'Cảnh báo sức khỏe, mọi người có thể gặp vấn đề sức khỏe nghiêm trọng';
  return 'Cảnh báo sức khỏe khẩn cấp, toàn bộ dân số có thể bị ảnh hưởng';
};

// Hàm lấy màu viền theo chỉ số AQI
export const getAQIBorderColor = (aqius) => {
  if (aqius <= 50) return '#00e400';
  if (aqius <= 100) return '#ffff00';
  if (aqius <= 150) return '#ff7e00';
  if (aqius <= 200) return '#ff0000';
  if (aqius <= 300) return '#8f3f97';
  return '#7e0023';
};

// Hàm lấy màu với độ trong suốt
export const getAQIColorWithOpacity = (aqius, opacity = 0.3) => {
  const color = getAQIColor(aqius);
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
