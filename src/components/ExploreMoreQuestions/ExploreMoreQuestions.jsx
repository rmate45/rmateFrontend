import React, { useEffect, useState, useRef } from "react";
import api from "../../api/api";
import { slugify } from "../../utils/slugify";
const ExploreMoreQuestions = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
const[active,setActive]=useState("")
  useEffect(() => {
    getQuestion();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getQuestion = async () => {
    setLoading(true);
    try {
      const response = await api.get("/get-explore-questions");
      if (response.data?.type === "success" && response.data?.data) {
        setData(response.data.data);
      } else {
        setError("Failed to load questions");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  const handleQuestionClick = (question) => {
    console.log(question, "inside");
    const titleSlug = slugify(
      `${question.question}`);
    const idParam = encodeURIComponent(question._id);
    const url = `/Top-Explore-Questions/${titleSlug}?id=${idParam}&type=explore`;
    window.open(url, "_blank");

  }

  if (loading) {
    return (
      <div className="text-center px-6 max-w-7xl mx-auto py-10 sm:py-16">
        <h2 className="text-introPrimary font-medium text-2xl mb-8">
          Explore retirement through stories like yours
        </h2>
        <p className="text-gray-600 text-lg">Loading Explore more questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center px-6 max-w-7xl mx-auto py-10 sm:py-16">
        <h2 className="text-introPrimary font-medium text-2xl mb-8">
          Explore retirement through stories like yours
        </h2>
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="text-center px-6 pt-10 sm:pt-16">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center">
        <p className="text-introPrimary font-medium text-xl sm:text-2xl mb-10">
          Explore more questions
        </p>

        {/* Custom Dropdown */}
        <div className="relative w-full max-w-lg" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-full text-sm flex justify-between items-center px-5 py-3 text-left rounded-2xl border border-primary text-gray-700 bg-white shadow-sm hover:shadow-md transition"
          >
            <span>
              {active
                ? data.find((q) => q._id === active)?.question
                : "Select a question"}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-5 h-5 text-gray-500 shrink-0 transform transition-transform ${dropdownOpen ? "rotate-180" : ""
                }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-y-auto">
              {data.map((item, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSelectedQuestion(item);
                    setActive(item._id);
                    setDropdownOpen(false);
                  }}
                  className={`px-5 py-3 text-left text-sm jost grow font-medium text-[#6B7280]  cursor-pointer hover:bg-blue-50 ${active === item._id ? "bg-blue-100 font-medium" : ""
                    }`}
                >
                  {item.question}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Button */}
        <div className="mt-6">
          <button
            onClick={() => handleQuestionClick(selectedQuestion)}
            disabled={!active}
            className={`px-6 py-2 rounded-md text-base font-semibold border transition ${active
                ? "mt-5 w-full  rounded-lg px-4 py-2 bg-[#567257] text-white"
                : "text-gray-400 border-gray-300 cursor-not-allowed"
              }`}
          >
            Ask RetireMate
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExploreMoreQuestions;
