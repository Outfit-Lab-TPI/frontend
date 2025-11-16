import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalElements,
  size,
  className = ""
}) {
  if (totalPages <= 1) return null;

  const generatePageNumbers = () => {
    const pages = [];
    const delta = 2; // Número de páginas a mostrar a cada lado de la página actual

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

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Información de elementos */}
      <div className="text-sm text-gray">
        Mostrando {Math.min((currentPage * size) + 1, totalElements)} - {Math.min((currentPage + 1) * size, totalElements)} de {totalElements} marcas
      </div>

      {/* Controles de paginación */}
      <div className="flex items-center gap-2">
        {/* Botón anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray/20 hover:bg-gray/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Página anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Primera página si no está visible */}
        {pageNumbers[0] > 0 && (
          <>
            <button
              onClick={() => onPageChange(0)}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray/20 hover:bg-gray/40 transition-colors"
            >
              1
            </button>
            {pageNumbers[0] > 1 && (
              <span className="text-gray">...</span>
            )}
          </>
        )}

        {/* Números de página */}
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
              page === currentPage
                ? 'bg-primary text-black font-semibold'
                : 'bg-gray/20 hover:bg-gray/40'
            }`}
          >
            {page + 1}
          </button>
        ))}

        {/* Última página si no está visible */}
        {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 2 && (
              <span className="text-gray">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages - 1)}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray/20 hover:bg-gray/40 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Botón siguiente */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray/20 hover:bg-gray/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Página siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;