// components/FeaturesSection/FeaturesSection.js
import React from 'react';
import Carousel from '../Carousel/Carousel';
const FeatureItem = ({ icon, description }) => {
  return (
    <div className="flex flex-col gap-1 justify-center items-center max-w-[305px]">
      <img src={icon} alt="Feature" className="w-8 h-8" />
      <p className="text-base font-normal text-introPrimary jost">
        {description}
      </p>
    </div>
  );
};


const FeaturesSection = ({ features = [], testimonials = [] }) => {
  const defaultFeatures = [
    {
      id: 1,
      description: "RetireMate has read all the best Retirement books, so you don't have to."
    },
    {
      id: 2,
      description: "When laws and markets change, you'll be the first to know how it affects you and what you need to do."
    },
    {
      id: 3,
      description: "Haven't saved enough? RetireMate will help you get on track and shows you all your options."
    },
    {
      id: 4,
      description: "Want to speak with a Certified Financial Planner? RetireMate will help you find the right one for you."
    }
  ];

  const testimonialsdata = [
    {
      id: 1,
      text: "I've always let my husband handle our finances, but I worry what would happen if I had to figure out retirement alone. RetireMate gives me confidence that I'd know exactly what to do.",
      name: "Lisa M.",
      title: "Recently Divorced, Part-time worker"
    },
    {
      id: 2,
      text: "Full-time Mom, Planning aheadWe've been saving for years, but we honestly don't know if it's enough. Between our mortgage, kids, and everything else, it's hard to know if we're on track. RetireMate gave us a roadmap to see where we stand and what we should do next.",
      name: "Rachel T.",
      title: "Full-time Mom, Planning ahead"
    },
    {
      id: 3,
      text: "I make a good living, but I never realized how much I'd need to maintain my lifestyle into my 90s. RetireMate gave me a roadmap to see the gap and how to close it.",
      name: "David & Sarah K.",
      title: "Working Parents, Homeowners"
    },
    {
      id: 4,
      text: "I drive for Uber and never had a retirement plan through work. I didn't even know where to start. RetireMate gave me simple steps to begin saving, even with an irregular income.",
      name: "Dr. James R.",
      title: "Cardiologist, High Earner"
    },
    {
      id: 5,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamc. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamc...",
      name: "Marcus L.",
      title: "Rideshare Driver, Contract Worker"
    }
  ];

  const featuresToDisplay = features.length > 0 ? features : defaultFeatures;

  return (
    <div>
      <div className='bg-gray-50 text-center py-12'>
        <h2 className="text-introPrimary font-medium text-2xl">
          Planning for Retirement should always be this easy.
        </h2>

        <div className="flex gap-4 items-start justify-center my-10 flex-wrap mx-auto">
          {featuresToDisplay.map((feature, index) => (
            <FeatureItem
              key={index}
              icon={feature.icon}
              description={feature.description}
            />
          ))}
        </div>
      </div>
      <div className='text-center px-6 py-10 sm:py-16'>
        <div className="max-w-7xl mx-auto flex flex-col justify-center px-5">


          <div className="">
            <h2 className="text-introPrimary font-medium text-2xl mb-5">
              Who We Help
            </h2>
            <Carousel
              items={testimonialsdata}
              renderItem={(currentItems) => (
                <div className="flex flex-col p-5 rounded-xl gap-4 bg-white text-black h-full" style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px 4px 15px" }}>
                  <p className="text-sm jost font-light line-clamp-5 text-left text-black grow-1">
                    {currentItems.text}
                  </p>
                  <div className="flex gap-3 text-left items-center">
                    {/* <img src={avatar} alt="Avatar" className="w-11 h-11" /> */}
                    <div>
                      <h2 className="text-base font-medium">{currentItems.name}</h2>
                      <p className="text-sm jost font-light mt-1">{currentItems.title}</p>
                    </div>
                  </div>
                </div>
              )} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;