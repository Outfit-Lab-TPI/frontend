import { Check, Heart, Sparkle } from "lucide-react";

function PrendaGalleryCard({
  prenda,
  isSelected,
  onSelect,
  onToggleFavorita,
  onSugerencias,
}) {
  const handleFavoritoClick = (e) => {
    e.stopPropagation();
    if (onToggleFavorita) {
      onToggleFavorita(prenda);
    }
  };

  const handleSugerenciasClick = (e) => {
    e.stopPropagation();
    if (onSugerencias) {
      onSugerencias(prenda);
    }
  };
  return (
    <div
      className={`relative w-40 h-48 rounded-md overflow-hidden cursor-pointer group transition-all duration-300 ${
        isSelected
          ? "bg-primary ring-2 ring-primary shadow-lg scale-105"
          : "bg-gray hover:bg-gray/80"
      }`}
      onClick={() => onSelect(prenda)}
    >
      <div className="w-full h-full flex items-center justify-center">
        <img
          src={prenda.imagenUrl || "/isotipo.svg"}
          alt={prenda.nombre}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "/isotipo.svg";
          }}
        />
      </div>
      <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={handleSugerenciasClick}
          className="group/sparkle w-6 h-6 hover:w-auto rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center hover:text-tertiary transition-all duration-300 cursor-pointer hover:px-2"
        >
          <span className="overflow-hidden max-w-0 group-hover/sparkle:max-w-xs transition-all duration-300 whitespace-nowrap text-xs text-white">
            Ver sugerencias
          </span>
          <Sparkle className="w-3 h-3 flex-shrink-0 ml-0 group-hover/sparkle:ml-1" />
        </button>

        <button
          onClick={handleFavoritoClick}
          className="w-6 h-6 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors cursor-pointer"
        >
          <Heart
            className={`w-3 h-3 transition-colors ${
              prenda.esFavorita
                ? "text-red-500 fill-red-500"
                : "text-white hover:text-red-300"
            }`}
          />
        </button>
      </div>

      {isSelected ? (
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-between px-2 py-4">
          <div className="flex justify-end">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <Check className="text-black w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <h5 className="text-white font-semibold text-base text-center">
              {prenda.nombre}
            </h5>
          </div>
        </div>
      ) : (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-2 py-4 flex items-end transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h5 className="text-white font-semibold text-base text-center w-full">
            {prenda.nombre}
          </h5>
        </div>
      )}
    </div>
  );
}

export default PrendaGalleryCard;
