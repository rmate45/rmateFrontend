// components/SuggestedQuestions/SuggestedQuestions.js
import React from "react";
import { useNavigate } from 'react-router-dom';
import Carousel from "../Carousel/Carousel";
import AiImage from '../../assets/AIChat.png'

const SuggestedQuestions = ({ questions, onQuestionClick }) => {
  const navigate = useNavigate();

  const handleQuestionClick = (question) => {
    // Navigate to quiz page with the question text
    navigate('/quiz', { state: { title: question.text } });

    // Still call the original onQuestionClick if provided for backward compatibility
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
          <Carousel
            items={questions}
            renderItem={(q) => (
              <div
                className="rounded-3xl relative
                h-full
                text-left 
                px-6 md:px-4 
                py-6 md:py-4
                pr-6 md:pr-10 
                tracking-wide 
                w-full 
                bg-white
                hover:opacity-90
                transition
                duration-200
                cursor-pointer
                flex flex-col justify-start items-start gap-3"

                style={{
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)" // custom shadow
                }}

              >
                <span
                  style={{ backgroundColor: q.tagcolor }}
                  className="text-xs inline-block p-1.5 rounded"
                >
                  {q.tag}
                </span>
                <p className="text-wrap font-bold text-lg md:text-2xl text-[#567257] grow-1">
                  {q.text}
                </p>
                <div className="flex justify-end w-full absolute right-3 bottom-3">
                  <img src={AiImage} alt="chat" onClick={() => handleQuestionClick(q)} role="button" />
                </div>
              </div>
            )}

          />
        </div>

        <div className="text-center">
          <p className="text-[#2A2420] font-medium text-xl sm:text-2xl">
            We believe everyone should have access to instant,<br /> personalized retirement answers - for free 
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuggestedQuestions;