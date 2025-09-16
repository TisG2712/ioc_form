// components/auth/PublicRoute.jsx
import React from "react";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const PublicRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Nếu đã đăng nhập và đang cố vào trang /login thì đẩy sang trang trước đó hoặc /monitor
  if (isLoggedIn && location.pathname === "/login") {
    // Check for redirect parameter first, then state, then default to /monitor
    const redirectPath = searchParams.get('redirect') || location.state?.from?.pathname || "/monitor";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default PublicRoute;
