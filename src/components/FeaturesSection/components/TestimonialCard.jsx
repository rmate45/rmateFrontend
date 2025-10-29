import React from "react";

const TestimonialCard = ({ item }) => (
  <div className="flex flex-col p-5 rounded-xl gap-4 bg-white text-black h-full shadow-md">
    <div className="flex gap-2 items-center">
      <h2 className="text-base font-medium">
        {item.name}, {item.age}
      </h2>
      <span className="text-sm jost font-light">- {item.title}</span>
    </div>

    <div className="flex gap-3 h-full items-start">
      <img
        src={item.img}
        alt="Avatar"
        className="w-14 h-14 rounded-full object-cover"
      />
      <div className="flex flex-col justify-between h-full text-left">
        <p className="text-sm jost grow h-full font-light text-black">
          {item.text}
        </p>
        <button className="mt-4 w-fit text-xs rounded-lg px-4 py-2 bg-[#567257] text-white">
          Explore this retirement
        </button>
      </div>
    </div>
  </div>
);

export default TestimonialCard;
