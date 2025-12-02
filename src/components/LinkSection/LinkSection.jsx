import React from "react";
import { Link } from "react-router-dom";

const LinkSection = () => {
  const resources = [
    "Important Retirement Dates",
    "Retirement calculators",
    "Retirement books",
    "Retirement podcasts",
    "Where to Live in Retirement",
    "Finding Adventure in Retirement",
    "Certified Financial Planners & Advisors",
    "Saving for Retirement",
    "Retirement Income",
    "Tax Strategies",
    "Medicare & Medicare Advantage",
    "Social Security",
    "Life & Long-Term Care Insurance",
    "Estate Planning & Legal",
    "Long-term care",
    "Retirement lifestyle blogs",
  ];

  return (
    <div className="bg-white  px-6 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-introPrimary text-center font-medium text-2xl mb-8">
          Retirement Resources, News & Advice
        </h1>
        <ul className="space-y-2 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {resources.map((item, index) => (
            <li key={index}>
              <Link
                to={import.meta.env.VITE_WEBSITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base jost grow  text-[#6B7280] text-left  hover:text-primary/90 hover:!underline  transition-colors"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LinkSection;
