import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceDot,
  Label,
  ReferenceLine,
} from "recharts";
import Recommendation from "./Recommendation";

const dollarFormatter = (value) => {
  if (value >= 1_000_000) {
    // Format in millions with 1 decimal place
    return `$${(value / 1_000_000).toFixed(1)}M`;
  } else if (value >= 1_000) {
    // Format in thousands with no decimals
    return `$${(value / 1_000).toFixed(0)}K`;
  } else {
    // For values under 1000, show full number
    return `$${value?.toLocaleString()}`;
  }
};

const CustomTooltip = ({ active, payload }) => {

  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const showHouseholdIncome = data.age < 67;
    const showSocialSecurity = data.age >= 67;

    return (
      <div className="bg-white p-2 border border-gray-300 jost rounded shadow-sm text-xs">
        <p className="font-semibold text-gray-700">Age: {data.age}</p>
        <p className="text-green-700">
          Savings: {dollarFormatter(data.savings)}
        </p>
        {showHouseholdIncome && (
          <p className="text-gray-600">
            Household Income: {dollarFormatter(data.householdIncome)}
          </p>
        )}
        {showSocialSecurity && (
          <p className="text-blue-600">
            Social Security: {dollarFormatter(data.socialSecurity)}
          </p>
        )}
        <p className="text-red-600">
          Withdrawal: {dollarFormatter(data.withdrawal)}
        </p>
      </div>
    );
  }
  return null;
};

const PlotChart = ({ data }) => {
  const [showRecommendation, setShowRecommendation] = useState(false);
  const parsedData =
    typeof data.text === "string"
      ? JSON.parse(data.text?.data)
      : data.text?.data;

  const filteredData = parsedData?.filter((item) => item.savings > 0);

  // --- Determine full retirement data point (age 67)
  const retirementPoint = parsedData.find((d) => d.age === 67);

  // --- Determine starting point
  const startPoint = parsedData[0];

  // --- Summary text logic (unchanged)
  let summaryText = "";
  if (parsedData && parsedData.length > 0) {
    const depletionPoint = parsedData.find((d) => d.savings <= 0);
    const endAge = parsedData[parsedData.length - 1].age;
    const lastPositive = parsedData
      .slice()
      .reverse()
      .find((d) => d.savings > 0);
    let savingsLastAge = lastPositive ? lastPositive.age : depletionPoint?.age;
    if (!savingsLastAge) savingsLastAge = endAge;

    if (savingsLastAge >= 97) {
      summaryText = `Great News, you have done incredible work with your savings. We project that your savings will last through your life expectancy of 97 years. However, be aware that unforeseen conditions and high medical costs in later years may pressure your finances.`;
    } else if (savingsLastAge >= 90) {
      summaryText = `Retirement projections show your savings will carry you through your 80s but may run out in your 90s — a critical period when medical costs and life uncertainties often peak. A smart plan and awareness are key to avoid disappointment later in retirement.`;
    } else if (savingsLastAge >= 80) {
      summaryText = `Your savings may support you through your 70s but could run out during your 80s. Planning now with greater awareness is essential to protect your later years.`;
    } else {
      summaryText = `Retirement projections show your savings may last only until age ${savingsLastAge}. This is a critical warning sign. You need to act now, increase awareness, and start planning to avoid a financial shortfall in retirement.`;
    }
  }

  return (
    <div className="w-full">
      <div className="px-2 py-2 rounded-xl border-1 border-green-300 bg-white w-full max-w-full">

        <h1 className="jost text-gray-700 mb-2 mt-2 leading-relaxed text-center">
          How Long Will My Savings Last?
        </h1>

        <div className="h-96">
          <ResponsiveContainer>
            <LineChart
              data={filteredData}
              margin={{ top: 10, right: 10, bottom: 20, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis
                dataKey="age"
                label={{
                  value: "Age",
                  position: "insideBottom",
                  offset: -5,
                  style: { fontSize: 10 },
                }}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                tickFormatter={dollarFormatter}
                label={{
                  value: "Savings",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontSize: 10 },
                }}
                tick={{ fontSize: 10 }}
              />
              <Tooltip content={<CustomTooltip />} />

              {retirementPoint && (
                <ReferenceLine
                  x={retirementPoint.age}
                  stroke="green"
                  strokeDasharray="3 3"
                  strokeWidth={1}
                />
              )}

              {/* Main savings line */}
              <Line
                type="monotone"
                dataKey="savings"
                stroke="#567257"
                strokeWidth={2}
                dot={{ r: 3, fill: "#567257" }}
                activeDot={{ r: 5, fill: "#567257" }}
              />

              {/* === Marker for Full Retirement Age (67) === */}
              {retirementPoint && (
                <>
                  {/* Marker pointer at age 67 */}
                  <ReferenceDot
                    x={67}
                    y={retirementPoint.savings}
                    r={8}
                    fill="#0e6634"
                    stroke="#fff"
                    strokeWidth={2}
                  >
                    {/* <Label
                    value="Full Retirement Age"
                    position="top"
                    fill="#0e6634"
                    fontSize={11}
                    fontWeight={600}
                    offset={15}
                  /> */}
                    <Label
                      value={`${dollarFormatter(retirementPoint.savings)}`}
                      position="top"
                      fill="#0e6634"
                      fontSize={11}
                      fontWeight={600}
                      offset={15}
                      className="custom-saving"
                    />
                  </ReferenceDot>
                </>
              )}

              {/* === "You are here" marker at the start age === */}
              {startPoint && (
                <>
                  <ReferenceDot
                    x={startPoint.age}
                    y={startPoint.savings}
                    r={5}
                    fill="#567257"
                  >
                    <Label
                      value="You are here"
                      position="right"
                      fill="#567257"
                      fontSize={11}
                      className="label-set"
                      offset={10}
                    />
                  </ReferenceDot>
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className=" hidden sm:block">

          <Recommendation data={data} />

        </div>
      </div>
      <div onClick={() => setShowRecommendation(true)} className="px-2 py-2 mt-3 rounded-xl border-1 border-green-300 bg-white w-full max-w-full block sm:hidden">

        {showRecommendation ? <Recommendation data={data} /> :
          <p className=" text-sm max-w-xs rounded-xl flex justify-start items-center jost  text-black">

            Tap here to view the analysis
          </p>}
      </div>
      <div className="order-green-300 bg-green-100 p-3 jost rounded-xl mt-3">
        To receive a free, educational retirement analysis tailored to your age, income, and goals, please enter your contact details below.”
      </div>
    </div>
  );
};

export default PlotChart;
