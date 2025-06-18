"use client";
import React from "react";
import PropTypes from "prop-types";

const RadioGroup = ({ label, options, name, value, onChange, error }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-formlable mb-3">
          {label}
        </label>
      )}
      <div className="flex items-center gap-6">
        {options.map((option) => (
          <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className={`appearance-none w-4 h-4 rounded-full border-2 transition 
                ${value === option.value ? "border-primary bg-primary" : "border-[#2C334559]"} 
                focus:ring-1 focus:ring-primary`}
            />
            <span className="text-base font-light text-formlable">{option.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
  );
};

RadioGroup.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any,
    })
  ).isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.object,
};

export default RadioGroup;
