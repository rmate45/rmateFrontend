"use client";

import React, { useState } from "react";
import DateFilter from "@/components/form/DateFilter/DateFilter";
import RevenueCard from "@/components/cards/RevenueCard/RevenueCard";
import RevenueChartCard from "@/components/cards/RevenueChartCard/RevenueChartCard";
import TicketSection from "@/components/shared/TicketSection/TicketSection";
import PropertiesLayout from "@/components/layout/PropertiesLayout/PropertiesLayout";
import { useRouter } from "next/navigation";
import { useGetDashboardSummaryQuery } from "@/apis/admin/adminApi";

const AdminDashboard = () => {
  const router = useRouter();
  const [filter, setFilter] = useState("yearly");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const queryParams = {
    type: "overview",
    filter: filter,
    ...(filter === "custom" && startDate && endDate
      ? { start_date: startDate, end_date: endDate }
      : {}),
  };

  const { data, error, isLoading } = useGetDashboardSummaryQuery(queryParams, {
    skip: filter === "custom" && (!startDate || !endDate),
  });

  const {
    data: chartData,
    error: chartError,
    isLoading: chartIsLoading,
  } = useGetDashboardSummaryQuery(
    {
      ...queryParams,
      type: "chart",
    },
    {
      skip: filter === "custom" && (!startDate || !endDate),
    }
  );

  return (
    <div className="space-y-6">
      <DateFilter
        date={filter}
        setDate={setFilter}
        onCustomDateChange={({ startDate, endDate }) => {
          setStartDate(startDate);
          setEndDate(endDate);
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {data &&
          Object.entries(data?.data).map(([key, item]) => (
            <RevenueCard
              key={key}
              title={key
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())} // Convert snake_case to Title Case
              value={`$${item.amount}`}
              percentage={item.change}
              profit={item.direction}
              label={item.label}
            />
          ))}
      </div>

      <div className="flex gap-5 flex-col lg:flex-row">
        <div className="flex-1">
          <RevenueChartCard
            totalRevnue={data?.data?.total_revenue}
            labels={chartData?.data?.labels}
            values={chartData?.data?.values}
          />
        </div>
        <TicketSection />
      </div>

      <div>
        <PropertiesLayout
          onClickProperty={(propertyId) =>
            router.push(`/dashboard/properties/${propertyId}`)
          }
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
