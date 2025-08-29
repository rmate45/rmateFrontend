import React, { useRef } from "react";
import Slider from "react-slick";

const Carousel = ({ items, renderItem, slidesToShow = 3 }) => {
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 900,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="flex items-center w-full">
      {/* Left Arrow */}
      <button
        onClick={() => sliderRef.current?.slickPrev()}
        className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition"
      >
        {/* Using Unicode arrow instead of MUI icon */}
        <span className="text-sm">←</span>
      </button>

      {/* Slider */}
      <div className="flex-grow mx-3 w-full">
        <Slider ref={sliderRef} {...settings}>
          {items.map((item, idx) => (
            <div key={idx} className="px-2">
              {renderItem(item, idx)}
            </div>
          ))}
        </Slider>
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => sliderRef.current?.slickNext()}
        className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition"
      >
        <span className="text-sm">→</span>
      </button>
    </div>
  );
};

export default Carousel;
