import React from "react";
import logo from "../assets/retiremate-logo.svg"; // adjust the path if needed
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <img src={logo} alt="RetireMate Logo" className="w-48 mb-6" />

      <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
        Welcome to RetireMate
      </h1>

      <p className="text-gray-700 text-sm sm:text-base max-w-md mb-8">
        Discover your retirement needs and get personalized guidance with our quick and insightful quiz.
      </p>

      <button
        onClick={handleStart}
        className="px-6 py-3 bg-primary hover:bg-secondary text-white font-semibold rounded-xl shadow-md transition-colors duration-200"
      >
        Start Quiz
      </button>
    </div>
  );
};

export default WelcomePage;
