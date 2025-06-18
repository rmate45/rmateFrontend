"use client";

import React, { useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";

const UnderlineInput = React.forwardRef(
  (
    {
      placeholder = "",
      type = "text",
      disabled = false,
      className = "",
      error,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const actualType = isPassword && !showPassword ? "password" : "text";

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type={actualType}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full bg-transparent border-0 border-b outline-none transition-all duration-200
            placeholder-gray-400 text-base py-2 text-center
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${isPassword ? "pr-10" : ""}
            ${
              error
                ? "border-b-red-500"
                : "border-b-gray-400 focus:border-b-primary"
            }
            ${className}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 px-2"
          >
            <Image
              src={showPassword ? "/eye-linear.svg" : "/eye-slash.svg"}
              alt="Toggle visibility"
              width={20}
              height={20}
            />
          </button>
        )}
        {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
      </div>
    );
  }
);

UnderlineInput.displayName = "UnderlineInput";

UnderlineInput.propTypes = {
  placeholder: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  error: PropTypes.object,
};

export default UnderlineInput;
