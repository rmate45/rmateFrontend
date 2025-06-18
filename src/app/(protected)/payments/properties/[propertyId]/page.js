"use client";

import DropDownContent from "@/components/shared/DropDownContent/DropDownContent";
import PropertyDetails from "@/components/shared/PropertyDetails/PropertyDetails";
import RevenueBox from "@/components/shared/RevenueBox/RevenueBox";
import UserCard from "@/components/cards/UserCard/UserCard";
import DataTable from "@/components/tables/DataTable/DataTable";
import MentainanceTable from "@/components/tables/MentainanceTable/MentainanceTable";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";
import PropertyDetailsCard from "@/components/cards/PropertyDetailsCard/PropertyDetailsCard";
import DocumentsPreviewCard from "@/components/cards/DocumentsPreviewCard/DocumentsPreviewCard";
import InsuranceCard from "@/components/cards/InsuranceCard/InsuranceCard";
import TenantLeaseCard from "@/components/cards/TenantLeaseCard/TenantLeaseCard";

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

  const maintenanceData = [
    {
      id: "1",
      date: "01-01-2025",
      description:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
      photos: "https://picsum.photos/id/237/200/300",
      status: "Pending",
    },
    {
      id: "2",
      date: "01-01-2025",
      description:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
      photos: "https://picsum.photos/id/237/200/300",
      status: "Assigned",
    },
    {
      id: "3",
      date: "01-01-2025",
      description:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
      photos: "https://picsum.photos/id/237/200/300",
      status: "Resolved",
    },
    {
      id: "4",
      date: "01-01-2025",
      description:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
      photos: "https://picsum.photos/id/237/200/300",
      status: "Resolved",
    },
    {
      id: "5",
      date: "01-01-2025",
      description:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
      photos: "https://picsum.photos/id/237/200/300",
      status: "Resolved",
    },
    {
      id: "6",
      date: "01-01-2025",
      description:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
      photos: "https://picsum.photos/id/237/200/300",
      status: "Resolved",
    },
    {
      id: "7",
      date: "01-01-2025",
      description:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
      photos: "https://picsum.photos/id/237/200/300",
      status: "Resolved",
    },
    // Add more entries as needed
  ];

  const maintenanceColumns = [
    { key: "date", header: "Date Submitted" },
    { key: "description", header: "Maintenance Description" },
    {
      key: "photos",
      header: "Photos",
      render: (row) => {
        return <Image src={row.photos} alt="image" width={80} height={80} />;
      },
    },
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
    <div className="flex gap-4">
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
        <DropDownContent title="Mentainance History">
          <MentainanceTable
            data={maintenanceData}
            allColumns={maintenanceColumns}
            itemsPerPage={5}
            enableAdd={false}
            enableSelectDate={true}
            enableEdit={false}
            enableExport={false}
            searchInputPaceholder="Search"
            isDropdownTable={true}
            changeRowColorOnStatus={true}
          />
        </DropDownContent>
      </div>
      <div className="flex flex-col flex-1 gap-4">
        
        <div className="flex gap-4">
          <RevenueBox
            title="Market Value"
            price="$500,000"
            priceColor="#3AC887"
          />
          <RevenueBox
            title="Assessed Value"
            price="$400,000"
            priceColor="#000000"
          />
        </div>

        <UserCard
          name="Ryan Levin"
          userId="USR-10293"
          imageUrl="https://picsum.photos/id/237/200/300"
        />

        <PropertyDetailsCard
          details={{
            acquisitionDate: "22-07-2018",
            propertyType: "Residential",
            lotSize: "850 sq. ft.",
            ownershipStatus: "Tenant Occupied",
            yearBuild: "2012",
            bedroom: 2,
            bathroom: 1,
            parking: 1,
          }}
          onEdit={() => console.log("Edit clicked")}
        />

        <DocumentsPreviewCard />

        <InsuranceCard
          policyNumber="HO-123-456-7890"
          companyName="Company Name"
          validTill="2 Jan 2028"
          planPrice="150"
        />

        <TenantLeaseCard
          tenantName="Chris Friedkly"
          tenantId="TEN-10293"
          tenantImage="https://picsum.photos/id/237/200/300"
          numOfTenants={1}
          leaseDuration="12 Months"
          leaseStart="03/21/2025"
          leaseEnd="03/21/2026"
          securityDeposit={1000}
          onEdit={() => console.log("Edit clicked")}
          onRelease={() => console.log("Release tenant clicked")}
        />
      </div>
    </div>
  );
};

export default Page;
