import Slider from "react-slick";
import { AdvisorCard } from "../AdvisorCard/AdvisorCard";

export const AdvisorMeetingSection = ({ onScheduleMeeting }) => {
  const advisors = [
    { name: "", location: "Newport Beach, CA" },
    { name: "Smart Wealth Planning", location: "San Diego, CA" },
    { name: "Welath Gain", location: "San Diego, CA" },
  ];

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // This hides the arrow navigation
    dotsClass: "slick-dots", // Custom class for styling dots if needed
  };

  return (
    <div className="p-6 border rounded-xl shadow-md bg-[#ffffff]">
      <h2 className="text-xl font-semibold text-center mb-4">
        Our AI has matched you with financial advisors.
      </h2>

      <div className="space-y-4 mb-6 mt-8">
        {/* <Slider {...settings}> */}
          {advisors.map((advisor, index) => (
            <AdvisorCard
              key={index}
              name={advisor.name}
              location={advisor.location}
              onConsult={onScheduleMeeting}
            />
          ))}
        {/* </Slider> */}
      </div>
    </div>
  );
};