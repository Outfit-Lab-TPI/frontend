import { useEffect, useCallback } from "react";
import PrendaGalleryCard from "./PrendaGalleryCard.jsx";
import Pagination from "./shared/Pagination.jsx";
import { usePaginacion } from "../hooks/usePaginacion.jsx";
import { probadorService } from "../services/probadorService.js";
import { favoritosService } from "../services/favoritosService.js";

export default function Catalogo({
  tipo, // "superior" o "inferior"
  titulo,
  selectedPrenda,
  onSelectPrenda,
  onToggleFavorita,
  onSugerencias,
  emptyMessage = "No hay prendas disponibles",
  hint,
  busqueda = ""
}) {

  // Función de fetch específica para este tipo de prenda
  const fetchPrendas = useCallback(async (page, size) => {
    const fetchFunction = tipo === "superior"
      ? probadorService.obtenerPrendasSuperiores
      : probadorService.obtenerPrendasInferiores;

    const [responsePrendas, responseFavoritas] = await Promise.all([
      fetchFunction({}, page, size),
      favoritosService.obtenerPrendasFavoritas().catch(() => ({ data: { content: [] } }))
    ]);

    const prendasFavoritas = responseFavoritas.data?.content || responseFavoritas.data || [];
    const codigosFavoritas = new Set(prendasFavoritas.map(prenda => prenda.garmentCode));

    const prendasConFavoritas = {
      ...responsePrendas,
      data: {
        ...responsePrendas.data,
        content: (responsePrendas.data.content || []).map(prenda => ({
          ...prenda,
          esFavorita: codigosFavoritas.has(prenda.garmentCode)
        }))
      }
    };

    return prendasConFavoritas;
  }, [tipo]);

  const { data: prendas, loading, paginacion, changePage, fetchData } = usePaginacion(fetchPrendas);

  // Cargar datos iniciales
  useEffect(() => {
    fetchData(0);
  }, [fetchData]);

  // Filtrar prendas por búsqueda localmente
  const prendasFiltradas = busqueda
    ? prendas.filter(prenda =>
        prenda.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        prenda.marcaNombre?.toLowerCase().includes(busqueda.toLowerCase())
      )
    : prendas;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gray/5 pt-1 px-2 flex flex-col sm:flex-row justify-between items-center rounded-sm">
        <h5 className="font-semibold">
          {titulo} ({paginacion.totalElements})
        </h5>
        {hint && (
          <p className="text-sm text-gray">{hint}</p>
        )}
      </div>

      {/* Grid de prendas */}
      {loading ? (
        <div className="grid justify-center grid-cols-[repeat(auto-fit,160px)] mx-2 md:mx-4 gap-5 md:gap-7">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="w-40 h-48 bg-gray rounded-lg animate-pulse" />
          ))}
        </div>
      ) : prendasFiltradas && prendasFiltradas.length > 0 ? (
        <>
          <div className="grid justify-center grid-cols-[repeat(auto-fit,160px)] mx-2 md:mx-4 gap-5 md:gap-7">
            {prendasFiltradas.map((prenda, index) => (
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
          {paginacion.totalPages > 1 && (
            <Pagination
              currentPage={paginacion.page}
              totalPages={paginacion.totalPages}
              totalElements={paginacion.totalElements}
              size={paginacion.size}
              onPageChange={changePage}
              itemLabel="prendas"
            />
          )}
        </>
      ) : (
        <div className="text-center py-8 text-gray">
          {busqueda ? "No hay prendas que coincidan con la búsqueda" : emptyMessage}
        </div>
      )}
    </div>
  );
}
