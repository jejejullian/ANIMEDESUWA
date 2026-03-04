export default function Pagination({ currentPage, totalPages, onPageChange, isLoading = false }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // pagination: 1 ... 4 5 [6] 7 8 ... 21
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handleClick = (page) => {
    if (page === "..." || page === currentPage || isLoading) return;
    onPageChange(page);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      {/* Previous Button */}
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className="
          px-3 py-2 rounded-lg
          bg-surface-3 text-foreground
          hover:bg-surface-2
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors
          text-sm cursor-pointer
        "
      >
        ← Prev
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => handleClick(page)}
          disabled={page === "..." || isLoading}
          className={`
            min-w-9 px-3 py-2 rounded-lg font-medium transition-colors
            text-sm
            ${page === currentPage ? "bg-brand text-white ring-2 ring-brand/40 cursor-pointer" : page === "..." ? "bg-transparent text-foreground-muted cursor-default" : "bg-surface-3 text-foreground hover:bg-surface-2 cursor-pointer"}
            ${isLoading ? "opacity-50" : ""}
          `}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage >= totalPages || isLoading}
        className=" px-3 py-2 rounded-lg
          bg-surface-3 text-foreground
          hover:bg-surface-2
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors
          text-sm cursor-pointer"
        >
        Next →
      </button>
    </div>
  );
}
