"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/tables/DataTable/DataTable";
import { useGetAdminListQuery } from "@/apis/admin/adminApi";

const Page = () => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useGetAdminListQuery(
    {
      page: currentPage,
      per_page: 9,
      search: searchTerm,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const adminData = data?.data?.data || [];
  const pagination = data?.data?.pagination || {};

  // Extract pagination info from API response
  const totalItems = pagination.total || 0;
  const totalPages = pagination.last_page || 0;
  const currentApiPage = pagination.current_page || 1;
  const perPage = pagination.per_page || 9;

  const allColumns = [
    { key: "username", header: "Admin ID" },
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
    {
      key: "access",
      header: "Access",
      render: (row) => (
        <span>{row.external === 1 ? "External" : "Internal"}</span>
      ),
    },
    {
      key: "job",
      header: "Job",
      render: (row) => <span>{row.job_title}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <span>{row.status === 1 ? "Active" : "Inactive"}</span>,
    },
  ];

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading admin data...</div>
      </div>
    );
  }

  // Show error state
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
    <>
      <DataTable
        data={adminData}
        allColumns={allColumns}
        currentPage={currentPage}
        totalItems={totalItems}
        totalPages={totalPages}
        lastPage={totalPages} // Alternative prop name support
        itemsPerPage={perPage}
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        onAddClick={() => router.push("/admin/add")}
        onExportClick={() => alert("Export clicked")}
        onClickRow={(id) => router.push(`/admin/${id}`)}
        title="Admin"
        addButtonPlaceholder="Add New Admin"
        searchInputPaceholder="Search by ID or name"
        isServerPaginated={true}
      />
    </>
  );
};

export default Page;
