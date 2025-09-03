// components/InsightsSection/RetireAgeCard.js
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import DataTable from "../../../DataTable/DataTable";

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

const barData = [
  { savings: "$250", age: 72 },
  { savings: "$500", age: 67 },
  { savings: "$750", age: 65 },
  { savings: "$1K", age: 63 },
];

const RetireAgeCard = () => (
  <div className="bg-white rounded-[20px] shadow p-5">
    <h3 className="font-medium text-base mb-3 text-introPrimary">What age can I retire?</h3>
    <p className="text-sm jost text-left mb-5 text-introPrimary">
      You can retire as early as 63 with a comfortable lifestyle in Los Angeles, CA.
    </p>

    <div className="flex flex-wrap xl:flex-nowrap">

    <div className="w-full h-64">
      <ResponsiveContainer>
        <BarChart data={barData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <XAxis dataKey="savings" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="age" fill="#567257" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="mt-2 flex-1/2">
      <DataTable columns={savingsColumns} data={savingsData} />
      <p className="mt-4 text-left text-xs jost text-introPrimary">
        Saving $1,000 or 5% of your monthly income — the max recommended — could
        allow you to retire as young as 63. Saving $250 or 1% of your monthly
        income would allow you to retire comfortably by 72.
      </p>
    </div>
    </div>
  </div>
);

export default RetireAgeCard;
