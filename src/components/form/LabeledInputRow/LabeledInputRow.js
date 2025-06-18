import React from "react";

const LabeledInputRow = React.forwardRef(
  (
    {
      label,
      name,
      value,
      onChange,
      placeholder = "",
      type = "text",
      disabled = false,
      error,
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-1 w-full">
        <div className="flex items-center justify-between bg-[#F4F4F5] rounded-md px-4 py-3">
          <label
            htmlFor={name}
            className="text-base text-[#7C8BA0] whitespace-nowrap mr-2"
          >
            {label}
          </label>
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            ref={ref}
            className={`
              bg-transparent poppins text-[#667085] text-base border-none outline-none focus:ring-0 p-0 h-auto w-full 
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-500 ml-2">{error.message}</p>}
      </div>
    );
  }
);

LabeledInputRow.displayName = "LabeledInputRow";

export default LabeledInputRow;
