import React from "react";

const CountSelector = ({ label, value, setValue, options }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-[#98A0B4] mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            className={`w-[52px] py-2 rounded-2xl font-medium text-sm border ${
              value === option
                ? "bg-primary text-white border-primary"
                : "bg-[#F2F4F7] text-[#4B4B4B] border-[#F2F4F7]"
            }`}
            onClick={() => setValue(value === option ? null : option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CountSelector;
