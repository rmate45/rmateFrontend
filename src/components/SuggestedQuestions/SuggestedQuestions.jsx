// components/SuggestedQuestions/SuggestedQuestions.js
import React from "react";
import Carousel from "../Carousel/Carousel";
import AiImage from "../../assets/AIChat.png";
import ResponsiveCarousel from "../ResponsiveCarousel/ResponsiveCarousel";

const SuggestedQuestions = ({ questions, onQuestionClick }) => {
  const handleQuestionClick = (question) => {
    // Still call the original onQuestionClick if provided
    if (onQuestionClick) {
      onQuestionClick(question);
    }
  };

  return (
    <div className="text-center px-6 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-5">
        <p className="text-[#2A2420] font-medium text-xl sm:text-2xl text-center">
          Not sure where to start?
        </p>
        <p className="text-[#2A2420] font-medium text-xl sm:text-2xl text-center">
          Tap a question below to begin.
        </p>

        <div className="max-w-[1080px] mx-auto my-10 sm:my-16">
          <ResponsiveCarousel
            items={questions}
            renderItem={(q) => (
              <div
                className="rounded-3xl relative
                h-full
                text-left 
                px-6 md:px-4 
                py-6 md:py-4
                tracking-wide 
                w-full 
                bg-white
                hover:opacity-90
                transition
                duration-200
                cursor-pointer
                flex flex-col justify-start items-start gap-3"
                style={{
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)", // custom shadow
                }}
                onClick={() => handleQuestionClick(q)}
              >
                <p className="text-wrap font-bold text-lg md:text-[24px] text-[#567257] grow-1">
                  {q.text}
                </p>
                <p className="text-xs inline-block p-1.5 rounded">
                  {q.description}
                </p>
                <div className="flex justify-end w-full">
                  <button className="text-xs font-semibold border-2  placeholder-primary px-4 py-2 rounded-full">
                    Ask RetireMate
                  </button>
                </div>
              </div>
            )}
          />
        </div>

        <div className="text-center">
          <p className="text-[#2A2420] font-medium text-xl sm:text-2xl">
            We believe everyone should have access to instant,
            <br /> personalized retirement answers - for free
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuggestedQuestions;
