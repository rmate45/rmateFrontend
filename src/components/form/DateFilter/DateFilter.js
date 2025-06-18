import React, { useState, useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const options = [
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
  { label: "Custom", value: "custom" },
];

const DateFilter = ({ date, setDate, onCustomDateChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [customLabel, setCustomLabel] = useState("");
  const [tempRange, setTempRange] = useState(range);

  const calendarRef = useRef();

  const handleOptionClick = (option) => {
    console.log(option.value);
    if (option.value !== "custom") {
      setCustomLabel(""); // Reset custom label
      setRange([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ]);
      setTempRange([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: "selection",
        },
      ]);
      onCustomDateChange({
        startDate: null,
        endDate: null,
      });
      setShowCalendar(false);
    } else {
      setShowCalendar((prev) => !prev);
    }

    setDate(option.value);
  };

  const handleRangeChange = () => {
    setRange(tempRange);
    const start = tempRange[0].startDate;
    const end = tempRange[0].endDate;
    setCustomLabel(
      `${format(start, "dd MMM yyyy")} - ${format(end, "dd MMM yyyy")}`
    );
    setDate("custom");
    onCustomDateChange({
      startDate: format(start, "yyyy-MM-dd"),
      endDate: format(end, "yyyy-MM-dd"),
    });
    setShowCalendar(false);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  return (
    <div className="flex flex-col items-end relative mb-4">
      <div className="flex gap-4">
        {options.map((option) => {
          const isCustomSelected =
            date === "custom" && option.value === "custom";
          const label =
            isCustomSelected && customLabel ? customLabel : option.label;

          return (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className={`px-4 py-2 rounded-full text-sm font-normal transition-colors poppins ${
                date === option.value
                  ? "bg-primary text-white"
                  : "bg-[#F2E6F6] text-subheadline cursor-pointer"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {date === "custom" && showCalendar && (
        <div
          ref={calendarRef}
          className="absolute top-full mt-2 z-100 shadow-lg border rounded-xl bg-white"
        >
          <DateRange
            ranges={tempRange}
            onChange={(ranges) => setTempRange([ranges.selection])}
            moveRangeOnFirstSelection={false}
            rangeColors={["#A934BD"]}
            showDateDisplay={false}
          />
          <div className="p-2 text-right border-t">
            <button
              onClick={handleRangeChange}
              className="px-4 py-1 bg-primary text-white rounded-md text-sm"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
