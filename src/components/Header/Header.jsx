// components/Header/Header.js
import React from "react";
import logo from "../../assets/logo.png";

const Header = ({ onLoginClick }) => {
  return (
    <div className="bg-[#567257] py-4 px-4 sm:px-10 sm:py-6 flex justify-between items-center">
      <div className="max-w-[1750px] flex justify-end items-center mx-auto w-full relative">
        <img className="w-[160px] lg:w-[180px] absolute left-1/2 -translate-x-1/2" src={logo} alt="RetireMate Logo" />
        <button
          className="text-xs lg:text-base border border-primary text-primary bg-[#f7f8f7] !font-semibold rounded-[10px] jost px-2 lg:px-5 py-2 hover:bg-[#e8fdba]/95 hover:text-[#567257] transition"
          onClick={onLoginClick}
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Header;
