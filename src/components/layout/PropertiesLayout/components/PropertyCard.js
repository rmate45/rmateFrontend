import React from "react";
import Image from "next/image";

const STATUS_COLORS = {
  Vacant: "bg-primary",
  Paid: "bg-activegreen",
  "Rent Due": "bg-inactivered",
};

const PropertyCard = ({
  imageUrl,
  title,
  price,
  location,
  status = "",
  variant = "grid",
  description = "",
  features = [],
}) => {
  const statusColor = STATUS_COLORS[status] || "bg-gray-400";

  return (
    <>
      {variant === "grid" ? (
        <div className="poppins flex flex-col gap-2 mt-3 rounded-sm cursor-pointer p-5 hover:bg-gray-200 transition duration-300 ease-in-out">
          {" "}
          {/* Grid*/}
          <div className="relative">
            <Image
              className="rounded-md max-h-[160px] max-w-full object-cover"
              width={380}
              height={180}
              alt="property"
              src={imageUrl}
            />

            {/* Single Status Badge */}
            {status && (
              <p
                className={`${statusColor} text-white rounded-sm px-5 py-1 text-center font-normal text-xs absolute -top-2.5 left-8`}
              >
                {status}
              </p>
            )}
          </div>
          {/* Title and Price */}
          <div className="flex items-center justify-between">
            <h2 className="text-headline text-xl font-bold">{title}</h2>
            <h1 className="text-black text-2xl font-semibold">${price}</h1>
          </div>
          {/* Location */}
          <div className="flex items-center gap-2">
            <Image
              width={18}
              height={18}
              alt="location"
              src="/location.svg"
            />
            <p className="text-subheadline font-normal text-sm">{location}</p>
          </div>
        </div>
      ) : (
        <div className="poppins flex gap-4 cursor-pointer p-4 hover:bg-gray-200 transition duration-300 ease-in-out">
          {" "}
          {/* List*/}
          <Image
            className="rounded-sm max-h-[210px] max-w-[380px] object-cover w-full"
            width={380}
            height={210}
            alt="property"
            src={imageUrl}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-headline text-xl font-bold flex items-center gap-2">
                {title}
                {status && (
                  <span
                    className={`${statusColor} text-white rounded-sm px-5 py-1 text-center font-normal text-xs`}
                  >
                    {status}
                  </span>
                )}
              </h2>
              <h1 className="text-black text-2xl font-semibold">${price}</h1>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2">
              <Image
                width={18}
                height={18}
                alt="location"
                src="/location.svg"
              />
              <p className="text-subheadline font-normal text-sm">{location}</p>
            </div>
            <div className="flex flex-col gap-2 mt-3">
              <h2 className="text-headline font-semibold text-lg">
                Description
              </h2>
              <p className="text-black font-normal text-sm line-clamp-2">
                {description}
              </p>
            </div>
            {features?.length > 0 && (
              <div className="mt-3">
                <h2 className="text-headline font-semibold text-lg">
                  Features/Amenities
                </h2>
                <div className="flex gap-5 mt-2 flex-wrap">
                  {features.map((feature) => (
                    <div key={feature} className="flex gap-2 items-center">
                      <Image
                        src="/paint.svg"
                        width={18}
                        height={18}
                        className="w-5 h-5 object-cover"
                        alt={feature}
                      />
                      <p className="text-xs text-subheadline font-medium">
                        {feature
                          .split(/_|-/)
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyCard;
