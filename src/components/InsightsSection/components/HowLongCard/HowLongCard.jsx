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

const lifestyleColumns = [
  { key: "lifestyle", label: "Lifestyle" },
  { key: "age", label: "Age Savings Run Out" },
];

const lifestyleData = [
  { lifestyle: "Budget", age: "85-89", color: "#567257" },
  { lifestyle: "Comfort", age: "81-84", color: "#A3C586" },
  { lifestyle: "Luxury", age: "72-75", color: "#C68A6B" },
];

// Base savings
const initialSavings = 156000; // $156K

// Data for chart (start from $156K and decrease)
const data = [
  { age: 67, budget: 156000, comfort: 156000, luxury: 156000 },
  { age: 72, budget: 120000, comfort: 110000, luxury: 95000 },
  { age: 81, budget: 60000, comfort: 45000, luxury: 20000 },
  { age: 85, budget: 20000, comfort: 5000, luxury: 0 },
];

const lines = [
  { key: "budget", color: "#567257" },
  { key: "comfort", color: "#A3C586" },
  { key: "luxury", color: "#C68A6B" },
];

// Formatter for axis numbers
const dollarFormatter = (value) => `$${(value / 1000).toFixed(0)}K`;

const HowLongCard = () => {

  return (
    <div className="bg-white rounded-[20px] shadow p-5">
      <h3 className="font-medium text-base mb-3 text-introPrimary">
        How long will my savings last?
      </h3>
      <p className="text-sm jost text-left mb-5 text-introPrimary">
        Your savings of <strong>${(initialSavings / 1000).toFixed(0)}K</strong>{" "}
        will last until you’re 81-84*, if you retire at 70 in Los Angeles, CA,
        and maintain a comfortable lifestyle.
      </p>

      <div className="flex flex-wrap xl:flex-nowrap items-end">
        <div className="w-full h-64">
          <ResponsiveContainer>
            <LineChart
              data={data}
              margin={{ top: 20, right: 20, bottom: 30, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis
                dataKey="age"
                label={{ value: "Age", position: "insideBottom", offset: -10 }}
              />
              <YAxis
                tickFormatter={dollarFormatter}
                label={{
                  value: "$",
                  angle: -90,
                  position: "insideLeft",
                  offset: 0,
                }}
              />
              <Tooltip formatter={(v) => dollarFormatter(v)} />
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
          {/* Table with row colors */}
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {lifestyleColumns.map((col) => (
                  <th key={col.key} className="px-3 py-2 text-left">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lifestyleData.map((row, i) => (
                <tr
                  key={i}
                  style={{ backgroundColor: `${row.color}22` }} // light tint
                >
                  <td
                    className="px-3 py-2 font-medium"
                    style={{ color: row.color }}
                  >
                    {row.lifestyle}
                  </td>
                  <td className="px-3 py-2">{row.age}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-4 text-left text-xs jost text-introPrimary">
            Living a budget lifestyle will extend your savings until you’re
            85-89, living luxuriously will reduce it to 72-75.
          </p>

          <button
            className="mt-4 rounded-lg px-4 py-2 bg-[#567257] text-white text-base"
            onClick={() => {
                window.open(`/quiz`, "_blank");
            }}
          >
            Get started on yours
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowLongCard;
