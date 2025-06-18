import clsx from "clsx";
import React from "react";

const RevenueBox = ({ title, price }) => {
  return (
    <div className="flex-1 min-w-[160px] bg-white py-6 px-4 rounded-[10px] flex flex-col gap-4 poppins text-center max-h-[120px] h-full">
      <h2 className="text-[#737373] text-sm font-bold">{title}</h2>
      <h1 className={clsx(`font-semibold text-2xl`, title == "Total Rent Due" ? "text-[#FF5A65]" : "text-[#3AC887]")}>
        {price}
      </h1>
    </div>
  );
};

export default RevenueBox;
