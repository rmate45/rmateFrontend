import React from "react";
import Qa from "../../assets/qa.png";
import roadmap from "../../assets/roadmap.png";
import checklist from "../../assets/checklist.png";

const RetiremateEdge = () => {
  return (
    <div className="text-center px-6">
      <div className="max-w-7xl mx-auto">
        <p className="text-introPrimary  font-medium text-xl sm:text-3xl text-center">
          The RetireMate Edge
        </p>
        <p className="text-xl  jost inline-block p-1.5 rounded text-[#567257] text-center"> 
          Instant retiremate guidance, every step of the way
        </p>

        <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 max-w-[1080px] mx-auto mt-8 sm:pt-10 pb-10 sm:pb-16">
          {/* Answers you can trust */}
          <div className="flex gap-5 items-start">
            <img src={Qa} alt="QA" width={50} height={50} className="w-11 h-11" />
            <div className="flex flex-col gap-2 text-left">
              <p className="text-wrap font-bold text-lg  text-[#567257]">Answers you can trust</p>
              <p className="text-base  jost inline-block p-1.5 rounded text-[#6B7280]">
                Instant, personalized guidance you can rely on - built on tried and true
                principles used by leading retirement planners.
              </p>
            </div>
          </div>

          {/* Checklists */}
          <div className="flex gap-5 items-start">
            <img src={checklist} alt="Checklist" width={50} height={50} className="w-11 h-11" />
            <div className="flex flex-col gap-2 text-left">
              <p className="text-wrap font-bold text-lg md:text-[18px] text-[#567257] grow-1 mb-2">Checklists guide you forward</p>
              <p className="text-base  jost inline-block p-1.5 rounded text-[#6B7280]">
                Retirement can feel overwhelming. Our checklists cut through the noise, showing
                you exactly what matters right now.
              </p>
            </div>
          </div>

          {/* Roadmap */}
          <div className="flex gap-5 items-start">
            <img src={roadmap} alt="Roadmap" width={50} height={50} className="w-11 h-11" />
            <div className="flex flex-col gap-2 text-left">
              <p className="text-wrap font-bold text-lg md:text-[18px] text-[#567257] grow-1 mb-2">A Roadmap built for you</p>
              <p className="text-base  jost inline-block p-1.5 rounded text-[#6B7280]">
                RetireMate tailors a plan to your goals and coaches you to achieve it, always
                with you, every step of the way.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetiremateEdge;
