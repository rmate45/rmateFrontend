// components/Header/Header.js
import React from 'react';
import logo from "../../assets/logo.png";


const Header = ({ onLoginClick }) => {
  return (
    <div className="bg-[#567257] py-5 px-4 flex justify-between items-center">
      <div className="max-w-[1750px] flex justify-between items-center mx-auto w-full">
        <img className="w-[180px]" src={logo} alt="RetireMate Logo" />
        <button 
          className="border border-white text-white text-base !font-normal rounded-[10px] jost px-4 py-1 hover:bg-white hover:text-[#567257] transition"
          onClick={onLoginClick}
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default Header;