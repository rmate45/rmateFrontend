import React from "react";
import Carousel from "../components/Carousel/Carousel";

const questions = [
  { text: "How long will my savings last?", color: "#567257" },
  { text: "What age can I retire?", color: "#8B5E57" },
  { text: "How much money do I need to retire?", color: "#C1B9AF" },
];

function IntroPage() {
  return (
    <>
      {/* Banner */}
      <div className="bg-[#567257] py-2 px-4 flex justify-between items-center">
        <div className="max-w-[1800px] flex justify-between items-center mx-auto w-full">

        <h1 className="text-white font-bold text-lg">RetireMate®</h1>
        <button className="border border-white text-white rounded-full px-4 py-1 hover:bg-white hover:text-[#567257] transition">
          Log In
        </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-[#567257] text-white py-12 md:py-20 text-center px-2">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-bold mb-2 text-3xl md:text-5xl">
            Retirement is Scary.
          </h2>
          <p className="text-lg mb-6">
            Get personalized answers to all your retirement questions
          </p>

          {/* Search Input */}
          <div className="bg-white rounded-full flex items-center px-3 py-2 max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Ask Anything"
              className="flex-1 outline-none px-2 text-gray-700"
            />
            <button className="ml-2">
              <span role="img" aria-label="mic">
                🎤
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="text-center py-12 px-4">
        <p className="mb-6 text-gray-700">
          Don’t know where to start? Try one of these.
        </p>

      <div className="max-w-6xl mx-auto">
        <Carousel
          items={questions}
          renderItem={(q) => (
            <button
              className="rounded-full px-6 py-3 text-white font-semibold whitespace-nowrap"
              style={{ backgroundColor: q.color }}
            >
              {q.text}
            </button>
          )}
        />
        </div>
      </div>

      {/* Statement */}
      <div className="text-center py-6">
        <p className="font-medium text-gray-700 text-lg">
          We believe personalized retirement advice should be free – for
          everyone
        </p>
      </div>

      {/* Insights Section */}
      <div className="bg-[#E7C7C3] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-center mb-10 font-medium text-lg">
            RetireMate makes it easy to get the right answers <br /> to all your
            retirement questions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold mb-2">
                How long will my savings last?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Your savings will last until 81.34, if you retire at 70 in Los
                Angeles, CA, and maintain a comfortable lifestyle.
              </p>
              <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                [Chart Placeholder]
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold mb-2">What age can I retire?</h3>
              <p className="text-sm text-gray-600 mb-4">
                You can retire as early as 63 with a comfortable lifestyle in
                Los Angeles, CA.
              </p>
              <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                [Chart Placeholder]
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default IntroPage;
