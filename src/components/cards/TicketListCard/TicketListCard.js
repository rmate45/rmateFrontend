import Image from "next/image";
import React from "react";

const TicketListCard = ({
  date,
  name,
  location,
  description,
  avatarUrl,
  imageUrl,
}) => {
  return (
    <div className="flex justify-center items-center">
      <div className="relative w-full">
        {/* Main card */}
        <div className="relative bg-[#A934BD1A] rounded-2xl p-4">
          <div className="flex gap-3 justify-between items-center">
            <div className="flex items-center gap-3 mb-2">
              <Image
                className="rounded-full object-cover w-10 h-10"
                width={40}
                height={40}
                alt="profile"
                src={avatarUrl}
              />
              <div>
                <p className="font-medium text-[#131313]">{name}</p>
                <p className="text-sm font-normal text-headline">{location}</p>
              </div>
            </div>
            <div>
            <p className="text-xs text-headline mb-2">{date}</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <p className="text-headline text-sm flex-1">{description}</p>
            <Image
              src={imageUrl}
              alt="ticket image"
              className="rounded-lg max-h-[54px] object-cover"
              width={54}
              height={54}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketListCard;
