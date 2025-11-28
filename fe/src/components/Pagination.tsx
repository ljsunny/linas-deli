import React, { JSX } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers: JSX.Element[] = [];

    if (totalPages <= 5) {
      // 페이지가 5개 이하일 때는 모든 페이지를 보여줌
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-4 py-2 rounded-full ${currentPage === i ? "bg-[#8E5927] text-white" : ""}`}
          >
            {i}
          </button>
        );
      }
    } else {
      // 페이지가 10개 이상일 때, ... 표시
      if (currentPage > 3) {
        pageNumbers.push(
          <>
            <button
              onClick={() => handlePageChange(1)}
              className={`px-4 py-2 rounded-full ${currentPage === 1 ? "bg-[#8E5927] text-white" : ""}`}
            >
              1
            </button>
            <span className="px-3 py-1">...</span>
          </>
        );
      }

      // 현재 페이지 주변의 페이지들을 표시
      const pagesToShow = [
        currentPage - 1,
        currentPage,
        currentPage + 1,
      ].filter(page => page > 0 && page <= totalPages);

      pagesToShow.forEach(page => {
        pageNumbers.push(
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 rounded-full ${currentPage === page ? "bg-[#8E5927] text-white" : ""}`}
          >
            {page}
          </button>
        );
      });

      if (currentPage < totalPages - 2) {
        pageNumbers.push(
          <>
            <span className="px-3 py-1">...</span>
            <button
              onClick={() => handlePageChange(totalPages)}
              className={`px-4 py-2 rounded-full ${currentPage === totalPages ? "bg-[#8E5927] text-white" : ""}`}
            >
              {totalPages}
            </button>
          </>
        );
      }
    }

    return pageNumbers;
  };

  return (
    <div className="flex space-x-4 justify-center">
      {/* Prev 버튼 */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 ${currentPage === 1 ? "text-gray-300" : ""}`}
      >
        {"←"} {/* 왼쪽 화살표 */}
      </button>

      {renderPageNumbers()}

      {/* Next 버튼 */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 ${currentPage === totalPages ? "text-gray-300" : ""}`}
      >
        {"→"} {/* 오른쪽 화살표 */}
      </button>
    </div>
  );
};

export default Pagination;
