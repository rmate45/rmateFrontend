"use client";

import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

const ApexLineChart = ({ values = [], labels = [] }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartConfig = {
      series: [
        {
          name: "Growth",
          data: values.length ? values : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
      chart: {
        type: "area",
        height: 200,
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      stroke: {
        curve: "straight",
        width: 2,
        dashArray: [4],
        colors: ["#22C55E"],
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.1,
          inverseColors: false,
          opacityFrom: 0.4,
          opacityTo: 0,
          stops: [0, 100],
        },
        colors: ["#22C55E"],
      },
      xaxis: {
        categories: labels.length ? labels : [],
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontWeight: 400,
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          formatter: (value) => `${Math.round(value / 1000)}k`,
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontWeight: 400,
          },
          offsetX: -10, // ⬅️ Adds gap between labels and plot area
        },
      },
      grid: {
        borderColor: "#E5E7EB",
        strokeDashArray: 4,
        padding: {
          left: 20, // ⬅️ Adds space between Y-axis and chart
        },
      },
      tooltip: {
        theme: "light",
        y: {
          formatter: (val) => `$${val.toLocaleString()}`,
        },
      },
    };

    const chart = new ApexCharts(chartRef.current, chartConfig);
    chart.render();

    return () => chart.destroy();
  }, [values, labels]);

  return <div ref={chartRef} />;
};

export default ApexLineChart;
