import React from "react";

const TestimonialCard = ({ item }) => {
  const handleClick = () => {
    const params = new URLSearchParams({
      age: item.age || "",
      householdIncome: item.annualIncome || "",
      retirementSavings: item.totalSavings || "",
      otherSavings: item.otherSavings || "0",
      chatBubble: item.chatBubble || "",
      isPersona: "true",
    });

    window.open(`/quiz?${params.toString()}`, "_blank");
  };

  return (
    <div className="flex flex-col p-5 rounded-xl gap-4 bg-white text-black h-full shadow-md">
      <div className="flex gap-2 ">
        <h2 className="text-base whitespace-nowrap font-medium">
          {item.name}, {item.age}
        </h2>
        -
        <span className="text-sm mt-auto text-left jost font-light">
          {" "}
          {item.title}
        </span>
      </div>

      <div className="flex gap-3 h-full items-start">
        <img
          src={item.img}
          alt="Avatar"
          className="w-14 h-14 rounded-full object-cover"
        />
        <div className="flex flex-col justify-between h-full text-left">
          <div className="h-full grow">
            <p className="text-sm jost grow font-light text-black">
              {item.text}
            </p>
            <p className="mt-3">{item.persona_question}</p>
          </div>
          <button
            className="mt-5 w-full text-xs rounded-lg px-4 py-2 bg-[#567257] text-white"
            onClick={handleClick}
          >
            Explore this retirement
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
