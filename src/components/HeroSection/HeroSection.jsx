// components/HeroSection/HeroSection.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = ({ searchIcon, micIcon, onSearch, onVoiceSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to quiz page with the search query
      navigate('/quiz', { state: { title: searchQuery.trim() } });
    }
    // Still call the original onSearch if provided for backward compatibility
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleVoiceSearch = () => {
    // Call the original onVoiceSearch if provided
    if (onVoiceSearch) {
      onVoiceSearch();
    }
    // You can add voice search logic here that eventually navigates to quiz
  };

  return (
    <div className="bg-[#567257] text-white py-12 md:py-28 md:pb-42 text-center px-2">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-medium mb-3 text-3xl md:text-5xl">
          Retirement is Scary.
        </h2>
        <p className="text-lg sm:text-2xl font-light jost mb-9">
          Get personalized answers to all your retirement questions
        </p>

        {/* Search Input */}
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
          <div className="bg-white rounded-full flex items-center px-3 py-3 max-w-xl mx-auto">
            <button type="submit" onClick={handleSearch}>
              <img src={searchIcon} alt="Search" className="w-7 h-7" />
            </button>
            <input
              type="text"
              placeholder="Ask Anything"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 outline-none jost font-normal text-base px-2 text-introPrimary"
              placeholdertextcolor="#567257"
            />
            <button 
              type="button"
              className="ml-2"
              onClick={handleVoiceSearch}
            >
              <img src={micIcon} alt="Microphone" className="w-8 h-8" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeroSection;