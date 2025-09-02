// components/QuestionsToAction/QuestionsToAction.js
import React, { useState } from "react";
import Carousel from "../Carousel/Carousel";
import { ChevronDown } from "lucide-react";

const FilterDropdown = ({ id, label, value, onChange, options }) => {
  return (
    <div className="w-full sm:w-44">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-[#2A2420] mb-2"
      >
        {label}
      </label>

      <div className="relative">
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
            Select {label.toLowerCase()}
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
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
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
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedGender, setSelectedGender] = useState("");

  const defaultQuestions = [
    { id: 1, text: "How does divorce impact my retirement benefits?" },
    {
      id: 2,
      text: "What retirement benefits can I claim from a deceased or ex-spouse?",
    },
    { id: 3, text: "Should I increase contributions now that kids are older?" },
  ];

  const defaultAgeOptions = [
    { value: "18-20", label: "18-20" },
    { value: "21-24", label: "21-24" },
    { value: "25-29", label: "25-29" },
    { value: "30-34", label: "30-34" },
    { value: "35+", label: "35+" },
  ];

  const defaultGenderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const questionsToDisplay =
    questions.length > 0 ? questions : defaultQuestions;
  const ageOptionsToDisplay =
    ageOptions.length > 0 ? ageOptions : defaultAgeOptions;
  const genderOptionsToDisplay =
    genderOptions.length > 0 ? genderOptions : defaultGenderOptions;

  return (
    <div className="bg-[#D9D8D5] text-center px-4 sm:px-6 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col xl:flex-row justify-between gap-10 items-center">
          {/* Left side: Questions heading and filters */}
          <div className="w-full max-w-[400px] text-left">
            <p className="font-medium text-lg sm:text-2xl mb-6">
              What questions should you be asking?
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <FilterDropdown
                id="age"
                label="Age"
                value={selectedAge}
                onChange={setSelectedAge}
                options={ageOptionsToDisplay}
              />

              <FilterDropdown
                id="gender"
                label="Gender"
                value={selectedGender}
                onChange={setSelectedGender}
                options={genderOptionsToDisplay}
              />
            </div>
          </div>

          {/* Right side: Carousel */}
          <div className="w-full lg:flex-1">
            <div className="max-w-3xl mx-auto">
              <Carousel
                items={questionsToDisplay}
                renderItem={(q) => (
                  <div className="flex h-full">
                    <button
                      className="
                        rounded-3xl 
                        text-left 
                        p-5 sm:p-7 
                        bg-introPrimary 
                        tracking-wide 
                        shadow-md 
                        min-h-[140px] sm:min-h-[170px] 
                        w-full 
                        text-white 
                        font-medium sm:font-normal 
                        text-base sm:text-lg 
                        flex items-start
                        max-w-[300px]
                        mx-auto
                      "
                      onClick={() => onQuestionClick && onQuestionClick(q)}
                    >
                      {q.text}
                    </button>
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        {/* Browse link */}
        <div className="mt-8 border-t border-[#D9D9D9] pt-4">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onBrowseAllClick && onBrowseAllClick();
            }}
            className="text-[#2A2420] jost text-center font-semibold block"
          >
            Browse all questions
          </a>
        </div>
      </div>
    </div>
  );
};

export default QuestionsToAction;
