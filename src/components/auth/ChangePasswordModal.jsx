import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { changePassword } from "../../service/login";
import { useAuth } from "../../contexts/AuthContext";

const ChangePasswordModal = ({
  isOpen,
  onClose,
  username: propUsername,
  onSuccess,
}) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { username: contextUsername, logout } = useAuth();

  // Sử dụng username từ props hoặc context
  const username = propUsername || contextUsername;

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = {};
    if (!oldPassword) formErrors.oldPassword = "Vui lòng nhập mật khẩu cũ";
    if (!newPassword) formErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    if (!confirmPassword)
      formErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      formErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    if (newPassword && newPassword.length < 6) {
      formErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    setIsLoading(true);
    try {
      await changePassword({
        username: username,
        oldPassword: oldPassword,
        newPassword: newPassword,
      });

      setNotification({ type: "success", message: "Đổi mật khẩu thành công!" });

      // Clear form
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});

      // Call onSuccess callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
          setNotification(null);
        }, 2000);
      } else {
        // Auto close after success if no callback
        setTimeout(() => {
          onClose();
          setNotification(null);
        }, 2000);
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: error.response?.data?.message || "Không thể đổi mật khẩu",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
    setNotification(null);
    onClose();
  };

  // Early return after all hooks
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]">
      <div className="bg-white p-6 rounded-lg w-[400px] max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Đổi mật khẩu</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="oldPassword"
            label="Mật khẩu cũ"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Nhập mật khẩu cũ"
            error={errors.oldPassword}
            icon="lock"
            disabled={isLoading}
          />

          <Input
            id="newPassword"
            label="Mật khẩu mới"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
            error={errors.newPassword}
            icon="lock"
            disabled={isLoading}
          />

          <Input
            id="confirmPassword"
            label="Xác nhận mật khẩu mới"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
            error={errors.confirmPassword}
            icon="lock"
            disabled={isLoading}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              className="w-auto px-4 py-2 bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500"
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-auto px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 flex items-center gap-2"
            >
              {isLoading && (
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
              {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </Button>
          </div>
        </form>

        {notification && (
          <div
            className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white text-sm transition-opacity duration-500 ${
              fadeOut ? "opacity-0" : "opacity-100"
            } ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {notification.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordModal;
