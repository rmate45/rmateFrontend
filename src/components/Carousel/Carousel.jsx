// components/Carousel/Carousel.js
import React, { useRef } from "react";
import Slider from "react-slick";
import arrowIcon from "../../assets/arrow_right.png"; // use one icon

const Carousel = ({ items, renderItem, slidesToShow = 3 }) => {
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow,
    slidesToScroll: 1,
    arrows: false,
    adaptiveHeight: false,
    responsive: [
      {
        breakpoint: 1280, // large screens
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 1024, // tablets landscape
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640, // mobile
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="relative w-full flex items-center">
      {/* Left Arrow */}
      <button
        onClick={() => sliderRef.current?.slickPrev()}
        className="absolute -left-6 sm:-left-10 z-10 bg-introPrimary text-white flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-[#465c47] transition"
      >
        <img src={arrowIcon} alt="Left Arrow" className="w-4 h-4 sm:w-6 sm:h-6 rotate-180" />
      </button>

      {/* Slider */}
      <div className="w-full">
        <Slider ref={sliderRef} {...settings}>
          {items.map((item, idx) => (
            <div key={idx} className="px-2 sm:px-3 h-full">
              {renderItem(item, idx)}
            </div>
          ))}
        </Slider>
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => sliderRef.current?.slickNext()}
        className="absolute -right-6 sm:-right-10 z-10 bg-introPrimary text-white flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-[#465c47] transition"
      >
        <img src={arrowIcon} alt="Right Arrow" className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>
    </div>
  );
};

export default Carousel;
