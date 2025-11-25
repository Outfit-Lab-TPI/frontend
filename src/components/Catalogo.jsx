import PrendaGalleryCard from "./PrendaGalleryCard.jsx";
import Pagination from "./shared/Pagination.jsx";

export default function Catalogo({
  titulo,
  prendas,
  totalElements,
  paginacion,
  onPageChange,
  selectedPrenda,
  onSelectPrenda,
  onToggleFavorita,
  onSugerencias,
  emptyMessage = "No hay prendas disponibles",
  hint
}) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gray/5 pt-1 px-2 flex flex-col sm:flex-row justify-between items-center rounded-sm">
        <h5 className="font-semibold">
          {titulo} ({totalElements})
        </h5>
        {hint && (
          <p className="text-sm text-gray">{hint}</p>
        )}
      </div>

      {/* Grid de prendas */}
      {prendas && prendas.length > 0 ? (
        <>
          <div className="grid justify-center grid-cols-[repeat(auto-fit,160px)] mx-2 md:mx-4 gap-5 md:gap-7">
            {prendas.map((prenda, index) => (
              <PrendaGalleryCard
                key={`${prenda.garmentCode}-${index}`}
                prenda={prenda}
                isSelected={selectedPrenda?.garmentCode === prenda.garmentCode}
                onSelect={onSelectPrenda}
                onToggleFavorita={onToggleFavorita}
                onSugerencias={onSugerencias}
              />
            ))}
          </div>

          {/* Paginación */}
          {paginacion && paginacion.totalPages > 1 && (
            <Pagination
              currentPage={paginacion.page}
              totalPages={paginacion.totalPages}
              totalElements={paginacion.totalElements}
              size={paginacion.size}
              onPageChange={onPageChange}
              itemLabel="prendas"
            />
          )}
        </>
      ) : (
        <div className="text-center py-8 text-gray">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
