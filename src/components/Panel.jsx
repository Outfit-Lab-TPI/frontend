import { Blend, Box, LoaderCircle } from "lucide-react";
import { VscPerson } from 'react-icons/vsc';
import Button from "./shared/Button.jsx";
import ModeloViewer from "./ModeloViewer.jsx";

function Panel({
  loadingCombinacion,
  resultado,
  errorCombinacion,
  errorModelo3D,
  modeloUrl,
  loadingModelo3D,
  canCombine,
  esHombre,
  setEsHombre,
  onCombinarPrendas,
  onGenerarModelo3D,
  getButtonText
}) {
  return (
    <div className="w-1/3 flex flex-col border border-gray/20 relative h-full">
      <div className="flex-1 flex items-center justify-center overflow-hidden">
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
            {!modeloUrl && (
              <button
                onClick={onGenerarModelo3D}
                disabled={!resultado || loadingModelo3D}
                className="absolute top-2 right-2 z-10 flex group bg-gray/50 hover:bg-gray/70 backdrop-blur-sm rounded-full transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-default overflow-hidden hover:px-4"
              >
                <div className="hidden group-hover:flex items-center justify-center transition-all duration-300">
                  <span className="text-white text-sm font-medium whitespace-nowrap">
                    Proxímamente: Probador 3D
                  </span>
                </div>

                <div className="flex items-center justify-center p-3 transition-all duration-300">
                  {loadingModelo3D ? (
                    <LoaderCircle className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Box className="w-5 h-5 text-white animate-bounce" />
                  )}
                </div>
              </button>
            )}

            {modeloUrl ? (
              <ModeloViewer
                modeloUrl={modeloUrl}
                className="max-w-full max-h-full"
              />
            ) : (
              <img
                src={resultado?.imageUrl}
                alt="Combinación de outfit"
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.target.src = '/placeholder-outfit.svg';
                }}
              />
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
          <div className="text-center">
            <VscPerson className="w-60 h-60 text-gray mx-auto mb-6 animate-pulse" />
            <div className="text-lg text-gray leading-relaxed">
              Selecciona dos prendas y combina tu outfit
            </div>
          </div>
        )}
      </div>

      {canCombine && (
        <div className="absolute bottom-15 left-0 right-0 p-2 bg-black/50 backdrop-blur-sm border-t border-gray/20">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray">Tipo de avatar:</span>
            <Button
              onClick={() => setEsHombre(true)}
              variant='outline'
              color='gray'
              width='fit'
              className={esHombre ? 'text-white text-sm border-gray' : 'text-sm'}
            >
              Hombre
            </Button>
            <Button
              onClick={() => setEsHombre(false)}
              variant='outline'
              color='gray'
              width='fit'
              className={!esHombre ? 'text-white text-sm border-gray' : 'text-sm'}
            >
              Mujer
            </Button>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 group p-2 flex-shrink-0">
        <Button
          onClick={onCombinarPrendas}
          disabled={!canCombine || loadingCombinacion}
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
}

export default Panel;