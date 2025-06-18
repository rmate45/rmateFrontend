// components/PropertiesLayout.js
"use client";
import React, { useState } from "react";
import PropertiesHeader from "./components/PropertiesHeader";
import PropertiesList from "./components/PropertiesList";
import PropertyFilter from "./components/PropertyFilter";
import Pagination from "@/components/tables/DataTable/components/Pagination";

const AMENITIES = [
  "air_conditioning",
  "assisted_living",
  "disability_access",
  "controlled_access",
  "cable_ready",
  "available_now",
  "college",
  "corporate",
  "elevator",
  "extra_storage",
  "high_speed_internet",
  "garage",
  "pet_allowed",
];

const generateDummyProperties = (count = 24) =>
  Array.from({ length: count }, (_, i) => ({
    imageUrl: `https://picsum.photos/seed/${i + 1}/400/300`,
    title: `Property ${i + 1}`,
    price: (500 + (i % 10) * 50).toString(),
    location: `${i + 1} Example Street, City`,
    status: ["Paid", "Vacant", "Rent Due"][i % 3],
    description: `This is a short description for Property ${i + 1}.`,
    features: AMENITIES.slice(i % AMENITIES.length, (i % AMENITIES.length) + 4),
    id: `${i + 1}`,
  }));

const PropertiesLayout = ({
  showFilter,
  onClickProperty,
  showAddButton,
  showTitle = true,
  addButtonPlaceholder,
  onClickAdd,
}) => {
  const [viewType, setViewType] = useState("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const allProperties = generateDummyProperties(24);
  const totalItems = allProperties.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProperties = allProperties.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="bg-white text-headline transition-all duration-300 ease-in-out p-6 my-4 flex flex-col gap-4 rounded-2xl w-full shadow">
      {showTitle && (
        <h1 className="text-black font-medium text-xl">
          Properties ({totalItems})
        </h1>
      )}

      <PropertiesHeader
        viewType={viewType}
        setViewType={setViewType}
        onFilterClick={() => setIsFilterOpen(true)}
        showFilter={showFilter}
        showAddButton={showAddButton}
        addButtonPlaceholder={addButtonPlaceholder}
        onClickAdd={onClickAdd}
      />

      <PropertiesList
        properties={currentProperties}
        viewType={viewType}
        onClickProperty={onClickProperty}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        startIndex={startIndex}
        goToPage={goToPage}
      />

      {isFilterOpen && (
        <PropertyFilter onClose={() => setIsFilterOpen(false)} />
      )}
    </div>
  );
};

export default PropertiesLayout;
