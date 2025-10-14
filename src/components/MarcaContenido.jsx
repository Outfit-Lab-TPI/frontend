import { useMemo } from "react";
import { SquareArrowOutUpRight } from "lucide-react";
import PrendaGalleryCard from "./PrendaGalleryCard.jsx";

function MarcaContenido({
  marcaDetail,
  selectedSuperior,
  selectedInferior,
  onSelectPrenda
}) {
  const prendasCategorizadas = useMemo(() => {
    if (!marcaDetail?.prendas) return { superiores: [], inferiores: [] };

    return {
      superiores: marcaDetail.prendas.filter(
        prenda => prenda.tipo === "superior"
      ),
      inferiores: marcaDetail.prendas.filter(
        prenda => prenda.tipo === "inferior"
      ),
    };
  }, [marcaDetail?.prendas]);

  return (
    <div className="w-2/3 flex flex-col">
      <div className="flex-shrink-0 p-4 bg-gray/10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-20 h-20 bg-gray rounded-xl flex items-center justify-center p-4">
            <img
              src={marcaDetail.logoUrl || "/isotipo.svg"}
              alt={marcaDetail.nombre}
              className="max-w-full max-h-full object-contain"
              onError={e => {
                e.target.src = "/isotipo.svg";
              }}
            />
          </div>

          <div className="h-20 flex flex-col justify-center gap-2">
            <h2>{marcaDetail.nombre}</h2>
            {marcaDetail.sitioUrl && (
              <a
                href={marcaDetail.sitioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray hover:text-white transition-colors"
              >
                <SquareArrowOutUpRight className="w-4 h-4" />
                Visitar sitio web
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mt-6 modern-scrollbar">
        {marcaDetail.prendas && marcaDetail.prendas.length > 0 ? (
          <div className="space-y-12 max-w-5xl mx-auto">
            <div>
              <h4 className="text-xl font-semibold mb-3">
                Prendas Superiores
              </h4>
              <div className="flex flex-wrap gap-8">
                {prendasCategorizadas.superiores.map((prenda, index) => (
                  <PrendaGalleryCard
                    key={`superior-${index}`}
                    prenda={prenda}
                    isSelected={selectedSuperior?.nombre === prenda.nombre}
                    onSelect={onSelectPrenda}
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
              <h4 className="text-xl font-semibold mb-3">
                Prendas Inferiores
              </h4>
              <div className="flex flex-wrap gap-4">
                {prendasCategorizadas.inferiores.map((prenda, index) => (
                  <PrendaGalleryCard
                    key={`inferior-${index}`}
                    prenda={prenda}
                    isSelected={selectedInferior?.nombre === prenda.nombre}
                    onSelect={onSelectPrenda}
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