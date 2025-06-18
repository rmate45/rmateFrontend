"use client";

import { useState } from "react";
import Image from "next/image";
import { PriceRangeSlider } from "./PriceRangeSlider";
import CountSelector from "@/components/form/CountSelector/CountSelector";
import SegmentedToggle from "@/components/shared/SegmentedToggle/SegmentedToggle";
import SelectField from "@/components/form/SelectField/SelectField";
import CustomCheckbox from "@/components/shared/CustomCheckbox/CustomCheckbox";

export default function PropertyFilter({ onClose }) {
  const [propertyType, setPropertyType] = useState("residential");
  const [furnishedType, setFurnishedType] = useState("furnished");
  const [location, setLocation] = useState("Any area");
  const [bathrooms, setBathrooms] = useState(null);
  const [bedrooms, setBedrooms] = useState("Any");
  const [priceRange, setPriceRange] = useState([50, 100000]);
  const [propertySubTypes, setPropertySubTypes] = useState([]);
  const [amenities, setAmenities] = useState([]);

  const handlePropertySubTypeChange = (type) => {
    if (propertySubTypes.includes(type)) {
      setPropertySubTypes(propertySubTypes.filter((item) => item !== type));
    } else {
      setPropertySubTypes([...propertySubTypes, type]);
    }
  };

  const handleAmenityChange = (amenity) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((item) => item !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handlePriceRangeChange = (e) => {
    const value = Number.parseInt(e.target.value);
    setPriceRange([value, priceRange[1]]);
  };

  const resetAll = () => {
    setPropertyType("residential");
    setFurnishedType("furnished");
    setLocation("Any area");
    setBathrooms(null);
    setBedrooms("Any");
    setPriceRange([50, 100]);
    setPropertySubTypes([]);
    setAmenities([]);
  };

  const applyFilters = () => {
    console.log({
      propertyType,
      furnishedType,
      location,
      bathrooms,
      bedrooms,
      priceRange,
      propertySubTypes,
      amenities,
    });
    // Here you would typically call an API or update the parent component
  };

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-xs flex justify-center items-center z-50">
      <div className="bg-white w-full shadow-md max-w-md h-[90vh] rounded-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b  border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Property Filter</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-[#4B4B4B]"
          >
            <Image
              src="/close.svg"
              alt="close"
              width={20}
              height={20}
              className="mr-2 cursor-pointer"
            />
          </button>
        </div>

        {/* Filter Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Location */}
          <div>
            <SelectField
              label="Location"
              value={location}
              onChange={setLocation}
              options={[
                { value: "any", label: "Any area" },
                { value: "downtown", label: "Downtown" },
                { value: "suburbs", label: "Suburbs" },
                { value: "beachfront", label: "Beachfront" },
              ]}
            />
          </div>

          {/* Property Type */}
          <div>
            <SegmentedToggle
              label="Property type"
              value={propertyType}
              onChange={setPropertyType}
              options={[
                { value: "residential", label: "Residential" },
                { value: "commercial", label: "Commercial" },
              ]}
            />

            {propertyType === "residential" && (
              <div className="mt-3 space-y-2">
                <CustomCheckbox
                  id="single-family"
                  label="Single-Family"
                  checked={propertySubTypes.includes("single-family")}
                  onChange={() => handlePropertySubTypeChange("single-family")}
                />
                <CustomCheckbox
                  id="townhouses"
                  label="Townhouses"
                  checked={propertySubTypes.includes("townhouses")}
                  onChange={() => handlePropertySubTypeChange("townhouses")}
                />
                <CustomCheckbox
                  id="multi-family"
                  label="Multi-family"
                  checked={propertySubTypes.includes("multi-family")}
                  onChange={() => handlePropertySubTypeChange("multi-family")}
                />
                <CustomCheckbox
                  id="condo"
                  label="Condo"
                  checked={propertySubTypes.includes("condo")}
                  onChange={() => handlePropertySubTypeChange("condo")}
                />
              </div>
            )}
          </div>

          {/* Furnished Type */}
          <SegmentedToggle
            label="Furnished type"
            value={furnishedType}
            onChange={setFurnishedType}
            options={[
              { value: "furnished", label: "Furnished" },
              { value: "unfurnished", label: "Unfurnished" },
            ]}
          />

          {/* Bathrooms */}
          <CountSelector
            label="Bathrooms"
            value={bathrooms}
            setValue={setBathrooms}
            options={["Any", "1", "2", "3", "4", "5+"]}
          />

          {/* Bedrooms */}
          <CountSelector
            label="Bedrooms"
            value={bedrooms}
            setValue={setBedrooms}
            options={["Any", "1", "2", "3", "4", "5+"]}
          />

          {/* Price Range */}
          <div>
            <PriceRangeSlider
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>

          {/* Amenities */}
          <label className="block text-sm font-medium text-[#98A0B4] mb-2">
            Amenities
          </label>
          <div className="flex  items-center flex-wrap gap-4">
            {[
              "Air conditioning",
              "Assisted living",
              "Disability Access",
              "Controlled access",
              "Cable Ready",
              "Available now",
              "Cottage",
              "Corporate",
              "Elevator",
              "Extra Storage",
              "High speed internet",
              "Garage",
              "Pet allowed",
            ].map((amenity) => {
              const isActive = amenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  onClick={() => handleAmenityChange(amenity)}
                  className={`text-xs px-2 py-2 rounded-xl border cursor-pointer text-center font-medium ${
                    isActive
                      ? "bg-primary text-white border-primary"
                      : "bg-[#F2F4F7] text-[#4B4B4B] border-[#F2F4F7]"
                  }`}
                >
                  {amenity}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex space-x-2">
          <button
            onClick={resetAll}
            className="flex-1 py-2 px-4 border border-purple-300 text-primary cursor-pointer rounded-md hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Reset All
          </button>
          <button
            onClick={applyFilters}
            className="flex-1 py-2 px-4 bg-primary text-white rounded-md cursor-pointer hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Apply Filter(s)
          </button>
        </div>
      </div>
    </div>
  );
}
