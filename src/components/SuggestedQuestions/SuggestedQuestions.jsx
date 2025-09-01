// components/SuggestedQuestions/SuggestedQuestions.js
import React from "react";
import Carousel from "../Carousel/Carousel";

const SuggestedQuestions = ({ questions, onQuestionClick }) => {
  return (
    <div className="text-center px-6 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto">
        <p className="text-[#2A2420] font-medium text-xl sm:text-2xl">
          Don't know where to start? Try one of these.
        </p>

        <div className="max-w-[1080px] mx-auto my-10 sm:my-16">
          <Carousel
            items={questions}
            renderItem={(q) => (
              <button
                className="  rounded-3xl 
        text-left 
        px-6 md:px-10 
        py-6 md:py-8 
        tracking-wide 
        shadow-lg 
        sm:max-w-full md:max-w-[340px] 
        w-full 
        text-wrap 
        text-white 
        font-bold 
        text-lg md:text-2xl 
        flex items-center justify-center
        max-w-[300px]
        mx-auto"
                style={{ backgroundColor: q.color }}
                onClick={() => onQuestionClick && onQuestionClick(q)}
              >
                {q.text}
              </button>
            )}
          />
        </div>

        <div className="text-center">
          <p className="text-[#2A2420] font-medium text-xl sm:text-2xl">
            We believe personalized retirement advice <br /> should be free -
            for everyone
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuggestedQuestions;
