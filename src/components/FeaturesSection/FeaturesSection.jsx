// components/FeaturesSection/FeaturesSection.js
import React, { useState } from "react";
import avatar1 from "../../assets/avatar-1.jpg";
import avatar2 from "../../assets/avatar-2.webp";
import avatar3 from "../../assets/avatar-3.jpeg";
import avatar4 from "../../assets/avatar-4.jpeg";
import avatar5 from "../../assets/avatar-5.jpg";
import TestimonialsGrid from "./components/TestimonialsGrid";
import FeatureItem from "./components/FeatureItem";

const FeaturesSection = ({ features = [], testimonials = [] }) => {
  const defaultFeatures = [
    {
      id: 1,
      description:
        "RetireMate has read all the best Retirement books, so you don't have to.",
    },
    {
      id: 2,
      description:
        "When laws and markets change, you'll be the first to know how it affects you and what you need to do.",
    },
    {
      id: 3,
      description:
        "Haven't saved enough? RetireMate will help you get on track and shows you all your options.",
    },
    {
      id: 4,
      description:
        "Want to speak with a Certified Financial Planner? RetireMate will help you find the right one for you.",
    },
  ];

  const testimonialsData = [
    {
      id: 1,
      text: "I spent years focused on raising my kids. After my divorce, I felt lost about how to start saving for retirement. RetireMate showed me the steps I need to take now - and that it's not too late.",
      name: "Lisa M",
      title: "Part-time worker",
      age: "45",
      img: avatar1,
    },
    {
      id: 2,
      text: "I've always let my husband handle our finances, but I worry what would happen if I had to figure out retirement alone. RetireMate gives me confidence that I'd know exactly what to do.",
      name: "Rachel T",
      title: "Planning ahead",
      age: "38",
      img: avatar2,
    },
    {
      id: 3,
      text: "We've been saving for years, but we honestly don't know if it's enough. Between our mortgage, kids, and everything else, it's hard to know if we're on track. RetireMate gave us a roadmap to see where we stand and what we should do next.",
      name: "David & Sarah K",
      title: "Homeowners",
      age: "50",
      img: avatar3,
    },
    {
      id: 4,
      text: "I make a good living, but I never realized how much I'd need to maintain my lifestyle into my 90s. RetireMate gave me a roadmap to see the gap and how to close it.",
      name: "Dr. James R",
      title: "Cardiologist",
      age: "55",
      img: avatar4,
    },
    {
      id: 5,
      text: "I drive for Uber and never had a retirement plan through work. I didn't even know where to start. RetireMate gave me simple steps to begin saving, even with an irregular income.",
      name: "Marcus L",
      title: "Contract Worker",
      age: "32",
      img: avatar5,
    },
    {
      id: 6,
      text: "RetireMate simplified everything for me. I now know exactly where I stand and how to retire comfortably.",
      name: "Alan W",
      title: "Engineer",
      age: "42",
      img: avatar1,
    },
    {
      id: 7,
      text: "I didn’t think about retirement until I turned 40. RetireMate helped me get on track quickly and easily.",
      name: "Priya S",
      title: "Teacher",
      age: "41",
      img: avatar2,
    },
    {
      id: 8,
      text: "The app feels like talking to a real advisor, but way simpler. I recommend it to all my friends.",
      name: "Carlos M",
      title: "Freelancer",
      age: "36",
      img: avatar3,
    },
  ];

  const featuresToDisplay = features.length > 0 ? features : defaultFeatures;
 

  return (
    <div className="bg-gray-50 px-6 py-10 sm:py-16  mt-10 sm:mt-16">
      {/* Features Section */}
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-introPrimary font-medium text-2xl">
          Planning for Retirement should always be this easy.
        </h2>
        <div className="flex gap-4 items-start justify-center mt-10 flex-wrap mx-auto">
          {featuresToDisplay.map((feature, index) => (
            <FeatureItem
              key={index}
              icon={feature.icon}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
