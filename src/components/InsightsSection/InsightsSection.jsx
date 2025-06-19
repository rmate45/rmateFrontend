import React, { useState } from "react";

export const InsightsSection = ({ onInsightSelect, insightsData }) => {


  



  // Transform the dynamic data into the format expected by the component
  const transformInsightsData = (data) => {
    if (!data) return [];

    const insights = [];

    // Can I retire at 67?
    if (data.canRetireAt67) {
      const canRetireAnswer = data.canRetireAt67["Can I retire at 67?"];
      insights.push({
        type: "retirement",
        question: "Can I retire at 67?",
        canRetire: canRetireAnswer?.toLowerCase() === "yes",
        fields: [
          {
            label: "Your Projected Savings at 67",
            value: `$${
              data.canRetireAt67[
                "Your Projected Savings at 67"
              ]?.toLocaleString() || "0"
            }`,
            color: "text-green-600",
          },
          {
            label: "Savings Required at 67",
            value: `$${
              data.canRetireAt67["Savings Required at 67"]?.toLocaleString() ||
              "0"
            }`,
            color: "text-green-600",
          },
          {
            label: "Savings Deficit / Surplus",
            value: `$${
              data.canRetireAt67[
                "Savings Deficit / Surplus"
              ]?.toLocaleString() || "0"
            }`,
            color:
              data.canRetireAt67["Savings Deficit / Surplus"] >= 0
                ? "text-green-600"
                : "text-orange-600",
          },
        ],
        detail: "",
      });
    }

    // How much saving is required at 67?
    if (data.savingRequiredAt67) {
      insights.push({
        type: "saving_required",
        question: "How much saving is required at 67?",
        fields: [
          {
            label: "For Budget Lifestyle",
            value: `$${
              data.savingRequiredAt67[
                "For Budget LifeStyle"
              ]?.toLocaleString() || "0"
            }`,
            color: "text-green-600",
          },
          {
            label: "For Comfortable Lifestyle",
            value: `$${
              data.savingRequiredAt67[
                "For Comfortable Lifestyle"
              ]?.toLocaleString() || "0"
            }`,
            color: "text-green-600",
          },
          {
            label: "For Luxury Lifestyle",
            value: `$${
              data.savingRequiredAt67[
                "For Luxury Lifestyle"
              ]?.toLocaleString() || "0"
            }`,
            color: "text-green-600",
          },
        ],
        detail: "",
      });
    }

    // How Long will my money last?
    if (data.howLongMoneyLast) {
      insights.push({
        type: "money_duration",
        question: "How Long will my money last?",
        fields: [
          {
            label: "Money will last",
            value: `${data.howLongMoneyLast["How Long will my money last?"]} years`,
            color: "text-green-600",
          },
          {
            label: "Years Extra/Short",
            value: `${data.howLongMoneyLast["Years Extra"]} years`,
            color:
              data.howLongMoneyLast["Years Extra"] >= 0
                ? "text-green-600"
                : "text-orange-600",
          },
        ],
        years: data.howLongMoneyLast["How Long will my money last?"],
        detail: data.howLongMoneyLast["Message"] || "",
      });
    }

    // Can I Retire Today?
    if (data.canIRetireToday) {
      const canRetireTodayAnswer = data.canIRetireToday["Can I Retire Today?"];
      insights.push({
        type: "retire_today",
        question: "Can I Retire Today?",
        canRetire: canRetireTodayAnswer?.toLowerCase() === "yes",
        fields: [
          {
            label: "Savings Today",
            value: `$${
              data.canIRetireToday["Savings Today"]?.toLocaleString() || "0"
            }`,
            color: "text-green-600",
          },
          {
            label: "Amount Needed to Retire Today",
            value: `$${
              data.canIRetireToday[
                "Amount Needed to Retire Today"
              ]?.toLocaleString() || "0"
            }`,
            color: "text-green-600",
          },
        ],
        // detail: data.canIRetireToday["Message"] || "",
      });
    }

    return insights;
  };

  const insights = transformInsightsData(insightsData);

  return (
    <>
      {insights.map((insight, index) => {
        return (
          <div
            key={index}
            className=" rounded-lg shadow hover:shadow-md transition"
          >
            <div
              className={`cursor-pointer flex justify-center p-6 bg-blue text-white rounded-t-lg  items-center`}
            >
              <h3 className="font-semibold text-lg">{insight.question}</h3>
            </div>

            <div className="pt-8 px-6 pb-8  border border-blue text-sm text-gray-800 space-y-2">
              {insight.hasOwnProperty("canRetire") &&
                insight.type !== "money_duration" && (
                  <div
                    className={`text-lg border-2 rounded-full max-w-fit mx-auto mb-6 p-12 px-12 font-bold text-blue`}
                  >
                    {insight.canRetire ? "YES" : "NO"}
                  </div>
                )}

              {insight.type == "money_duration" && (
                <div>
                  <div className="text-center text-base mt-8 font-medium text-blue mb-6">
                    If you retire at 67 your money will last
                  </div>

                  <div
                    className={`text-lg border-2 rounded-full max-w-fit mx-auto mb-6 p-11 px-12 font-bold text-blue`}
                  >
                    {insight.years} <br/> years
                  </div>
                </div>
              )}

              {insight.fields && insight.type !== "money_duration" && (
                <div className="text-center space-y-8">
                  {insight.fields.map((field, idx) => (
                    <div key={idx}>
                      <div className={`${field.color} font-semibold text-lg`}>
                        {field.value}
                        <hr className="border-b border-[#dfe0e3] my-2 max-w-1/2 mx-auto" />
                      </div>
                      <div className="font-semibold text-base text-blue">
                        {field.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {insight.detail && (
                <div className="text-center text-base mt-8 font-medium text-blue mb-6">
                  {insight.detail}
                </div>
              )}

              <button
                onClick={() => onInsightSelect(insight)}
                className="mt-12 block mx-auto px-6 py-2 bg-secondary text-white font-semibold rounded-full hover:bg-green-400 transition"
              >
                Read More
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
};
