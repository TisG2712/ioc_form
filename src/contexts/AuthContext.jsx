import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshToken, setRefreshToken] = useState("");

  useEffect(() => {
    const storedLogin = sessionStorage.getItem("isLoggedIn");
    const storedUser = sessionStorage.getItem("username");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    // Simplified check - chỉ cần có refreshToken và isLoggedIn
    if (storedLogin === "true" && storedRefreshToken) {
      setIsLoggedIn(true);
      setUsername(storedUser || "");
      setRefreshToken(storedRefreshToken);
    } else {
      // Clear all auth data nếu không có dữ liệu hợp lệ
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("username");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("isLoggedIn");

      setIsLoggedIn(false);
      setUsername("");
      setRefreshToken("");
    }

    setIsLoading(false);
  }, []);

  const login = (username, refreshTokenValue = null) => {
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("username", username);
    if (refreshTokenValue) {
      localStorage.setItem("refreshToken", refreshTokenValue);
      setRefreshToken(refreshTokenValue);
    }
    setIsLoggedIn(true);
    setUsername(username);
    setIsLoading(false);
  };

  const logout = async () => {
    // Simplified logout - chỉ cần clear local data
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isLoggedIn");

    setIsLoggedIn(false);
    setUsername("");
    setRefreshToken("");

    // Redirect to login page
    window.location.href = "/login";
  };

  const forceLogout = () => {
    // Force logout without API call (for token expiration)
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isLoggedIn");

    setIsLoggedIn(false);
    setUsername("");
    setRefreshToken("");

    // Silent redirect without notification, preserve current path
    const currentPath = window.location.pathname;
    window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
  };

  const value = {
    isLoggedIn,
    username,
    isLoading,
    refreshToken,
    login,
    logout,
    forceLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
