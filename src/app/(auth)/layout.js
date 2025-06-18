import Image from "next/image";
import React from "react";

const layout = ({ children }) => {
  return (
    <div className="bg-white  min-h-screen flex">
      <Image
        src="/building.svg"
        alt="logo"
        width={787}
        height={652}
        className="absolute bottom-0 left-0 w-4/9"
        priority={true}
      />
      <div className="bg-primary min-h-screen w-4/11  p-11">
        <div className="flex flex-col gap-[32px]">
          <Image
            src="/promex-logo-white.svg"
            alt="logo"
            width={235}
            height={72}
          />
          <h1 className="text-2xl text-white font-normal">
            Get started today and effortlessly <br /> manage your{" "}
            <span className="font-bold italic"> properties from anywhere</span>.
          </h1>
        </div>
      </div>
      <div className="bg-white min-h-screen grow flex justify-center items-center m-auto">
        {children}
      </div>
    </div>
  );
};

export default layout;
