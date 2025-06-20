import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const renderPageNumbers = () => {
    const pages = [];

    // Always show first page
    pages.push(
      <button
        key={1}
        onClick={() => onPageChange(1)}
        className={`px-3 py-1 rounded-md font-semibold text-xs sm:text-sm ${
          currentPage === 1 ? "bg-[#e07d6a] text-white" : "text-gray-500"
        }`}>
        1
      </button>
    );

    if (currentPage > 3) {
      pages.push(
        <span key="start-dots" className="px-2 text-gray-500 text-sm">
          ...
        </span>
      );
    }

    if (currentPage !== 1 && currentPage !== totalPages) {
      pages.push(
        <button
          key={currentPage}
          onClick={() => onPageChange(currentPage)}
          className="px-3 py-1 rounded-md font-semibold bg-[#e07d6a] text-white text-xs sm:text-sm">
          {currentPage}
        </button>
      );
    }

    if (currentPage < totalPages - 2) {
      pages.push(
        <span key="end-dots" className="px-2 text-gray-500 text-sm">
          ...
        </span>
      );
    }

    if (totalPages > 1) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`px-3 py-1 rounded-md font-semibold text-xs sm:text-sm ${
            currentPage === totalPages
              ? "bg-[#e07d6a] text-white"
              : "text-gray-500"
          }`}>
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="w-full px-2 py-4 flex justify-center">
      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
        {currentPage > 1 && (
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="px-2 text-lg sm:text-xl font-bold text-gray-500">
            «
          </button>
        )}

        {renderPageNumbers()}

        {currentPage < totalPages && (
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="px-2 text-lg sm:text-xl font-bold text-gray-500">
            »
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
