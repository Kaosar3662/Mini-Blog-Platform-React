interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const btnBase = 'px-2 py-1 border rounded-lg transition-colors font-sans';
  const btnActive = 'bg-[var(--color-primary)] text-white font-bold cursor-default shadow-[var(--shadow-md)]';
  const btnInactive = 'bg-[var(--color-dark)] text-white hover:bg-[var(--color-primary)] cursor-pointer shadow-[var(--shadow-md)]';
  const btnDisabled = 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed';

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div
      className="flex gap-2 items-center justify-center"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      {/* Prev Button */}
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnInactive} px-3`}
      >
        Prev
      </button>

      {/* Page Buttons */}
      <div className="flex max-w-[100vw] overflow-auto ">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`${btnBase} flex items-center justify-center min-w-8.5 w-auto shrink-0 ${page === currentPage ? btnActive : btnInactive}`}
            disabled={page === currentPage}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnInactive} px-3`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
