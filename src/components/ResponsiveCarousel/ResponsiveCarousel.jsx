// components/Carousel/Carousel.js
import React, { useRef } from "react";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ResponsiveCarousel = ({ items, renderItem, slidesToShow = 3 }) => {
  const sliderRef = useRef(null);

  // Custom component for mobile slides (3 items per slide)
  const MobileSlide = ({ slideItems }) => (
    <div className="flex flex-col gap-4">
      {slideItems.map((item, idx) => (
        <div key={idx} className="w-full">
          {renderItem(item, idx)}
        </div>
      ))}
    </div>
  );

  // Group items into chunks of 3 for mobile
  const groupItemsForMobile = (items, chunkSize = 3) => {
    const chunks = [];
    for (let i = 0; i < items.length; i += chunkSize) {
      chunks.push(items.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const mobileChunks = groupItemsForMobile(items, 3);

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <ChevronLeft color="white" />,
    nextArrow: <ChevronRight color="white" />,
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
          infinite: items.length > slidesToShow,
        },
      },
    ],
  };

  return (
    <div className="relative w-full flex items-center">
      {/* Desktop/Tablet Slider */}
      <div className="w-full md:block hidden xs:hidden">
        <Slider ref={sliderRef} {...settings}>
          {items.map((item, idx) => (
            <div key={idx} className="px-2 sm:px-3 h-full">
              {renderItem(item, idx)}
            </div>
          ))}
        </Slider>
      </div>

      {/* Mobile Slider - 3 items per slide */}
      <div className="w-full  block md:hidden lg:hidden xl:hidden">
        <Slider ref={sliderRef} {...settings}>
          {mobileChunks.map((chunk, idx) => (
            <div key={idx} className="px-2">
              <MobileSlide slideItems={chunk} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ResponsiveCarousel;
