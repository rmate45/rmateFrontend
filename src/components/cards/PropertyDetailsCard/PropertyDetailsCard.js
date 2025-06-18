import Image from "next/image";

const PropertyDetailsCard = ({ details, onEdit }) => {
  const labelClass = "text-[#000000] font-medium";
  const valueClass = "text-[#000000] font-normal text-right";

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm poppins">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-medium text-gray-800">Property Details</h2>
        <Image
          onClick={onEdit}
          src="/profile_edit.svg"
          alt="edit"
          width={20}
          height={20}
          className="cursor-pointer"
        />
      </div>

      <hr className="mb-4 border-[#00000040]" />

      <div className="grid grid-cols-2 gap-y-4 text-xs px-4">
        <div className={labelClass}>Aquisition Date</div>
        <div className={valueClass}>{details.acquisitionDate}</div>

        <div className={labelClass}>Property type</div>
        <div className={valueClass}>{details.propertyType}</div>

        <div className={labelClass}>Lot Size</div>
        <div className={valueClass}>{details.lotSize}</div>

        <div className={labelClass}>Ownership Status</div>
        <div className={valueClass}>{details.ownershipStatus}</div>

        <div className={labelClass}>Year Build</div>
        <div className={valueClass}>{details.yearBuild}</div>

        <div className={labelClass}>Bedroom</div>
        <div className={valueClass}>{details.bedroom}</div>

        <div className={labelClass}>Bathroom</div>
        <div className={valueClass}>{details.bathroom}</div>

        <div className={labelClass}>Parking</div>
        <div className={valueClass}>{details.parking}</div>
      </div>
    </div>
  );
};

export default PropertyDetailsCard;
