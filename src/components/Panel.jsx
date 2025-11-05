import { Blend, Box, LoaderCircle, Heart } from "lucide-react";
import { VscPerson } from "react-icons/vsc";
import { useState, useEffect } from "react";
import ModeloViewer from "./ModeloViewer.jsx";
import { useFavoritos } from "../hooks/useFavoritos.jsx";

function Panel({
  loadingCombinacion,
  resultado,
  errorCombinacion,
  errorModelo3D,
  modeloUrl,
  loadingModelo3D,
  onGenerarModelo3D,
}) {
  const { toggleCombinacionFavorita, loading: loadingFavorito } = useFavoritos();
  const [esFavorita, setEsFavorita] = useState(false);

  useEffect(() => {
    setEsFavorita(resultado?.esFavorita || false);
  }, [resultado]);

  const handleToggleFavorita = async (e) => {
    e.stopPropagation();
    if (!resultado?.imageUrl) return;

    try {
      const nuevoEstado = !esFavorita;
      setEsFavorita(nuevoEstado);

      await toggleCombinacionFavorita(
        resultado.imageUrl,
        nuevoEstado
      );
    } catch (error) {
      console.error('Error al cambiar favorito:', error);
      setEsFavorita(!nuevoEstado);
    }
  };
  return (
    <div className="w-full flex flex-col lg:border-l border-gray/20 relative h-[70dvh] lg:h-full">
      <div className="flex-1 flex items-center justify-center overflow-hidden pt-2">
        {loadingCombinacion ? (
          <div className="display flex flex-col items-center gap-2">
            <Blend className="animate-spin self-center h-20 w-20 mb-4" />
            <div className="text-lg text-white leading-relaxed">
              Generando tu outfit...
            </div>
            <div className="text-sm text-gray">
              Esto puede tomar unos segundos
            </div>
          </div>
        ) : resultado ? (
          <div className="w-full h-full flex items-center justify-center p-0 relative">
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              <button
                onClick={handleToggleFavorita}
                disabled={loadingFavorito}
                className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    esFavorita
                      ? "text-red-500 fill-red-500"
                      : "text-white hover:text-red-300"
                  }`}
                />
              </button>

              {!modeloUrl && (
                <button
                  onClick={onGenerarModelo3D}
                  disabled={!resultado || loadingModelo3D}
                  className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loadingModelo3D ? (
                    <LoaderCircle className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Box className="w-5 h-5 text-white" />
                  )}
                </button>
              )}
            </div>

            {modeloUrl ? (
              <ModeloViewer
                modeloUrl={modeloUrl}
                className="max-w-full max-h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={resultado?.imageUrl}
                  alt="Combinación de outfit"
                  className="size-full object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                    const parent = e.target.parentElement;
                    if (!parent.querySelector(".error-message")) {
                      const errorDiv = document.createElement("div");
                      errorDiv.className = "error-message text-center p-8";
                      errorDiv.innerHTML = `
                        <div class="text-gray text-lg mb-2">No pudimos generar la imagen</div>
                        <div class="text-gray/70 text-sm">Por favor elige otra combinación</div>
                      `;
                      parent.appendChild(errorDiv);
                    }
                  }}
                />
              </div>
            )}
          </div>
        ) : errorCombinacion || errorModelo3D ? (
          <div className="text-center">
            <div className="text-error mb-4">
              Error: {errorCombinacion || errorModelo3D}
            </div>
            <div className="text-lg text-white leading-relaxed">
              Selecciona dos prendas y combina tu outfit
            </div>
          </div>
        ) : (
          <div className="text-center ml-2">
            <VscPerson className="size-32 lg:size-60 text-gray mx-auto mb-6 animate-pulse" />
            <div className="text-lg text-gray leading-relaxed">
              Selecciona dos prendas y combina tu outfit
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Panel;
