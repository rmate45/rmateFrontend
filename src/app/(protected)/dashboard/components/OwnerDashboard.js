"use client";

import { useGetOwnerByIdQuery } from "@/apis/owner/ownerApi";
import GrowthCard from "@/components/cards/GrowthCard/GrowthCard";
import ProfileCard from "@/components/cards/ProfileCard/ProfileCard";
import PropertiesLayout from "@/components/layout/PropertiesLayout/PropertiesLayout";
import DropDownContent from "@/components/shared/DropDownContent/DropDownContent";
import RevenueBox from "@/components/shared/RevenueBox/RevenueBox";
import TicketList from "@/components/shared/TicketList/TicketList";
import DataTable from "@/components/tables/DataTable/DataTable";
import { checkPermission } from "@/helpers/AccessControlUtils";
import Image from "next/image";
import { useRouter } from "next/navigation";

const OwnerDashboard = ({ id }) => {
  const router = useRouter();

  const { data, isLoading, isError } = useGetOwnerByIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const ownerProfile = data?.data;

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
      status: "Paid",
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
            alt="download"
            className="cursor-pointer"
          />
        </div>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError || !ownerProfile) return <div>Failed to load owner details</div>;

  return (
    <div className="mx-auto w-full bg-transparent overflow-hidden space-y-6">
      <div className="flex gap-4">
        {/* Left: Profile */}
        <div className="w-[260px] shrink-0">
          <ProfileCard
            name={`${ownerProfile.first_name} ${ownerProfile.last_name}`}
            employeeId={ownerProfile.username}
            imageUrl={ownerProfile.profile_picture.url}
            phone={ownerProfile.phone_number}
            email={ownerProfile.email}
            properties={0}
            role="owner"
            address={ownerProfile.address_line_1}
            onEdit={() => router.push(`/owner/${ownerProfile.id}/edit`)}
            onCopy={() => navigator.clipboard.writeText(ownerProfile.username)}
            isEditable={checkPermission("owner", "u")}
          />
        </div>

        {/* Right: Dashboard */}
        <div className="flex flex-1 gap-4">
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex justify-between gap-4 flex-wrap">
              <RevenueBox
                title="Total Revenue"
                price="$120,578"
                priceColor="#3AC887"
              />
              <RevenueBox
                title="Monthly Rent"
                price="$15,578"
                priceColor="#3AC887"
              />
              <RevenueBox
                title="Total Rent Due"
                price="$1,400"
                priceColor="#FF5A65"
              />
            </div>
            <GrowthCard />
          </div>

          <div className="flex-1">
            <TicketList />
          </div>
        </div>
      </div>

      {/* Payment History Table */}
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

      {/* Properties */}
      <PropertiesLayout
        showFilter={false}
        onClickProperty={(propertyId) =>
          router.push(`/owner/${id}/properties/${propertyId}`)
        }
        showAddButton={checkPermission("properties", "u")}
      />
    </div>
  );
};

export default OwnerDashboard;
