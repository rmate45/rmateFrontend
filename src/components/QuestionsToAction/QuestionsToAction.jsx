// components/QuestionsToAction/QuestionsToAction.js
import React, { useState } from "react";
import Carousel from "../Carousel/Carousel";

const FilterDropdown = ({ id, label, value, onChange, options }) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-[#2A2420] mb-2"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-40 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-[#2A2420] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2A2420]"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
      text: "What retirement benefits can I claim from a deceased or ex-spouse",
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
    <div className="bg-[#D9D8D5] text-center px-6 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto pr-12">
        <div className="flex justify-between flex-wrap items-center gap-10">
          {/* Left side: Questions heading and filters */}
          <div className="text-left max-w-[400px]">
            <p className="font-medium text-lg sm:text-2xl mb-6">
              What questions should you be asking?
            </p>

            <div className="flex gap-6">
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
          <div>
            <div className="max-w-3xl mx-auto">
              <Carousel
                items={questionsToDisplay}
                renderItem={(q) => (
                  <div className="flex h-full">
                    {" "}
                    {/* stretch wrapper */}
                    <button
                      className="rounded-3xl text-left p-7 bg-introPrimary tracking-wide shadow-md min-h-[170px] text-wrap text-white !font-normal text-lg flex items-start"
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
        <div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onBrowseAllClick && onBrowseAllClick();
            }}
            className="pt-4 w-full border-t border-[#D9D9D9] inline-block text-[#2A2420] jost text-center font-semibold"
          >
            Browse all questions
          </a>
        </div>
      </div>
    </div>
  );
};

export default QuestionsToAction;
