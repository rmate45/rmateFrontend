import React from "react";

const TestimonialCard = ({ item }) => {

  console.log(item, "item")

  const handleClick = () => {
    const params = new URLSearchParams({
      // age: item.age || "",
      // householdIncome: item.annualIncome || "0",
      // retirementSavings: item.totalSavings || "0",
      // otherSavings: item.otherSavings || "0",
      // chatBubble: item.chatBubble || "",
      isPersona: "true",
      id: item.id || "",
    });

    window.open(`/quiz?${params.toString()}`, "_blank");
  };

  return (
    <div className="flex flex-col p-5 rounded-xl gap-4 bg-white text-black h-full" style={{boxShadow:"rgba(0, 0, 0, 0.15) 0px 4px 15px"}}>
      <div className="flex gap-3 items-center">
        <img
          src={item.img}
          alt="Avatar"
          className="w-14 h-14 rounded-full object-cover shrink-0"
        />
        <div className="grow text-left">

          <h2 className="text-base whitespace-nowrap text-[#567257] font-semibold">
            {item.name}, {item.age}
          </h2>
          <span className="text-sm mt-auto text-left jost font-medium text-[#6B7280]">
            {" "}
            {item.title}
          </span>
        </div>
      </div>

      <div className="flex gap-3 h-full items-start">

        <div className="flex flex-col justify-between h-full text-left items-start">
          <div className="h-full grow">
            <p className="text-wrap font-bold text-lg md:text-[18px] text-[#567257] grow-1 mb-3">{item.persona_question}</p>
            <p className="text-[14px] lg:text-[16px]  jost inline-block p-1.5 rounded text-[#6B7280]">
              {item.text}
            </p>
          </div>
          <button
            className="mt-5 text-xs rounded-lg px-4 py-2 bg-[#567257] text-white"
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
