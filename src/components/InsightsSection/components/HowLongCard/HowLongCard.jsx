// components/InsightsSection/HowLongCard.js
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
import DataTable from "../../../DataTable/DataTable";

const lifestyleColumns = [
  { key: "lifestyle", label: "Lifestyle" },
  { key: "age", label: "Age Savings Run Out" },
];

const lifestyleData = [
  { lifestyle: "Budget", age: "85-89" },
  { lifestyle: "Comfort", age: "81-84" },
  { lifestyle: "Luxury", age: "72-75" },
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

const HowLongCard = () => (
  <div className="bg-white rounded-[20px] shadow p-5">
    <h3 className="font-medium text-base mb-3 text-introPrimary">
      How long will my savings last?
    </h3>
    <p className="text-sm jost text-left mb-5 text-introPrimary">
      Your savings will last until you’re 81-84*, if you retire at 70 in Los
      Angeles, CA, and maintain a comfortable lifestyle.
    </p>

    <div className="flex flex-wrap xl:flex-nowrap">
      <div className="w-full h-64">
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis dataKey="age" />
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
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-col items-center xl:items-start">
        <DataTable columns={lifestyleColumns} data={lifestyleData} />
        <p className="mt-4 text-left text-xs jost text-introPrimary">
          Living a budget lifestyle will extend your savings until you’re 85-89,
          living luxuriously will reduce it to 72-75.
        </p>
      </div>
    </div>
  </div>
);

export default HowLongCard;
