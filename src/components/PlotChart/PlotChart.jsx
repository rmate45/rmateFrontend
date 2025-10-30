import React from "react";
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

      <div className=" text-sm  mt-4 sm:px-4">
        <p className="jost text-lg text-gray-700 leading-relaxed ">
          Recommendations from RetireMate:
        </p>
        <ul className="max-w-xl mt-2 pl-4 sm:pl-6">
          {(() => {
            const recommendations = data?.text?.recommendations;
            const scenario = recommendations?.scenario;
            const depletionAge = recommendations?.savingsDepletionAge;
            const alternativeScenarios = recommendations?.alternativeScenarios;
            const recTexts = recommendations?.recommendations || [];

            // Check if we need custom rendering for scenario 3 with depletion age < 90
            if (scenario === 3 && depletionAge < 90) {
              const increasedContributions =
                alternativeScenarios?.increasedContributions || [];
              const alternativeGrowth =
                alternativeScenarios?.alternativeGrowth || [];

              return (
                <>
                  {/* 1. Projected Longevity of Savings */}
                  <li className="jost text-left text-gray-700 leading-relaxed mb-2">
                    <span className="  font-semibold mr-1">1.</span>
                    <strong>Projected Longevity of Savings:</strong>
                    <ul className=" mt-1">
                      <li className="text-gray-700 jost">
                        <span className="mr-1">•</span>
                        {recTexts[0] ||
                          `Your total savings are projected to last until approximately age ${
                            depletionAge - 3
                          } to ${depletionAge + 2}.`}
                      </li>
                    </ul>
                  </li>

                  {/* 2. Impact of Monthly Contributions */}
                  <li className="jost text-left text-gray-700 leading-relaxed mb-2">
                    <span className=" font-semibold mr-1">2.</span>
                    <strong>Impact of Monthly Contributions:</strong>
                    <ul className=" mt-1">
                      <li className="text-gray-700 mb-1 jost">
                        <span className="mr-1">•</span>
                        {recTexts[1] ||
                          "Current model assumes a 10% contribution from household income."}
                      </li>
                      <li className="text-gray-700 mb-1 jost">
                        <span className="mr-1">•</span>
                        {recTexts[2] ||
                          "Increasing contributions can significantly extend your savings horizon:"}
                      </li>
                      {increasedContributions.map((contrib, idx) => (
                        <li key={idx} className="text-gray-700 ml-4 text-sm jost">
                          <span className="mr-1">○</span>
                          At {contrib.contributionRate}% contribution ($
                          {contrib.monthlyContribution?.toLocaleString()}/month)
                          → lasts until age {contrib.projectedAgeRange.min} to{" "}
                          {contrib.projectedAgeRange.max}
                        </li>
                      ))}
                    </ul>
                  </li>

                  {/* 3. Impact of Market Conditions */}
                  <li className="jost text-left text-gray-700 leading-relaxed mb-2">
                    <span className=" font-semibold mr-1">3.</span>
                    <strong>Impact of Market Conditions:</strong>
                    <ul className=" mt-1">
                      <li className="text-gray-700 mb-1 jost">
                        <span className="mr-1">•</span>
                        Current model assumes a 6% nominal annual growth rate
                        (moderate growth).
                      </li>
                      <li className="text-gray-700 mb-1 jost">
                        <span className="mr-1">•</span>
                        Under alternative growth assumptions:
                      </li>
                      {alternativeGrowth.map((growth, idx) => (
                        <li key={idx} className="text-gray-700 ml-4 text-sm jost">
                          <span className="mr-1">○</span>
                          {growth.growthRate}% ({growth.riskLevel}) → lasts
                          until age {growth.projectedAgeRange.min} to{" "}
                          {growth.projectedAgeRange.max}
                        </li>
                      ))}
                    </ul>
                  </li>

                  {/* 4. Monthly Savings Recommendation */}
                  <li className="jost text-left text-gray-700 leading-relaxed mb-2">
                    <span className=" font-semibold mr-1">4.</span>
                    <strong>Monthly Savings Recommendation:</strong>
                    <ul className=" mt-1">
                      <li className="text-gray-700 mb-1 jost">
                        <span className="mr-1">•</span>
                        {recTexts[3] || "You are currently saving per month."}
                      </li>
                      <li className="text-gray-700 jost">
                        <span className="mr-1">•</span>
                        {recTexts[4] ||
                          "Our model recommends increasing this to 15% to 25% per month to stay on track."}
                      </li>
                    </ul>
                  </li>
                </>
              );
            } else {
              // Default rendering for other scenarios
              return recTexts?.map((rec, index) => (
                <li
                  key={index}
                  className="jost text-left text-gray-700 leading-relaxed "
                >
                  <span className="text-lg font-semibold mr-1">•</span> {rec}
                </li>
              ));
            }
          })()}
        </ul>
      </div>
    </div>
  );
};

export default PlotChart;
