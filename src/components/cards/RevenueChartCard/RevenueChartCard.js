"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import React from "react";

// Load ApexChart client-side only
const ApexBarChart = dynamic(
  () => import("../../charts/ApexBarChart/ApexBarChart"),
  {
    ssr: false,
  }
);

const RevenueChartCard = ({
  title = "Total Revenue",
  totalRevnue,
  values,
  labels,
}) => {
  return (
    <div className="bg-white text-headline transition-all duration-300 ease-in-out p-5 my-4 flex flex-col gap-0 rounded-2xl w-full shadow">
      <div>
        <p className="flex items-center gap-3 text-sm text-subheadline">
          {title}
          {totalRevnue?.direction == "up" ? (
            <span className="text-[#14CA74] flex items-center text-sm font-normal">
              {totalRevnue?.change}
              <Image
                src="/profit-icon.svg"
                width={10}
                height={10}
                alt="profit"
                className="ml-1"
              />
            </span>
          ) : (
            <span className="text-inactivered flex items-center text-sm font-normal">
              {totalRevnue?.change}
              <Image
                src="/loss-icon.svg"
                width={10}
                height={10}
                alt="loss"
                className="ml-1"
              />
            </span>
          )}
        </p>
        <h1 className="text-4xl font-medium mt-2 text-dark">
          {totalRevnue?.amount}
        </h1>
      </div>

      <div>
        <div className="relative flex flex-col rounded-xl bg-white text-gray-700">
          <ApexBarChart values={values} labels={labels} />
        </div>
      </div>
    </div>
  );
};

export default RevenueChartCard;
