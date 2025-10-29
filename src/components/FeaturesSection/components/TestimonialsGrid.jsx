import React, { useState } from "react";
import TestimonialCard from "./TestimonialCard";

const TestimonialsGrid = ({ testimonials }) => {
  const [visibleCount, setVisibleCount] = useState(6);

  return (
    <div className="text-center px-6 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto flex flex-col justify-center px-5">
        <h2 className="text-introPrimary font-medium text-2xl mb-8">
          Explore retirement through stories like yours
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, visibleCount).map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </div>

        {visibleCount < testimonials.length && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-6 py-2 bg-[#567257] text-white text-sm rounded-lg hover:bg-[#456045] transition"
            >
              View More +
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsGrid;
