// components/PropertiesHeader.js
import React from "react";

import Image from "next/image";
import clsx from "clsx";
import Button from "@/components/shared/Button/Button";
import SearchInput from "@/components/shared/SearchInput/SearchInput";

const PropertiesHeader = ({
  viewType,
  setViewType,
  onFilterClick,
  showFilter = true,
  showAddButton = true,
  addButtonPlaceholder = "Add New Property",
  onClickAdd
}) => {
  return (
    <div className="flex justify-between items-center flex-wrap gap-4">
      <div className="w-full max-w-[400px]">
        <SearchInput placeholder="Search Properties" onSearch={() => {}} />
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        {showAddButton && (
          <div className="max-w-[300px]">
            <Button
              title={addButtonPlaceholder}
              iconSrc="/plus-white.svg"
              iconAlt="add"
              size="sm"
              onClick={onClickAdd}
            />
          </div>
        )}

        {/* View toggle */}
        <div className="flex items-center border border-[#C1BCBC40] rounded-md overflow-hidden">
          {["grid", "list"].map((type) => (
            <button
              key={type}
              className={clsx(
                "px-2 py-2 w-10 flex justify-center items-center transition-all duration-300",
                viewType === type
                  ? "bg-primary"
                  : "bg-white cursor-pointer hover:bg-gray-100"
              )}
              onClick={() => setViewType(type)}
              aria-label={`${type} view`}
            >
              <Image
                src={`../${type}${viewType === type ? "-active" : ""}.svg`}
                alt={type}
                width={30}
                height={30}
                className="w-5 h-5"
              />
            </button>
          ))}
        </div>

        {/* Filters */}
        {showFilter && (
          <div
            onClick={onFilterClick}
            className="flex items-center gap-1 px-3 py-2 border border-[#C1BCBC40] rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <Image
              src="/filter-search.svg"
              alt="filter"
              width={20}
              height={20}
            />
            <p className="text-subheadline font-medium text-xs">Filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesHeader;
