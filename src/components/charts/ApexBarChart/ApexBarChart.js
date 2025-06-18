"use client";

import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

const ApexBarChart = ({ values = [], labels = [] }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartConfig = {
      series: [
        {
          name: "Sales",
          data: values.length ? values : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // fallback
        },
      ],
      chart: {
        type: "bar",
        height: 240,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
          borderRadius: 6,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: { enabled: false },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          gradientToColors: ["rgba(169, 52, 189, 1)"],
          opacityFrom: 0.5,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      colors: ["rgba(169, 52, 189, 0.8)"],
      xaxis: {
        categories: labels.length ? labels : [],
        labels: {
          style: {
            colors: "#464646",
            fontSize: "14px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        axisTicks: { show: false },
        axisBorder: { show: false },
      },
      yaxis: {
        labels: {
          formatter: (value) => `$${value}`,
          style: {
            colors: "#464646",
            fontSize: "14px",
            fontFamily: "inherit",
            fontWeight: 500,
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        padding: {
          top: 10,
          bottom: -5,
          left: 0,
          right: 10,
        },
      },
      tooltip: {
        theme: "dark",
        y: {
          formatter: (val) => `$${val}`,
        },
      },
    };

    const chart = new ApexCharts(chartRef.current, chartConfig);
    chart.render();

    return () => chart.destroy();
  }, [values, labels]); // <- ensure chart updates on prop changes

  return <div ref={chartRef} />;
};

export default ApexBarChart;
