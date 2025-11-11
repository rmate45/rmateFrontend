import { ChevronDown } from "lucide-react";
 
export const FilterDropdown = ({ id, label, value, onChange, options }) => {
  return (
    <div className={`w-full flex items-center ${label && "gap-2"} `}>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-[#2A2420] mb-2"
      >
        {label}
      </label>

      <div className="relative w-full">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            block w-full rounded-xl border border-gray-300 bg-white 
            pl-4 pr-10 py-2.5 text-sm font-medium text-[#2A2420] 
            shadow-sm focus:outline-none focus:ring-1 focus:ring-[#567257] focus:border-[#567257]
            cursor-pointer
            appearance-none
          "
        >
          <option className="text-gray-400" value="">
            Select
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="py-2 px-3 text-sm text-[#2A2420]"
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Chevron */}
        <ChevronDown
          className="absolute right-3 top-3 text-gray-500 pointer-events-none"
          size={18}
        />
      </div>
    </div>
  );
};