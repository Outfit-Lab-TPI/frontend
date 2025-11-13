import { useState } from "react";
import { Check, Filter, ChevronDown, X, Heart } from "lucide-react";
import Button from "./shared/Button";

function FilterDropdown({
  filtros,
  marcasDisponibles,
  coloresDisponibles,
  onActualizarFiltros,
  onLimpiarFiltros,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hayFiltrosActivos =
    filtros.marca || filtros.color || filtros.soloFavoritas;
  const contadorFiltros = [
    filtros.marca,
    filtros.color,
    filtros.soloFavoritas,
  ].filter(Boolean).length;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative">
      {/* Botón de filtros */}
      <button
        onClick={toggleExpanded}
        className="flex items-center gap-2 p-2.5 rounded-md transition-colors bg-gray/10 text-gray hover:text-white border border-gray/20 hover:border-gray/40"
      >
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium">
          Filtros
          {contadorFiltros > 0 && (
            <span className="ml-2">({contadorFiltros})</span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {isExpanded && (
        <div className="absolute top-full right-[-150px] mt-2 w-72 bg-black border border-gray/20 rounded-lg shadow-xl z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-white">
                Filtrar prendas
              </span>
              {hayFiltrosActivos && (
                <Button
                  onClick={() => {
                    onLimpiarFiltros();
                    setIsExpanded(false);
                  }}
                  variant="text"
                  color="gray"
                  width="fit"
                  className="text-xs"
                >
                  <X className="h-3 w-3" />
                  Limpiar
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray mb-2">Marca</label>
                <select
                  value={filtros.marca}
                  onChange={(e) =>
                    onActualizarFiltros({ marca: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray/10 border border-gray/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Todas las marcas</option>
                  {marcasDisponibles.map((marca) => (
                    <option key={marca} value={marca}>
                      {marca}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro por color */}
              {/* <div>
                <label className="block text-xs text-gray mb-2">Color</label>
                <select
                  value={filtros.color}
                  onChange={(e) => onActualizarFiltros({ color: e.target.value })}
                  className="w-full px-3 py-2 bg-gray/10 border border-gray/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Todos los colores</option>
                  {coloresDisponibles.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div> */}

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filtros.soloFavoritas}
                    onChange={(e) =>
                      onActualizarFiltros({ soloFavoritas: e.target.checked })
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                      filtros.soloFavoritas
                        ? "bg-primary border-primary"
                        : "border-gray/40 hover:border-gray"
                    }`}
                  >
                    {filtros.soloFavoritas && <Check className="h-2.5 w-2.5" />}
                  </div>
                  <span className="text-sm text-white">Solo favoritas</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {isExpanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
}

export default FilterDropdown;
