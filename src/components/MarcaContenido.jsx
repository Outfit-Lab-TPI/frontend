import { Link } from "react-router-dom";
import { useMemo } from "react";
import { MoveLeft, ChevronLeft, SquareArrowOutUpRight } from "lucide-react";
import PrendaGalleryCard from "./PrendaGalleryCard.jsx";
import Button from "./shared/Button.jsx";

function MarcaContenido({
  marcaDetail,
  selectedSuperior,
  selectedInferior,
  onSelectPrenda,
  onToggleFavorita,
  onSugerencias,
  canCombine,
  esHombre,
  setEsHombre,
  onCombinarPrendas,
  loadingCombinacion,
}) {
  const prendasCategorizadas = useMemo(() => {
    return {
      superiores: marcaDetail?.garmentTop?.content || [],
      inferiores: marcaDetail?.garmentBottom?.content || [],
    };
  }, [marcaDetail]);

  return (
    <div className="w-full lg:w-2/3 flex flex-col">
      {/* Detalles de marca */}
      <div className="flex gap-2">
        <Link to="/marcas">
          <ChevronLeft className="h-5 w-5 m-1" color="gray" />
        </Link>
        <div className="p-2 bg-gray/10 w-full">
          <div className="flex flex-col lg:flex-row flex-wrap justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray rounded-xl flex items-center justify-center p-1">
                <img
                  src={marcaDetail.brandDTO?.logoUrl || "/isotipo.svg"}
                  alt={marcaDetail.brandDTO?.nombre}
                  className="max-w-full max-h-full object-contain"
                  onError={e => {
                    e.target.src = "/isotipo.svg";
                  }}
                />
              </div>
              <div className="h-14 flex flex-col justify-center">
                <h4>{marcaDetail.brandDTO?.nombre}</h4>
                {marcaDetail.brandDTO?.sitioUrl && (
                  <a
                    href={marcaDetail.brandDTO.sitioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm inline-flex items-center gap-2 text-gray hover:text-white transition-colors"
                  >
                    <SquareArrowOutUpRight className="w-3 h-3" />
                    Visitar sitio web
                  </a>
                )}
              </div>
            </div>

            <div className="flex not-sm:flex-col not-sm:items-start not-lg:w-full items-center gap-4">
              {selectedSuperior && selectedInferior ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray whitespace-nowrap">Avatar:</span>
                {/* Toggle moderno para selección de género */}
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
        {(prendasCategorizadas.superiores.length > 0 || prendasCategorizadas.inferiores.length > 0) ? (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div>
              <h5 className="bg-gray/5 py-1 px-2 rounded-sm font-semibold mb-4">Prendas Superiores</h5>
              <div className="flex flex-wrap gap-4">
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
                  No hay prendas superiores disponibles
                </div>
              )}
            </div>

            <div>
              <h5 className="bg-gray/5 py-1 px-2 rounded-sm font-semibold mb-4">Prendas Inferiores</h5>
              <div className="flex flex-wrap gap-4">
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
                  No hay prendas inferiores disponibles
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray">
            No hay productos disponibles para esta marca
          </div>
        )}
      </div>
    </div>
  );
}

export default MarcaContenido;
