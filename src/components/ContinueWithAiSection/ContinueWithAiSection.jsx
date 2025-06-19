import React from "react";

export const ContinueWithAiSection = ({ onStartQuiz2 }) => {
  return (
    <div className="p-6 border rounded-xl shadow-md bg-white max-w-2xl mx-auto">
      <h2 className="text-xl text-blue font-semibold text-center mb-4">
        Continue working with our AI & discover financial freedom
      </h2>
      <div className="text-center mb-6">
        <button
          onClick={onStartQuiz2}
          className="bg-secondary text-white px-8 py-3 rounded-full font-bold shadow hover:bg-green-400 transition"
        >
          Click for knowledge
        </button>
      </div>
      <div className="text-sm text-gray-800">
        <p className="font-semibold mb-2">The AI Conversation gives you the following:</p>
        <ul className="list-decimal list-inside space-y-1">
          <li>Best-in-class analysis of your personal financial situation</li>
          <li><span className="font-bold">FREE</span> advice and methods to improve</li>
          <li>If needed, connect to a financial advisor for detailed assessment</li>
        </ul>
      </div>
    </div>
  );
};
