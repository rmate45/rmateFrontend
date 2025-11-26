import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from "../../assets/search.png";

const AskAnything = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.open(`/quiz?title=${encodeURIComponent(searchQuery.trim())}`, "_blank", "noopener,noreferrer");
    }

    if (typeof onSearch === "function") {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-white px-6 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-introPrimary text-center font-medium text-2xl mb-8">
          What Retirement Questions You Should Be Asking.
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col justify-center items-center"
        >
          <div className="bg-white border border-[#567257] rounded-full flex items-center px-3 py-3 max-w-xl w-full mx-auto">
            <button type="submit">
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

          <button
            type="submit"
            // ✅ Enable only when there *is* text
            disabled={searchQuery.length === 0}
            className={`mt-5 px-6 py-2 rounded-md text-base font-semibold border transition ${searchQuery.length > 0
                ? "rounded-lg px-4 py-2 bg-[#567257] text-white"
                : "text-gray-400 border-gray-300 cursor-not-allowed"
              }`}
          >
            Ask RetireMate
          </button>
        </form>
      </div>
    </div>
  );
};

export default AskAnything;
