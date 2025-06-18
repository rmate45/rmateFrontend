import Image from "next/image";
import React from "react";

const FormHeader = ({ title = "Add Title" }) => {
  return (
    <div className="w-full flex flex-col gap-9 justify-center items-center">
      <Image
        src="/promex-logo-purple.svg"
        alt="promex"
        width={152}
        height={42}
        className="max-w-[152px] object-cover"
      />
      <h1 className="font-medium text-[32px] text-dark">{title}</h1>
    </div>
  );
};

export default FormHeader;
