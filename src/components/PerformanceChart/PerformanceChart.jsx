import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const PerformanceChart = ({ data }) => {

    console.log(data, "data")

  const chartData = useMemo(() => {
    if (!data) return [];
    const parsedData = typeof data.text === "string" ? JSON.parse(data.text) : data.text;
    return parsedData || [];
  }, [data]);

  const processedData = useMemo(() => {
    if (!Array.isArray(chartData) || chartData.length === 0) {
      return { 
        ages: [], 
        savings: [], 
        phases: [], 
        retirementAge: null,
        filteredData: [],
        startPoint: null,
        retirementPoint: null
      };
    }

    const filteredData = chartData.filter((item) => item.savings > 0);
    const ages = filteredData.map(d => d.age);
    const savings = filteredData.map(d => d.savings);
    const phases = filteredData.map(d => d.phase);
    
    const retirementPoint = chartData.find((d) => d.age === 67);

    return { 
      ages, 
      savings, 
      phases, 
      retirementAge: 67,
      filteredData,
      startPoint: chartData[0],
      retirementPoint
    };
  }, [chartData]);

  const summaryText = useMemo(() => {
    if (!chartData || chartData.length === 0) return "";
    const lastPositive = chartData.slice().reverse().find((d) => d.savings > 0);
    let savingsLastAge = lastPositive ? lastPositive.age : chartData[chartData.length - 1].age;

    if (savingsLastAge >= 97) {
      return `Great News, you have done incredible work with your savings. We project that your savings will last through your life expectancy of 97 years. However, be aware that unforeseen conditions and high medical costs in later years may pressure your finances.`;
    } else if (savingsLastAge >= 90) {
      return `Retirement projections show your savings will carry you through your 80s but may run out in your 90s — a critical period when medical costs and life uncertainties often peak. A smart plan and awareness are key to avoid disappointment later in retirement.`;
    } else if (savingsLastAge >= 80) {
      return `Your savings may support you through your 70s but could run out during your 80s. Planning now with greater awareness is essential to protect your later years.`;
    } else {
      return `Retirement projections show your savings may last only until age ${savingsLastAge}. This is a critical warning sign. You need to act now, increase awareness, and start planning to avoid a financial shortfall in retirement.`;
    }
  }, [chartData]);

  const chartConfig = useMemo(() => {
    const { ages, savings, startPoint, retirementPoint } = processedData;

    if (ages.length === 0) return null;

    const peakIndex = retirementPoint ? ages.indexOf(retirementPoint.age) : -1;
    
    return {
      chart: {
        type: "line",
         events: {
        load: function() {
          if (this.series[0] && this.series[0].points[0]) {
             this.series[0].points[0].onMouseOver(); 
          }
        }
      },
        backgroundColor: "#ffffff",
        style: { fontFamily: "Jost, sans-serif" },
        height: 400,
        spacingTop: 20,
        spacingRight: 20,
        spacingBottom: 20,
        spacingLeft: 20,
      },
      title: { 
        text: "Retirement Savings Projection",
        style: {
          fontSize: "16px",
          fontWeight: "600",
          color: "#374151"
        }
      },
      xAxis: {
        categories: ages,
        title: { 
          text: "Age",
          style: { fontSize: "10px", color: "#6b7280" }
        },
        labels: { 
          style: { fontSize: "10px", color: "#6b7280" },
          step: Math.ceil(ages.length / 10)
        },
        lineColor: "#dddddd",
        tickColor: "#dddddd",
        gridLineWidth: 0,
        min: 0,
        plotLines: peakIndex >= 0 ? [{
            value: peakIndex,
            color: '#a1a1aa', 
            width: 1,
            dashStyle: 'dash',
            zIndex: 4, 
        }] : []
      },
      yAxis: {
        title: { 
          text: "Savings",
          style: { fontSize: "10px", color: "#6b7280" }
        },
        labels: {
          formatter: function() {
            return `$${(this.value/1000).toFixed(0)}K`;
          },
          style: { fontSize: "10px", color: "#6b7280" }
        },
        gridLineColor: "#dddddd",
        gridLineDashStyle: "Dash",
        gridLineWidth: 1,
        min: 0
      },
      tooltip: {
        useHTML: true,
        backgroundColor: "#ffffff",
        borderColor: "#d1d5db",
        borderWidth: 1,
        borderRadius: 4,
        shadow: true,
        style: { 
          fontSize: "12px",
          padding: "8px"
        },
        formatter: function() {
          const index = this.point.index;
          const dataPoint = processedData.filteredData[index];
          if (!dataPoint) return '';
          
          const age = dataPoint.age;
          const isRetirementAge = age === 67;
          const savings = isRetirementAge ? retirementPoint.savings : dataPoint.savings; 
          const socialSecurity = isRetirementAge ? retirementPoint.socialSecurity : dataPoint.socialSecurity; 
          const withdrawal = isRetirementAge ? retirementPoint.withdrawal : dataPoint.withdrawal; 

          const showHouseholdIncome = age < 67; 
          const showSocialSecurity = age >= 67; 

          return `
            <div style="padding: 4px;">
              <p style="margin: 0; font-weight: 600; color: #374151;">Age: ${age}</p>
              <p style="margin: 2px 0; color: #059669;">Savings: $${(savings/1000).toFixed(0)}K</p>
              ${showHouseholdIncome ? `<p style="margin: 2px 0; color: #6b7280;">Household Income: $${(dataPoint.householdIncome/1000).toFixed(0)}K</p>` : ''}
              ${showSocialSecurity ? `<p style="margin: 2px 0; color: #2563eb;">Social Security: $${(socialSecurity/1000).toFixed(0)}K</p>` : ''}
              <p style="margin: 2px 0; color: #dc2626;">Withdrawal: $${(withdrawal/1000).toFixed(0)}K</p>
            </div>
          `;
        }
      },
      plotOptions: {
        line: {
          marker: {
            enabled: true,
            radius: 3,
            fillColor: "#567257",
            lineWidth: 0,
            symbol: "circle"
          },
          lineWidth: 2,
          color: "#567257"
        }
      },
      series: [{
        name: "Savings",
        data: savings,
        color: "#567257",
        lineWidth: 2
      }, 
      // *** NEW SERIES FOR LEGEND ENTRY ***
      {
        name: `Retirement Age: ${processedData.retirementAge}`,
        data: [null], // No data points, just for legend entry
        type: 'scatter', // Use scatter to easily control the marker
        showInLegend: true,
        marker: {
            symbol: 'circle',
            fillColor: '#0e6634', // Match the Age 67 marker color
            radius: 4
        },
        enableMouseTracking: false, // Prevent tooltips/hover
        color: 'transparent' // Make the line/data transparent if any shows up
      }],
     annotations: [
        // "You are here" permanent label (Start Point)
        ...(startPoint ? [{
          labels: [{
            point: {
              x: 0,
              y: startPoint.savings,
              xAxis: 0,
              yAxis: 0
            },
            useHTML: true,
            text: `
              <div style="background: #ffffff; border: 1px solid #d1d5db; border-radius: 4px; padding: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p style="margin: 0; font-weight: 600; color: #374151; font-size: 12px;">You are here</p>
                <p style="margin: 2px 0 0 0; color: #059669; font-size: 12px;">Age: ${startPoint.age}</p>
                <p style="margin: 2px 0 0 0; color: #059669; font-size: 12px;">Savings: $${(startPoint.savings/1000).toFixed(0)}K</p>
              </div>
            `,
            backgroundColor: "transparent",
            borderColor: "transparent",
            y: -85,
            x: 0
          }],
          shapes: [{
            type: "circle",
            point: {
              x: 0,
              y: startPoint.savings,
              xAxis: 0,
              yAxis: 0
            },
            r: 8,
            fill: "#567257",
            stroke: "#ffffff",
            strokeWidth: 2
          }]
        }] : []),
        
        // Full Retirement Age permanent label (Highest Point highlight)
        ...(retirementPoint && peakIndex >= 0 ? [{
          labels: [{
            point: {
              x: peakIndex,
              y: retirementPoint.savings,
              xAxis: 0,
              yAxis: 0
            },
            useHTML: true,
            text: `
              <div style="background: #ffffff; border: 1px solid #d1d5db; border-radius: 4px; padding: 4px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; font-weight: 600; color: #374151; font-size: 14px;">
                Age ${retirementPoint.age}
              </div>
            `,
            backgroundColor: "transparent",
            borderColor: "transparent",
            y: -30,
            x: 0
          }],
          shapes: [{
            type: "circle",
            point: {
              x: peakIndex,
              y: retirementPoint.savings,
              xAxis: 0,
              yAxis: 0
            },
            r: 8,
            fill: "#0e6634",
            stroke: "#ffffff",
            strokeWidth: 2
          }]
        }] : [])
      ],
      credits: { enabled: false },
      // **ENABLE LEGEND**
      legend: { enabled: true, align: 'center', verticalAlign: 'bottom', layout: 'horizontal' }
    };
  }, [processedData, chartData]);

  if (!chartConfig) {
    return (
      <div className="w-full p-4 text-center text-gray-500">
        No data available for chart
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg">
      <h1 className="jost text-gray-700 mb-2 mt-2 leading-relaxed text-center">
        How Long Will My Savings Last?
      </h1>
      <HighchartsReact highcharts={Highcharts} options={chartConfig} />
      <p className="jost text-sm text-gray-700 mt-4 leading-relaxed text-center px-4 pb-4">
        {summaryText}
      </p>
    </div>
  );
};

export default PerformanceChart;