// File: components/Pagination/Pagination.jsx
import clsx from "clsx";
import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  startIndex,
  goToPage,
  isDropdownTable,
}) => {
  // Create an array of visible page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 6;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than or equal to max visible pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Complex pagination logic with ellipsis
      if (currentPage <= 3) {
        // We're near the start
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // We're near the end
        pageNumbers.push(1);
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // We're in the middle
        pageNumbers.push(1);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const handlePrevious = () => {
    goToPage(currentPage - 1);
  };

  const handleNext = () => {
    goToPage(currentPage + 1);
  };

  return (
    <div
      className={clsx(
        "bg-white p-10 flex flex-col sm:flex-row justify-between items-center border-[#00000014] border-t",
        isDropdownTable ? " rounded-br-xl rounded-bl-xl" : "rounded-sm"
      )}
    >
      <div className="text-lg text-black mb-4 sm:mb-0">
        Showing {startIndex + 1} to{" "}
        {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}{" "}
        entries
      </div>
      <div className="flex items-center gap-5">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`text-gray-700 ${
            currentPage === 1
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          Previous
        </button>

        <div className="bg-[#F7EBF9] flex rounded-xl overflow-hidden">
          {getPageNumbers().map((page, index, array) => (
            <div
              key={page}
              onClick={() => goToPage(page)}
              className={`py-3 px-5 text-center cursor-pointer 
                ${
                  currentPage === page
                    ? "bg-primary text-white"
                    : "bg-[#F7EBF9] text-gray-700"
                } 
                ${index === 0 ? "rounded-l-xl" : ""} 
                ${index === array.length - 1 ? "rounded-r-xl" : ""}
              `}
            >
              {page}
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`text-gray-700 ${
            currentPage === totalPages
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
