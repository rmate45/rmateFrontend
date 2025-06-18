"use client";
import React, { useMemo, useState, useEffect } from "react";
import TableActions from "./components/TableActions";
import Pagination from "./components/Pagination";
import Table from "./components/Table";
import clsx from "clsx";

const DataTable = ({
  title = "",
  data = [],
  allColumns = [], // All available columns including hidden ones
  itemsPerPage = 9,
  enableSearch = true,
  enableAdd = true,
  enableEdit = true,
  enableExport = true,
  enableSelectDate = false,
  searchInputPaceholder,
  changeRowColorOnStatus,
  onAddClick = () => {},
  onExportClick = () => {},
  onClickRow = () => {},
  onSelectDate = () => {},
  isDropdownTable = false,
  addButtonPlaceholder,
  // Server-side pagination props
  currentPage = 1,
  totalItems = 0,
  searchTerm = "",
  onSearch = () => {},
  onPageChange = () => {},
  isServerPaginated = false,
  // API pagination data
  totalPages: apiTotalPages,
  lastPage: apiLastPage
}) => {
  const [visibleColumns, setVisibleColumns] = useState(
    allColumns.filter((col) => !col.hidden).map((col) => col.key)
  );

  // Get currently visible columns
  const columns = useMemo(() => {
    return allColumns.filter((col) => visibleColumns.includes(col.key));
  }, [allColumns, visibleColumns]);

  // For server-side pagination, use the data as-is
  // For client-side pagination, filter and paginate locally
  const { filteredData, visibleData, totalPages } = useMemo(() => {
    if (isServerPaginated) {
      return {
        filteredData: data,
        visibleData: data,
        totalPages: apiTotalPages || apiLastPage || Math.ceil(totalItems / itemsPerPage)
      };
    }

    // Client-side filtering
    const filtered = searchTerm
      ? data.filter((item) => {
          return allColumns.some((column) => {
            const value = item[column.key];
            return (
              value &&
              value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
          });
        })
      : data;

    // Client-side pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const visible = filtered.slice(startIndex, startIndex + itemsPerPage);
    const pages = Math.ceil(filtered.length / itemsPerPage);

    return {
      filteredData: filtered,
      visibleData: visible,
      totalPages: pages
    };
  }, [data, searchTerm, allColumns, currentPage, itemsPerPage, isServerPaginated, apiTotalPages, apiLastPage, totalItems]);

  // Calculate start index for display
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Handle page changes
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      if (isServerPaginated) {
        onPageChange(page);
      } else {
        // For client-side pagination, you might want to add state management here
        console.log("Client-side page change:", page);
      }
    }
  };

  // Handle search changes
  const handleSearch = (term) => {
    if (isServerPaginated) {
      onSearch(term);
    } else {
      // For client-side search, you might want to add state management here
      console.log("Client-side search:", term);
    }
  };

  const handleApplyColumnChanges = (newVisibleColumns) => {
    setVisibleColumns(newVisibleColumns);
  };

  return (
    <div>
      {title && (
        <h2 className="text-lg text-dark font-semibold text-left w-full ml-4 mb-4">
          {title} List
        </h2>
      )}

      {/* Actions Section */}
      <TableActions
        enableSearch={enableSearch}
        enableAdd={enableAdd}
        enableEdit={enableEdit}
        enableExport={enableExport}
        enableSelectDate={enableSelectDate}
        columns={allColumns}
        visibleColumns={visibleColumns}
        onSearch={handleSearch}
        onAddClick={onAddClick}
        onApplyColumnChanges={handleApplyColumnChanges}
        onExportClick={onExportClick}
        onSelectDate={onSelectDate}
        searchInputPaceholder={searchInputPaceholder}
        isDropdownTable={isDropdownTable}
        addButtonPlaceholder={addButtonPlaceholder}
        searchTerm={searchTerm}
        isServerPaginated={isServerPaginated}
      />

      {/* Table */}
      <div
        className={clsx(
          "bg-white",
          isDropdownTable ? "rounded-br-xl rounded-bl-xl" : "rounded-sm"
        )}
      >
        <Table
          data={visibleData}
          columns={columns}
          onClickRow={onClickRow}
          changeRowColorOnStatus={changeRowColorOnStatus}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={isServerPaginated ? totalItems : filteredData.length}
          itemsPerPage={itemsPerPage}
          startIndex={startIndex}
          goToPage={goToPage}
          isDropdownTable={isDropdownTable}
        />
      </div>
    </div>
  );
};

export default DataTable;