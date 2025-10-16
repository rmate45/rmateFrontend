import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  ReferenceDot,
  Label,
} from "recharts";

const dollarFormatter = (value) => `$${(value / 1000).toFixed(0)}K`;

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
    typeof data.text === "string" ? JSON.parse(data.text) : data.text;

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
    <div className="w-full chart-container">
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
                {/* Label the savings value at 67 */}
                <ReferenceDot
                  x={67}
                  y={retirementPoint.savings}
                  r={5}
                  fill="#0e6634"
                >
                  <Label
                    value={`$${(retirementPoint.savings / 1000).toFixed(0)}K`}
                    position="top"
                    fill="#0e6634"
                    fontSize={11}
                    fontWeight={600}
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
                  />
                </ReferenceDot>
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="jost text-sm text-gray-700 mt-4 leading-relaxed text-center">
        {summaryText}
      </p>
    </div>
  );
};

export default PlotChart;
