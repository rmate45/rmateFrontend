// components/PropertiesList.js
import React from "react";
import clsx from "clsx";
import PropertyCard from "./PropertyCard";

const PropertiesList = ({ properties, viewType, onClickProperty}) => {

  return (
    <div
      className={clsx(
        viewType === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 max-h-[670px] overflow-y-auto"
          : "flex flex-col max-h-[670px] overflow-y-auto"
      )}
    >
      {properties.map((property, index) => (
        <div
          key={index}
          className={clsx(viewType === "list" ? "w-full" : "max-w-[380px]")}
          onClick={() => onClickProperty(property.id)}
        >
          <PropertyCard {...property} variant={viewType} />
        </div>
      ))}
    </div>
  );
};

export default PropertiesList;
