"use client";

import { useState, useRef, useEffect } from "react";
import Button from "@/components/shared/Button/Button";
import SearchInput from "@/components/shared/SearchInput/SearchInput";
import clsx from "clsx";
import MultiSelectDropdown from "@/components/shared/MultiSelectDropdown/MultiSelectDropdown";
import ColumnVisibilityDropdown from "@/components/shared/ColumnVisibilityDropdown/ColumnVisibilityDropdown";

const TableActions = ({
  enableSearch = true,
  enableAdd = true,
  enableEdit = true,
  enableExport = true,
  enableSelectDate = false,
  columns = [],
  visibleColumns = [],
  onSearch,
  onAddClick,
  onEditClick,
  onExportClick,
  onSelectDate,
  onApplyColumnChanges,
  searchInputPaceholder,
  isDropdownTable,
  addButtonPlaceholder = "Add",
  searchTerm = "",
  isServerPaginated = false
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tempVisibleColumns, setTempVisibleColumns] = useState(visibleColumns);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const dropdownRef = useRef(null);

  // Update temp columns when visible columns change
  useEffect(() => {
    setTempVisibleColumns(visibleColumns);
  }, [visibleColumns]);

  // Update local search term when prop changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        // Reset temp columns to match current visible columns when closing without saving
        setTempVisibleColumns(visibleColumns);
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

  const handleSearchChange = (term) => {
    setLocalSearchTerm(term);
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (isServerPaginated) {
      // For server-side search, debounce the API call
      const newTimeout = setTimeout(() => {
        onSearch(term);
      }, 500); // 500ms debounce
      
      setSearchTimeout(newTimeout);
    } else {
      // For client-side search, call immediately
      onSearch(term);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <div
      className={clsx(
        "bg-white p-5 flex justify-between",
        isDropdownTable ? "border-t border-[#00000014]" : "my-4 rounded-sm"
      )}
    >
      <div>
        {enableSearch && (
          <SearchInput
            onSearch={handleSearchChange}
            placeholder={searchInputPaceholder}
            value={localSearchTerm}
            debounce={isServerPaginated ? 500 : 0}
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        {enableAdd && (
          <Button
            title={addButtonPlaceholder}
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
      </div>
    </div>
  );
};

export default TableActions;