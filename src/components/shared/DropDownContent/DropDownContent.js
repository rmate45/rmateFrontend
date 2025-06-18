import Image from "next/image";
import React, { useState } from "react";
import clsx from "clsx";

const DropDownContent = ({ children, title = "Title" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full  my-4">
      {/* Header */}
      <div
        className={clsx(
          "bg-white p-6 flex justify-between items-center gap-4 w-full cursor-pointer poppins",
          isOpen ? "rounded-tr-xl rounded-tl-xl" : "rounded-xl"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-[#333333] font-medium text-lg">{title}</h2>
        <Image
          src="/arrow-down.svg"
          width={24}
          height={24}
          alt="drop"
          className={clsx(
            "transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </div>

      {/* Dropdown content with transition */}
      <div
        className={clsx(
          "overflow-hidden transition-all duration-500 ease-in-out",
          isOpen ? " opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div>{children}</div>
      </div>
    </div>
  );
};

export default DropDownContent;
