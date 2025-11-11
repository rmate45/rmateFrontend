import React, { useState } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from "../../assets/search.png";

const AskAnything = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);

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
    <div className="bg-white  px-6 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-introPrimary text-center font-medium text-2xl mb-8">
          What Retirement Questions You Should Be Asking.
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <div className="bg-white border border-[#567257] rounded-full flex items-center px-3 py-3 max-w-xl mx-auto">
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
        </form>
      </div>
    </div>
  );
};

export default AskAnything;
