import { useMemo } from "react";
import PrendaGalleryCard from "./PrendaGalleryCard.jsx";
import FilterDropdown from "./FilterDropdown.jsx";
import Button from "./shared/Button.jsx";

function ProbadorContenido({
  prendas,
  prendasCategorizadas,
  filtros,
  marcasDisponibles,
  coloresDisponibles,
  onActualizarFiltros,
  onLimpiarFiltros,
  onToggleFavorita,
  selectedSuperior,
  selectedInferior,
  onSelectPrenda,
  canCombine,
  esHombre,
  setEsHombre,
  onCombinarPrendas,
  loadingCombinacion,
}) {

  return (
    <div className="w-full lg:w-2/3 flex flex-col">
      {/* Header del probador */}
      <div className="flex gap-2">
        <div className="p-2 bg-gray/10 w-full">
          <div className="flex flex-col lg:flex-row flex-wrap justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray rounded-xl flex items-center justify-center p-1">
                <img
                  src="/isotipo.svg"
                  alt="Probador Virtual"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="h-14 flex flex-col justify-center">
                <h4>Probador Virtual</h4>
                <p className="text-sm text-gray">Combina prendas de todas las marcas</p>
              </div>
            </div>

            <div className="flex not-sm:flex-col not-sm:items-start not-lg:w-full items-center gap-4">
              {/* Filtros dropdown */}
              <FilterDropdown
                filtros={filtros}
                marcasDisponibles={marcasDisponibles}
                coloresDisponibles={coloresDisponibles}
                onActualizarFiltros={onActualizarFiltros}
                onLimpiarFiltros={onLimpiarFiltros}
              />

              {selectedSuperior && selectedInferior ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray whitespace-nowrap">Avatar:</span>
                <div className="relative inline-flex items-center bg-dark-gray rounded-full p-1 transition-colors">
                  <button
                    onClick={() => setEsHombre(true)}
                    className={`cursor-pointer relative z-10 px-3 py-1 text-xs font-medium rounded-l-full transition-all duration-200 border border-gray ${
                      esHombre
                        ? 'text-black bg-white/80 shadow-sm'
                        : 'text-gray hover:text-white'
                    }`}
                  >
                    Hombre
                  </button>
                  <button
                    onClick={() => setEsHombre(false)}
                    className={`cursor-pointer relative z-10 px-3 py-1 text-xs font-medium rounded-r-full transition-all duration-200 border border-gray ${
                      !esHombre
                        ? 'text-black bg-white/80 shadow-sm'
                        : 'text-gray hover:text-white'
                    }`}
                  >
                    Mujer
                  </button>
                </div>
              </div>
              ) : (
                <span className="text-sm text-gray whitespace-nowrap">Selecciona 2 prendas</span>
              )}

              <Button
                onClick={onCombinarPrendas}
                disabled={!canCombine || loadingCombinacion}
                width="full"
                className="text-nowrap"
              >
                Combinar prendas
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Galería de prendas */}
      <div className="flex-1 overflow-y-auto mt-4 modern-scrollbar">
        {prendas && prendas.length > 0 ? (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div>
              <h5 className="bg-gray/5 py-1 px-2 rounded-sm font-semibold mb-4">
                Prendas Superiores ({prendasCategorizadas.superiores.length})
              </h5>
              <div className="flex flex-wrap gap-4">
                {prendasCategorizadas.superiores.map((prenda, index) => (
                  <PrendaGalleryCard
                    key={`superior-${index}`}
                    prenda={prenda}
                    isSelected={selectedSuperior?.nombre === prenda.nombre}
                    onSelect={onSelectPrenda}
                    onToggleFavorita={onToggleFavorita}
                    showFavoritos={true}
                  />
                ))}
              </div>
              {prendasCategorizadas.superiores.length === 0 && (
                <div className="text-center py-8 text-gray">
                  No hay prendas superiores disponibles con los filtros aplicados
                </div>
              )}
            </div>

            <div>
              <h5 className="bg-gray/5 py-1 px-2 rounded-sm font-semibold mb-4">
                Prendas Inferiores ({prendasCategorizadas.inferiores.length})
              </h5>
              <div className="flex flex-wrap gap-4">
                {prendasCategorizadas.inferiores.map((prenda, index) => (
                  <PrendaGalleryCard
                    key={`inferior-${index}`}
                    prenda={prenda}
                    isSelected={selectedInferior?.nombre === prenda.nombre}
                    onSelect={onSelectPrenda}
                    onToggleFavorita={onToggleFavorita}
                    showFavoritos={true}
                  />
                ))}
              </div>
              {prendasCategorizadas.inferiores.length === 0 && (
                <div className="text-center py-8 text-gray">
                  No hay prendas inferiores disponibles con los filtros aplicados
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray">
            No hay prendas disponibles con los filtros aplicados
          </div>
        )}
      </div>
    </div>
  );
}

export default ProbadorContenido;