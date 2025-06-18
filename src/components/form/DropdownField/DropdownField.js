import React from "react";
import { Controller } from "react-hook-form";

const DropdownField = ({
  name,
  control,
  label,
  options,
  placeholder = "Select...",
  error,
  onChange: externalOnChange, // <-- receive optional onChange prop
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm text-formlable font-normal">
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            {...field}
            className="form-select w-full border rounded p-2 max-h-[350px]"
            onChange={(e) => {
              field.onChange(e); // notify react-hook-form
              if (externalOnChange) externalOnChange(e); // notify external handler if passed
            }}
          >
            <option value="">{placeholder}</option>
            {options.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        )}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
    </div>
  );
};

export default DropdownField;
