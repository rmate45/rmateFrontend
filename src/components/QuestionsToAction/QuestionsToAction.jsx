// components/QuestionsToAction/QuestionsToAction.js
import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import ResponsiveCarousel from "../ResponsiveCarousel/ResponsiveCarousel";

const FilterDropdown = ({ id, label, value, onChange, options }) => {
  return (
    <div className="w-full sm:w-44 flex items-center gap-2">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-[#2A2420] mb-2"
      >
        {label}
      </label>

      <div className="relative w-full">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            block w-full rounded-xl border border-gray-300 bg-white 
            pl-4 pr-10 py-2.5 text-sm font-medium text-[#2A2420] 
            shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2A2420] focus:border-[#2A2420]
            cursor-pointer
            appearance-none
          "
        >
          <option className="text-gray-400" value="">
            Select
          </option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="py-2 px-3 text-sm text-[#2A2420]"
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Chevron */}
        <ChevronDown
          className="absolute right-3 top-3 text-gray-500 pointer-events-none"
          size={18}
        />
      </div>
    </div>
  );
};

const QuestionsToAction = ({
  questions = [],
  ageOptions = [],
  genderOptions = [],
  onQuestionClick,
  onBrowseAllClick,
}) => {
  // Set default values
  const [selectedAge, setSelectedAge] = useState("45-54");
  const [selectedGender, setSelectedGender] = useState("Male");
  const [apiQuestions, setApiQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const defaultQuestions = [
    { id: 1, text: "How does divorce impact my retirement benefits?" },
    {
      id: 2,
      text: "What retirement benefits can I claim from a deceased or ex-spouse?",
    },
    { id: 3, text: "Should I increase contributions now that kids are older?" },
  ];

  const defaultAgeOptions = [
    { value: "18-24", label: "18-24" },
    { value: "25-34", label: "25-34" },
    { value: "35-44", label: "35-44" },
    { value: "45-54", label: "45-54" },
    { value: "55-64", label: "55-64" },
    { value: "65-74", label: "65-74" },
    { value: "75-84", label: "75-84" },
    { value: "85+", label: "85+" },
  ];

  const defaultGenderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "both", label: "Both" },
  ];

  const ageOptionsToDisplay =
    ageOptions.length > 0 ? ageOptions : defaultAgeOptions;
  const genderOptionsToDisplay =
    genderOptions.length > 0 ? genderOptions : defaultGenderOptions;

  // API call function
  const fetchRetirementQuestions = async (ageGroup, gender) => {
    setLoading(true);
    setError(null);

    console.log(ageGroup, "ageGroup");
    console.log(gender, "gender");

    try {
      const response = await fetch(
        `https://quiz-api.retiremate.com/api/v1/retirement-questions?ageGroup=${ageGroup}&gender=${gender}&page=1&limit=10`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const data = await response.json();

      if (data.type === "success" && data.data && data.data.questions) {
        // Transform API response to match expected format
        const transformedQuestions = data.data.questions.map(
          (question, index) => ({
            id: question._id || index + 1,
            text: question.prompt,
            ...question, // Include other properties if needed
          })
        );

        setApiQuestions(transformedQuestions);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching retirement questions:", err);
      setError(err.message);
      // Fallback to default questions on error
      setApiQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch questions on component mount and when filters change
  useEffect(() => {
    if (selectedAge) {
      fetchRetirementQuestions(selectedAge, selectedGender);
    }
  }, [selectedAge, selectedGender]);

  // Handle age change
  const handleAgeChange = (age) => {
    setSelectedAge(age);
  };

  // Handle gender change
  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
  };

  // Determine which questions to display
  const questionsToDisplay = () => {
    if (apiQuestions.length > 0) {
      return apiQuestions;
    }

    // Fallback to provided questions or default questions
    return defaultQuestions;
  };

  console.log(questionsToDisplay(), "questionsToDisplay");

  return (
    <div className="bg-[#D9D8D5] text-center px-4 sm:px-6 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col xl:flex-row justify-between gap-10 items-center">
          {/* Left side: Questions heading and filters */}
          <div className="w-full max-w-[400px] text-left">
            <p className="font-medium text-lg sm:text-2xl mb-6 text-center">
              What questions should you be asking?
            </p>

            <div className="flex gap-4 sm:gap-6">
              <FilterDropdown
                id="age"
                label="Age"
                value={selectedAge}
                onChange={handleAgeChange}
                options={ageOptionsToDisplay}
              />

              <FilterDropdown
                id="gender"
                label="Gender"
                value={selectedGender}
                onChange={handleGenderChange}
                options={genderOptionsToDisplay}
              />
            </div>
          </div>

          {/* Right side: Carousel */}
          <div className="w-full lg:flex-1 px-5">
            <div className="max-w-3xl mx-auto">
              <ResponsiveCarousel
                items={questionsToDisplay()}
                renderItem={(q) => (
                  <div
                    className="flex h-full"
                    key={q.id}
                    onClick={() => {
                      if (onQuestionClick) {
                        onQuestionClick(q);
                      }
                    }}
                  >
                    <button
                      className="
                        rounded-3xl 
                        text-left 
                        p-5 sm:p-7 
                        bg-introPrimary
                        tracking-wide 
                        shadow-md 
                        w-full 
                        text-white 
                        font-medium sm:font-normal 
                        text-base sm:text-lg 
                        flex items-start
                        mx-auto
                        cursor-pointer
                        flex-col
                        gap-4
                        hover:opacity-90
                        transition
                        duration-200
                      "
                    >
                      <p className="text-wrap text-lg grow-1 text-left">
                        {q.text}
                      </p>

                      <div className="flex justify-end w-full">
                        <button className="text-xs font-semibold border-2  placeholder-primary px-4 py-2 rounded-full">
                          Ask Retiremate
                        </button>
                      </div>
                    </button>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsToAction;
