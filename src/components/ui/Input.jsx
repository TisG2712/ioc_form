import React, { useState, memo, useCallback, useMemo } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Input = memo(
  ({ id, label, type = "text", value, onChange, placeholder, error, icon }) => {
    const [showPassword, setShowPassword] = useState(false);

    const renderIcon = useCallback(() => {
      if (icon === "user") return <FaUser className="text-gray-400 mr-2" />;
      if (icon === "lock") return <FaLock className="text-gray-400 mr-2" />;
      return null;
    }, [icon]);

    return (
      <div className="mb-4">
        <label
          htmlFor={id}
          className="block mb-3 text-sm font-medium text-gray-700 cursor-pointer"
          style={{
            fontFamily: "'Roboto Condensed', Arial, sans-serif",
            letterSpacing: "0.5px",
          }}
        >
          {label}
        </label>
        <div className="flex items-center text-sm rounded-lg px-3 py-2 focus-within:ring focus-within:ring-red-600">
          {renderIcon()}
          <input
            id={id}
            type={
              type === "password" ? (showPassword ? "text" : "password") : type
            }
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="flex-1 outline-none"
            style={{
              fontFamily: "'Roboto Condensed', Arial, sans-serif",
              letterSpacing: "0.3px",
            }}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={useCallback(
                () => setShowPassword(!showPassword),
                [showPassword]
              )}
              className="ml-2 text-gray-500"
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          )}
        </div>
        {error && (
          <p
            className="text-red-500 text-sm mt-1"
            style={{
              fontFamily: "'Roboto Condensed', Arial, sans-serif",
              letterSpacing: "0.3px",
            }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
