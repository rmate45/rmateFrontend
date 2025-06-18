"use client";
import {
  useGetTenantByIdQuery,
  useGetTenantDashboardSummaryQuery,
} from "@/apis/tenant/tenantApi";
import ProfileCard from "@/components/cards/ProfileCard/ProfileCard";
import PropertiesLayout from "@/components/layout/PropertiesLayout/PropertiesLayout";
import AssignPropertyModal from "@/components/modals/AssignPropertyModal/AssignPropertyModal";
import DropDownContent from "@/components/shared/DropDownContent/DropDownContent";
import Modal from "@/components/shared/Modal/Modal";
import RevenueBox from "@/components/shared/RevenueBox/RevenueBox";
import TicketList from "@/components/shared/TicketList/TicketList";
import DataTable from "@/components/tables/DataTable/DataTable";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function TenantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [isAssignPropertyModal, setIsAssignPropertyModal] = useState(false);
  const { data, isLoading, isError } = useGetTenantByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: tenantSummary,
    error: tenantSummaryError,
    isLoading: tenantSummaryIsLoading,
  } = useGetTenantDashboardSummaryQuery({
    type: "overview",
    filter: "yearly",
    tenant_id: id
  });

  const tenantProfile = data?.data;

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
          return (
            <span className={`${baseClass} text-inactivered`}>Overdue</span>
          );
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

  if (isLoading) return   <div className="flex justify-center items-center h-64">Loading...</div>;
  if (isError || !tenantProfile)
    return <div>Failed to load tenant details</div>;

  return (
    <div className="mx-auto w-full bg-transparent overflow-hidden">
      <div className="flex gap-4">
        {/* 1. Left Section - Profile Card */}
        <div className="w-[260px] shrink-0">
          <ProfileCard
            name={`${tenantProfile.first_name} ${tenantProfile.last_name}`}
            employeeId={`${tenantProfile.username}`}
            imageUrl={tenantProfile.profile_picture?.url}
            phone={tenantProfile.phone_number}
            email={tenantProfile.email}
            address={tenantProfile.address_line_1}
            onEdit={() => router.push(`/tenant/${tenantProfile.id}/edit`)}
            onCopy={() =>
              navigator.clipboard.writeText(`${tenantProfile.username}`)
            }
          />
        </div>

        {/* 2. Middle + Right Section - Equal Width */}
        <div className="flex flex-1 gap-4">
          {/* Middle Section */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex flex-col justify-between gap-4 flex-wrap">
              {tenantSummary &&
                Object.entries(tenantSummary?.data).map(([key, item]) => (
                  <RevenueBox
                    key={key}
                    title={key
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())} // Convert snake_case to Title Case
                    price={`$${item.amount}`}
                  />
                ))}
            </div>
            {/* <GrowthCard /> */}
          </div>

          {/* Right Section */}
          <div className="flex-1">
            <TicketList />
          </div>
        </div>
      </div>

      <div>
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

      <div>
        <PropertiesLayout
          showFilter={false}
          onClickProperty={(propertyId) =>
            router.push(`/tenant/${id}/properties/${propertyId}`)
          }
          addButtonPlaceholder="Assign Property"
          onClickAdd={() => setIsAssignPropertyModal(true)}
        />
      </div>

      <Modal
        isOpen={isAssignPropertyModal}
        onClose={() => setIsAssignPropertyModal(false)}
      >
        <AssignPropertyModal onClose={() => setIsAssignPropertyModal(false)} />
      </Modal>
    </div>
  );
}
