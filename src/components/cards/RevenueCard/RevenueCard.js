import Image from "next/image";
import React from "react";

const RevenueCard = ({
  title,
  value,
  percentage,
  profit = true,
  label,
}) => {
  
  return (
    <div className="bg-white text-headline hover:bg-primary group transition-all duration-300 ease-in-out p-5 flex flex-col gap-5 rounded-2xl poopins w-full cursor-pointer shadow poppins">
      <h2 className="text-base font-medium transition-all group-hover:text-white">
        {title}
      </h2>

      <div>
        <h1 className="text-2xl font-semibold text-subheadline transition-all group-hover:text-white mb-2">
          {value}
        </h1>

        <p className="flex items-center gap-4 text-subheadline transition-all group-hover:text-white">
          {profit == "up" ? (
            <span className="text-[#14CA74] flex items-center text-sm font-normal text-nowrap">
              {percentage} %
              <Image
                src="/profit-icon.svg"
                width={10}
                height={10}
                alt="profit"
                className="ml-1"
              />
            </span>
          ) : (
            <span className="text-inactivered flex items-center text-sm font-normal  text-nowrap">
              {percentage} %
              <Image
                src="/loss-icon.svg"
                width={10}
                height={10}
                alt="loss"
                className="ml-1"
              />
            </span>
          )}
           {label}
        </p>
      </div>
    </div>
  );
};

export default RevenueCard;
