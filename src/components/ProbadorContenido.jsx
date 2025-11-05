import PrendaGalleryCard from "./PrendaGalleryCard.jsx";
import FilterDropdown from "./FilterDropdown.jsx";
import Button from "./shared/Button.jsx";
import Panel from "../components/Panel.jsx";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
} from "@/components/ui/drawer";
import GoBackButton from "./shared/GoBackButton.jsx";

function ProbadorContenido({
  prendas,
  prendasCategorizadas,
  filtros,
  marcasDisponibles,
  coloresDisponibles,
  onActualizarFiltros,
  onLimpiarFiltros,
  onToggleFavorita,
  onSugerencias,
  selectedSuperior,
  selectedInferior,
  onSelectPrenda,
  canCombine,
  esHombre,
  setEsHombre,
  onCombinarPrendas,
  loadingCombinacion,
  resultado,
  errorCombinacion,
  errorModelo3D,
  modeloUrl,
  loadingModelo3D,
  handleGenerarModelo3D,
}) {
  return (
    <div className="w-full lg:w-2/3 flex flex-col px-2">
      {/* Header del probador */}
      <div className="flex flex-col gap-2">
        <GoBackButton />
        <div className="p-4 bg-gray/10 w-full rounded-md max-w-[600px]">
          <div className="flex flex-col lg:flex-row flex-wrap justify-between items-start lg:items-center gap-6">
            <div className="h-14 flex flex-col justify-center">
              <h4>Probador Virtual</h4>
              <p className="text-sm text-gray">
                Combina prendas de todas las marcas
              </p>
            </div>

            <div className="flex not-sm:flex-wrap not-sm:items-start w-full items-center md:justify-around gap-4">
              {/* Filtros dropdown */}
              <FilterDropdown
                filtros={filtros}
                marcasDisponibles={marcasDisponibles}
                coloresDisponibles={coloresDisponibles}
                onActualizarFiltros={onActualizarFiltros}
                onLimpiarFiltros={onLimpiarFiltros}
              />

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray whitespace-nowrap">
                  Avatar:
                </span>
                <div className="relative inline-flex items-center bg-dark-gray rounded-full p-1 transition-colors">
                  <button
                    onClick={() => setEsHombre(true)}
                    className={`cursor-pointer relative z-10 px-3 py-1 text-xs font-medium rounded-l-full transition-all duration-200 border border-gray ${
                      esHombre
                        ? "text-black bg-white/80 shadow-sm"
                        : "text-gray hover:text-white"
                    }`}
                  >
                    Hombre
                  </button>
                  <button
                    onClick={() => setEsHombre(false)}
                    className={`cursor-pointer relative z-10 px-3 py-1 text-xs font-medium rounded-r-full transition-all duration-200 border border-gray ${
                      !esHombre
                        ? "text-black bg-white/80 shadow-sm"
                        : "text-gray hover:text-white"
                    }`}
                  >
                    Mujer
                  </button>
                </div>
              </div>
              <div className="hidden lg:inline-flex">
                <Button
                  onClick={onCombinarPrendas}
                  disabled={!canCombine || loadingCombinacion}
                  width="fit"
                  className="text-nowrap"
                >
                  {loadingCombinacion ? "Combinando..." : "Combinar prendas"}
                </Button>
              </div>

              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    onClick={onCombinarPrendas}
                    className="lg:hidden text-nowrap"
                    width="fit"
                    disabled={!canCombine || loadingCombinacion}
                  >
                    {loadingCombinacion ? "Combinando..." : "Combinar prendas"}
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="h-[90dvh] flex flex-col bg-black/95 lg:hidden">
                  <div className="flex-1 overflow-y-auto pb-2">
                    <Panel
                      loadingCombinacion={loadingCombinacion}
                      resultado={resultado}
                      errorCombinacion={errorCombinacion}
                      errorModelo3D={errorModelo3D}
                      modeloUrl={modeloUrl}
                      loadingModelo3D={loadingModelo3D}
                      onGenerarModelo3D={handleGenerarModelo3D}
                    />
                  </div>

                  <div className="p-4 border-t text-white border-gray/20 bg-background flex justify-end">
                    <DrawerClose asChild>
                      <Button>Cerrar</Button>
                    </DrawerClose>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray">
          * Selecciona una prenda superior e inferior para poder combinarlas
        </p>
      </div>

      {/* Galería de prendas */}
      <div className="flex-1 overflow-y-auto mt-4 modern-scrollbar">
        {prendas && prendas.length > 0 ? (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div>
              <h5 className="bg-gray/5 pt-1 px-2 rounded-sm font-semibold mb-4">
                Prendas Superiores ({prendasCategorizadas.superiores.length})
              </h5>
              <div className="flex flex-wrap mx-8 items-center gap-6">
                {prendasCategorizadas.superiores.map((prenda, index) => (
                  <PrendaGalleryCard
                    key={`superior-${index}`}
                    prenda={prenda}
                    isSelected={selectedSuperior?.nombre === prenda.nombre}
                    onSelect={onSelectPrenda}
                    onToggleFavorita={onToggleFavorita}
                    onSugerencias={onSugerencias}
                  />
                ))}
              </div>
              {prendasCategorizadas.superiores.length === 0 && (
                <div className="text-center py-8 text-gray">
                  No hay prendas superiores disponibles con los filtros
                  aplicados
                </div>
              )}
            </div>

            <div>
              <h5 className="bg-gray/5 py-1 px-2 rounded-sm font-semibold mb-4">
                Prendas Inferiores ({prendasCategorizadas.inferiores.length})
              </h5>
              <div className="flex flex-wrap mx-8 items-center gap-6">
                {prendasCategorizadas.inferiores.map((prenda, index) => (
                  <PrendaGalleryCard
                    key={`inferior-${index}`}
                    prenda={prenda}
                    isSelected={selectedInferior?.nombre === prenda.nombre}
                    onSelect={onSelectPrenda}
                    onToggleFavorita={onToggleFavorita}
                    onSugerencias={onSugerencias}
                  />
                ))}
              </div>
              {prendasCategorizadas.inferiores.length === 0 && (
                <div className="text-center py-8 text-gray">
                  No hay prendas inferiores disponibles con los filtros
                  aplicados
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
