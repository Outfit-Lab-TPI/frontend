import { useState } from "react";
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
import { searchGarments } from "@/lib/searchUtils.js";
import SearchInput from "./shared/SearchInput.jsx";

export default function ProbadorContenido({
  prendas,
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
  onCombinarPrendas,
  loadingCombinacion,
  resultado,
  errorCombinacion,
  errorModelo3D,
  modeloUrl,
  loadingModelo3D,
  handleGenerarModelo3D,
}) {
  const [busqueda, setBusqueda] = useState("");

  const prendasFiltradas = searchGarments(prendas, busqueda);

  const prendasCategorizadasFiltradas = {
    superiores: prendasFiltradas.filter((p) => p.tipo === "superior"),
    inferiores: prendasFiltradas.filter((p) => p.tipo === "inferior"),
  };

  return (
    <div className="w-full lg:w-2/3 flex flex-col px-2">
      <div className="flex flex-col gap-2">
        <div className="p-4 bg-gray/10 w-full rounded-md ">
          <div className="flex flex-wrap justify-between items-start lg:items-center gap-8">
            <div className="h-14 flex flex-col justify-center">
              <h4 className="w-fit">Probador Virtual</h4>
              <p className="text-sm text-gray">
                Combina prendas de todas las marcas
              </p>
            </div>

            <div className="flex not-sm:flex-wrap w-fit items-center md:justify-around gap-4">
              <SearchInput
                value={busqueda}
                onChange={setBusqueda}
                placeholder="Buscar prendas..."
              />

              <FilterDropdown
                filtros={filtros}
                marcasDisponibles={marcasDisponibles}
                coloresDisponibles={coloresDisponibles}
                onActualizarFiltros={onActualizarFiltros}
                onLimpiarFiltros={onLimpiarFiltros}
              />

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

      <div className="flex-1 overflow-y-auto mt-4 modern-scrollbar">
        {prendasFiltradas && prendasFiltradas.length > 0 ? (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div>
              <h5 className="bg-gray/5 pt-1 px-2 rounded-sm font-semibold mb-4">
                Prendas Superiores (
                {prendasCategorizadasFiltradas.superiores.length})
              </h5>

              <div className="flex flex-wrap mx-8 items-center gap-6">
                {prendasCategorizadasFiltradas.superiores.map(
                  (prenda, index) => (
                    <PrendaGalleryCard
                      key={`superior-${index}`}
                      prenda={prenda}
                      isSelected={selectedSuperior?.nombre === prenda.nombre}
                      onSelect={onSelectPrenda}
                      onToggleFavorita={onToggleFavorita}
                      onSugerencias={onSugerencias}
                    />
                  )
                )}
              </div>

              {prendasCategorizadasFiltradas.superiores.length === 0 && (
                <div className="text-center py-8 text-gray">
                  No hay prendas superiores que coincidan con la búsqueda
                </div>
              )}
            </div>

            <div>
              <h5 className="bg-gray/5 py-1 px-2 rounded-sm font-semibold mb-4">
                Prendas Inferiores (
                {prendasCategorizadasFiltradas.inferiores.length})
              </h5>

              <div className="flex flex-wrap mx-8 items-center gap-6">
                {prendasCategorizadasFiltradas.inferiores.map(
                  (prenda, index) => (
                    <PrendaGalleryCard
                      key={`inferior-${index}`}
                      prenda={prenda}
                      isSelected={selectedInferior?.nombre === prenda.nombre}
                      onSelect={onSelectPrenda}
                      onToggleFavorita={onToggleFavorita}
                      onSugerencias={onSugerencias}
                    />
                  )
                )}
              </div>

              {prendasCategorizadasFiltradas.inferiores.length === 0 && (
                <div className="text-center py-8 text-gray">
                  No hay prendas inferiores que coincidan con la búsqueda
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray">
            No hay prendas disponibles con la búsqueda aplicada
          </div>
        )}
      </div>
    </div>
  );
}
