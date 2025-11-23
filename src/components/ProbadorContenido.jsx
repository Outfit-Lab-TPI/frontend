import { useState } from "react";
import PrendaGalleryCard from "./PrendaGalleryCard.jsx";
import FilterDropdown from "./FilterDropdown.jsx";
import Button from "./shared/Button.jsx";
import AvatarDropdown from "./AvatarDropdown.jsx";
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
  avatarType,
  onAvatarTypeChange,
  user,
  isDrawerOpen,
  setIsDrawerOpen,
  setAutoOpenDisabled,
}) {
  const [busqueda, setBusqueda] = useState("");
  const prendasFiltradas = searchGarments(prendas, busqueda);

  const prendasCategorizadasFiltradas = {
    superiores: prendasFiltradas.filter((p) => p.tipo === "superior"),
    inferiores: prendasFiltradas.filter((p) => p.tipo === "inferior"),
  };

  function handleOnOpenChange(open) {
    setIsDrawerOpen(open);
    if (!open) setAutoOpenDisabled(true);
  }

  function handleCombineInDrawer() {
    setIsDrawerOpen(true);
    setAutoOpenDisabled(true);
    onCombinarPrendas(avatarType);
  }

  return (
    <div className="w-full lg:w-2/3 flex flex-col px-2">
      <div className="flex flex-col gap-4">
        {/* Box superior: Título + Avatar + Botón Combinar */}
        <div className="p-4 bg-gray/10 w-full rounded-md">
          <div className="flex flex-wrap justify-between items-start lg:items-center gap-6">
            <div className="h-14 flex flex-col justify-center">
              <h4 className="w-fit">Probador Virtual</h4>
              <p className="text-sm text-gray">
                Combina prendas de todas las marcas
              </p>
            </div>

            <div className="flex not-sm:flex-wrap w-fit items-center md:justify-around gap-4">
              <AvatarDropdown
                avatarType={avatarType}
                onAvatarTypeChange={onAvatarTypeChange}
                userHasPhoto={!!user?.foto}
              />

              <div className="hidden lg:inline-flex">
                <Button
                  onClick={() => onCombinarPrendas(avatarType)}
                  disabled={!canCombine || loadingCombinacion}
                  width="fit"
                  className="text-nowrap"
                >
                  {loadingCombinacion ? "Combinando..." : "Combinar prendas"}
                </Button>
              </div>

              <div className="lg:hidden">
                <Button
                  onClick={() => setIsDrawerOpen(true)}
                  disabled={!resultado && !modeloUrl}
                  variant="primary"
                  width="fit"
                >
                  Ver combinación
                </Button>
              </div>

              <Drawer open={isDrawerOpen} onOpenChange={handleOnOpenChange}>
                <DrawerTrigger asChild>
                  <Button
                    onClick={handleCombineInDrawer}
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
                      <Button onClick={() => setIsDrawerOpen(false)}>
                        Cerrar
                      </Button>
                    </DrawerClose>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>

        {/* Box inferior: Búsqueda (izq) + Filtros (der) */}
        <div className="flex justify-between items-center gap-4">
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
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mt-4 modern-scrollbar">
        {prendasFiltradas && prendasFiltradas.length > 0 ? (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div>
              <div className="bg-gray/5 pt-1 px-2 flex flex-col sm:flex-row justify-between items-center rounded-sm mb-2">
                <h5 className="font-semibold">
                  Prendas Superiores (
                  {prendasCategorizadasFiltradas.superiores.length})
                </h5>
                {!selectedSuperior && (
                  <p className="text-sm text-gray">
                    * Selecciona una prenda superior para combinarla
                  </p>
                )}
              </div>

              <div className="grid justify-center grid-cols-[repeat(auto-fit,160px)] mx-4 my-8 gap-6 md:gap-8">
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
              <div className="bg-gray/5 pt-1 px-2 flex flex-col sm:flex-row justify-between items-center rounded-sm mb-2">
                <h5 className="font-semibold">
                  Prendas Inferiores (
                  {prendasCategorizadasFiltradas.inferiores.length})
                </h5>
                {!selectedInferior && (
                  <p className="text-sm text-gray">
                    * Selecciona una prenda inferior para combinarla
                  </p>
                )}
              </div>

              <div className="grid justify-center grid-cols-[repeat(auto-fit,160px)] mx-2 md:mx-4 my-8 gap-5 md:gap-7">
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
