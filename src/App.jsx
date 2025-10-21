import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import PublicRoute from "./components/auth/PublicRoute";
import Form from "./pages/FormManagement/Form";
import Toast from "./components/ui/Toast";
function App() {
  return (
    <div className="h-screen overflow-hidden">
      <AuthProvider>
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
              path="/form"
              element={
                <ProtectedRoute>
                  <Form />
                </ProtectedRoute>
              }
            />

            {/* Redirect tất cả route không hợp lệ về login */}
            <Route path="*" element={<Navigate to="/form" replace />} />
          </Routes>
        </Router>
        <Toast />
      </AuthProvider>
    </div>
  );
}

export default App;
