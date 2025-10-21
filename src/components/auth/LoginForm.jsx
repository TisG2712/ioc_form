import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Input from "../ui/Input";
import Button from "../ui/Button";
import PreferenceControls from "../ui/PreferenceControls";
import { login, forgotPassword, changePassword } from "../../service/login";
import { useAuth } from "../../contexts/AuthContext";
import ChangePasswordModal from "./ChangePasswordModal";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate(); // Hook để điều hướng trang sau khi đăng nhập thành công
  const [searchParams] = useSearchParams(); // Hook để lấy tham số trên URL (ví dụ: redirect).
  const { login: authLogin } = useAuth();
  const [showForgot, setShowForgot] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [tempUsername, setTempUsername] = useState(""); // lưu tạm username khi đổi mật khẩu

  useEffect(() => {
    if (notification) {
      setFadeOut(false);
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setNotification(null);
          if (notification.type === "success") {
            // Check for redirect parameter, otherwise go to form
            const redirectPath = searchParams.get("redirect") || "/form";
            navigate(redirectPath);
          }
        }, 500);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [notification, navigate, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = {};
    if (!username) formErrors.username = "Vui lòng nhập tên đăng nhập";
    if (!password) formErrors.password = "Vui lòng nhập mật khẩu";

    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    setIsLoginLoading(true);

    // Mock authentication - chỉ cần password = "pass"
    setTimeout(() => {
      if (password === "pass") {
        // Mock token và refresh token
        const mockToken = "mock-jwt-token-" + Date.now();
        const mockRefreshToken = "mock-refresh-token-" + Date.now();

        // Lưu vào localStorage như bình thường
        localStorage.setItem("token", mockToken);
        localStorage.setItem("refreshToken", mockRefreshToken);
        localStorage.setItem("isLoggedIn", "true");

        authLogin(username, mockRefreshToken);
        setNotification({ type: "success", message: "Đăng nhập thành công!" });
      } else {
        setNotification({
          type: "error",
          message: "Mật khẩu không đúng! Vui lòng nhập 'pass' để đăng nhập.",
        });
      }
      setIsLoginLoading(false);
    }, 500); // Simulate loading time
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!emailOrUsername) {
      setNotification({ type: "error", message: "Vui lòng nhập email" });
      return;
    }

    setIsForgotLoading(true);
    try {
      await forgotPassword({ email: emailOrUsername });
      setNotification({
        type: "success",
        message: "Mật khẩu mới đã được gửi qua email",
      });
      setShowForgot(false);
      setEmailOrUsername("");
    } catch (error) {
      setNotification({
        type: "error",
        message: error.response?.data?.message || "Không thể gửi yêu cầu",
      });
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative">
      {/* Top Right Controls */}
      <PreferenceControls />
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-xl w-[380px] h-auto max-w-md"
      >
        {/* Logo Section */}
        <div className="text-center mb-6 mt-3">
          <h1
            className="text-4xl font-black mb-2 bg-gradient-to-r from-yellow-500 via-red-500 to-yellow-600 bg-clip-text text-transparent"
            style={{
              fontFamily: "'Orbitron', 'Arial Black', sans-serif",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              letterSpacing: "5px",
            }}
          >
            GIOC
          </h1>
          <p
            className="text-xs text-gray-600 font-medium leading-tight px-2"
            style={{
              fontFamily: "'Roboto Condensed', Arial, sans-serif",
              letterSpacing: "0.5px",
            }}
          >
            TRUNG TÂM ĐIỀU HÀNH THÔNG MINH IOC
          </p>
        </div>

        <h2
          className="text-2xl font-bold mb-6 text-center text-gray-800"
          style={{
            fontFamily: "'Roboto Condensed', Arial, sans-serif",
            letterSpacing: "1px",
          }}
        >
          Đăng nhập
        </h2>
        <Input
          id="username"
          label="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nhập tên đăng nhập"
          error={errors.username}
          icon="user"
          disabled={isLoginLoading}
        />
        <Input
          id="password"
          label="Mật khẩu"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nhập mật khẩu"
          error={errors.password}
          icon="lock"
          disabled={isLoginLoading}
        />
        <div className="mt-6">
          <Button
            type="submit"
            disabled={isLoginLoading}
            className="flex items-center justify-center gap-2"
          >
            <span className="flex items-center gap-2">
              {isLoginLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              {isLoginLoading && (
                <svg
                  className="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
            </span>
          </Button>
          <div className="mt-3 text-xs text-blue-600 text-right">
            <button
              type="button"
              className="underline disabled:opacity-50"
              onClick={() => setShowForgot(true)}
              disabled={isLoginLoading}
              style={{
                fontFamily: "'Roboto Condensed', Arial, sans-serif",
                letterSpacing: "0.3px",
              }}
            >
              Quên mật khẩu?
            </button>
          </div>
        </div>
      </form>

      {showForgot && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]">
          <form
            className="bg-white p-4 rounded w-[320px] text-sm"
            onSubmit={handleForgot}
          >
            <div
              className="font-semibold mb-2 text-center"
              style={{
                fontFamily: "'Roboto Condensed', Arial, sans-serif",
                letterSpacing: "0.5px",
              }}
            >
              Quên mật khẩu
            </div>
            <Input
              id="emailOrUsername"
              label="Email"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="Nhập email của bạn"
              disabled={isForgotLoading}
            />
            <div className="flex justify-end gap-2 mt-3">
              <Button
                type="button"
                className="w-auto px-3 py-1 bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500"
                onClick={() => setShowForgot(false)}
                disabled={isForgotLoading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="w-auto px-3 py-1 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 flex items-center gap-2"
                disabled={isForgotLoading}
              >
                <span className="flex items-center gap-2">
                  {isForgotLoading ? "Đang gửi..." : "Gửi"}
                  {isForgotLoading && (
                    <svg
                      className="animate-spin h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                </span>
              </Button>
            </div>
          </form>
        </div>
      )}

      {notification && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white text-sm transition-opacity duration-500 ${
            fadeOut ? "opacity-0" : "opacity-100"
          } ${
            notification.type === "success"
              ? "bg-green-500"
              : notification.type === "info"
              ? "bg-blue-500"
              : "bg-red-500"
          }`}
          style={{
            fontFamily: "'Roboto Condensed', Arial, sans-serif",
            letterSpacing: "0.3px",
          }}
        >
          {notification.message}
        </div>
      )}

      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => {
          setShowChangePassword(false);
          setTempUsername("");
        }}
        username={tempUsername}
        onSuccess={() => {
          setShowChangePassword(false);
          setTempUsername("");
          setNotification({
            type: "success",
            message: "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.",
          });
        }}
      />
    </div>
  );
};

export default LoginForm;
