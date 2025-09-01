// components/InsightsSection/InsightsSection.js
import React from "react";
import DataTable from "../DataTable/DataTable";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const lifestyleColumns = [
  { key: "lifestyle", label: "Lifestyle" },
  { key: "age", label: "Age Savings Run Out" },
];

const lifestyleData = [
  { lifestyle: "Budget", age: "85-89" },
  { lifestyle: "Comfort", age: "81-84" },
  { lifestyle: "Luxury", age: "72-75" },
];

const savingsColumns = [
  { key: "savings", label: "Savings" },
  { key: "budget", label: "Budget" },
  { key: "comfort", label: "Comfort" },
  { key: "luxury", label: "Luxury" },
];

const savingsData = [
  { savings: "$250/mo", budget: 67, comfort: 72, luxury: 80 },
  { savings: "$500/mo", budget: 63, comfort: 67, luxury: 75 },
  { savings: "$750/mo", budget: 61, comfort: 65, luxury: 72 },
  { savings: "$1000/mo", budget: 59, comfort: 63, luxury: 67 },
];

const data = [
  { age: 67, budget: 100, comfort: 120, luxury: 150 },
  { age: 72, budget: 80, comfort: 90, luxury: 110 },
  { age: 81, budget: 40, comfort: 50, luxury: 70 },
  { age: 85, budget: 10, comfort: 20, luxury: 30 },
];

const lines = [
  { key: "budget", color: "#567257" },
  { key: "comfort", color: "#A3C586" },
  { key: "luxury", color: "#C68A6B" },
];


const InsightCard = ({ title, description, chartPlaceholder }) => {
  return (
    <div className="bg-white rounded-[20px] shadow p-5">
      <h3 className="font-medium text-base mb-3">{title}</h3>
      <p className="text-sm jost text-left mb-5">{description}</p>
      <div className="rounded flex gap-5 items-center justify-between">
       <div className="w-full h-64">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis dataKey="age" label={{ value: "Age", position: "insideBottom", offset: -5 }} />
          <YAxis label={{ value: "$", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          {lines.map((line, idx) => (
            <Line
              key={idx}
              type="monotone"
              dataKey={line.key}
              stroke={line.color}
              strokeWidth={2.5}
              dot={false}
              activeDot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
        <div>
          <DataTable columns={lifestyleColumns} data={lifestyleData} />
          <p className="mt-2 text-left text-xs jost">Living a budget lifestyle will extend your savings until you’re 85-89, living luxuriously will reduce it to 72-75.</p>
        </div>
      </div>
    </div>
  );
};

const InsightsSection = ({ insights = [] }) => {
  const defaultInsights = [
    {
      id: 1,
      title: "How long will my savings last?",
      description:
        "Your savings will last until you're 81-84*, if you retire at 70 in Los Angeles, CA, and maintain a comfortable lifestyle.",
    },
    {
      id: 2,
      title: "What age can I retire?",
      description:
        "You can retire as early as 63 with a comfortable lifestyle in Los Angeles, CA.",
    },
  ];

  const insightsToDisplay = insights.length > 0 ? insights : defaultInsights;

  return (
    <div className="bg-[#E7C7C3] text-center px-6 py-10 sm:py-16">
      <div className="max-w-6xl mx-auto">
        <p className="text-[#2A2420] font-medium text-xl sm:text-2xl mb-8">
          RetireMate makes it easy to get the right answers <br /> to all your
          retirement questions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insightsToDisplay.map((insight) => (
            <InsightCard
              key={insight.id}
              title={insight.title}
              description={insight.description}
              chartPlaceholder={insight.chartPlaceholder}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsightsSection;
