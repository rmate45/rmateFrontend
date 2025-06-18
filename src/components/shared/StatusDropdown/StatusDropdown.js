"use client";
import Image from "next/image";
import { useState } from "react";

const StatusDropdown = ({
  value,
  options,
  onChange,
  containerClassName = "",
  spanClassName = "",
}) => {
  const [open, setOpen] = useState(false);

  const getTextColor = (val) => {
    if (val === "Active") return "#3AC887";
    if (val === "Deactive") return "#FF5A65";
    return "#454545"; // default dark gray
  };

  const combinedSpanClassName = `text-sm font-normal capitalize mr-3 ${spanClassName}`;

  return (
    <div
      className={`flex items-center gap-2 relative text-[12px]  ${containerClassName}`}
    >
      <div
        className="flex items-center cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span
          className={`${combinedSpanClassName}`}
          style={{ color: getTextColor(value) }}
        >
          {value}
        </span>
        <Image
          src="/arrow-down.svg"
          alt="arrow"
          width={20}
          height={20}
          className="mr-2 cursor-pointer"
        />
      </div>

      {open && (
        <div className="absolute top-full right-0 mt-1 w-28 bg-white border border-gray-200 rounded shadow-md z-10">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
              style={{ color: getTextColor(option) }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
