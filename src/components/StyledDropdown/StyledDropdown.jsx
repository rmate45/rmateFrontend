import React from "react";
import ReactDropdown from "react-dropdown";
import { ChevronDown } from "lucide-react";
import "react-dropdown/style.css";

const StyledDropdown = ({ id, label, value, onChange, options }) => {
  const formattedOptions = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption =
    formattedOptions.find((opt) => opt.value === value) || formattedOptions[0];

  return (
    <div className="w-full sm:w-44 flex flex-col gap-1">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-[#2A2420]"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <ReactDropdown
          options={formattedOptions}
          onChange={(opt) => onChange(opt.value)}
          value={selectedOption}
          placeholder="Select"
          className="custom-dropdown"
          controlClassName="custom-dropdown-control"
          placeholderClassName="custom-dropdown-placeholder"
          arrowClassName="hidden"
        />

        {/* Chevron Icon */}
        <ChevronDown
          className="absolute right-3 top-3.5 text-gray-500 pointer-events-none"
          size={18}
        />
      </div>
    </div>
  );
};

export default StyledDropdown;
