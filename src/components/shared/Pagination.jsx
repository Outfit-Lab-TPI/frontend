import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalElements,
  size,
  className = "",
  itemLabel = "elementos"
}) {
  if (totalPages <= 1) return null;

  const generatePageNumbers = () => {
    const pages = [];
    const delta = 1; // Número de páginas a mostrar a cada lado de la página actual

    let start = Math.max(0, currentPage - delta);
    let end = Math.min(totalPages - 1, currentPage + delta);

    // Ajustar si estamos cerca del principio o final
    if (currentPage < delta) {
      end = Math.min(totalPages - 1, end + (delta - currentPage));
    }
    if (currentPage > totalPages - 1 - delta) {
      start = Math.max(0, start - (delta - (totalPages - 1 - currentPage)));
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();
  const startItem = Math.min((currentPage * size) + 1, totalElements);
  const endItem = Math.min((currentPage + 1) * size, totalElements);

  return (
    <div className={`flex flex-col items-center gap-3 py-4 ${className}`}>
      {/* Información de elementos */}
      <div className="text-xs sm:text-sm text-gray/80 font-medium">
        Mostrando <span className="text-white">{startItem} - {endItem}</span> de <span className="text-white">{totalElements}</span> {itemLabel}
      </div>

      {/* Controles de paginación */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Botón primera página */}
        <button
          onClick={() => onPageChange(0)}
          disabled={currentPage === 0}
          className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg bg-gray/10 hover:bg-gray/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
          title="Primera página"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Botón anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray/10 hover:bg-gray/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
          title="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Primera página si no está visible */}
        {pageNumbers[0] > 0 && (
          <>
            <button
              onClick={() => onPageChange(0)}
              className="hidden sm:flex items-center justify-center min-w-9 h-9 px-2 rounded-lg bg-gray/10 hover:bg-gray/20 transition-all duration-200 hover:scale-105 active:scale-95 text-sm font-medium"
            >
              1
            </button>
            {pageNumbers[0] > 1 && (
              <span className="text-gray/60 px-1 select-none">...</span>
            )}
          </>
        )}

        {/* Números de página */}
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex items-center justify-center min-w-9 h-9 px-2 rounded-lg transition-all duration-200 text-sm font-medium ${
              page === currentPage
                ? 'bg-tertiary/80 text-black font-bold shadow-lg shadow-primary/20 scale-105'
                : 'bg-gray/10 hover:bg-gray/20 hover:scale-105 active:scale-95'
            }`}
          >
            {page + 1}
          </button>
        ))}

        {/* Última página si no está visible */}
        {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 2 && (
              <span className="text-gray/60 px-1 select-none">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages - 1)}
              className="hidden sm:flex items-center justify-center min-w-9 h-9 px-2 rounded-lg bg-gray/10 hover:bg-gray/20 transition-all duration-200 hover:scale-105 active:scale-95 text-sm font-medium"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Botón siguiente */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray/10 hover:bg-gray/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
          title="Página siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Botón última página */}
        <button
          onClick={() => onPageChange(totalPages - 1)}
          disabled={currentPage === totalPages - 1}
          className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg bg-gray/10 hover:bg-gray/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
          title="Última página"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;