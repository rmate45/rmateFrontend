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

const PlotChart = ({ data }) => {
  return (
    <div className="w-full h-64 sm:h-80">
      <ResponsiveContainer>
        <LineChart
          data={data}
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
          <Tooltip formatter={(v) => dollarFormatter(v)} />
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
  );
};

export default PlotChart;
