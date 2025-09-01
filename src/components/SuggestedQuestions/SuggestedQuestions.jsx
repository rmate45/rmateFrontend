// components/SuggestedQuestions/SuggestedQuestions.js
import React from 'react';
import Carousel from '../Carousel/Carousel';

const SuggestedQuestions = ({ questions, onQuestionClick }) => {
  return (
    <div className="text-center py-16 px-4">
        <div className="max-w-7xl mx-auto">
      <p className="text-[#2A2420] font-medium text-2xl">
        Don't know where to start? Try one of these.
      </p>

      <div className="max-w-[1080px] mx-auto my-16">
        <Carousel
          items={questions}
          renderItem={(q) => (
            <button
              className="rounded-3xl text-left px-10 py-8 tracking-wide shadow-lg max-w-[340px] text-wrap text-white font-bold text-2xl h-[100%]"
              style={{ backgroundColor: q.color }}
              onClick={() => onQuestionClick && onQuestionClick(q)}
            >
              {q.text}
            </button>
          )}
        />
      </div>

      <div className="text-center">
        <p className="text-[#2A2420] font-medium text-2xl">
          We believe personalized retirement advice <br /> should be free -
          for everyone
        </p>
      </div>
      </div>
    </div>
  );
};

export default SuggestedQuestions;