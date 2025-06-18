import Image from "next/image";
import React from "react";

const TicketCard = ({
  date,
  name,
  location,
  description,
  avatarUrl,
  imageUrl,
}) => {
  return (
    <div className="flex justify-center items-center">
      <div className="relative w-[400px] poppins">
        {/* Main card */}
        <div className="relative bg-[#E9C9EF] rounded-xl shadow-lg p-5 z-40">
          <p className="text-sm text-subheadline mb-2">{date}</p>
          <div className="flex items-center gap-3 mb-2">
            <Image
              className="rounded-full object-cover w-10 h-10"
              width={40}
              height={40}
              alt="profile"
              src={avatarUrl}
            />
            <div>
              <p className="font-semibold text-headline">{name}</p>
              <p className="text-sm text-subheadline">{location}</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <p className="text-subheadline text-sm flex-1">{description}</p>
            <Image
              src={imageUrl}
              alt="ticket image"
              className="rounded-lg max-h-[60px] object-cover"
              width={60}
              height={60}
            />
          </div>
        </div>

        {/* Foreground mimic cards (above) */}
        <div className="absolute top-0 left-0 w-full h-full rounded-xl bg-[#E9C9EFBF] shadow-md scale-[0.95] -translate-y-4 z-10 pointer-events-none"></div>
        <div className="absolute -top-6 left-0 w-full h-full rounded-xl bg-[#E9C9EF80] shadow-md scale-[0.9] -translate-y-2 z-20 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default TicketCard;
