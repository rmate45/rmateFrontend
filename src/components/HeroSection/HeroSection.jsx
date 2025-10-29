// components/HeroSection/HeroSection.js
import React, { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";

const HeroSection = ({ searchIcon, onSearch, onVoiceSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current && !isMobile) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to quiz page with the search query
      navigate("/quiz", { state: { title: searchQuery.trim() } });
    }
    // Still call the original onSearch if provided for backward compatibility
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-[#567257] text-white py-12 md:py-28 md:pb-42 text-center px-2">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-medium mb-3 text-3xl md:text-5xl">
          Retirement is Scary.
        </h1>
        <p className="text-lg sm:text-2xl font-semibold jost mt-3 sm:mt-6">
          "Will I have enough?"
        </p>

        <button 
        onClick={() => navigate("/quiz")}
        className="border mt-10 border-white text-white text-lg !font-normal rounded-[10px] jost px-5 py-2 hover:bg-white hover:text-[#567257] transition">
          Check if you're prepared
        </button>

        {/* Search Input */}
        {/* <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <div className="bg-white rounded-full flex items-center px-3 py-3 max-w-xl mx-auto">
            <button type="submit" onClick={handleSearch}>
              <img src={searchIcon} alt="Search" className="w-7 h-7" />
            </button>
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask Anything"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 outline-none jost font-normal text-base px-2 text-introPrimary"
              placeholdertextcolor="#567257"
            />
           
          </div>
        </form> */}
      </div>
    </div>
  );
};

export default HeroSection;
