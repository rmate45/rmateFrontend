// components/Carousel/Carousel.js
import React, { useRef } from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Carousel = ({ items, renderItem, slidesToShow = 3 }) => {
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow,
    slidesToScroll: 1,
    arrows: true,

    prevArrow: <ChevronLeft color="white" />,
    nextArrow: <ChevronRight color="white" /> ,
    responsive: [
      {
        breakpoint: 1250, // large screens
        settings: { slidesToShow: 2, adaptiveHeight: true },
      },
      {
        breakpoint: 1024, // tablets landscape
        settings: { slidesToShow: 2, adaptiveHeight: true },
      },
      {
        breakpoint: 767, // mobile
        settings: {
          slidesToShow: 1,
          dots: true,
          adaptiveHeight: true,
          arrows: false,
        },
      },
    ],
  };

  return (
    <div className="relative w-full flex items-center">
      {/* Left Arrow */}

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
    </div>
  );
};

export default Carousel;
