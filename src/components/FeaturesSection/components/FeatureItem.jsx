import React from "react";

const FeatureItem = ({ icon, description }) => (
  <div className="flex flex-col gap-1 justify-center items-center max-w-[305px]">
    {icon && <img src={icon} alt="Feature Icon" className="w-8 h-8" />}
    <p className="text-base font-normal text-introPrimary jost text-center mt-3">
      {description}
    </p>
  </div>
);

export default FeatureItem;
