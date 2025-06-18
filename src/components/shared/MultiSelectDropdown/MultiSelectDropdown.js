"use client";

import React from "react";

const MultiSelectDropdown = ({
  title = "Select Status",
  options = [],
  selectedOptions = [],
  onToggle,
  onApply,
  onCancel,
}) => {
  return (
    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <div className="p-3 max-h-64 overflow-y-auto">
        {options.map((option) => (
          <div key={option.value} className="flex items-center py-1">
            <input
              type="checkbox"
              id={`status-${option.value}`}
              checked={selectedOptions.includes(option.value)}
              onChange={(e) => onToggle(option.value, e.target.checked)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label
              htmlFor={`status-${option.value}`}
              className="ml-2 text-sm text-gray-700"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-end space-x-2">
        <button
          className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-700"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="px-3 py-1 text-xs font-medium text-primary hover:text-primary-dark"
          onClick={onApply}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default MultiSelectDropdown;
