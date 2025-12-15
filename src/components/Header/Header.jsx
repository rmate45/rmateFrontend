// components/Header/Header.js
import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import clsx from "clsx";

const Header = ({ onLoginClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20); // change at 20px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={clsx(
        "fixed top-0 w-full z-999 transition-all duration-300",
        isScrolled
          ? "bg-[#567257] shadow-md py-3"
          : "bg-transparent py-4 sm:py-6"
      )}
    >
      <div className="px-4 sm:px-10 flex justify-end items-center max-w-[1750px] mx-auto relative">
        <img
          className="w-[130px] lg:w-[150px] absolute left-1/2 -translate-x-1/2"
          src={logo}
          alt="RetireMate Logo"
        />

        <button
          className="text-xs lg:text-base border bg-[#E8FFBD] border-[#E8FFBD] text-[#253D2C] rounded-[10px] jost px-2 lg:px-5 py-2 hover:bg-[#e8fdba]/95 hover:text-[#567257] transition"
          onClick={onLoginClick}
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Header;
