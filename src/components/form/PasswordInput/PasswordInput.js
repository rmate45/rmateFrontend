// components/PasswordInput.jsx
"use client";
import React, { useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";

const PasswordInput = React.forwardRef(
  ({ placeholder = "", disabled = false, className = "", error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full bg-gray text-dark focus:outline-none focus:ring-2 focus:ring-primary 
            placeholder-gray-400 px-4 py-3 rounded-md 
            ${disabled ? "opacity-50 cursor-not-allowed" : ""} 
            ${className}
            pr-10
            ${error ? "border-red-500 focus:ring-red-500 " : "border border-gray-300"}
          `}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute top-[15px] right-0 px-3 flex items-center cursor-pointer"
        >
          <Image
            src={showPassword ? "./eye-linear.svg" : "./eye-slash.svg"}
            alt="eye toggle"
            width={20}
            height={20}
          />
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

PasswordInput.propTypes = {
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  error: PropTypes.object,
};

export default PasswordInput;
