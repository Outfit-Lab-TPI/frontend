import { Heart, Eye } from "lucide-react";

function CombinacionCard({ combinacion, onVerDetalle, onToggleFavorita }) {

  const handleFavoritoClick = (e) => {
    e.stopPropagation();
    if (onToggleFavorita) {
      onToggleFavorita(combinacion);
    }
  };

  const handleVerDetalle = () => {
    if (onVerDetalle) {
      onVerDetalle(combinacion);
    }
  };

  return (
    <div className="relative w-48 h-64 rounded-md overflow-hidden cursor-pointer group transition-all duration-300 bg-gray hover:bg-gray/80 hover:scale-105">

      {/* Imagen de la combinación */}
      <div className="w-full h-full flex items-center justify-center">
        <img
          src={combinacion.imageUrl || '/isotipo.svg'}
          alt={`Combinación ${combinacion.nombre || combinacion.id}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/isotipo.svg';
          }}
        />
      </div>

      {/* Botones de acción */}
      <div className="absolute top-2 right-2 flex gap-2">
        {/* Botón de favorito */}
        <button
          onClick={handleFavoritoClick}
          className="w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
        >
          <Heart
            className={`w-3 h-3 transition-colors ${
              combinacion.esFavorita
                ? 'text-red-500 fill-red-500'
                : 'text-white hover:text-red-300'
            }`}
          />
        </button>

        {/* Botón de ver detalle */}
        <button
          onClick={handleVerDetalle}
          className="w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
        >
          <Eye className="w-3 h-3 text-white hover:text-primary" />
        </button>
      </div>

      {/* Información de la combinación */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-3 py-4 flex flex-col gap-1 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h5 className="text-white font-semibold text-sm text-center">
          {combinacion.nombre || `Combinación #${combinacion.id}`}
        </h5>
        {combinacion.fechaCreacion && (
          <p className="text-gray text-xs text-center">
            {new Date(combinacion.fechaCreacion).toLocaleDateString()}
          </p>
        )}
        {combinacion.genero && (
          <p className="text-gray text-xs text-center capitalize">
            {combinacion.genero}
          </p>
        )}
      </div>
    </div>
  );
}

export default CombinacionCard;