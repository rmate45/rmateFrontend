import React from "react";

const SegmentedToggle = ({ label, options, value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-[#98A0B4] mb-2">
        {label}
      </label>
      <div className="inline-flex relative w-full bg-[#F2F4F7] rounded-full p-1">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              className={`px-4 py-2 text-sm font-medium rounded-full w-full z-10 transition-colors duration-100 relative ${
                isSelected
                  ? "bg-primary text-white shadow"
                  : "text-[#98A0B4] cursor-pointer"
              }`}
              style={{
                backgroundColor: isSelected ? undefined : "transparent",
              }}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SegmentedToggle;
