"use client";

import DropDownContent from "@/components/shared/DropDownContent/DropDownContent";
import PropertyDetails from "@/components/shared/PropertyDetails/PropertyDetails";
import DataTable from "@/components/tables/DataTable/DataTable";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";

const Page = () => {
  const params = useParams();
  const id = params.id;

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
      render: () => (
        <div className="flex gap-2 justify-center items-center">
          <Image
            src="/view.svg"
            width={16}
            height={16}
            alt="view"
            className="cursor-pointer"
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
  return (
    <div>
      <div className="max-w-9/12">
        <PropertyDetails />
        <DropDownContent title="Payment History">
          <DataTable
            data={paymentData}
            allColumns={paymentColumns}
            itemsPerPage={5}
            enableAdd={false}
            enableSelectDate={true}
            searchInputPaceholder="Search by property"
            isDropdownTable={true}
            changeRowColorOnStatus={true}
          />
        </DropDownContent>
      </div>
    </div>
  );
};

export default Page;
