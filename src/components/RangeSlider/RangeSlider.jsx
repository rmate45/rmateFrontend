import React from "react";
import sendIcon from "../../assets/send.svg";

export const RangeSlider = ({
  min = 0,
  max = 100,
  value,
  onChange,
  onSubmit,
  step = 1,
  labelFormatter = (v) => `${v}`,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full flex items-start gap-4 pt-8">
      {/* Slider and label */}
      <div className="w-full">
        <div className="relative mb-2 h-5">
          <div className="absolute -top-6 left-[50%] translate-x-[-50%] text-blue font-bold text-sm">
            {labelFormatter(value)}
          </div>
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            step={step}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-3 bg-gray-300 rounded-sm appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #5cc37e ${percentage}%, #ccc ${percentage}%)`,
            }}
          />
        </div>

        {/* Min/Max Labels */}
        <div className="flex justify-between text-sm text-black font-semibold mb-4">
          <span>{labelFormatter(min)}</span>
          <span>{labelFormatter(max)}</span>
        </div>
      </div>
      {/* Send Button */}
      <div className="flex justify-end mt-1">
        <button
          onClick={onSubmit}
          className="flex  w-full items-center gap-2 px-3 py-2 p-0 text-blue border border-primary rounded-xl"
        >
          <img src={sendIcon} alt="send" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
