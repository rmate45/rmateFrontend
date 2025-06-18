"use client";
import React, { useRef } from "react";
import PropTypes from "prop-types";

const DateInput = React.forwardRef(
  (
    {
      placeholder = "",
      disabled = false,
      className = "",
      error,
      min,
      max,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef(null);

    return (
      <div
        className="relative w-full"
        onClick={() => {
          if (!disabled && inputRef.current) {
            inputRef.current.showPicker?.(); // Modern way to open the date picker
            inputRef.current.focus(); // Fallback if showPicker isn't supported
          }
        }}
      >
        <input
          ref={(el) => {
            inputRef.current = el;
            if (typeof ref === "function") ref(el);
            else if (ref) ref.current = el;
          }}
          type="date"
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          className={`
            w-full bg-gray text-dark focus:outline-none focus:ring-2 focus:ring-primary 
            placeholder-gray-400 px-4 py-3 rounded-md 
            ${disabled ? "opacity-50 cursor-not-allowed" : ""} 
            ${className}
            ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border border-gray-300"
            }
          `}
          {...props}
        />
        {/* Show error below input */}
        {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
      </div>
    );
  }
);

DateInput.displayName = "DateInput";

DateInput.propTypes = {
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  error: PropTypes.object,
};

export default DateInput;
