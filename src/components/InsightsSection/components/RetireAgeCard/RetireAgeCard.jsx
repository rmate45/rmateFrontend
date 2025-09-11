// components/InsightsSection/RetireAgeCard.js
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import DataTable from "../../../DataTable/DataTable";

const savingsColumns = [
  { key: "savings", label: "Savings" },
  { key: "budget", label: "Budget" },
  { key: "comfort", label: "Comfort" },
  { key: "luxury", label: "Luxury" },
];

const savingsData = [
  { savings: "$250/mo", budget: 72, comfort: 75, luxury: 80 },
  { savings: "$500/mo", budget: 67, comfort: 70, luxury: 77 },
  { savings: "$750/mo", budget: 65, comfort: 67, luxury: 74 },
  { savings: "$1000/mo", budget: 63, comfort: 65, luxury: 72 },
];

const barData = [
  { savings: "$250", age: 72 },
  { savings: "$500", age: 67 },
  { savings: "$750", age: 65 },
  { savings: "$1K", age: 63 },
];

const RetireAgeCard = () => {

  return (
    <div className="bg-white rounded-[20px] shadow p-5">
      <h3 className="font-medium text-base mb-3 jost text-introPrimary">
        What age can I retire?
      </h3>
      <p className="text-sm jost text-left mb-5 text-introPrimary">
        You can retire as early as <strong>63</strong> with a comfortable
        lifestyle in Los Angeles, CA, by saving <strong>$1,000/month</strong>.
      </p>

      <div className="flex flex-wrap xl:flex-nowrap">
        <div className="w-full h-64">
          <ResponsiveContainer>
            <BarChart
              data={barData}
              margin={{ top: 20, right: 20, bottom: 30, left: 20 }}
            >
              <XAxis
                dataKey="savings"
                label={{
                  value: "$ Retirement Savings/month",
                  position: "insideBottom",
                  offset: -5,
                  style: { fontFamily: "Jost, sans-serif", fontSize: 12 },
                }}
                tick={{
                  style: { fontFamily: "Jost, sans-serif", fontSize: 12 },
                }}
              />
              <YAxis
                domain={[60, 80]}
                ticks={[60, 65, 70, 75, 80]}
                label={{
                  value: "Age",
                  angle: -90,
                  position: "insideLeft",
                  style: { fontFamily: "Jost, sans-serif", fontSize: 12 },
                }}
                tick={{
                  style: { fontFamily: "Jost, sans-serif", fontSize: 12 },
                }}
              />
              <Tooltip
                contentStyle={{ fontFamily: "Jost, sans-serif" }}
                itemStyle={{ fontFamily: "Jost, sans-serif" }}
                labelStyle={{ fontFamily: "Jost, sans-serif" }}
              />
              <Bar dataKey="age" fill="#567257" radius={[8, 8, 0, 0]}>
                <LabelList
                  dataKey="age"
                  position="top"
                  fill="#2A2420"
                  fontSize={12}
                  style={{ fontFamily: "Jost, sans-serif" }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 flex-1/2 flex flex-col items-center xl:items-start">
          <DataTable columns={savingsColumns} data={savingsData} />
          <p className="mt-4 text-left text-xs jost text-introPrimary">
            Saving $1,000 or 5% of your monthly income — the max recommended —
            could allow you to retire as young as 63. Saving $250 or 1% of your
            monthly income would allow you to retire comfortably by 72.
          </p>
          <button
            className="mt-4 rounded-lg px-4 py-2 bg-[#567257] text-white"
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

export default RetireAgeCard;
