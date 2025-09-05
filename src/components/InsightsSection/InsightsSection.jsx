// components/InsightsSection/InsightsSection.js
import React from "react";
import HowLongCard from "./components/HowLongCard/HowLongCard";
import RetireAgeCard from "./components/RetireAgeCard/RetireAgeCard";

const InsightsSection = () => {
  return (
    <div className="bg-[#E7C7C3] text-center px-6 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto">
        <p className="text-[#2A2420] font-medium text-xl sm:text-2xl mb-8">
          RetireMate makes it easy to get the right answers  to all your <br />
          retirement questions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HowLongCard />
          <RetireAgeCard />
        </div>
      </div>
    </div>
  );
};

export default InsightsSection;
