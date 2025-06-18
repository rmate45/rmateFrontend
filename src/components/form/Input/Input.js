// components/Input.jsx
"use client";
import React from "react";
import PropTypes from "prop-types";

const Input = React.forwardRef(
  ({ placeholder = "", type = "text", disabled = false, className = "", error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full bg-gray text-dark focus:outline-none focus:ring-2 focus:ring-primary 
            placeholder-gray-400 px-4 py-3 rounded-md 
            ${disabled ? "opacity-50 cursor-not-allowed" : ""} 
            ${className}
            ${error ? "border-red-500 focus:ring-red-500 " : "border border-gray-300"}
          `}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

Input.propTypes = {
  placeholder: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  error: PropTypes.object,
};

export default Input;
