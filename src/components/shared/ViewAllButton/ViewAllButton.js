import Image from "next/image";
import React from "react";

const ViewAllButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="font-normal text-sm text-primary cursor-pointer flex items-center gap-1"
      aria-label="View all tickets"
    >
      view all
      <Image width={20} height={20} alt="next arrow" src="/next-purple.svg" />
    </button>
  );
};

export default ViewAllButton;
