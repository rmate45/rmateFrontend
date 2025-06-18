"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/tables/DataTable/DataTable";
import { useGetOwnerListQuery } from "@/apis/owner/ownerApi";

const Page = () => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useGetOwnerListQuery(
    {
      page: currentPage,
      per_page: 9,
      search: searchTerm,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const ownerData = data?.data?.data || [];
  const pagination = data?.data?.pagination || {};

  const totalItems = pagination.total || 0;
  const totalPages = pagination.last_page || 0;
  const currentApiPage = pagination.current_page || 1;
  const perPage = pagination.per_page || 9;

  const allColumns = [
    { key: "username", header: "Owner ID" },
    {
      key: "name",
      header: "Name",
      render: (row) => (
        <span>
          {row.first_name} {row.last_name}
        </span>
      ),
    },
    {
      key: "mobile",
      header: "Mobile Number",
      render: (row) => <span>{row.phone_number}</span>,
    },
    { key: "email", header: "E-Mail" },
    { key: "total_properties", header: "Total Properties" },
    {
      key: "status",
      header: "Status",
      render: (row) => <span>{row.status === 1 ? "Active" : "Inactive"}</span>,
    },
  ];

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to page 1 when a new search is made
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading Owner data...</div>
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
      data={ownerData}
      allColumns={allColumns}
      currentPage={currentPage}
      totalItems={totalItems}
      totalPages={totalPages}
      lastPage={totalPages}
      itemsPerPage={perPage}
      searchTerm={searchTerm}
      onSearch={handleSearch}
      onPageChange={handlePageChange}
      onAddClick={() => router.push("/owner/add")}
      onExportClick={() => alert("Export clicked")}
      onClickRow={(id) => router.push(`/owner/${id}`)}
      title="Owner"
      addButtonPlaceholder="Add New Owner"
      searchInputPaceholder="Search by ID or name"
      isServerPaginated={true}
    />
  );
};

export default Page;
