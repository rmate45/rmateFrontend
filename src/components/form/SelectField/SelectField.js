import Image from "next/image";
import React from "react";

const SelectField = ({ label, value, onChange, options = [] }) => {
  return (
    <div>
      <label  className="block text-sm font-medium text-[#98A0B4] mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          className="w-full p-2.5 text-[#4B4B4B] bg-white border border-[#F2F4F7] rounded-md appearance-none focus:outline-none focus:ring-primary focus:border-primary"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <Image
            src="/arrow-down.svg" // use a leading slash to reference from public/
            alt="arrow"
            width={20}
            height={20}
            className="mr-2"
          />
        </div>
      </div>
    </div>
  );
};

export default SelectField;
