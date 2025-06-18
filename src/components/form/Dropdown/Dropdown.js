"use client";
import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";

const Dropdown = React.forwardRef(
  (
    {
      options = [],
      value,
      onChange,
      placeholder = "Select...",
      disabled = false,
      error,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
    appearance-none w-full bg-gray-100 text-dark focus:outline-none focus:ring-2 focus:ring-primary 
    placeholder-gray-400 px-4 py-3 rounded-md pr-10
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${
      error
        ? "border-inactivered focus:ring-inactivered"
        : "border border-gray-300"
    }
    ${className}
  `}
          {...props}
        >
          <option value=""> {placeholder || "Select..."}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute top-1/2 right-3 transform -translate-y-1/2 pointer-events-none">
          <Image
            src="/arrow-down.svg"
            className="w-5 h-5"
            width={20}
            height={20}
            alt="dropdown"
          />
        </div>
      </div>
    );
  }
);

Dropdown.displayName = "Dropdown";

Dropdown.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.any })
  ).isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.object,
  className: PropTypes.string,
};

export default Dropdown;
