// components/Header/Header.js
import React from "react";
import logo from "../../assets/logo.png";

const Header = ({ onLoginClick }) => {
  return (
    <div className="bg-[#567257] py-6 px-10 flex justify-between items-center">
      <div className="max-w-[1750px] flex justify-between items-center mx-auto w-full">
        <img className="w-[180px]" src={logo} alt="RetireMate Logo" />
        <button
          className="border border-primary text-primary bg-[#e8fdba] !font-normal rounded-[10px] jost px-5 py-2 hover:bg-[#e8fdba]/95 hover:text-[#567257] transition"
          onClick={onLoginClick}
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Header;
