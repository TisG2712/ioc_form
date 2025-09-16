// Utility functions for token management

/**
 * Check if a JWT token is expired
 * @param {string} token - JWT token to check
 * @returns {boolean} - true if token is expired, false otherwise
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true;
  }
};

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} - Expiration date or null if invalid
 */
export const getTokenExpiration = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return new Date(payload.exp * 1000);
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

/**
 * Check if token will expire soon (within 5 minutes)
 * @param {string} token - JWT token to check
 * @param {number} minutes - Minutes before expiration to consider "soon" (default: 5)
 * @returns {boolean} - true if token expires soon
 */
export const isTokenExpiringSoon = (token, minutes = 5) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    const expirationTime = payload.exp;
    const timeUntilExpiry = expirationTime - currentTime;
    
    return timeUntilExpiry < (minutes * 60);
  } catch (error) {
    console.error('Error parsing token:', error);
    return true;
  }
};

/**
 * Get time until token expires in minutes
 * @param {string} token - JWT token
 * @returns {number} - Minutes until expiration (negative if expired)
 */
export const getMinutesUntilExpiry = (token) => {
  if (!token) return -1;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    const expirationTime = payload.exp;
    const timeUntilExpiry = expirationTime - currentTime;
    
    return Math.floor(timeUntilExpiry / 60);
  } catch (error) {
    console.error('Error parsing token:', error);
    return -1;
  }
};

/**
 * Validate token format and structure
 * @param {string} token - Token to validate
 * @returns {boolean} - true if token format is valid
 */
export const isValidTokenFormat = (token) => {
  if (!token || typeof token !== 'string') return false;
  
  const parts = token.split('.');
  return parts.length === 3;
};

/**
 * Get token payload (decoded)
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded payload or null if invalid
 */
export const getTokenPayload = (token) => {
  if (!isValidTokenFormat(token)) return null;
  
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('Error parsing token payload:', error);
    return null;
  }
};

/**
 * Check if user should be logged out based on token status
 * @param {string} token - JWT token
 * @param {string} refreshToken - Refresh token
 * @returns {boolean} - true if user should be logged out
 */
export const shouldLogout = (token, refreshToken) => {
  // If no token or refresh token, logout
  if (!token || !refreshToken) return true;
  
  // If token is expired and no refresh token, logout
  if (isTokenExpired(token) && !refreshToken) return true;
  
  // If token format is invalid, logout
  if (!isValidTokenFormat(token)) return true;
  
  return false;
};
