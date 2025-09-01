// components/FeaturesSection/FeaturesSection.js
import React from 'react';

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

const TestimonialCard = ({ text, avatar, name, title }) => {
  return (
    <div className="flex flex-col p-5 rounded-xl gap-4 bg-intoSecondary text-white max-w-[305px]">
      <p className="text-sm jost font-light line-clamp-5 text-left text-white">
        {text}
      </p>
      <div className="flex gap-3 text-left items-center">
        <img src={avatar} alt="Avatar" className="w-11 h-11" />
        <div>
          <h2 className="text-base font-medium">{name}</h2>
          <p className="text-sm jost font-light mt-1">{title}</p>
        </div>
      </div>
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

  const defaultTestimonials = [
    {
      id: 1,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamc. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamc...",
      name: "Lisa*",
      title: "Full-Time Mom"
    },
    {
      id: 2,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamc. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamc...",
      name: "Lisa*",
      title: "Full-Time Mom"
    },
    {
      id: 3,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamc. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamc...",
      name: "Lisa*",
      title: "Full-Time Mom"
    },
    {
      id: 4,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamc. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamc...",
      name: "Lisa*",
      title: "Full-Time Mom"
    }
  ];

  const featuresToDisplay = features.length > 0 ? features : defaultFeatures;
  const testimonialsToDisplay = testimonials.length > 0 ? testimonials : defaultTestimonials;

  return (
    <div className='text-center px-6 py-10 sm:py-16'>
    <div className="max-w-7xl mx-auto flex flex-col justify-center">
      <p className="text-introPrimary font-medium text-2xl">
        Planning for Retirement should always be this easy.
      </p>
      
      <div className="flex gap-4 items-start justify-center my-10 flex-wrap mx-auto">
        {featuresToDisplay.map((feature, index) => (
          <FeatureItem
            key={feature.id}
            icon={feature.icon}
            description={feature.description}
          />
        ))}
      </div>

        <div className="flex gap-4 justify-center items-start flex-wrap mx-auto">
          {testimonialsToDisplay.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              text={testimonial.text}
              avatar={testimonial.avatar}
              name={testimonial.name}
              title={testimonial.title}
            />
          ))}
        </div>
    </div>
    </div>
  );
};

export default FeaturesSection;