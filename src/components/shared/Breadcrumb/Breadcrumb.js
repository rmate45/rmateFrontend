import React from "react";
import Image from "next/image";

const BreadcrumbItem = ({ label, isLast = false, icon, onClick }) => {
  const itemClasses = isLast
    ? "font-semibold text-base"
    : "font-normal text-base text-gray-700 hover:text-blue-600 cursor-pointer";

  return (
    <div className="flex items-center">
      <div
        className={`flex items-center ${
          onClick && !isLast ? "cursor-pointer" : ""
        }`}
        onClick={!isLast && onClick ? onClick : undefined}
      >
        {icon && <span className="mr-1">{icon}</span>}
        <span className={itemClasses}>{label}</span>
      </div>
      {!isLast && (
        <Image
          width={16}
          height={16}
          alt="right"
          src="/right-point.svg"
          className="mx-3"
        />
      )}
    </div>
  );
};

const Breadcrumb = ({ items = [], onNavigateBack, showBackButton = true }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex items-center py-3">
      {showBackButton && (
        <button
          onClick={onNavigateBack}
          className="mr-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          <Image width={24} height={24} alt="back" src="/arrow-back.svg" />
        </button>
      )}

      <div className="flex flex-wrap items-center">
        {items.map((item, index) => (
          <BreadcrumbItem
            key={`breadcrumb-${index}`}
            label={item.label}
            icon={item.icon}
            onClick={item.onClick}
            isLast={index === items.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default Breadcrumb;
