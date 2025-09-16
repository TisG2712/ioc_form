import { publicApi } from './apiClient';

export const login = async (credentials) => {
  try {
    const response = await publicApi.post('/api/auth/login', credentials); 
    console.log('Login response:', response.data);
    
    const token = response?.data?.body?.token || response?.data?.token;
    const refreshToken = response?.data?.body?.refreshToken || response?.data?.refreshToken;
    
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('isLoggedIn', 'true');
      
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

export const refreshToken = async (refreshTokenValue) => {
  try {
    const response = await publicApi.post('/api/auth/refresh-token', {
      refreshToken: refreshTokenValue
    });
    
    const token = response?.data?.body?.token || response?.data?.token;
    const newRefreshToken = response?.data?.body?.refreshToken || response?.data?.refreshToken;
    
    if (token) {
      localStorage.setItem('token', token);
      
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Refresh token error:', error.response?.data || error.message);
    // Clear tokens on refresh failure
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    throw error;
  }
};

export const forgotPassword = async (payload) => {
  try {
    const response = await publicApi.post('/api/auth/forgot-password', payload);
    return response.data;
  } catch (error) {
    console.error('Forgot password error:', error.response?.data || error.message);
    throw error;
  }
};

export const changePassword = async (payload) => {
  try {
    const response = await publicApi.post('/api/auth/change-password', payload);
    return response.data;
  } catch (error) {
    console.error('Change password error:', error.response?.data || error.message);
    throw error;
  }
};

export const logout = async (refreshTokenValue) => {
  try {
    if (refreshTokenValue) {
      const response = await publicApi.post('/api/auth/logout', {
        refreshToken: refreshTokenValue
      });
      return response.data;
    }
  } catch (error) {
    console.error('Logout error:', error.response?.data || error.message);
    // Even if logout API fails, we should clear local data
  } finally {
    // Always clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
  }
};