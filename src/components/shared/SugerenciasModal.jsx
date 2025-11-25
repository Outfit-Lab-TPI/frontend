import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import Button from "./Button";
import AvatarDropdown from "./../AvatarDropdown.jsx";
import PrendaGalleryCard from "../PrendaGalleryCard";

function SugerenciasModal({
  isOpen,
  onClose,
  onSolicitarCombinacion,
  sugerencias,
  loading,
  error,
  prendaOriginal,
  avatarType,
  onAvatarTypeChange,
  loadingCombinacion,
}) {
  if (!isOpen) return null;

  const [prendaSeleccionada, setPrendaSeleccionada] = useState(null);
  const [sugerenciaActual, setSugerenciaActual] = useState(null);

  const handleSolicitarCombinacion = sugerencia => {
    if (onSolicitarCombinacion) {
      onSolicitarCombinacion(sugerencia);
    }
    onClose();
  };

  const handleSelectPrenda = (prenda, sugerencia) => {
    setPrendaSeleccionada(prenda);
    setSugerenciaActual(sugerencia);
  };

  // Limpiar selección al cerrar
  const handleClose = () => {
    setPrendaSeleccionada(null);
    setSugerenciaActual(null);
    onClose();
  };

  // Obtener la prenda complementaria de la sugerencia
  const getPrendaComplementaria = (sugerencia, prendaSeleccionada) => {
    if (prendaSeleccionada?.garmentCode === sugerencia.topGarment.garmentCode) {
      return sugerencia.bottomGarment;
    }
    return sugerencia.topGarment;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-black/90 border border-gray/20 rounded-lg shadow-xl max-w-6xl w-fit mx-4 p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex flex-wrap gap-1  justify-center md:justify-between">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="h-6 w-6 text-tertiary" />
            <h2 className="font-semibold text-white">
              Sugerencias
            </h2>
          </div>

          <div>
            <AvatarDropdown
                avatarType={avatarType}
                onAvatarTypeChange={onAvatarTypeChange}
                disabled={loadingCombinacion}
              />
          </div>

          {!loading && (
            <div className="flex justify-center">
              <Button
                onClick={() => handleSolicitarCombinacion(sugerenciaActual)}
                variant="default"
                color="secondary"
                size="lg"
                className="px-8"
                disabled={loading || !sugerenciaActual || !prendaSeleccionada}
              >
                Combinar prendas
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="min-h-48">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-tertiary animate-spin mb-4" />
              <p className="text-gray">Obteniendo sugerencias...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-12">
              <Sparkles className="h-12 w-12 text-gray mb-4" />
              <p className="text-error mb-2">Algo salió mal</p>
              <p className="text-gray text-sm text-center max-w-sm">Por favor intenta más tarde</p>
            </div>
          )}

          {sugerencias && sugerencias.length > 0 && (
            <div className="flex gap-12 flex-wrap justify-center md:justify-between">
              {/* Prenda Original */}
              {prendaOriginal && (
                <div>
                  <h3 className="text-white font-medium mb-4">
                    Prenda seleccionada:
                  </h3>
                  <div className="flex justify-center">
                    <PrendaGalleryCard
                      prenda={prendaOriginal}
                      isSelected={false}
                      onSelect={() => {}}
                    />
                  </div>
                </div>
              )}

              <div className="border-l border-gray/50 pl-12">
                <h3 className="text-white font-medium mb-4">
                  Prendas sugeridas:
                </h3>

                {/* Prendas Sugeridas */}
                <div className="flex flex-wrap justify-center gap-6 mb-6">
                  {sugerencias
                    .flatMap((sugerencia, index) => [
                      // Si la prenda original NO es la superior, mostrar la superior
                      prendaOriginal?.tipo !== "superior" && (
                        <PrendaGalleryCard
                          key={`top-${index}`}
                          prenda={sugerencia.topGarment}
                          isSelected={
                            prendaSeleccionada?.garmentCode ===
                            sugerencia.topGarment.garmentCode
                          }
                          onSelect={() =>
                            handleSelectPrenda(
                              sugerencia.topGarment,
                              sugerencia
                            )
                          }
                        />
                      ),
                      // Si la prenda original NO es la inferior, mostrar la inferior
                      prendaOriginal?.tipo !== "inferior" && (
                        <PrendaGalleryCard
                          key={`bottom-${index}`}
                          prenda={sugerencia.bottomGarment}
                          isSelected={
                            prendaSeleccionada?.garmentCode ===
                            sugerencia.bottomGarment.garmentCode
                          }
                          onSelect={() =>
                            handleSelectPrenda(
                              sugerencia.bottomGarment,
                              sugerencia
                            )
                          }
                        />
                      ),
                    ])
                    .filter(Boolean)}
                </div>
              </div>
            </div>
          )}

          {sugerencias && sugerencias.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Sparkles className="h-12 w-12 text-gray mb-4" />
              <p className="text-white mb-2">No se encontraron sugerencias</p>
              <p className="text-gray text-sm text-center">
                Lo sentimos, no pudimos encontrar combinaciones para esta prenda
                en este momento.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SugerenciasModal;
