import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login/Login";
import Home from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { CacheProvider } from "./contexts/CacheContext";
import PublicRoute from "./components/auth/PublicRoute";
import Monitor from "./pages/Monitor/Monitor";
import Medical from "./pages/Medical/Medical";
import Education from "./pages/Education/Education";
import Traffic from "./pages/Traffic/Traffic";
import Population from "./pages/Population/Population";
import Toast from "./components/ui/Toast";
function App() {
  return (
    <AuthProvider>
      <CacheProvider>
        <Router>
          <Routes>
          {/* Trang Login: /login */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Các route cần đăng nhập */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/monitor"
            element={
              <ProtectedRoute>
                <Monitor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={<Navigate to="http://localhost:5174/dashboard" replace />}
          />
          <Route
            path="/medical"
            element={
              <ProtectedRoute>
                <Medical />
              </ProtectedRoute>
            }
          />

          <Route
            path="/education"
            element={
              <ProtectedRoute>
                <Education />
              </ProtectedRoute>
            }
          />

          <Route
            path="/traffic"
            element={
              <ProtectedRoute>
                <Traffic />
              </ProtectedRoute>
            }
          />

          <Route
            path="/population"
            element={
              <ProtectedRoute>
                <Population />
              </ProtectedRoute>
            }
          />
          {/* Redirect tất cả route không hợp lệ về login */}
          <Route path="*" element={<Navigate to="/monitor" replace />} />
          </Routes>
        </Router>
      </CacheProvider>
      <Toast />
    </AuthProvider>
  );
}

export default App;
