"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/tables/DataTable/DataTable";
import { useGetTenantListQuery } from "@/apis/tenant/tenantApi";

const Page = () => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useGetTenantListQuery(
    {
      page: currentPage,
      per_page: 9,
      search: searchTerm,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const tenantData = data?.data?.data || [];
  const pagination = data?.data?.pagination || {};

  const totalItems = pagination.total || 0;
  const totalPages = pagination.last_page || 0;
  const currentApiPage = pagination.current_page || 1;
  const perPage = pagination.per_page || 9;

  const allColumns = [
    { key: "username", header: "Tenant ID" },
    {
      key: "name",
      header: "Name",
      render: (row) => (
        <span>
          {row.first_name} {row.last_name}
        </span>
      ),
    },
    { key: "phone_number", header: "Mobile Number" },
    { key: "email", header: "E-Mail" },
    {
      key: "status",
      header: "Status",
      render: (row) => <span>{row.status === 1 ? "Active" : "Inactive"}</span>,
    },
  ];

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading tenant data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">
          Error loading data: {error.message || "Something went wrong"}
        </div>
      </div>
    );
  }

  return (
    <DataTable
      data={tenantData}
      allColumns={allColumns}
      currentPage={currentPage}
      totalItems={totalItems}
      totalPages={totalPages}
      lastPage={totalPages}
      itemsPerPage={perPage}
      searchTerm={searchTerm}
      onSearch={handleSearch}
      onPageChange={handlePageChange}
      onAddClick={() => router.push("/tenant/add")}
      onExportClick={() => alert("Export clicked")}
      onClickRow={(id) => router.push(`/tenant/${id}`)}
      title="Tenant"
      addButtonPlaceholder="Add New Tenant"
      searchInputPaceholder="Search by ID or name"
      isServerPaginated={true}
    />
  );
};

export default Page;
