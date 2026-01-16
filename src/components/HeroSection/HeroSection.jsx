// components/HeroSection/HeroSection.js
import React, { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import Slider from "react-slick";
import bgImage from "../../assets/bgImage.png";
const HeroSection = ({ searchIcon, onSearch, onVoiceSearch }) => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,        // ✅ REQUIRED
    autoplaySpeed: 3000,   // 3 seconds
    pauseOnHover: false,   // optional
    pauseOnFocus: false,   // optional
  };
  
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [askedQestions, setAsketQuestions] = useState([])
  console.log(askedQestions, "askedQestions");

  const fetchAskedQuestion = async () => {
    try {
      const questionsResponse = await api.get("/get-asked-questions");
      console.log(questionsResponse, "questionsResponse");

      if (
        questionsResponse.data?.data &&
        questionsResponse.data?.data?.length > 0
      ) {
        setAsketQuestions(questionsResponse?.data?.data)
      }
      else {
        setAsketQuestions([])
      }
    }
    catch (error) {
      console.log(error, "error is here for log")
    }

  }
  useEffect(() => {
    if (inputRef.current && !isMobile) {
      inputRef.current.focus();
    }
    fetchAskedQuestion()
  }, []);


  return (
    <>
      <div className="bg-introPrimary sm:min-h-[606px] flex items-center justify-between text-white py-12 md:py-28 md:pb-42 text-center px-2 bg-no-repeat bg-cover bg-center relative bg-[url(/src/assets/mobile-image.png)] sm:bg-[url(/src/assets/bgImage.png)]" >
        <div className="max-w-2xl w-full mx-auto relative z-3">
          <h1 className="font-medium mb-3 text-3xl md:text-5xl mt-12 sm:mt-0">
            Retirement is Scary.
          </h1>
          {askedQestions.length > 0 && (
            <Slider {...settings}>
              {askedQestions.map((item, index) => (
                <div key={index}>
                  <p
                    className="text-lg sm:text-2xl font-semibold jost mt-2"
                  >
                    "{item.question}"
                  </p>
                  <p
                    className="text-lg sm:text-base  jost mt-2"
                  >
                    {`${item?.name}, ${item?.age}`}
                  </p>
                </div>

              ))}
            </Slider>
          )}

          <button
            onClick={() => window.open("/quiz")}
            className="border mt-2 border-primary md:mt-5 text-[#253D2C] bg-[#e8fdba] text-lg font-medium! rounded-[10px] jost px-5 py-2 hover:bg-[#e8fdba]/95 hover:text-[#567257] transition">
            Check if you're prepared
          </button>

          {/* Search Input */}
        </div>
        <div className="absolute inset-0 w-full h-full bg-black/40 z-2">

        </div>
      </div>
      
    </>
  );
};

export default HeroSection;
