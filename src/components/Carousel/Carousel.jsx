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
        breakpoint: 900,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="relative w-full flex items-center">
      {/* Left Arrow */}
      <button
        onClick={() => sliderRef.current?.slickPrev()}
        className="absolute -left-12 z-10 bg-introPrimary text-white flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#465c47] transition"
      >
        {/* rotate for left */}
        <img src={arrowIcon} alt="Left Arrow" className="w-6 h-6 rotate-180" />
      </button>

      {/* Slider */}
      <div className="w-full">
        <Slider ref={sliderRef} {...settings}>
          {items.map((item, idx) => (
            <div key={idx} className="px-3 h-full"> {/* gap between slides */}
              {renderItem(item, idx)}
            </div>
          ))}
        </Slider>
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => sliderRef.current?.slickNext()}
        className="absolute -right-12 z-10 bg-introPrimary text-white flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#465c47] transition"
      >
        <img src={arrowIcon} alt="Right Arrow" className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Carousel;
