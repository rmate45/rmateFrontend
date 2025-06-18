import React from "react";
import clsx from "clsx";

const InsuranceCard = ({
  policyNumber,
  status = "Active",
  companyName,
  validTill,
  planPrice,
  isActive = true,
}) => {
  return (
    <div className="bg-white rounded-lg p-4 flex flex-col gap-2 shadow-sm poppins text-xs">
      {/* Top Row */}
      <div className="flex justify-between text-xs items-center text-[#000000] font-medium">
        <span>{policyNumber}</span>
        <span className="flex items-center gap-1 text-xs font-medium text-activegreen">
          <span className="w-2 h-2 rounded-full bg-activegreen inline-block"></span>
          {status}
        </span>
      </div>

      <div className="flex gap-4">
        {/* Thumbnail Placeholder */}
        <div className="w-full h-[70px] bg-[#D9D9D9] rounded-md"></div>

        <div className="flex flex-col w-full">
          {/* Insurance Info */}
          <div className="text-[10px] text-subheadline font-medium">
            Insurance Type
          </div>
          <div className="text-sm font-medium text-black">{companyName}</div>

          {/* Bottom Row */}
          <div className="flex justify-between mt-1">
            <div>
              <div className="text-[10px] text-subheadline font-medium">
                Valid till
              </div>
              <div className="text-xs font-medium text-black">{validTill}</div>
            </div>
            <div>
              <div className="text-[10px] text-subheadline font-medium">
                Plan
              </div>
              <div className="text-xs font-medium text-black">${planPrice}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceCard;
