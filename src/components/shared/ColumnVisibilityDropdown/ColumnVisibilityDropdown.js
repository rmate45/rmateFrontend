"use client";

import React from "react";

const ColumnVisibilityDropdown = ({
  columns,
  selectedColumns,
  onChange,
  onApply,
  onCancel,
}) => {
  const handleToggle = (key, checked) => {
    onChange(key, checked);
  };

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-medium">Edit Visible Columns</h3>
      </div>
      <div className="p-3 max-h-64 overflow-y-auto">
        {columns.map((column) => (
          <div key={column.key} className="flex items-center py-1">
            <input
              type="checkbox"
              id={`column-${column.key}`}
              checked={selectedColumns.includes(column.key)}
              onChange={(e) => handleToggle(column.key, e.target.checked)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label
              htmlFor={`column-${column.key}`}
              className="ml-2 text-sm text-gray-700"
            >
              {column.header}
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

export default ColumnVisibilityDropdown;
