import { useMemo, useState } from "react";
import { SquareArrowOutUpRight, Check } from "lucide-react";
import PrendaGalleryCard from "./PrendaGalleryCard.jsx";
import Button from "./shared/Button.jsx";
import AvatarDropdown from "./AvatarDropdown.jsx";
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
}) {
  const [soloFavoritosSuperiores, setSoloFavoritosSuperiores] = useState(false);
  const [soloFavoritosInferiores, setSoloFavoritosInferiores] = useState(false);

  const prendasCategorizadas = useMemo(() => {
    const superiores = marcaDetail?.garmentTop?.content || [];
    const inferiores = marcaDetail?.garmentBottom?.content || [];

    return {
      superiores: soloFavoritosSuperiores
        ? superiores.filter((prenda) => prenda.esFavorita)
        : superiores,
      inferiores: soloFavoritosInferiores
        ? inferiores.filter((prenda) => prenda.esFavorita)
        : inferiores,
    };
  }, [marcaDetail, soloFavoritosSuperiores, soloFavoritosInferiores]);

  return (
    <div className="w-full lg:w-2/3 flex flex-col px-2">
      <div className="flex flex-col gap-4">
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

            <div className="flex items-center gap-4">
              <AvatarDropdown
                avatarType={avatarType}
                onAvatarTypeChange={onAvatarTypeChange}
                userHasPhoto={user?.avatarUrl ? true : false}
                disabled={loadingCombinacion}
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

              <Drawer>
                <DrawerTrigger asChild>
                  <Button
                    onClick={() => onCombinarPrendas(avatarType)}
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

        {/* Box inferior: Solo búsqueda (MarcaContenido no necesita filtros adicionales) */}
        <div className="flex justify-start">
          <SearchInput
            value={busqueda}
            onChange={setBusqueda}
            placeholder="Buscar prendas..."
          />
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
            {/* Checkbox para filtrar favoritos */}
            <div>
              <div className="flex justify-between items-center bg-gray/5 py-1 px-2 rounded-sm mb-4">
                <h5 className=" font-semibold">Prendas Superiores</h5>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={soloFavoritosSuperiores}
                    onChange={(e) =>
                      setSoloFavoritosSuperiores(e.target.checked)
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                      soloFavoritosSuperiores
                        ? "bg-primary border-primary"
                        : "border-gray/40 hover:border-gray"
                    }`}
                  >
                    {soloFavoritosSuperiores && (
                      <Check className="h-2.5 w-2.5" />
                    )}
                  </div>
                  <span className="text-sm text-white">Solo favoritos</span>
                </label>
              </div>
              <div className="flex flex-wrap gap-4 mx-8 items-center">
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
              <div className="flex justify-between items-center bg-gray/5 py-1 px-2 rounded-sm mb-4">
                <h5 className="font-semibold">Prendas Inferiores</h5>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={soloFavoritosInferiores}
                    onChange={(e) =>
                      setSoloFavoritosInferiores(e.target.checked)
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                      soloFavoritosInferiores
                        ? "bg-primary border-primary"
                        : "border-gray/40 hover:border-gray"
                    }`}
                  >
                    {soloFavoritosInferiores && (
                      <Check className="h-2.5 w-2.5" />
                    )}
                  </div>
                  <span className="text-sm text-white">Solo favoritos</span>
                </label>
              </div>
              <div className="flex flex-wrap gap-4 mx-8 items-center">
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
