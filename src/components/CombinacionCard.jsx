import { Heart } from "lucide-react";
import DownloadButton from "./shared/DownloadButton";

function CombinacionCard({ combinacion, onVerDetalle, onToggleFavorita }) {
  const handleFavoritoClick = (e) => {
    e.stopPropagation();
    if (onToggleFavorita) {
      onToggleFavorita(combinacion);
    }
  };
  return (
    <div
      className="relative w-48 h-64 rounded-md overflow-hidden cursor-pointer group transition-all duration-300 bg-transparent hover:bg-tertiary hover:scale-102 p-px"
      onClick={() => onVerDetalle(combinacion)}
    >
      <div className="w-full h-full flex items-center justify-center">
        <img
          src={combinacion.combinationUrl || "/isotipo.svg"}
          alt={`Combinación ${combinacion.nombre || combinacion.id}`}
          className="w-full h-full object-cover rounded-md"
          onError={(e) => {
            e.target.src = "/isotipo.svg";
          }}
        />
      </div>

      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={handleFavoritoClick}
          className="w-6 h-6 rounded-full cursor-pointer bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
        >
          <Heart
            className="w-3 h-3 transition-colors text-red-500 fill-red-500"
          />
        </button>

        <DownloadButton fileUrl={combinacion.combinationUrl}/>
      </div>
    </div>
  );
}

export default CombinacionCard;
