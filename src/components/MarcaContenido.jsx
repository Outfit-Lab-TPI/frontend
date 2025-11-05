import { useMemo } from "react";
import { SquareArrowOutUpRight } from "lucide-react";
import PrendaGalleryCard from "./PrendaGalleryCard.jsx";
import Button from "./shared/Button.jsx";
import Panel from "../components/Panel.jsx";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
} from "@/components/ui/drawer";
import GoBackButton from "./shared/GoBackButton.jsx";

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
  resultado,
  errorCombinacion,
  errorModelo3D,
  modeloUrl,
  loadingModelo3D,
  handleGenerarModelo3D,
}) {
  const prendasCategorizadas = useMemo(() => {
    return {
      superiores: marcaDetail?.garmentTop?.content || [],
      inferiores: marcaDetail?.garmentBottom?.content || [],
    };
  }, [marcaDetail]);

  return (
    <div className="w-full lg:w-2/3 flex flex-col px-2">
      <div className="flex flex-col gap-2">
        <GoBackButton url={"/marcas"} />
        <div className="p-4 bg-gray/10 w-full rounded-md max-w-[600px]">
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
                <p className="text-sm text-gray">Genera tu outfit favorito</p>
              </div>
            </div>

            <div className="flex flex-wrap not-lg:w-full items-center gap-6">
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
                  width="full"
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
        {prendasCategorizadas.superiores.length > 0 ||
        prendasCategorizadas.inferiores.length > 0 ? (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div>
              <h5 className="bg-gray/5 py-1 px-2 rounded-sm font-semibold mb-4">
                Prendas Superiores
              </h5>
              <div className="flex flex-wrap gap-4 mx-8">
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
              <h5 className="bg-gray/5 py-1 px-2 rounded-sm font-semibold mb-4">
                Prendas Inferiores
              </h5>
              <div className="flex flex-wrap gap-4 mx-8">
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
