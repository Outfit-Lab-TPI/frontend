import { useMemo } from "react";
import { SquareArrowOutUpRight } from "lucide-react";
import PrendaGalleryCard from "./PrendaGalleryCard.jsx";
import Button from "./shared/Button.jsx";

function MarcaContenido({
  marcaDetail,
  selectedSuperior,
  selectedInferior,
  onSelectPrenda,
  canCombine,
  esHombre,
  setEsHombre,
  onCombinarPrendas,
  loadingCombinacion,
  getButtonText,
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
      {/* Detalles de marca */}
      <div className="flex-shrink-0 p-2 bg-gray/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray rounded-xl flex items-center justify-center p-4">
              <img
                src={marcaDetail.logoUrl || "/isotipo.svg"}
                alt={marcaDetail.nombre}
                className="max-w-full max-h-full object-contain"
                onError={e => {
                  e.target.src = "/isotipo.svg";
                }}
              />
            </div>
            <div className="h-14 flex flex-col justify-center">
              <h4>{marcaDetail.nombre}</h4>
              {marcaDetail.sitioUrl && (
                <a
                  href={marcaDetail.sitioUrl}
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

          {canCombine && (
            <div className="flex items-center gap-4 ml-auto">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray">Tipo de avatar:</span>
                <Button
                  onClick={() => setEsHombre(true)}
                  variant="outline"
                  color="gray"
                  width="fit"
                  className={
                    esHombre ? "text-white text-sm border-gray" : "text-sm"
                  }
                >
                  Hombre
                </Button>
                <Button
                  onClick={() => setEsHombre(false)}
                  variant="outline"
                  color="gray"
                  width="fit"
                  className={
                    !esHombre ? "text-white text-sm border-gray" : "text-sm"
                  }
                >
                  Mujer
                </Button>
              </div>

              <Button
                onClick={onCombinarPrendas}
                disabled={!canCombine || loadingCombinacion}
                width="fit"
              >
                {getButtonText()}
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Galería de prendas */}
      <div className="flex-1 overflow-y-auto mt-4 modern-scrollbar">
        {marcaDetail.prendas && marcaDetail.prendas.length > 0 ? (
          <div className="space-y-4 max-w-5xl mx-auto">
            <div>
              <h5 className="text-xl font-semibold mb-1">Prendas Superiores</h5>
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
              <h5 className="text-xl font-semibold mb-1">Prendas Inferiores</h5>
              <div className="flex flex-wrap gap-8">
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
