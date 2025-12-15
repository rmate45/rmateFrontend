import React, { useState, useEffect } from "react";
import TestimonialCard from "./TestimonialCard";
import api from "../../../api/api";

import testimonial2 from "../../../assets/testimonial-1.png";
import testimonial1 from "../../../assets/testimonial-2.jpeg";
import testimonial3 from "../../../assets/testimonial-3.jpeg";
import testimonial4 from "../../../assets/testimonial-4.jpeg";
import testimonial6 from "../../../assets/testimonial-5.jpeg";
import testimonial5 from "../../../assets/testimonial-6.jpeg";

const TestimonialsGrid = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    try {
      setLoading(true);
      const response = await api.get("/get-personas");

      if (response.data?.type === "success" && response.data?.data) {
        // Transform API data to match TestimonialCard props
        const transformedData = response.data.data.map((persona, idx) => ({
          id: persona._id,
          name: persona.name,
          age: persona.age,
          title: persona.profession,
          text: persona.persona_description,
          question: persona.persona_question,
          chatBubble: persona.chat_bubble,
          img:persona?.image,
          // Include original data for potential use
          personaId: persona.persona_id,
          gender: persona.gender,
          ethnicity: persona.ethnicity,
          annualIncome: persona.annual_income,
          totalSavings: persona.total_savings,
          persona_question: persona.persona_question,
          idx:idx
        }));

        setTestimonials(transformedData);
      } else {
        setError("Failed to load testimonials");
      }
    } catch (err) {
      console.error("Error fetching personas:", err);
      setError("An error occurred while loading testimonials");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get avatar image based on gender and ethnicity
  const getAvatarImage = (index = 0) => {
    const images = [
      testimonial1,
      testimonial2,
      testimonial3,
      testimonial4,
      testimonial5,
      testimonial6,
    ];
    return images[index % images.length];
  }; // Closing brace for getAvatarImage function

  if (loading) {
    return (
      <div className="text-center px-6 max-w-7xl mx-auto py-10 sm:py-16">
        <div className="flex flex-col justify-center px-5">
          <h2 className="text-introPrimary font-medium text-2xl mb-8">
            Explore retirement through stories like yours
          </h2>
          <div className="flex justify-center items-center py-20">
            <div className="text-lg text-gray-600">Loading testimonials...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center px-6 max-w-7xl mx-auto py-10 sm:py-16">
        <div className="flex flex-col justify-center px-5">
          <h2 className="text-introPrimary font-medium text-2xl mb-8">
            Explore retirement through stories like yours
          </h2>
          <div className="flex justify-center items-center py-20">
            <div className="text-lg text-red-600">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-5 sm:py-16 sm:pt-5">
    <div className="text-center  max-w-7xl mx-auto ">
      <div className="flex flex-col justify-center ">
        <h2 className="text-introPrimary font-medium text-2xl mb-8">
          Explore retirement through stories like yours
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, visibleCount).map((item) => (
            <TestimonialCard key={item.id} item={item} />
          ))}
        </div>

        {visibleCount < testimonials.length && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-6 py-2 bg-[#567257] text-white text-sm rounded-lg hover:bg-[#456045] transition"
            >
              View More +
            </button>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default TestimonialsGrid;
