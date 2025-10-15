// components/PlotChart.js
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const dollarFormatter = (value) => `$${(value / 1000).toFixed(0)}K`;

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border border-gray-300 jost rounded shadow-sm text-xs">
        <p className="font-semibold jost text-gray-700">Age: {data.age}</p>
        <p className="text-green-700 jost">
          Savings: {dollarFormatter(data.savings)}
        </p>
        <p className="text-gray-600 jost">
          Household Income: {dollarFormatter(data.householdIncome)}
        </p>
        <p className="text-blue-600 jost">
          Social Security: {dollarFormatter(data.socialSecurity)}
        </p>
        <p className="text-red-600 jost">
          Withdrawal: {dollarFormatter(data.withdrawal)}
        </p>
      </div>
    );
  }
  return null;
};

const PlotChart = ({ data }) => {
  // Parse data if it’s a JSON string
  const parsedData =
    typeof data.text === "string" ? JSON.parse(data.text) : data.text;

  // ===============================
  // Generate Summary Insight
  // ===============================
  let summaryText = "";
  if (parsedData && parsedData.length > 0) {
    const startAge = parsedData[0].age;
    const endAge = parsedData[parsedData.length - 1].age;
    const peakSavings = Math.max(...parsedData.map((d) => d.savings));
    const minSavings = Math.min(...parsedData.map((d) => d.savings));
    const depletionPoint = parsedData.find((d) => d.savings <= 0);
    const lastPositive = parsedData
      .slice()
      .reverse()
      .find((d) => d.savings > 0);

    if (depletionPoint) {
      summaryText = `Based on your responses, your current savings and income sources are projected to last until around age ${depletionPoint.age}. Beyond this point, your savings may be depleted unless adjustments are made to your spending or withdrawals.`;
    } else {
      summaryText = `According to your responses, your savings appear sustainable through at least age ${endAge}, peaking at around ${dollarFormatter(
        peakSavings
      )} and remaining above ${dollarFormatter(
        minSavings
      )} by the end of the forecast period.`;
    }

    if (lastPositive && !depletionPoint) {
      summaryText += ` This suggests a solid retirement plan with consistent income support until your late years.`;
    }
  } else {
    summaryText =
      "No data available to generate insights. Please review your responses and try again.";
  }

  // ===============================
  // Render
  // ===============================
  return (
    <div className="w-full h-[520px] sm:h-[480px]">
      <div className="h-96">
        <ResponsiveContainer>
          <LineChart
            data={parsedData}
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
            <Line
              type="monotone"
              dataKey="savings"
              stroke="#567257"
              strokeWidth={2}
              dot={{ r: 3, fill: "#567257" }}
              activeDot={{ r: 5, fill: "#567257" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Dynamic Summary Text */}
      <p className="jost text-sm text-gray-700 mt-4 leading-relaxed text-center">
        {summaryText}
      </p>
    </div>
  );
};

export default PlotChart;
