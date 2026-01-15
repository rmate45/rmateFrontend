// components/Header/Header.js
import React, { useEffect, useState, useRef } from "react";
import logo from "../../assets/logo.png";
import clsx from "clsx";

const Header = ({ onLoginClick, alwaysGreen = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const signUpButtonRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20); // change at 20px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleHeaderClick = (e) => {
    // Get the Sign Up button's position
    if (signUpButtonRef.current) {
      const buttonRect = signUpButtonRef.current.getBoundingClientRect();
      const clickX = e.clientX;
      
      // If click is within 40px to the left of the button or on the button, don't scroll
      if (clickX >= buttonRect.left - 40) {
        return;
      }
    }
    
    // Scroll to top smoothly
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div
      className={clsx(
        "fixed top-0 w-full z-999 transition-all duration-300 cursor-pointer",
        alwaysGreen
          ? "bg-introPrimary shadow-md py-4"
          : isScrolled
          ? "bg-introPrimary shadow-md py-4"
          : "bg-transparent py-4 sm:py-6"
      )}
      onClick={handleHeaderClick}
    >
      <div className="px-4 sm:px-10 flex justify-center items-center max-w-[1750px] mx-auto relative">
        <img
          className="w-[130px] lg:w-[150px] max-h-[60px]"
          src={logo}
          alt="RetireMate Logo"
        />

        {/* <button
          ref={signUpButtonRef}
          className="text-xs lg:text-base border bg-[#E8FFBD] border-[#E8FFBD] text-[#253D2C] rounded-[10px] jost px-2 lg:px-5 py-2 hover:bg-[#e8fdba]/95 hover:text-[#567257] transition cursor-pointer"
          onClick={(e) => {
            e.stopPropagation(); // Prevent scroll to top when clicking Sign Up
            onLoginClick();
          }}
        >
          Sign up
        </button> */}
      </div>
    </div>
  );
};

export default Header;
