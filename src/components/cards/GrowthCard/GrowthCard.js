"use client";

import dynamic from "next/dynamic";
import React from "react";
import StatusDropdown from "../../shared/StatusDropdown/StatusDropdown";

const ApexLineChart = dynamic(
  () => import("../../charts/ApexLineChart/ApexLineChart"),
  {
    ssr: false,
  }
);

const GrowthCard = ({ values, labels, setFilter, filter }) => {
  const handleStatusChange = (newStatus) => {
    setFilter(newStatus.toLowerCase());
  };

  return (
    <div className="bg-white text-headline transition-all duration-300 ease-in-out p-5 pt-10 flex flex-col gap-4 rounded-2xl w-full shadow">
      <div className="flex items-center justify-between">
        <h1 className="text-black text-lg font-semibold">Asset Growth</h1>
        <StatusDropdown
          value={filter}
          options={["Weekly", "Monthly", "Yearly"]}
          onChange={handleStatusChange}
          className="w-32"
        />
      </div>

      <div>
        <ApexLineChart values={values} labels={labels} />
      </div>
    </div>
  );
};

export default GrowthCard;
