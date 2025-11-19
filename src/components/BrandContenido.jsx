import { useMemo } from "react";
import { SquareArrowOutUpRight, Plus } from "lucide-react";
import BrandPrendaCard from "./BrandPrendaCard.jsx";
import Button from "./shared/Button.jsx";
import GoBackButton from "./shared/GoBackButton.jsx";

function BrandContenido({
  marcaDetail,
  onAgregarPrenda,
  onEditarPrenda,
}) {
  const prendasCategorizadas = useMemo(() => {
    const superiores = marcaDetail?.garmentTop?.content || [];
    const inferiores = marcaDetail?.garmentBottom?.content || [];

    return {
      superiores,
      inferiores,
    };
  }, [marcaDetail]);

  return (
    <div className="w-full flex flex-col px-2 items-center">
        <div className="p-4 bg-gray/10 w-full rounded-md max-w-5xl">
          <div className="flex flex-col lg:flex-row flex-wrap justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray rounded-xl flex items-center justify-center p-1">
                <img
                  src={marcaDetail.brandDTO?.logoUrl || "/isotipo.svg"}
                  alt={marcaDetail.brandDTO?.nombre}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
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
                <p className="text-sm text-gray">Gestiona tu catálogo de prendas</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                onClick={onAgregarPrenda}
                width="fit"
              >
                <Plus size={16} />
                Nueva prenda
              </Button>
            </div>
          </div>
        </div>

      {/* Galería de prendas */}
      <div className="flex-1 overflow-y-auto w-full mt-4 modern-scrollbar">
        {prendasCategorizadas.superiores.length > 0 ||
        prendasCategorizadas.inferiores.length > 0 ? (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Prendas Superiores */}
            <div>
              <div className="bg-gray/5 py-1 px-2 rounded-sm mb-4">
                <h5 className="font-semibold">Prendas Superiores ({prendasCategorizadas.superiores.length})</h5>
              </div>
              <div className="flex flex-wrap gap-4 mx-8 items-center">
                {prendasCategorizadas.superiores.map((prenda, index) => (
                  <BrandPrendaCard
                    key={`superior-${index}`}
                    prenda={prenda}
                    onSelect={onEditarPrenda}
                  />
                ))}
              </div>
              {prendasCategorizadas.superiores.length === 0 && (
                <div className="text-center py-8 text-gray">
                  No hay prendas superiores disponibles
                </div>
              )}
            </div>

            {/* Prendas Inferiores */}
            <div>
              <div className="bg-gray/5 py-1 px-2 rounded-sm mb-4">
                <h5 className="font-semibold">Prendas Inferiores ({prendasCategorizadas.inferiores.length})</h5>
              </div>
              <div className="flex flex-wrap gap-4 mx-8 items-center">
                {prendasCategorizadas.inferiores.map((prenda, index) => (
                  <BrandPrendaCard
                    key={`inferior-${index}`}
                    prenda={prenda}
                    onSelect={onEditarPrenda}
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
            <p className="mb-4">No hay productos disponibles para esta marca</p>
            <Button
              onClick={onAgregarPrenda}
              width="fit"
              variant="primary"
            >
              <Plus size={16} />
              Agregar primera prenda
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BrandContenido;