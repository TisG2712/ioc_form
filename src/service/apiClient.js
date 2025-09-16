import axios from 'axios';
import { isTokenExpired, isTokenExpiringSoon } from '../utils/tokenUtils';

const BASE_URL = 'http://localhost:8082';
const TIMEOUT = 30000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

console.log('API Base URL:', BASE_URL);

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const retryRequest = async (config, retryCount = 0) => {
  try {
    return await axios(config);
  } catch (error) {
    if (retryCount < MAX_RETRIES && shouldRetry(error)) {
      const delayTime = RETRY_DELAY * Math.pow(2, retryCount);
      console.log(`Retry attempt ${retryCount + 1} after ${delayTime}ms`);
    await delay(delayTime);
    return retryRequest(config, retryCount + 1);
  }
  throw error;
}
};

const shouldRetry = (error) => {
  return (
    !error.response ||
    error.response.status >= 500 ||
    error.code === 'ECONNABORTED' ||
    error.code === 'ERR_NETWORK'
  );
};

const api = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const publicApi = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (token) {
      // Check if token is expired before sending request
      if (isTokenExpired(token)) {
        console.warn('Token is expired, attempting proactive refresh...');
        
        // Proactive refresh token if available
        if (refreshToken) {
          try {
            const refreshResponse = await publicApi.post('/api/auth/refresh-token', {
              refreshToken: refreshToken
            });
            
            const newToken = refreshResponse.data?.body?.token || refreshResponse.data?.token;
            const newRefreshToken = refreshResponse.data?.body?.refreshToken || refreshResponse.data?.refreshToken;
            
            if (newToken) {
              localStorage.setItem('token', newToken);
              if (newRefreshToken) {
                localStorage.setItem('refreshToken', newRefreshToken);
              }
              console.log('Token refreshed proactively');
              config.headers.Authorization = `Bearer ${newToken}`;
            } else {
              config.headers.Authorization = `Bearer ${token}`;
            }
          } catch (refreshError) {
            console.warn('Proactive refresh failed:', refreshError);
            config.headers.Authorization = `Bearer ${token}`;
          }
        } else {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } else if (isTokenExpiringSoon(token, 2)) {
        console.warn('Token expires soon, consider refreshing proactively');
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    config.params = {
      ...config.params,
      _t: Date.now()
    };

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

publicApi.interceptors.request.use(
  (config) => {
    config.params = {
      ...config.params,
      _t: Date.now()
    };

    return config;
  },
  (error) => {
    console.error('Public API request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest._retry && shouldRetry(error)) {
      originalRequest._retry = true;
      return retryRequest(originalRequest);
    }

    // Handle 401 Unauthorized - try to refresh token (fallback for proactive refresh)
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          originalRequest._retry = true;
          
          // Try to refresh token
          const refreshResponse = await publicApi.post('/api/auth/refresh-token', {
            refreshToken: refreshToken
          });
          
          const newToken = refreshResponse.data?.body?.token || refreshResponse.data?.token;
          const newRefreshToken = refreshResponse.data?.body?.refreshToken || refreshResponse.data?.refreshToken;
          
          if (newToken) {
            console.log('Token refreshed in response interceptor');
            
            // Update tokens
            localStorage.setItem('token', newToken);
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }
            
            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.warn('Token refresh failed in response interceptor:', refreshError);
          // If refresh fails, force logout
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('isLoggedIn');
          sessionStorage.removeItem('isLoggedIn');
          sessionStorage.removeItem('username');
          
          // Force redirect to login with current path as state
          const currentPath = window.location.pathname;
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, force logout
        console.warn('No refresh token available, forcing logout');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('username');
        
        // Force redirect to login with current path as state
        const currentPath = window.location.pathname;
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }

    if (error.response?.status === 403) {
      console.warn('Permission error (403), user không có quyền');
    }

    console.error('API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
      message: error.message
    });

    return Promise.reject(error);
  }
);

publicApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('Public API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
      message: error.message
    });

    return Promise.reject(error);
  }
);

export const apiRequest = async (config) => {
  try {
    return await api(config);
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Dữ liệu không tìm thấy');
    } else if (error.response?.status === 500) {
      throw new Error('Lỗi server, vui lòng thử lại sau');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Kết nối bị timeout, vui lòng kiểm tra mạng');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Không thể kết nối đến server, vui lòng kiểm tra mạng');
    }

    throw error;
  }
};

export default api;