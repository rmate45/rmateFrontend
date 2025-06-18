"use client";
import React, { useMemo, useState } from "react";
import TableActions from "./components/TableActions";
import Pagination from "./components/Pagination";
import Table from "./components/Table";
import clsx from "clsx";

const MentainanceTable = ({
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
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleColumns, setVisibleColumns] = useState(
    allColumns.filter((col) => !col.hidden).map((col) => col.key)
  );

  // Get currently visible columns
  const columns = useMemo(() => {
    return allColumns.filter((col) => visibleColumns.includes(col.key));
  }, [allColumns, visibleColumns]);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((item) => {
      return allColumns.some((column) => {
        const value = item[column.key];
        return (
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    });
  }, [data, searchTerm, allColumns]);

  // Calculate pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Handle page changes
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle search changes
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleApplyColumnChanges = (newVisibleColumns) => {
    // Only apply changes when the "Apply" button is clicked
    setVisibleColumns(newVisibleColumns);
  };

  return (
    <div>
      {title && (
        <h2 className="text-lg text-dark font-semibold text-left w-full ml-4">
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
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          startIndex={startIndex}
          goToPage={goToPage}
          isDropdownTable={isDropdownTable}
        />
      </div>
    </div>
  );
};

export default MentainanceTable;
