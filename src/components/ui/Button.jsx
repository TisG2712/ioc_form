import React, { memo } from "react";

const Button = memo(
  ({
    children,
    onClick,
    type = "button",
    disabled = false,
    className = "",
  }) => {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`w-full text-sm mt-3 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        style={{
          fontFamily: "'Roboto Condensed', Arial, sans-serif",
          letterSpacing: "0.5px",
        }}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
