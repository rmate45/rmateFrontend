"use client";

import { useState, useRef, useEffect } from "react";
import Button from "@/components/shared/Button/Button";
import SearchInput from "@/components/shared/SearchInput/SearchInput";
import clsx from "clsx";
import MultiSelectDropdown from "@/components/shared/MultiSelectDropdown/MultiSelectDropdown";
import ColumnVisibilityDropdown from "@/components/shared/ColumnVisibilityDropdown/ColumnVisibilityDropdown";

const statusOptions = [
  { value: "resolved", label: "Resolved" },
  { value: "assigned", label: "Assigned" },
  { value: "pending", label: "Pending" },
];

const TableActions = ({
  enableSearch = true,
  enableAdd = true,
  enableEdit = true,
  enableExport = true,
  enableSelectDate = false,
  enableStatus = true,
  columns = [],
  visibleColumns = [],
  onSearch,
  onAddClick,
  onEditClick,
  onExportClick,
  onStatusClick,
  onSelectDate,
  onApplyColumnChanges,
  searchInputPaceholder,
  isDropdownTable,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tempVisibleColumns, setTempVisibleColumns] = useState(visibleColumns);
  const dropdownRef = useRef(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const statusDropdownRef = useRef(null);

  // Update temp columns when visible columns change
  useEffect(() => {
    setTempVisibleColumns(visibleColumns);
  }, [visibleColumns]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setTempVisibleColumns(visibleColumns);
      }
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setStatusDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visibleColumns]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    // Still call the original onEditClick if needed
    if (onEditClick) onEditClick();
  };

  const handleColumnToggle = (columnKey, isChecked) => {
    if (isChecked) {
      setTempVisibleColumns((prev) => [...prev, columnKey]);
    } else {
      setTempVisibleColumns((prev) => prev.filter((key) => key !== columnKey));
    }
  };

  const handleApplyChanges = () => {
    // Apply the temporary changes to the actual visible columns
    onApplyColumnChanges(tempVisibleColumns);
    setDropdownOpen(false);
  };

  const handleCancel = () => {
    // Reset to the current visible columns without applying changes
    setTempVisibleColumns(visibleColumns);
    setDropdownOpen(false);
  };

  const toggleStatusDropdown = () => {
    setStatusDropdownOpen(!statusDropdownOpen);
  };

  const handleStatusToggle = (value, isChecked) => {
    setSelectedStatuses((prev) =>
      isChecked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };

  const handleStatusApply = () => {
    if (onStatusClick) onStatusClick(selectedStatuses);
    setStatusDropdownOpen(false);
  };

  const handleStatusCancel = () => {
    setSelectedStatuses([]);
    setStatusDropdownOpen(false);
  };

  return (
    <div
      className={clsx(
        "bg-white p-5  flex justify-between",
        isDropdownTable ? "border-t border-[#00000014]" : "my-4 rounded-sm"
      )}
    >
      <div>
        {enableSearch && (
          <SearchInput
            onSearch={onSearch}
            placeholder={searchInputPaceholder}
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        {enableAdd && (
          <Button
            title="Add new admin"
            size="sm"
            iconSrc="/plus-white.svg"
            onClick={onAddClick}
          />
        )}

        {enableSelectDate && (
          <Button
            title="Select Date"
            variant="secondary"
            size="sm"
            iconSrc="/calendar.svg"
            onClick={onSelectDate}
          />
        )}

        {enableEdit && (
          <div className="relative" ref={dropdownRef}>
            <Button
              title="Edit"
              variant="secondary"
              size="sm"
              iconSrc="/edit.svg"
              onClick={toggleDropdown}
            />
            {dropdownOpen && (
              <ColumnVisibilityDropdown
                columns={columns}
                selectedColumns={tempVisibleColumns}
                onChange={handleColumnToggle}
                onApply={handleApplyChanges}
                onCancel={handleCancel}
              />
            )}
          </div>
        )}
        {enableExport && (
          <Button
            title="Export"
            variant="secondary"
            size="sm"
            iconSrc="/export.svg"
            onClick={onExportClick}
          />
        )}
        {enableStatus && (
          <div className="relative" ref={statusDropdownRef}>
            <Button
              title="Status"
              variant="secondary"
              size="sm"
              iconSrc="/status.svg"
              onClick={toggleStatusDropdown}
            />
            {statusDropdownOpen && (
              <MultiSelectDropdown
                title="Filter by Status"
                options={statusOptions}
                selectedOptions={selectedStatuses}
                onToggle={handleStatusToggle}
                onApply={handleStatusApply}
                onCancel={handleStatusCancel}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TableActions;
