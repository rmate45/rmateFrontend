"use client";

import React, { useState, forwardRef } from "react";
import PropTypes from "prop-types";
import Image from "next/image";

const LabeledInput = forwardRef(
  (
    {
      label,
      placeholder = "",
      type = "text",
      disabled = false,
      className = "",
      error,
      required = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const actualType = isPassword && !showPassword ? "password" : "text";

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className="text-[#718096] poppins text-base font-normal block mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        {/* Input Wrapper */}
        <div className="relative w-full">
          <input
            ref={ref}
            type={actualType}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full bg-gray text-dark placeholder-gray-400 px-4 py-3 rounded-md
              focus:outline-none focus:ring-2
              ${
                error
                  ? "border-red-500 focus:ring-red-500"
                  : "border border-gray-300 focus:ring-primary"
              }
              ${isPassword ? "pr-10" : ""}
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              ${className}
            `}
            {...props}
          />

          {/* Password Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[15px] cursor-pointer right-0 flex items-center px-3"
              tabIndex={-1}
            >
              <Image
                src={showPassword ? "/eye-linear.svg" : "/eye-slash.svg"}
                alt="toggle visibility"
                width={20}
                height={20}
              />
            </button>
          )}
        </div>

        {/* Error Message */}
        {error?.message && (
          <p className="text-sm text-red-500 mt-1">{error.message}</p>
        )}
      </div>
    );
  }
);

LabeledInput.displayName = "LabeledInput";

LabeledInput.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  error: PropTypes.object,
  required: PropTypes.bool,
};

export default LabeledInput;
