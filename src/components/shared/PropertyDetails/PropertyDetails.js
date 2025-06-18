"use client";
import React, { useState } from "react";
import PropertyFeature from "../PropertyFeature/PropertyFeature";
import PropertyGallery from "../PropertyGallery/PropertyGallery";
import Image from "next/image";

const PropertyDetails = () => {
  const [mainImage, setMainImage] = useState(0);

  const images = [
    "https://picsum.photos/seed/13/400/300",
    "https://picsum.photos/seed/13/400/300",
    "https://picsum.photos/seed/13/400/300",
    "https://picsum.photos/seed/13/400/300",
    "https://picsum.photos/seed/13/400/300",
    "https://picsum.photos/seed/13/400/300",
  ];

  const features = [
    { icon: "bed", label: "2 Bed" },
    { icon: "bath", label: "1 Bath" },
    { icon: "ruler", label: "850 sq. ft." },
    { icon: "car", label: "1 Parking" },
    { icon: "sparkles", label: "Newly Renovated" },
    { icon: "flame", label: "Stove/Oven" },
    { icon: "pawprint", label: "Pet Friendly" },
    { icon: "utensils", label: "Dishwasher" },
    { icon: "refrigerator", label: "Refrigerator" },
    { icon: "microwave", label: "Microwave" },
    { icon: "droplet", label: "Water Heater" },
    { icon: "waves", label: "Swimming Pool" },
    { icon: "shield", label: "Home Security System" },
  ];

  return (
    <div className="poppins space-y-4">
      <PropertyGallery
        images={images}
        mainImage={mainImage}
        setMainImage={setMainImage}
      />

      <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-black">
              Broadway Heights
            </h1>
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-subheadline">
                PROP-20240321-001
              </div>
              <Image
                src="/copy.svg"
                alt="Copy"
                width={16}
                height={16}
                className="cursor-pointer"
              />
            </div>
          </div>
          <div className="flex items-center mt-1 gap-2 font-normal text-sm text-subheadline">
            <Image
              src="/location-light.svg"
              width={18}
              height={18}
              alt="location"
            />
            <span>456 Broadway, New York</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-3xl md:text-[34px] font-semibold">$700</div>
          <div className="py-[6px] px-3 gap-1 flex items-center rounded-xl bg-white shadow-xs">
            <Image src="/green-tick.svg" width={12} height={12} alt="tick" />
            <div className="text-activegreen text-xs">Rented</div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg text-black font-medium mb-1">Description</h2>
        <p className="text-subheadline text-sm">
          Located at 456 Broadway, New York, Broadway Heights offers a spacious
          2-bedroom, 1-bathroom layout with 850 sq. ft. of modern living space.
          Featuring bright interiors, a sleek kitchen.
        </p>
      </div>

      <div className="">
        <h2 className="text-lg text-black font-medium mb-2">
          Features/Amenities
        </h2>
        <div className="flex gap-4 items-center justify-start flex-wrap">
          {features.map((feature, index) => (
            <PropertyFeature
              key={index}
              icon={feature.icon}
              label={feature.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
