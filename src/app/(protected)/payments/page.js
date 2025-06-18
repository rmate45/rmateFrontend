"use client";
import React from "react";
import DataTable from "@/components/tables/DataTable/DataTable";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Page = () => {
  const paymentData = [
    {
      id: "1",
      date: "01-01-2025",
      name: "Omar Franci",
      tenantId: "TNT-10987",
      propertyId: "PROP-20240321",
      amount: "$700",
      status: "Scheduled",
    },
    {
      id: "2",
      date: "01-01-2025",
      name: "Omar Franci",
      tenantId: "TNT-10987",
      propertyId: "PROP-20240321",
      amount: "$700",
      status: "Overdue",
    },
    {
      id: "3",
      date: "01-01-2025",
      name: "Omar Franci",
      tenantId: "TNT-10987",
      propertyId: "PROP-20240321",
      amount: "$700",
      status: "Overdue",
    },
    {
      id: "4",
      date: "01-01-2025",
      name: "Omar Franci",
      tenantId: "TNT-10987",
      propertyId: "PROP-20240321",
      amount: "$700",
      status: "Paid",
    },
    {
      id: "5",
      date: "01-01-2025",
      name: "Omar Franci",
      tenantId: "TNT-10987",
      propertyId: "PROP-20240321",
      amount: "$700",
      status: "Paid",
    },
    {
      id: "6",
      date: "01-01-2025",
      name: "Omar Franci",
      tenantId: "TNT-10987",
      propertyId: "PROP-20240321",
      amount: "$700",
      status: "Paid",
    },
    {
      id: "7",
      date: "01-01-2025",
      name: "Omar Franci",
      tenantId: "TNT-10987",
      propertyId: "PROP-20240321",
      amount: "$700",
      status: "Paid",
    },
    // Add more entries as needed
  ];

  const router = useRouter();

  const paymentColumns = [
    { key: "date", header: "Date" },
    { key: "name", header: "Name" },
    { key: "tenantId", header: "Tenant ID" },
    { key: "propertyId", header: "Property Id" },
    { key: "amount", header: "Amount" },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const baseClass = "font-medium";
        if (row.status === "Paid")
          return <span className={`${baseClass} text-activegreen`}>Paid</span>;
        if (row.status === "Overdue")
          return <span className={`${baseClass} text-inactivered`}>Overdue</span>;
        if (row.status === "Scheduled")
          return <span className={`${baseClass} text-primary`}>Scheduled</span>;
        return <span className={baseClass}>{row.status}</span>;
      },
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2 justify-center items-center">
          <Image
            src="/view.svg"
            width={16}
            height={16}
            alt="view"
            className="cursor-pointer"
            onClick={() => router.push(`/payment/properties/${row.id}`)}
          />  
          <Image
            src="/download.svg"
            width={16}
            height={16}
            alt="view"
            className="cursor-pointer"
          />
        </div>
      ),
    },
  ];

  const handleAddClick = () => alert("Add new tenant clicked");
  const handleExportClick = () => alert("Export clicked");

  return (
    <>
      <DataTable
        data={paymentData}
        allColumns={paymentColumns}
        itemsPerPage={5}
        enableAdd={false}
        enableSelectDate={true}
        searchInputPaceholder="Search by property"
        isDropdownTable={true}
        changeRowColorOnStatus={true}
        title="Payment History"
      />
    </>
  );
};

export default Page;