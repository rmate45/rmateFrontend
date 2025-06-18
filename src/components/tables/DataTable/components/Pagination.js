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
  // Handle edge case where totalItems is 0
  if (totalItems === 0) {
    return (
      <div
        className={clsx(
          "bg-white p-10 flex flex-col sm:flex-row justify-between items-center border-[#00000014] border-t",
          isDropdownTable ? " rounded-br-xl rounded-bl-xl" : "rounded-sm"
        )}
      >
        <div className="text-lg text-black mb-4 sm:mb-0">No entries found</div>
      </div>
    );
  }

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
        for (let i = 1; i <= Math.min(5, totalPages); i++) {
          pageNumbers.push(i);
        }
        if (totalPages > 5) {
          pageNumbers.push("...");
          pageNumbers.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        // We're near the end
        pageNumbers.push(1);
        if (totalPages > 5) {
          pageNumbers.push("...");
        }
        for (let i = Math.max(totalPages - 4, 2); i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // We're in the middle
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (page !== "..." && page !== currentPage) {
      goToPage(page);
    }
  };

  // Calculate the actual end index
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const displayStartIndex = totalItems > 0 ? startIndex + 1 : 0;

  return (
    <div
      className={clsx(
        "bg-white p-10 flex flex-col lg:flex-row  gap-6 justify-between items-center border-[#00000014] border-t",
        isDropdownTable ? " rounded-br-xl rounded-bl-xl" : "rounded-sm"
      )}
    >
      <div className="text-lg text-black mb-4 sm:mb-0">
        Showing {displayStartIndex} to {endIndex} of {totalItems} entries
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-5">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`text-gray-700 px-3 py-2 rounded transition-colors duration-200 ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-gray-100"
            }`}
          >
            Previous
          </button>

          <div className="bg-[#F7EBF9] flex rounded-xl overflow-hidden">
            {getPageNumbers().map((page, index, array) => (
              <div
                key={`${page}-${index}`}
                onClick={() => handlePageClick(page)}
                className={`py-3 px-5 text-center min-w-[50px] transition-colors duration-200
                  ${
                    page === "..."
                      ? "bg-[#F7EBF9] text-gray-500 cursor-default"
                      : currentPage === page
                      ? "bg-primary text-white"
                      : "bg-[#F7EBF9] text-gray-700 cursor-pointer hover:bg-gray-200"
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
            className={`text-gray-700 px-3 py-2 rounded transition-colors duration-200 ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
